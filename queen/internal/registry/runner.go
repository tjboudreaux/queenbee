package registry

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"syscall"
	"time"
)

// RunningCommand represents a currently executing command.
type RunningCommand struct {
	HashID    string    `json:"hash_id"`
	Agent     string    `json:"agent"`
	Command   string    `json:"command"`
	IssueID   string    `json:"issue_id"`
	PID       int       `json:"pid"`
	StartedAt time.Time `json:"started_at"`
	Cmd       *exec.Cmd `json:"-"`
}

// Runner manages command execution and tracking.
type Runner struct {
	registry    *Registry
	beadsDir    string
	running     map[string]*RunningCommand // keyed by HashID
	mu          sync.RWMutex
	stateFile   string
	workDir     string
}

// NewRunner creates a new command runner.
func NewRunner(reg *Registry, beadsDir, workDir string) *Runner {
	r := &Runner{
		registry:  reg,
		beadsDir:  beadsDir,
		workDir:   workDir,
		running:   make(map[string]*RunningCommand),
		stateFile: filepath.Join(beadsDir, "queen_runner.json"),
	}
	r.loadState()
	return r
}

// CanRun checks if a command can be run (not duplicate, within limits).
func (r *Runner) CanRun(agentName, commandName, issueID string) (bool, string) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	hashID := CommandHash(agentName, commandName, issueID)

	// Check for duplicate
	if _, exists := r.running[hashID]; exists {
		return false, fmt.Sprintf("command already running (hash: %s)", hashID)
	}

	// Check global max_agents limit
	if len(r.running) >= r.registry.Daemon.MaxAgents {
		return false, fmt.Sprintf("global max_agents limit reached (%d)", r.registry.Daemon.MaxAgents)
	}

	// Check per-command max_concurrent limit
	cmd, ok := r.registry.GetCommand(agentName, commandName)
	if !ok {
		return false, fmt.Sprintf("unknown command %s for agent %s", commandName, agentName)
	}

	count := r.countRunningCommands(agentName, commandName)
	if count >= cmd.MaxConcurrent {
		return false, fmt.Sprintf("max_concurrent limit reached for %s.%s (%d)", agentName, commandName, cmd.MaxConcurrent)
	}

	return true, ""
}

// countRunningCommands counts running instances of a specific agent+command.
func (r *Runner) countRunningCommands(agentName, commandName string) int {
	count := 0
	for _, rc := range r.running {
		if rc.Agent == agentName && rc.Command == commandName {
			count++
		}
	}
	return count
}

// Run executes a command and tracks it.
func (r *Runner) Run(ctx context.Context, agentName, commandName, issueID string) (*RunningCommand, error) {
	// Check if we can run
	canRun, reason := r.CanRun(agentName, commandName, issueID)
	if !canRun {
		return nil, fmt.Errorf("cannot run: %s", reason)
	}

	// Build the command string
	cmdStr, err := r.registry.BuildCommand(agentName, commandName, issueID)
	if err != nil {
		return nil, err
	}

	// Create the exec.Cmd
	cmd := exec.CommandContext(ctx, "sh", "-c", cmdStr)
	cmd.Dir = r.workDir
	cmd.Env = append(os.Environ(),
		fmt.Sprintf("QUEEN_AGENT=%s", agentName),
		fmt.Sprintf("QUEEN_ISSUE=%s", issueID),
		fmt.Sprintf("QUEEN_COMMAND=%s", commandName),
	)

	// Set up process group for cleanup
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	// Create log file for output
	logDir := filepath.Join(r.beadsDir, "queen_logs")
	os.MkdirAll(logDir, 0755)
	logFile := filepath.Join(logDir, fmt.Sprintf("%s_%s_%s.log", agentName, commandName, issueID))
	
	f, err := os.Create(logFile)
	if err != nil {
		return nil, fmt.Errorf("creating log file: %w", err)
	}
	cmd.Stdout = f
	cmd.Stderr = f

	// Start the command
	if err := cmd.Start(); err != nil {
		f.Close()
		return nil, fmt.Errorf("starting command: %w", err)
	}

	// Create running command record
	rc := &RunningCommand{
		HashID:    CommandHash(agentName, commandName, issueID),
		Agent:     agentName,
		Command:   commandName,
		IssueID:   issueID,
		PID:       cmd.Process.Pid,
		StartedAt: time.Now(),
		Cmd:       cmd,
	}

	// Track it
	r.mu.Lock()
	r.running[rc.HashID] = rc
	r.mu.Unlock()

	r.saveState()

	// Start goroutine to wait for completion
	go func() {
		cmd.Wait()
		f.Close()
		r.mu.Lock()
		delete(r.running, rc.HashID)
		r.mu.Unlock()
		r.saveState()
	}()

	return rc, nil
}

// Stop stops a running command by hash ID.
func (r *Runner) Stop(hashID string) error {
	r.mu.Lock()
	rc, exists := r.running[hashID]
	if !exists {
		r.mu.Unlock()
		return fmt.Errorf("command not found: %s", hashID)
	}
	r.mu.Unlock()

	if rc.Cmd != nil && rc.Cmd.Process != nil {
		// Kill the process group
		pgid, err := syscall.Getpgid(rc.Cmd.Process.Pid)
		if err == nil {
			syscall.Kill(-pgid, syscall.SIGTERM)
		} else {
			rc.Cmd.Process.Kill()
		}
	}

	r.mu.Lock()
	delete(r.running, hashID)
	r.mu.Unlock()

	r.saveState()
	return nil
}

// StopAll stops all running commands.
func (r *Runner) StopAll() {
	r.mu.Lock()
	for _, rc := range r.running {
		if rc.Cmd != nil && rc.Cmd.Process != nil {
			pgid, err := syscall.Getpgid(rc.Cmd.Process.Pid)
			if err == nil {
				syscall.Kill(-pgid, syscall.SIGTERM)
			} else {
				rc.Cmd.Process.Kill()
			}
		}
	}
	r.running = make(map[string]*RunningCommand)
	r.mu.Unlock()

	r.saveState()
}

// List returns all running commands.
func (r *Runner) List() []*RunningCommand {
	r.mu.RLock()
	defer r.mu.RUnlock()

	list := make([]*RunningCommand, 0, len(r.running))
	for _, rc := range r.running {
		list = append(list, rc)
	}
	return list
}

// Count returns the number of running commands.
func (r *Runner) Count() int {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return len(r.running)
}

// CountForAgent returns running commands for a specific agent.
func (r *Runner) CountForAgent(agentName string) int {
	r.mu.RLock()
	defer r.mu.RUnlock()

	count := 0
	for _, rc := range r.running {
		if rc.Agent == agentName {
			count++
		}
	}
	return count
}

// IsRunning checks if a specific command instance is running.
func (r *Runner) IsRunning(agentName, commandName, issueID string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()

	hashID := CommandHash(agentName, commandName, issueID)
	_, exists := r.running[hashID]
	return exists
}

// CleanupStale removes entries for processes that are no longer running.
func (r *Runner) CleanupStale() int {
	r.mu.Lock()
	cleaned := 0
	for hashID, rc := range r.running {
		// Check if process is still alive
		process, err := os.FindProcess(rc.PID)
		if err != nil {
			delete(r.running, hashID)
			cleaned++
			continue
		}

		// On Unix, FindProcess always succeeds, so send signal 0 to check
		if err := process.Signal(syscall.Signal(0)); err != nil {
			delete(r.running, hashID)
			cleaned++
		}
	}
	r.mu.Unlock()

	if cleaned > 0 {
		r.saveState()
	}
	return cleaned
}

// saveState persists running commands to disk.
func (r *Runner) saveState() error {
	r.mu.RLock()
	state := r.snapshotStateLocked()
	r.mu.RUnlock()

	data, err := json.MarshalIndent(state, "", "  ")
	if err != nil {
		return err
	}

	return os.WriteFile(r.stateFile, data, 0644)
}

// snapshotStateLocked creates a copy of state - caller must hold lock.
func (r *Runner) snapshotStateLocked() map[string]*RunningCommand {
	state := make(map[string]*RunningCommand)
	for k, v := range r.running {
		state[k] = &RunningCommand{
			HashID:    v.HashID,
			Agent:     v.Agent,
			Command:   v.Command,
			IssueID:   v.IssueID,
			PID:       v.PID,
			StartedAt: v.StartedAt,
		}
	}
	return state
}

// loadState loads running commands from disk and validates they're still running.
func (r *Runner) loadState() {
	data, err := os.ReadFile(r.stateFile)
	if err != nil {
		return
	}

	var state map[string]*RunningCommand
	if err := json.Unmarshal(data, &state); err != nil {
		return
	}

	// Only keep entries for processes that are still running
	for hashID, rc := range state {
		process, err := os.FindProcess(rc.PID)
		if err != nil {
			continue
		}
		if err := process.Signal(syscall.Signal(0)); err == nil {
			r.running[hashID] = rc
		}
	}
}

// Stats returns runner statistics.
type RunnerStats struct {
	TotalRunning   int            `json:"total_running"`
	MaxAgents      int            `json:"max_agents"`
	ByAgent        map[string]int `json:"by_agent"`
	ByCommand      map[string]int `json:"by_command"`
}

// Stats returns current runner statistics.
func (r *Runner) Stats() RunnerStats {
	r.mu.RLock()
	defer r.mu.RUnlock()

	stats := RunnerStats{
		TotalRunning: len(r.running),
		MaxAgents:    r.registry.Daemon.MaxAgents,
		ByAgent:      make(map[string]int),
		ByCommand:    make(map[string]int),
	}

	for _, rc := range r.running {
		stats.ByAgent[rc.Agent]++
		key := fmt.Sprintf("%s.%s", rc.Agent, rc.Command)
		stats.ByCommand[key]++
	}

	return stats
}
