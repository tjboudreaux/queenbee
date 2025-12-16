package registry

import (
	"context"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func setupTestRegistry(t *testing.T) (*Registry, string) {
	dir := t.TempDir()

	content := `
version: 1

daemon:
  max_agents: 3

agents:
  test-agent:
    skills: [testing]
    commands:
      work_issue:
        run: "sleep 0.1 && echo T_ISSUE_ID"
        max_concurrent: 2
      plan_issue:
        run: "sleep 0.1 && echo planning T_ISSUE_ID"
  other-agent:
    skills: [other]
    commands:
      work_issue:
        run: "sleep 0.1"
`

	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	return reg, dir
}

func TestRunnerCanRun(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	// Should be able to run initially
	canRun, reason := runner.CanRun("test-agent", "work_issue", "gb-123")
	if !canRun {
		t.Errorf("should be able to run: %s", reason)
	}

	// Start a command
	ctx := context.Background()
	_, err := runner.Run(ctx, "test-agent", "work_issue", "gb-123")
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	// Should not be able to run duplicate
	canRun, reason = runner.CanRun("test-agent", "work_issue", "gb-123")
	if canRun {
		t.Error("should not be able to run duplicate")
	}
	if reason == "" {
		t.Error("expected reason for rejection")
	}

	// Should be able to run same agent/command with different issue
	canRun, _ = runner.CanRun("test-agent", "work_issue", "gb-456")
	if !canRun {
		t.Error("should be able to run different issue")
	}
}

func TestRunnerMaxConcurrent(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	// Run first command (max_concurrent=2 for work_issue)
	_, err := runner.Run(ctx, "test-agent", "work_issue", "gb-1")
	if err != nil {
		t.Fatalf("Run 1 failed: %v", err)
	}

	// Run second command
	_, err = runner.Run(ctx, "test-agent", "work_issue", "gb-2")
	if err != nil {
		t.Fatalf("Run 2 failed: %v", err)
	}

	// Third should fail (max_concurrent=2)
	canRun, reason := runner.CanRun("test-agent", "work_issue", "gb-3")
	if canRun {
		t.Error("should not exceed max_concurrent")
	}
	if reason == "" {
		t.Error("expected reason")
	}

	// But different command should work
	canRun, _ = runner.CanRun("test-agent", "plan_issue", "gb-3")
	if !canRun {
		t.Error("different command should work")
	}
}

func TestRunnerMaxAgents(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	// Fill up to max_agents (3)
	_, err := runner.Run(ctx, "test-agent", "work_issue", "gb-1")
	if err != nil {
		t.Fatalf("Run 1 failed: %v", err)
	}
	_, err = runner.Run(ctx, "test-agent", "work_issue", "gb-2")
	if err != nil {
		t.Fatalf("Run 2 failed: %v", err)
	}
	_, err = runner.Run(ctx, "other-agent", "work_issue", "gb-3")
	if err != nil {
		t.Fatalf("Run 3 failed: %v", err)
	}

	// Fourth should fail (max_agents=3)
	canRun, reason := runner.CanRun("test-agent", "plan_issue", "gb-4")
	if canRun {
		t.Error("should not exceed max_agents")
	}
	if reason == "" {
		t.Error("expected reason")
	}
}

func TestRunnerList(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	// Initially empty
	list := runner.List()
	if len(list) != 0 {
		t.Errorf("expected empty list, got %d", len(list))
	}

	// Add some commands
	runner.Run(ctx, "test-agent", "work_issue", "gb-1")
	runner.Run(ctx, "test-agent", "plan_issue", "gb-2")

	list = runner.List()
	if len(list) != 2 {
		t.Errorf("expected 2 running, got %d", len(list))
	}
}

func TestRunnerStats(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	runner.Run(ctx, "test-agent", "work_issue", "gb-1")
	runner.Run(ctx, "test-agent", "plan_issue", "gb-2")
	runner.Run(ctx, "other-agent", "work_issue", "gb-3")

	stats := runner.Stats()

	if stats.TotalRunning != 3 {
		t.Errorf("expected TotalRunning=3, got %d", stats.TotalRunning)
	}
	if stats.MaxAgents != 3 {
		t.Errorf("expected MaxAgents=3, got %d", stats.MaxAgents)
	}
	if stats.ByAgent["test-agent"] != 2 {
		t.Errorf("expected test-agent=2, got %d", stats.ByAgent["test-agent"])
	}
	if stats.ByAgent["other-agent"] != 1 {
		t.Errorf("expected other-agent=1, got %d", stats.ByAgent["other-agent"])
	}
}

func TestRunnerIsRunning(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	// Not running initially
	if runner.IsRunning("test-agent", "work_issue", "gb-123") {
		t.Error("should not be running initially")
	}

	// Start it
	runner.Run(ctx, "test-agent", "work_issue", "gb-123")

	// Now running
	if !runner.IsRunning("test-agent", "work_issue", "gb-123") {
		t.Error("should be running")
	}

	// Different issue not running
	if runner.IsRunning("test-agent", "work_issue", "gb-456") {
		t.Error("different issue should not be running")
	}
}

func TestRunnerStop(t *testing.T) {
	reg, dir := setupTestRegistry(t)
	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	rc, err := runner.Run(ctx, "test-agent", "work_issue", "gb-123")
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	// Stop it
	err = runner.Stop(rc.HashID)
	if err != nil {
		t.Errorf("Stop failed: %v", err)
	}

	// Give it time to clean up
	time.Sleep(50 * time.Millisecond)

	// Should not be running
	if runner.IsRunning("test-agent", "work_issue", "gb-123") {
		t.Error("should not be running after stop")
	}
}

func TestRunnerCompletionCleanup(t *testing.T) {
	reg, dir := setupTestRegistry(t)

	// Use a very short command
	reg.Agents["test-agent"] = Agent{
		Skills: []string{"testing"},
		Commands: map[string]Command{
			"work_issue": {Run: "echo T_ISSUE_ID", MaxConcurrent: 2},
		},
	}

	runner := NewRunner(reg, dir, dir)
	defer runner.StopAll()

	ctx := context.Background()

	_, err := runner.Run(ctx, "test-agent", "work_issue", "gb-123")
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	// Wait for completion
	time.Sleep(200 * time.Millisecond)

	// Should be cleaned up automatically
	if runner.Count() != 0 {
		t.Errorf("expected 0 running after completion, got %d", runner.Count())
	}
}

func TestRunnerStatePersistence(t *testing.T) {
	reg, dir := setupTestRegistry(t)

	// Use a longer-running command
	reg.Agents["test-agent"] = Agent{
		Skills: []string{"testing"},
		Commands: map[string]Command{
			"work_issue": {Run: "sleep 10", MaxConcurrent: 2},
		},
	}

	runner := NewRunner(reg, dir, dir)
	ctx := context.Background()

	rc, err := runner.Run(ctx, "test-agent", "work_issue", "gb-123")
	if err != nil {
		t.Fatalf("Run failed: %v", err)
	}

	// Check state file exists
	stateFile := filepath.Join(dir, "queen_runner.json")
	if _, err := os.Stat(stateFile); os.IsNotExist(err) {
		t.Error("state file should exist")
	}

	// Create new runner (simulates restart)
	runner2 := NewRunner(reg, dir, dir)

	// Should recognize the running process
	if !runner2.IsRunning("test-agent", "work_issue", "gb-123") {
		t.Error("should recognize running process after reload")
	}

	// Cleanup
	runner.Stop(rc.HashID)
	runner2.StopAll()
}
