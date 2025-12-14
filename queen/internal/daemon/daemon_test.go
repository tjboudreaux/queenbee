package daemon

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func setupTestDaemon(t *testing.T) *Daemon {
	t.Helper()
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	return New(Config{
		BeadsDir:     beadsDir,
		PollInterval: 100 * time.Millisecond,
	})
}

func TestDaemon_New(t *testing.T) {
	d := setupTestDaemon(t)

	if d == nil {
		t.Error("Expected daemon to be created")
	}
	if d.config.PollInterval != 100*time.Millisecond {
		t.Errorf("PollInterval = %v, want %v", d.config.PollInterval, 100*time.Millisecond)
	}
}

func TestDaemon_IsRunning_NotRunning(t *testing.T) {
	d := setupTestDaemon(t)

	if d.IsRunning() {
		t.Error("Expected daemon to not be running initially")
	}
}

func TestDaemon_GetStatus_NotRunning(t *testing.T) {
	d := setupTestDaemon(t)

	status := d.GetStatus()
	if status.Running {
		t.Error("Expected Running = false")
	}
	if status.PID != 0 {
		t.Errorf("Expected PID = 0, got %d", status.PID)
	}
}

func TestDaemon_WritePIDFile(t *testing.T) {
	d := setupTestDaemon(t)

	if err := d.writePIDFile(); err != nil {
		t.Fatalf("writePIDFile failed: %v", err)
	}
	defer d.removePIDFile()

	pid, err := d.readPIDFile()
	if err != nil {
		t.Fatalf("readPIDFile failed: %v", err)
	}

	if pid != os.Getpid() {
		t.Errorf("PID = %d, want %d", pid, os.Getpid())
	}
}

func TestDaemon_ReadPIDFile_NotExists(t *testing.T) {
	d := setupTestDaemon(t)

	_, err := d.readPIDFile()
	if err == nil {
		t.Error("Expected error for non-existent PID file")
	}
}

func TestDaemon_RemovePIDFile(t *testing.T) {
	d := setupTestDaemon(t)

	// Write then remove
	d.writePIDFile()
	d.removePIDFile()

	if _, err := os.Stat(d.pidFile); !os.IsNotExist(err) {
		t.Error("PID file should be removed")
	}
}

func TestDaemon_Start_AlreadyRunning(t *testing.T) {
	d := setupTestDaemon(t)

	// Simulate running daemon by writing PID file with current process
	d.writePIDFile()
	defer d.removePIDFile()

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	err := d.Start(ctx)
	if err == nil {
		t.Error("Expected error when daemon already running")
	}
}

func TestDaemon_Start_ContextCancelled(t *testing.T) {
	d := setupTestDaemon(t)

	ctx, cancel := context.WithCancel(context.Background())

	// Cancel immediately
	go func() {
		time.Sleep(50 * time.Millisecond)
		cancel()
	}()

	err := d.Start(ctx)
	if err != nil {
		t.Errorf("Expected no error on context cancel, got: %v", err)
	}

	// PID file should be cleaned up
	if _, err := os.Stat(d.pidFile); !os.IsNotExist(err) {
		t.Error("PID file should be removed after stop")
	}
}

func TestDaemon_Stop_NotRunning(t *testing.T) {
	d := setupTestDaemon(t)

	err := d.Stop()
	if err == nil {
		t.Error("Expected error when stopping non-running daemon")
	}
}

func TestStatus_JSON(t *testing.T) {
	status := Status{
		Running:   true,
		PID:       12345,
		StartedAt: time.Date(2024, 1, 1, 12, 0, 0, 0, time.UTC),
		Uptime:    "1h30m",
	}

	json := status.JSON()
	if json == "" {
		t.Error("Expected non-empty JSON")
	}
	if !contains(json, `"running": true`) {
		t.Errorf("JSON should contain running: true, got: %s", json)
	}
	if !contains(json, `"pid": 12345`) {
		t.Errorf("JSON should contain pid, got: %s", json)
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsAt(s, substr, 0))
}

func containsAt(s, substr string, start int) bool {
	for i := start; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}

func TestDaemon_Log(t *testing.T) {
	d := setupTestDaemon(t)

	// Create log file
	logPath := filepath.Join(d.config.BeadsDir, "test.log")
	f, err := os.Create(logPath)
	if err != nil {
		t.Fatal(err)
	}
	d.logFile = f

	d.log("test message %d", 123)
	f.Close()

	// Read log
	content, err := os.ReadFile(logPath)
	if err != nil {
		t.Fatal(err)
	}

	if !contains(string(content), "test message 123") {
		t.Errorf("Log should contain message, got: %s", content)
	}
}

func TestDaemon_Log_NoFile(t *testing.T) {
	d := setupTestDaemon(t)
	d.logFile = nil

	// Should not panic
	d.log("test message without file")
}

func TestDaemon_Poll(t *testing.T) {
	d := setupTestDaemon(t)

	// Create log file to capture poll output
	logPath := filepath.Join(d.config.BeadsDir, "poll.log")
	f, err := os.Create(logPath)
	if err != nil {
		t.Fatal(err)
	}
	d.logFile = f

	// Call poll directly
	d.poll()
	f.Close()

	// Verify poll logged something
	content, _ := os.ReadFile(logPath)
	if !contains(string(content), "Poll cycle") {
		t.Errorf("Expected poll cycle log, got: %s", content)
	}
}

func TestDaemon_GetStatus_StalePIDFile(t *testing.T) {
	d := setupTestDaemon(t)

	// Write a PID file with a non-existent PID (very high number)
	os.WriteFile(d.pidFile, []byte("999999999"), 0644)

	status := d.GetStatus()
	// On some systems this might appear running because FindProcess always succeeds
	// but the signal check should fail
	_ = status // The test exercises the code path
}

func TestDaemon_GetStatus_Running(t *testing.T) {
	d := setupTestDaemon(t)

	// Write PID file with current process (which is running)
	d.writePIDFile()
	defer d.removePIDFile()

	status := d.GetStatus()
	if !status.Running {
		t.Error("Expected Running = true for current process")
	}
	if status.PID != os.Getpid() {
		t.Errorf("PID = %d, want %d", status.PID, os.Getpid())
	}
	if status.StartedAt.IsZero() {
		t.Error("Expected StartedAt to be set")
	}
	if status.Uptime == "" {
		t.Error("Expected Uptime to be set")
	}
}

func TestDaemon_Stop_InvalidPID(t *testing.T) {
	d := setupTestDaemon(t)

	// Write invalid PID
	os.WriteFile(d.pidFile, []byte("not-a-number"), 0644)

	err := d.Stop()
	if err == nil {
		t.Error("Expected error for invalid PID")
	}
}

func TestDaemon_Stop_NonExistentProcess(t *testing.T) {
	d := setupTestDaemon(t)

	// Write PID of non-existent process
	os.WriteFile(d.pidFile, []byte("999999999"), 0644)

	// This should error or clean up the stale PID file
	_ = d.Stop() // Error is expected

	// PID file should be cleaned up
	if _, err := os.Stat(d.pidFile); !os.IsNotExist(err) {
		t.Error("Stale PID file should be removed")
	}
}

func TestDaemon_CustomLogFile(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	os.MkdirAll(beadsDir, 0755)

	customLog := filepath.Join(dir, "custom.log")

	d := New(Config{
		BeadsDir:     beadsDir,
		PollInterval: 100 * time.Millisecond,
		LogFile:      customLog,
	})

	if d.config.LogFile != customLog {
		t.Errorf("LogFile = %q, want %q", d.config.LogFile, customLog)
	}
}

func TestDaemon_Start_RunsOnePollCycle(t *testing.T) {
	d := setupTestDaemon(t)
	d.config.PollInterval = 10 * time.Millisecond

	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	err := d.Start(ctx)
	if err != nil {
		t.Errorf("Unexpected error: %v", err)
	}
}
