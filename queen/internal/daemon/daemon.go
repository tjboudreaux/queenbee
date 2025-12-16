// Package daemon provides daemon functionality for queen.
package daemon

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

// Config holds daemon configuration.
type Config struct {
	BeadsDir     string
	PollInterval time.Duration
	LogFile      string
	WorkDir      string // Project root directory
}

// Status represents daemon status.
type Status struct {
	Running        bool      `json:"running"`
	PID            int       `json:"pid,omitempty"`
	StartedAt      time.Time `json:"started_at,omitempty"`
	Uptime         string    `json:"uptime,omitempty"`
	RunningAgents  int       `json:"running_agents,omitempty"`
	MaxAgents      int       `json:"max_agents,omitempty"`
	RegistryLoaded bool      `json:"registry_loaded,omitempty"`
}

// Daemon manages the queen daemon process.
type Daemon struct {
	config   Config
	pidFile  string
	logFile  *os.File
	stopChan chan struct{}
	registry *registry.Registry
	runner   *registry.Runner
	queue    *registry.WorkQueue
}

// New creates a new daemon instance.
func New(cfg Config) *Daemon {
	return &Daemon{
		config:   cfg,
		pidFile:  filepath.Join(cfg.BeadsDir, "queen_daemon.pid"),
		stopChan: make(chan struct{}),
	}
}

// Start starts the daemon in the foreground.
func (d *Daemon) Start(ctx context.Context) error {
	// Check if already running
	if d.IsRunning() {
		return fmt.Errorf("daemon already running (pid file exists: %s)", d.pidFile)
	}

	// Write PID file
	if err := d.writePIDFile(); err != nil {
		return fmt.Errorf("writing pid file: %w", err)
	}
	defer d.removePIDFile()

	// Open log file
	logPath := d.config.LogFile
	if logPath == "" {
		logPath = filepath.Join(d.config.BeadsDir, "queen_daemon.log")
	}

	var err error
	d.logFile, err = os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("opening log file: %w", err)
	}
	defer d.logFile.Close()

	// Load registry
	workDir := d.config.WorkDir
	if workDir == "" {
		workDir = filepath.Dir(d.config.BeadsDir)
	}

	reg, err := registry.Load(workDir)
	if err != nil {
		d.log("Warning: No registry loaded: %v", err)
		d.log("Create a .queen.yaml file to enable agent orchestration")
	} else {
		d.registry = reg
		d.runner = registry.NewRunner(reg, d.config.BeadsDir, workDir)
		d.queue = registry.NewWorkQueue(d.config.BeadsDir)
		d.log("Registry loaded: %d agents, max_agents=%d, queued=%d", len(reg.Agents), reg.Daemon.MaxAgents, d.queue.Len())

		// Use registry poll interval if not overridden
		if d.config.PollInterval == 0 {
			d.config.PollInterval = reg.Daemon.PollInterval
		}
	}

	d.log("Daemon started (pid: %d, poll interval: %s)", os.Getpid(), d.config.PollInterval)

	// Set up signal handling
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Create ticker for polling
	ticker := time.NewTicker(d.config.PollInterval)
	defer ticker.Stop()

	// Main loop
	for {
		select {
		case <-ctx.Done():
			d.log("Context canceled, shutting down")
			return nil
		case sig := <-sigChan:
			d.log("Received signal: %v, shutting down", sig)
			return nil
		case <-d.stopChan:
			d.log("Stop requested, shutting down")
			return nil
		case <-ticker.C:
			d.poll()
		}
	}
}

// Stop stops a running daemon.
func (d *Daemon) Stop() error {
	pid, err := d.readPIDFile()
	if err != nil {
		return fmt.Errorf("daemon not running: %w", err)
	}

	// Send SIGTERM to the process
	process, err := os.FindProcess(pid)
	if err != nil {
		d.removePIDFile()
		return fmt.Errorf("process not found: %w", err)
	}

	if err := process.Signal(syscall.SIGTERM); err != nil {
		// Process might already be dead
		d.removePIDFile()
		return fmt.Errorf("sending signal: %w", err)
	}

	// Wait for process to exit (with timeout)
	for i := 0; i < 10; i++ {
		time.Sleep(500 * time.Millisecond)
		if !d.IsRunning() {
			return nil
		}
	}

	// Force kill if still running
	if err := process.Signal(syscall.SIGKILL); err != nil {
		d.removePIDFile()
		return nil
	}

	d.removePIDFile()
	return nil
}

// GetStatus returns the daemon status.
func (d *Daemon) GetStatus() Status {
	pid, err := d.readPIDFile()
	if err != nil {
		return Status{Running: false}
	}

	// Check if process is actually running
	process, err := os.FindProcess(pid)
	if err != nil {
		return Status{Running: false}
	}

	// On Unix, FindProcess always succeeds, so we need to check
	if sigErr := process.Signal(syscall.Signal(0)); sigErr != nil {
		d.removePIDFile()
		return Status{Running: false}
	}

	// Get start time from PID file modification time
	info, err := os.Stat(d.pidFile)
	if err != nil {
		return Status{Running: true, PID: pid}
	}

	startedAt := info.ModTime()
	uptime := time.Since(startedAt).Round(time.Second)

	status := Status{
		Running:   true,
		PID:       pid,
		StartedAt: startedAt,
		Uptime:    uptime.String(),
	}

	// Add runner stats if available
	if d.runner != nil {
		stats := d.runner.Stats()
		status.RunningAgents = stats.TotalRunning
		status.MaxAgents = stats.MaxAgents
		status.RegistryLoaded = true
	} else if d.registry != nil {
		status.RegistryLoaded = true
		status.MaxAgents = d.registry.Daemon.MaxAgents
	}

	return status
}

// IsRunning checks if the daemon is running.
func (d *Daemon) IsRunning() bool {
	return d.GetStatus().Running
}

// poll performs a single daemon poll cycle.
func (d *Daemon) poll() {
	d.log("Poll cycle started")

	// Skip if no registry loaded
	if d.registry == nil || d.runner == nil {
		d.log("Poll skipped: no registry loaded")
		return
	}

	// Cleanup stale processes
	if cleaned := d.runner.CleanupStale(); cleaned > 0 {
		d.log("Cleaned up %d stale processes", cleaned)
	}

	// Process queued work first (if we have capacity)
	d.processQueue()

	// Get ready issues from beads
	readyIssues, err := d.getReadyIssues()
	if err != nil {
		d.log("Error getting ready issues: %v", err)
		return
	}

	if len(readyIssues) == 0 {
		d.log("No ready issues found")
	} else {
		d.log("Found %d ready issues", len(readyIssues))

		// Process each ready issue
		for _, issue := range readyIssues {
			d.processIssue(issue)
		}
	}

	d.log("Poll cycle completed (running: %d/%d, queued: %d)", d.runner.Count(), d.registry.Daemon.MaxAgents, d.queue.Len())
}

// processQueue attempts to run queued work items.
func (d *Daemon) processQueue() {
	if d.queue == nil || d.queue.Len() == 0 {
		return
	}

	// Try to run queued items while we have capacity
	for d.runner.Count() < d.registry.Daemon.MaxAgents {
		work, ok := d.queue.Peek()
		if !ok {
			break
		}

		// Check if we can run this work
		canRun, _ := d.runner.CanRun(work.Agent, work.Command, work.IssueID)
		if !canRun {
			break
		}

		// Dequeue and run
		d.queue.Dequeue()
		d.log("Dequeued %s.%s for %s", work.Agent, work.Command, work.IssueID)

		ctx := context.Background()
		rc, err := d.runner.Run(ctx, work.Agent, work.Command, work.IssueID)
		if err != nil {
			d.log("Error running queued work: %v", err)
			continue
		}

		d.log("Started queued %s.%s for %s (pid: %d)", work.Agent, work.Command, work.IssueID, rc.PID)
	}
}

// BeadsIssue represents an issue from beads.
type BeadsIssue struct {
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Type     string   `json:"issue_type"`
	Priority int      `json:"priority"`
	Labels   []string `json:"labels"`
	Status   string   `json:"status"`
}

// getReadyIssues fetches ready issues from beads CLI.
func (d *Daemon) getReadyIssues() ([]BeadsIssue, error) {
	cmd := exec.Command("bd", "ready", "--json")
	cmd.Dir = filepath.Dir(d.config.BeadsDir)

	output, err := cmd.Output()
	if err != nil {
		return nil, fmt.Errorf("running bd ready: %w", err)
	}

	var issues []BeadsIssue
	if err := json.Unmarshal(output, &issues); err != nil {
		return nil, fmt.Errorf("parsing bd output: %w", err)
	}

	return issues, nil
}

// processIssue handles a single ready issue.
func (d *Daemon) processIssue(issue BeadsIssue) {
	// Check if already being worked on
	for _, rc := range d.runner.List() {
		if rc.IssueID == issue.ID {
			d.log("Issue %s already being worked on by %s", issue.ID, rc.Agent)
			return
		}
	}

	// Check if already queued
	if d.queue != nil && d.queue.IsQueued("", "", issue.ID) {
		return // Already queued, skip
	}

	// Convert numeric priority to string format (0 -> "P0", 1 -> "P1", etc.)
	priority := fmt.Sprintf("P%d", issue.Priority)

	// Match to an agent using rules
	agent := d.registry.MatchAgent(issue.Labels, issue.Type, priority)
	if agent == "" {
		d.log("No agent matched for issue %s (labels: %v)", issue.ID, issue.Labels)
		return
	}

	// Determine command based on issue type and workflow
	commandName := d.determineCommand(issue.Type, agent)

	// Check if agent has this command
	if _, ok := d.registry.GetCommand(agent, commandName); !ok {
		d.log("Agent %s doesn't have command %s", agent, commandName)
		return
	}

	// Check if we can run
	canRun, reason := d.runner.CanRun(agent, commandName, issue.ID)
	if !canRun {
		// Queue the work instead of dropping it
		if d.queue != nil && strings.Contains(reason, "max_agents") {
			d.queueWork(agent, commandName, issue)
		} else {
			d.log("Cannot run %s.%s for %s: %s", agent, commandName, issue.ID, reason)
		}
		return
	}

	// Run the command
	d.log("Starting %s.%s for issue %s", agent, commandName, issue.ID)

	ctx := context.Background()
	rc, err := d.runner.Run(ctx, agent, commandName, issue.ID)
	if err != nil {
		d.log("Error starting command: %v", err)
		return
	}

	d.log("Started %s.%s for %s (pid: %d, hash: %s)", agent, commandName, issue.ID, rc.PID, rc.HashID)
}

// determineCommand figures out which command to run based on issue type and workflows.
func (d *Daemon) determineCommand(issueType, agent string) string {
	// If agent is the default/triage agent, use the triage workflow
	if agent == d.registry.DefaultAgent && agent != "" {
		if wf, ok := d.registry.GetWorkflow("triage"); ok {
			if wf.Work != nil && len(wf.Work.Steps) > 0 {
				if wf.Work.Steps[0].Command != "" {
					return wf.Work.Steps[0].Command
				}
			}
		}
		return "triage_issue" // Fallback for triage agent
	}

	// Check if there's a workflow defined for this issue type
	if wf, ok := d.registry.GetWorkflow(issueType); ok {
		// For now, use first step's command from work phase (or plan for epics)
		if strings.EqualFold(issueType, "epic") && wf.Plan != nil && len(wf.Plan.Steps) > 0 {
			if wf.Plan.Steps[0].Command != "" {
				return wf.Plan.Steps[0].Command
			}
		} else if wf.Work != nil && len(wf.Work.Steps) > 0 {
			if wf.Work.Steps[0].Command != "" {
				return wf.Work.Steps[0].Command
			}
		}
	}

	// Default behavior
	if strings.EqualFold(issueType, "epic") {
		return "plan_issue"
	}
	return "work_issue"
}

// queueWork adds work to the queue.
func (d *Daemon) queueWork(agent, command string, issue BeadsIssue) {
	work := registry.QueuedWork{
		Agent:     agent,
		Command:   command,
		IssueID:   issue.ID,
		IssueType: issue.Type,
		Priority:  issue.Priority,
		Reason:    "max_agents reached",
	}
	d.queue.Enqueue(work)
	d.log("Queued %s.%s for %s (priority: %d)", agent, command, issue.ID, issue.Priority)
}

// log writes a log message.
func (d *Daemon) log(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	line := fmt.Sprintf("[%s] %s\n", timestamp, msg)

	if d.logFile != nil {
		_, _ = d.logFile.WriteString(line) // Ignore write errors for logging
	}
}

// writePIDFile writes the current process ID to the PID file.
func (d *Daemon) writePIDFile() error {
	return os.WriteFile(d.pidFile, []byte(strconv.Itoa(os.Getpid())), 0644)
}

// readPIDFile reads the PID from the PID file.
func (d *Daemon) readPIDFile() (int, error) {
	data, err := os.ReadFile(d.pidFile)
	if err != nil {
		return 0, err
	}
	return strconv.Atoi(string(data))
}

// removePIDFile removes the PID file.
func (d *Daemon) removePIDFile() {
	os.Remove(d.pidFile)
}

// StatusJSON returns status as JSON.
func (s Status) JSON() string {
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return "{}" // Return empty JSON on error
	}
	return string(data)
}
