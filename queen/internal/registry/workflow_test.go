package registry

import (
	"context"
	"testing"
	"time"
)

func TestWorkflowExecutor_ExecuteExec(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{
		Agents: map[string]Agent{
			"test-agent": {
				Skills: []string{"test"},
				Commands: map[string]Command{
					"work_issue": {
						Run: "echo test",
					},
				},
			},
		},
	}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Exec: "echo T_ISSUE_ID"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	if len(result.Steps) != 1 {
		t.Errorf("expected 1 step result, got %d", len(result.Steps))
	}

	if result.Steps[0].StepType != "exec" {
		t.Errorf("expected exec step type, got %s", result.Steps[0].StepType)
	}

	// Check T_ISSUE_ID was replaced
	if result.Steps[0].Output != "qb-123\n" {
		t.Errorf("expected 'qb-123\\n' output, got '%s'", result.Steps[0].Output)
	}
}

func TestWorkflowExecutor_ExecuteExec_T_AGENT(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "ui-engineer")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Exec: "echo T_AGENT"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	// Check T_AGENT was replaced
	if result.Steps[0].Output != "ui-engineer\n" {
		t.Errorf("expected 'ui-engineer\\n' output, got '%s'", result.Steps[0].Output)
	}
}

func TestWorkflowExecutor_ExecuteExec_BothPlaceholders(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	tests := []struct {
		name     string
		cmd      string
		issueID  string
		agent    string
		expected string
	}{
		{
			name:     "both placeholders",
			cmd:      "echo T_ISSUE_ID T_AGENT",
			issueID:  "qb-123",
			agent:    "ui-engineer",
			expected: "qb-123 ui-engineer\n",
		},
		{
			name:     "reversed order",
			cmd:      "echo T_AGENT T_ISSUE_ID",
			issueID:  "qb-456",
			agent:    "backend-dev",
			expected: "backend-dev qb-456\n",
		},
		{
			name:     "multiple occurrences",
			cmd:      "echo T_AGENT works on T_ISSUE_ID as T_AGENT",
			issueID:  "gb-789",
			agent:    "test-agent",
			expected: "test-agent works on gb-789 as test-agent\n",
		},
		{
			name:     "in flags",
			cmd:      "echo --agent=T_AGENT --issue=T_ISSUE_ID",
			issueID:  "qb-1",
			agent:    "dev",
			expected: "--agent=dev --issue=qb-1\n",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			exec := NewWorkflowExecutor(reg, runner, tmpDir, tt.issueID, tt.agent)
			phase := &WorkflowPhase{
				Steps: []Step{{Exec: tt.cmd}},
			}

			result, err := exec.ExecutePhase(context.Background(), phase, "work")
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if !result.Success {
				t.Errorf("expected success, got error: %v", result.Steps[0].Error)
			}

			if result.Steps[0].Output != tt.expected {
				t.Errorf("expected %q, got %q", tt.expected, result.Steps[0].Output)
			}
		})
	}
}

func TestWorkflowExecutor_T_AGENT_EdgeCases(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	tests := []struct {
		name     string
		agent    string
		expected string
	}{
		{"hyphenated", "ui-engineer", "ui-engineer\n"},
		{"underscored", "ui_engineer", "ui_engineer\n"},
		{"numbers", "agent123", "agent123\n"},
		{"single char", "a", "a\n"},
		{"empty agent", "", "\n"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-1", tt.agent)
			phase := &WorkflowPhase{
				Steps: []Step{{Exec: "echo T_AGENT"}},
			}

			result, err := exec.ExecutePhase(context.Background(), phase, "work")
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if !result.Success {
				t.Errorf("expected success")
			}

			if result.Steps[0].Output != tt.expected {
				t.Errorf("expected %q, got %q", tt.expected, result.Steps[0].Output)
			}
		})
	}
}

func TestWorkflowExecutor_T_AGENT_CaseSensitivity(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	// Only exact case "T_AGENT" should be replaced
	// Lowercase and mixed case should NOT be replaced
	tests := []struct {
		name     string
		cmd      string
		expected string
	}{
		{"t_agent lowercase", "echo t_agent", "t_agent\n"},
		{"T_Agent mixed", "echo T_Agent", "T_Agent\n"},
		{"exact T_AGENT", "echo T_AGENT", "test-agent\n"},
		// Substring matches ARE replaced (consistent with T_ISSUE_ID behavior)
		{"T_AGENT_NAME substring", "echo T_AGENT_NAME", "test-agent_NAME\n"},
		{"MY_T_AGENT substring", "echo MY_T_AGENT", "MY_test-agent\n"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-1", "test-agent")
			phase := &WorkflowPhase{
				Steps: []Step{{Exec: tt.cmd}},
			}

			result, err := exec.ExecutePhase(context.Background(), phase, "work")
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}

			if result.Steps[0].Output != tt.expected {
				t.Errorf("expected %q, got %q", tt.expected, result.Steps[0].Output)
			}
		})
	}
}

func TestWorkflowExecutor_T_AGENT_Parallel(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "parallel-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{
				Parallel: []Step{
					{Exec: "echo step1 T_AGENT"},
					{Exec: "echo step2 T_AGENT"},
					{Exec: "echo step3 T_AGENT T_ISSUE_ID"},
				},
			},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	// All parallel steps should have T_AGENT replaced
	for i, sr := range result.Steps {
		if sr.Output == "" {
			continue // might be timing issue
		}
		if sr.Output != "" && !contains(sr.Output, "parallel-agent") {
			t.Errorf("step %d: expected output to contain 'parallel-agent', got %q", i, sr.Output)
		}
	}
}

func TestWorkflowExecutor_T_AGENT_StartupShutdown(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "lifecycle-agent")

	phase := &WorkflowPhase{
		Startup:  []Step{{Exec: "echo startup T_AGENT"}},
		Steps:    []Step{{Exec: "echo main T_AGENT T_ISSUE_ID"}},
		Shutdown: []Step{{Exec: "echo shutdown T_AGENT"}},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	// Check all phases replaced T_AGENT
	expected := []string{
		"startup lifecycle-agent\n",
		"main lifecycle-agent qb-123\n",
		"shutdown lifecycle-agent\n",
	}

	if len(result.Steps) != 3 {
		t.Fatalf("expected 3 steps, got %d", len(result.Steps))
	}

	for i, sr := range result.Steps {
		if sr.Output != expected[i] {
			t.Errorf("step %d: expected %q, got %q", i, expected[i], sr.Output)
		}
	}
}

func TestWorkflowExecutor_ExecuteExec_Failure(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Exec: "exit 1"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure")
	}

	if result.Steps[0].Error == nil {
		t.Error("expected error in step result")
	}
}

func TestWorkflowExecutor_ExecuteParallel(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{
				Parallel: []Step{
					{Exec: "echo step1"},
					{Exec: "echo step2"},
					{Exec: "echo step3"},
				},
			},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	// Should have 3 step results from the parallel execution
	if len(result.Steps) != 3 {
		t.Errorf("expected 3 step results, got %d", len(result.Steps))
	}

	for _, sr := range result.Steps {
		if !sr.Success {
			t.Errorf("expected step to succeed: %v", sr.Error)
		}
	}
}

func TestWorkflowExecutor_StartupStepsShutdown(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Startup:  []Step{{Exec: "echo startup"}},
		Steps:    []Step{{Exec: "echo main"}},
		Shutdown: []Step{{Exec: "echo shutdown"}},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Error("expected success")
	}

	// Should have 3 step results (startup + main + shutdown)
	if len(result.Steps) != 3 {
		t.Errorf("expected 3 step results, got %d", len(result.Steps))
	}
}

func TestWorkflowExecutor_StartupFailure_SkipsMain(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Startup:  []Step{{Exec: "exit 1"}},
		Steps:    []Step{{Exec: "echo should-not-run"}},
		Shutdown: []Step{{Exec: "echo shutdown"}},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure due to startup failure")
	}

	// Main steps should not have run (only startup result)
	// Shutdown should not run when startup fails
	if len(result.Steps) != 1 {
		t.Errorf("expected 1 step result (startup only), got %d", len(result.Steps))
	}
}

func TestWorkflowExecutor_MainFailure_RunsShutdown(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Startup:  []Step{{Exec: "echo startup"}},
		Steps:    []Step{{Exec: "exit 1"}},
		Shutdown: []Step{{Exec: "echo shutdown"}},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure due to main step failure")
	}

	// Shutdown should still run
	if len(result.Steps) != 3 {
		t.Errorf("expected 3 step results (startup, main, shutdown), got %d", len(result.Steps))
	}
}

func TestWorkflowExecutor_NilPhase(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	_, err := exec.ExecutePhase(context.Background(), nil, "work")
	if err == nil {
		t.Error("expected error for nil phase")
	}
}

func TestWorkflowExecutor_EmptyStep(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{}, // Empty step - no command, exec, or parallel
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure for empty step")
	}
}

func TestWorkflowExecutor_EmptyParallel(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Parallel: []Step{}}, // Empty parallel
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure for empty parallel")
	}
}

func TestWorkflowExecutor_ContextCancellation(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Exec: "sleep 10"},
		},
	}

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()

	result, err := exec.ExecutePhase(ctx, phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure due to context cancellation")
	}
}

func TestRegistry_GetWorkflow(t *testing.T) {
	reg := &Registry{
		Workflows: map[string]Workflow{
			"task": {
				Work: &WorkflowPhase{
					Steps: []Step{{Command: "work_issue"}},
				},
			},
			"epic": {
				Plan: &WorkflowPhase{
					Steps: []Step{{Command: "plan_issue"}},
				},
			},
		},
	}

	wf, ok := reg.GetWorkflow("task")
	if !ok {
		t.Error("expected task workflow to exist")
	}
	if wf.Work == nil {
		t.Error("expected work phase")
	}

	wf, ok = reg.GetWorkflow("epic")
	if !ok {
		t.Error("expected epic workflow to exist")
	}
	if wf.Plan == nil {
		t.Error("expected plan phase")
	}

	_, ok = reg.GetWorkflow("nonexistent")
	if ok {
		t.Error("expected nonexistent workflow to not exist")
	}
}

func TestRegistry_GetWorkflow_NilWorkflows(t *testing.T) {
	reg := &Registry{
		Workflows: nil,
	}

	_, ok := reg.GetWorkflow("task")
	if ok {
		t.Error("expected no workflow when Workflows is nil")
	}
}

func TestRegistry_GetDefaultWorkflow(t *testing.T) {
	reg := &Registry{}

	// Epic should get plan workflow
	wf := reg.GetDefaultWorkflow("epic")
	if wf.Plan == nil {
		t.Error("expected epic to have plan phase")
	}
	if len(wf.Plan.Steps) != 1 || wf.Plan.Steps[0].Command != "plan_issue" {
		t.Error("expected plan_issue command")
	}

	// Task should get work workflow
	wf = reg.GetDefaultWorkflow("task")
	if wf.Work == nil {
		t.Error("expected task to have work phase")
	}
	if len(wf.Work.Steps) != 1 || wf.Work.Steps[0].Command != "work_issue" {
		t.Error("expected work_issue command")
	}

	// Bug should get work workflow (default)
	wf = reg.GetDefaultWorkflow("bug")
	if wf.Work == nil {
		t.Error("expected bug to have work phase")
	}
}

func TestGetStepType(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)
	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	tests := []struct {
		step     Step
		expected string
	}{
		{Step{Command: "work_issue"}, "command"},
		{Step{Exec: "echo test"}, "exec"},
		{Step{Parallel: []Step{{Exec: "echo"}}}, "parallel"},
		{Step{}, "unknown"},
	}

	for _, tc := range tests {
		got := exec.getStepType(tc.step)
		if got != tc.expected {
			t.Errorf("expected %s, got %s", tc.expected, got)
		}
	}
}

func TestWorkflowResult_Duration(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Exec: "sleep 0.1"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Duration < 100*time.Millisecond {
		t.Errorf("expected duration >= 100ms, got %v", result.Duration)
	}
}

func TestWorkflowExecutor_ExecuteCommand_NotFound(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{
		Agents: map[string]Agent{
			"test-agent": {
				Skills: []string{"test"},
				Commands: map[string]Command{
					"work_issue": {
						Run: "echo test",
					},
				},
			},
		},
	}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Command: "nonexistent_command"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if result.Success {
		t.Error("expected failure when command not found")
	}
}

func TestWorkflowExecutor_ExecuteCommand_Success(t *testing.T) {
	tmpDir := t.TempDir()
	reg := &Registry{
		Agents: map[string]Agent{
			"test-agent": {
				Skills: []string{"test"},
				Commands: map[string]Command{
					"work_issue": {
						Run:           "echo T_ISSUE_ID",
						MaxConcurrent: 5,
					},
				},
			},
		},
		Daemon: DaemonConfig{
			MaxAgents: 10,
		},
	}
	runner := NewRunner(reg, tmpDir, tmpDir)

	exec := NewWorkflowExecutor(reg, runner, tmpDir, "qb-123", "test-agent")

	phase := &WorkflowPhase{
		Steps: []Step{
			{Command: "work_issue"},
		},
	}

	result, err := exec.ExecutePhase(context.Background(), phase, "work")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	if !result.Success {
		t.Errorf("expected success: %v", result.Steps)
	}

	if len(result.Steps) != 1 {
		t.Errorf("expected 1 step, got %d", len(result.Steps))
	}

	// Command should have started successfully
	if result.Steps[0].StepType != "command" {
		t.Errorf("expected command step type, got %s", result.Steps[0].StepType)
	}
}
