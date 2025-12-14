// Package daemon provides daemon functionality for queen.
package daemon

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"path/filepath"
	"strconv"
	"syscall"
	"time"
)

// Config holds daemon configuration.
type Config struct {
	BeadsDir     string
	PollInterval time.Duration
	LogFile      string
}

// Status represents daemon status.
type Status struct {
	Running   bool      `json:"running"`
	PID       int       `json:"pid,omitempty"`
	StartedAt time.Time `json:"started_at,omitempty"`
	Uptime    string    `json:"uptime,omitempty"`
}

// Daemon manages the queen daemon process.
type Daemon struct {
	config   Config
	pidFile  string
	logFile  *os.File
	stopChan chan struct{}
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
			d.log("Context cancelled, shutting down")
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
	if err := process.Signal(syscall.Signal(0)); err != nil {
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

	return Status{
		Running:   true,
		PID:       pid,
		StartedAt: startedAt,
		Uptime:    uptime.String(),
	}
}

// IsRunning checks if the daemon is running.
func (d *Daemon) IsRunning() bool {
	return d.GetStatus().Running
}

// poll performs a single daemon poll cycle.
func (d *Daemon) poll() {
	d.log("Poll cycle started")

	// TODO: Implement actual polling logic
	// 1. Scan for new epics to decompose
	// 2. Scan for ready unassigned tasks
	// 3. Check for reservation conflicts
	// 4. Check for stale assignments
	// 5. Process inbox messages

	d.log("Poll cycle completed")
}

// log writes a log message.
func (d *Daemon) log(format string, args ...interface{}) {
	msg := fmt.Sprintf(format, args...)
	timestamp := time.Now().Format("2006-01-02 15:04:05")
	line := fmt.Sprintf("[%s] %s\n", timestamp, msg)

	if d.logFile != nil {
		d.logFile.WriteString(line)
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
	data, _ := json.MarshalIndent(s, "", "  ")
	return string(data)
}
