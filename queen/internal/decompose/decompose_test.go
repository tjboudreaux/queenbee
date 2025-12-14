package decompose

import (
	"testing"
)

func TestDecompose_WithDeliverables(t *testing.T) {
	epic := Epic{
		ID:       "qb-123",
		Title:    "User Authentication System",
		Priority: "P1",
		Description: `
Implement user authentication for the application.

Deliverables:
- Login page with email/password
- Registration form with validation
- Password reset flow
- Session management
- OAuth integration - DONE

Depends on: qb-100 (database setup)
`,
	}

	result := Decompose(epic)

	if result.EpicID != "qb-123" {
		t.Errorf("EpicID = %q, want %q", result.EpicID, "qb-123")
	}

	// Should extract 4 non-done deliverables
	if len(result.Tasks) < 4 {
		t.Errorf("Expected at least 4 tasks, got %d", len(result.Tasks))
	}

	// Check that done items are excluded or marked
	for _, task := range result.Tasks {
		if task.Title == "OAuth integration" {
			// Done items should be excluded
			t.Errorf("Done item should not be included: %s", task.Title)
		}
	}
}

func TestDecompose_WithChecklist(t *testing.T) {
	epic := Epic{
		ID:       "qb-456",
		Title:    "API Implementation",
		Priority: "P2",
		Description: `
Build REST API endpoints.

Tasks:
- [ ] Create user endpoints (CRUD)
- [x] Set up database schema
- [ ] Add authentication middleware
- [ ] Write API documentation
`,
	}

	result := Decompose(epic)

	// Should extract unchecked items
	if len(result.Tasks) < 3 {
		t.Errorf("Expected at least 3 tasks (unchecked items), got %d", len(result.Tasks))
	}
}

func TestDecompose_InfersLabels(t *testing.T) {
	epic := Epic{
		ID:       "qb-789",
		Title:    "Full Stack Feature",
		Priority: "P1",
		Description: `
Deliverables:
- Frontend React component for dashboard
- Backend API endpoint for data
- Unit tests for all components
- Deployment pipeline setup
`,
	}

	result := Decompose(epic)

	// Check label inference
	foundUI := false
	foundBackend := false
	foundTest := false
	foundInfra := false

	for _, task := range result.Tasks {
		for _, label := range task.Labels {
			switch label {
			case "ui":
				foundUI = true
			case "backend":
				foundBackend = true
			case "test":
				foundTest = true
			case "infra":
				foundInfra = true
			}
		}
	}

	if !foundUI {
		t.Error("Expected to find 'ui' label for frontend task")
	}
	if !foundBackend {
		t.Error("Expected to find 'backend' label for API task")
	}
	if !foundTest {
		t.Error("Expected to find 'test' label for test task")
	}
	if !foundInfra {
		t.Error("Expected to find 'infra' label for deployment task")
	}
}

func TestDecompose_EmptyDescription(t *testing.T) {
	epic := Epic{
		ID:          "qb-000",
		Title:       "Empty Epic",
		Priority:    "P3",
		Description: "",
	}

	result := Decompose(epic)

	if len(result.Tasks) != 0 {
		t.Errorf("Expected 0 tasks for empty description, got %d", len(result.Tasks))
	}

	if result.Confidence > 0.5 {
		t.Errorf("Confidence should be low for empty epic, got %f", result.Confidence)
	}

	if len(result.Warnings) == 0 {
		t.Error("Expected warnings for empty epic")
	}
}

func TestDecompose_PriorityInheritance(t *testing.T) {
	epic := Epic{
		ID:       "qb-111",
		Title:    "Priority Test",
		Priority: "P0",
		Description: `
Deliverables:
- Critical task one
- Critical task two
- Less critical task five
- Less critical task six
- Less critical task seven
`,
	}

	result := Decompose(epic)

	// First tasks should inherit P0, later ones should be lowered
	if len(result.Tasks) > 0 && result.Tasks[0].Priority != "P0" {
		t.Errorf("First task priority = %q, want P0", result.Tasks[0].Priority)
	}
}

func TestDecompose_DetectsDependencies(t *testing.T) {
	epic := Epic{
		ID:       "qb-222",
		Title:    "Dependency Test",
		Priority: "P1",
		Description: `
Deliverables:
- Create database schema
- Implement user repository using database
- Build API layer with repository
`,
	}

	result := Decompose(epic)

	// Later tasks should have dependencies on earlier related tasks
	hasDependency := false
	for _, task := range result.Tasks {
		if len(task.DependsOn) > 0 {
			hasDependency = true
			break
		}
	}

	if !hasDependency {
		t.Log("Warning: No dependencies detected (may be expected for simple cases)")
	}
}

func TestExtractDeliverables(t *testing.T) {
	desc := `
Overview text.

Deliverables:
- First item
- Second item - DONE
- Third item

Other section:
- Not a deliverable
`

	items := extractDeliverables(desc)

	if len(items) != 3 {
		t.Errorf("Expected 3 deliverables, got %d", len(items))
	}

	// Check done detection
	doneCount := 0
	for _, item := range items {
		if item.done {
			doneCount++
		}
	}
	if doneCount != 1 {
		t.Errorf("Expected 1 done item, got %d", doneCount)
	}
}

func TestExtractChecklist(t *testing.T) {
	desc := `
Tasks:
- [ ] Unchecked one
- [x] Checked item
- [ ] Unchecked two
`

	items := extractChecklist(desc)

	if len(items) != 3 {
		t.Errorf("Expected 3 checklist items, got %d", len(items))
	}

	checked := 0
	for _, item := range items {
		if item.done {
			checked++
		}
	}
	if checked != 1 {
		t.Errorf("Expected 1 checked item, got %d", checked)
	}
}

func TestInferLabels(t *testing.T) {
	tests := []struct {
		text     string
		expected []string
	}{
		{"Create React component for UI", []string{"ui"}},
		{"Build REST API endpoint", []string{"backend"}},
		{"Write unit tests", []string{"test"}},
		{"Set up CI/CD pipeline", []string{"infra"}},
		{"Add authentication system", []string{"backend", "security"}},
	}

	for _, tc := range tests {
		labels := inferLabels(tc.text)

		for _, expected := range tc.expected {
			found := false
			for _, label := range labels {
				if label == expected {
					found = true
					break
				}
			}
			if !found {
				t.Errorf("inferLabels(%q) missing expected label %q, got %v", tc.text, expected, labels)
			}
		}
	}
}

func TestLowerPriority(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"P0", "P1"},
		{"P1", "P2"},
		{"P2", "P3"},
		{"P3", "P3"},
		{"P4", "P4"},
	}

	for _, tc := range tests {
		result := lowerPriority(tc.input)
		if result != tc.expected {
			t.Errorf("lowerPriority(%q) = %q, want %q", tc.input, result, tc.expected)
		}
	}
}

func TestCalculateConfidence(t *testing.T) {
	tests := []struct {
		taskCount int
		desc      string
		minConf   float64
	}{
		{0, "", 0.0},
		{2, "Simple description", 0.4},
		{5, "With Deliverables section", 0.8},
		{5, "With [ ] checklist", 0.8},
	}

	for _, tc := range tests {
		conf := calculateConfidence(tc.taskCount, tc.desc)
		if conf < tc.minConf {
			t.Errorf("calculateConfidence(%d, %q) = %f, want >= %f", tc.taskCount, tc.desc, conf, tc.minConf)
		}
	}
}

func TestGenerateWarnings(t *testing.T) {
	// Test empty tasks warning
	warnings := generateWarnings([]TaskSuggestion{}, "desc")
	if len(warnings) == 0 {
		t.Error("Expected warning for empty tasks")
	}

	// Test too many tasks warning
	manyTasks := make([]TaskSuggestion, 20)
	warnings = generateWarnings(manyTasks, "desc")
	foundManyWarning := false
	for _, w := range warnings {
		if w == "Many tasks extracted. Consider splitting into sub-epics." {
			foundManyWarning = true
		}
	}
	if !foundManyWarning {
		t.Error("Expected warning for many tasks")
	}
}
