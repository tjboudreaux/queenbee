package registry

import (
	"os"
	"path/filepath"
	"testing"
)

func TestLoadRegistry(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

daemon:
  max_agents: 3
  poll_interval: 1m
  stale_hours: 12

agents:
  ui-engineer:
    skills: [react, typescript]
    commands:
      work_issue:
        run: "echo working on T_ISSUE_ID"
        max_concurrent: 2
      plan_issue:
        run: "echo planning T_ISSUE_ID"

  backend-engineer:
    skills: [go, postgres]
    commands:
      work_issue:
        run: "echo backend T_ISSUE_ID"

rules:
  - match:
      labels: [frontend, ui]
    agent: ui-engineer
  - match:
      labels: [backend, api]
    agent: backend-engineer

default_agent: backend-engineer
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	// Check daemon config
	if reg.Daemon.MaxAgents != 3 {
		t.Errorf("expected MaxAgents=3, got %d", reg.Daemon.MaxAgents)
	}

	// Check agents
	if len(reg.Agents) != 2 {
		t.Errorf("expected 2 agents, got %d", len(reg.Agents))
	}

	// Check ui-engineer
	ui, ok := reg.GetAgent("ui-engineer")
	if !ok {
		t.Fatal("ui-engineer not found")
	}
	if len(ui.Skills) != 2 {
		t.Errorf("expected 2 skills, got %d", len(ui.Skills))
	}

	// Check command max_concurrent
	workCmd, ok := reg.GetCommand("ui-engineer", "work_issue")
	if !ok {
		t.Fatal("work_issue command not found")
	}
	if workCmd.MaxConcurrent != 2 {
		t.Errorf("expected max_concurrent=2, got %d", workCmd.MaxConcurrent)
	}

	// Check default max_concurrent (should be 1)
	planCmd, ok := reg.GetCommand("ui-engineer", "plan_issue")
	if !ok {
		t.Fatal("plan_issue command not found")
	}
	if planCmd.MaxConcurrent != DefaultMaxConcurrent {
		t.Errorf("expected default max_concurrent=%d, got %d", DefaultMaxConcurrent, planCmd.MaxConcurrent)
	}
}

func TestDefaultMaxConcurrent(t *testing.T) {
	dir := t.TempDir()
	
	// Config without explicit max_concurrent
	content := `
version: 1

agents:
  test-agent:
    skills: [testing]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	cmd, ok := reg.GetCommand("test-agent", "work_issue")
	if !ok {
		t.Fatal("command not found")
	}

	if cmd.MaxConcurrent != DefaultMaxConcurrent {
		t.Errorf("expected default max_concurrent=%d, got %d", DefaultMaxConcurrent, cmd.MaxConcurrent)
	}
}

func TestMatchAgent(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  ui-engineer:
    skills: [react]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"
  backend-engineer:
    skills: [go]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"

rules:
  - match:
      labels: [frontend, ui, components]
    agent: ui-engineer
  - match:
      labels: [backend, api]
    agent: backend-engineer
  - match:
      type: bug
    agent: backend-engineer

default_agent: ui-engineer
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	tests := []struct {
		name     string
		labels   []string
		typ      string
		priority string
		want     string
	}{
		{"frontend label", []string{"frontend"}, "", "", "ui-engineer"},
		{"ui label", []string{"ui"}, "", "", "ui-engineer"},
		{"backend label", []string{"backend"}, "", "", "backend-engineer"},
		{"api label", []string{"api"}, "", "", "backend-engineer"},
		{"bug type", []string{}, "bug", "", "backend-engineer"},
		{"no match - use default", []string{"random"}, "", "", "ui-engineer"},
		{"empty - use default", []string{}, "", "", "ui-engineer"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := reg.MatchAgent(tt.labels, tt.typ, tt.priority)
			if got != tt.want {
				t.Errorf("MatchAgent() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestBuildCommand(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  test-agent:
    skills: [testing]
    commands:
      work_issue:
        run: "factory run --issue T_ISSUE_ID --verbose"
      plan_issue:
        run: "factory plan T_ISSUE_ID"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	tests := []struct {
		agent   string
		command string
		issueID string
		want    string
		wantErr bool
	}{
		{"test-agent", "work_issue", "gb-123", "factory run --issue gb-123 --verbose", false},
		{"test-agent", "plan_issue", "qb-456", "factory plan qb-456", false},
		{"test-agent", "unknown", "gb-123", "", true},
		{"unknown-agent", "work_issue", "gb-123", "", true},
	}

	for _, tt := range tests {
		t.Run(tt.agent+"/"+tt.command, func(t *testing.T) {
			got, err := reg.BuildCommand(tt.agent, tt.command, tt.issueID)
			if (err != nil) != tt.wantErr {
				t.Errorf("BuildCommand() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if got != tt.want {
				t.Errorf("BuildCommand() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestBuildCommand_T_AGENT(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  ui-engineer:
    skills: [react]
    commands:
      work_issue:
        run: "queen msg send T_AGENT 'Working on T_ISSUE_ID'"
      notify:
        run: "echo Agent T_AGENT started"
      both_placeholders:
        run: "factory run --agent T_AGENT --issue T_ISSUE_ID --verbose"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	tests := []struct {
		name    string
		agent   string
		command string
		issueID string
		want    string
	}{
		{
			name:    "T_AGENT replacement",
			agent:   "ui-engineer",
			command: "notify",
			issueID: "qb-123",
			want:    "echo Agent ui-engineer started",
		},
		{
			name:    "both T_ISSUE_ID and T_AGENT",
			agent:   "ui-engineer",
			command: "work_issue",
			issueID: "qb-456",
			want:    "queen msg send ui-engineer 'Working on qb-456'",
		},
		{
			name:    "both placeholders reversed order",
			agent:   "ui-engineer",
			command: "both_placeholders",
			issueID: "gb-789",
			want:    "factory run --agent ui-engineer --issue gb-789 --verbose",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := reg.BuildCommand(tt.agent, tt.command, tt.issueID)
			if err != nil {
				t.Fatalf("BuildCommand() error = %v", err)
			}
			if got != tt.want {
				t.Errorf("BuildCommand() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestBuildCommand_T_AGENT_EdgeCases(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  hyphen-agent:
    skills: [test]
    commands:
      work_issue:
        run: "echo T_AGENT"
  underscore_agent:
    skills: [test]
    commands:
      work_issue:
        run: "echo T_AGENT"
  agent123:
    skills: [test]
    commands:
      work_issue:
        run: "echo T_AGENT"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	tests := []struct {
		name  string
		agent string
		want  string
	}{
		{"hyphenated agent", "hyphen-agent", "echo hyphen-agent"},
		{"underscored agent", "underscore_agent", "echo underscore_agent"},
		{"numeric agent", "agent123", "echo agent123"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := reg.BuildCommand(tt.agent, "work_issue", "qb-1")
			if err != nil {
				t.Fatalf("BuildCommand() error = %v", err)
			}
			if got != tt.want {
				t.Errorf("BuildCommand() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestBuildCommand_T_AGENT_NoReplacement(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  test-agent:
    skills: [test]
    commands:
      no_placeholders:
        run: "echo hello world"
      case_sensitive:
        run: "echo t_agent T_Agent T_AGENT"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	tests := []struct {
		name    string
		command string
		want    string
	}{
		{
			name:    "no placeholders",
			command: "no_placeholders",
			want:    "echo hello world",
		},
		{
			name:    "case sensitive - only exact T_AGENT replaced",
			command: "case_sensitive",
			want:    "echo t_agent T_Agent test-agent",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := reg.BuildCommand("test-agent", tt.command, "qb-1")
			if err != nil {
				t.Fatalf("BuildCommand() error = %v", err)
			}
			if got != tt.want {
				t.Errorf("BuildCommand() = %q, want %q", got, tt.want)
			}
		})
	}
}

func TestCommandHash(t *testing.T) {
	hash1 := CommandHash("ui-engineer", "work_issue", "gb-123")
	hash2 := CommandHash("ui-engineer", "work_issue", "gb-123")
	hash3 := CommandHash("ui-engineer", "work_issue", "gb-456")
	hash4 := CommandHash("backend-engineer", "work_issue", "gb-123")

	// Same inputs = same hash
	if hash1 != hash2 {
		t.Errorf("same inputs should produce same hash")
	}

	// Different issue = different hash
	if hash1 == hash3 {
		t.Errorf("different issue should produce different hash")
	}

	// Different agent = different hash
	if hash1 == hash4 {
		t.Errorf("different agent should produce different hash")
	}

	// Hash should be 16 chars (8 bytes hex)
	if len(hash1) != 16 {
		t.Errorf("expected hash length 16, got %d", len(hash1))
	}
}

func TestFindAgentsWithSkill(t *testing.T) {
	dir := t.TempDir()
	
	content := `
version: 1

agents:
  ui-engineer:
    skills: [react, typescript, css]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"
  fullstack:
    skills: [react, go, postgres]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"
  backend-engineer:
    skills: [go, postgres]
    commands:
      work_issue:
        run: "echo T_ISSUE_ID"
`
	
	err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(content), 0644)
	if err != nil {
		t.Fatal(err)
	}

	reg, err := Load(dir)
	if err != nil {
		t.Fatalf("Load failed: %v", err)
	}

	// React skill
	reactAgents := reg.FindAgentsWithSkill("react")
	if len(reactAgents) != 2 {
		t.Errorf("expected 2 agents with react, got %d", len(reactAgents))
	}

	// Go skill
	goAgents := reg.FindAgentsWithSkill("go")
	if len(goAgents) != 2 {
		t.Errorf("expected 2 agents with go, got %d", len(goAgents))
	}

	// CSS skill (only ui-engineer)
	cssAgents := reg.FindAgentsWithSkill("css")
	if len(cssAgents) != 1 {
		t.Errorf("expected 1 agent with css, got %d", len(cssAgents))
	}

	// Unknown skill
	unknownAgents := reg.FindAgentsWithSkill("unknown")
	if len(unknownAgents) != 0 {
		t.Errorf("expected 0 agents with unknown skill, got %d", len(unknownAgents))
	}
}

func TestValidation(t *testing.T) {
	tests := []struct {
		name    string
		content string
		wantErr string
	}{
		{
			"missing version",
			`agents:
  test:
    commands:
      work_issue:
        run: "echo"`,
			"version is required",
		},
		{
			"unsupported version",
			`version: 99
agents:
  test:
    commands:
      work_issue:
        run: "echo"`,
			"unsupported version",
		},
		{
			"no agents",
			`version: 1`,
			"at least one agent",
		},
		{
			"agent without commands",
			`version: 1
agents:
  test:
    skills: [testing]`,
			"has no commands",
		},
		{
			"command without run",
			`version: 1
agents:
  test:
    commands:
      work_issue:
        max_concurrent: 1`,
			"has no run",
		},
		{
			"rule references unknown agent",
			`version: 1
agents:
  test:
    commands:
      work_issue:
        run: "echo"
rules:
  - match:
      labels: [test]
    agent: unknown`,
			"unknown agent",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			dir := t.TempDir()
			err := os.WriteFile(filepath.Join(dir, ".queen.yaml"), []byte(tt.content), 0644)
			if err != nil {
				t.Fatal(err)
			}

			_, err = Load(dir)
			if err == nil {
				t.Error("expected error, got nil")
				return
			}
			if tt.wantErr != "" && !contains(err.Error(), tt.wantErr) {
				t.Errorf("error %q should contain %q", err.Error(), tt.wantErr)
			}
		})
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
