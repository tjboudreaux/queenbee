package autoassign

import (
	"testing"
)

func TestAssigner_GeneratePlan_SkillMatch(t *testing.T) {
	droids := []Droid{
		{Name: "ui-engineer", Skills: []string{"ui", "frontend"}, MaxLoad: 3},
		{Name: "backend-engineer", Skills: []string{"backend", "api"}, MaxLoad: 3},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "task-1", Title: "Build login form", Labels: []string{"ui"}},
		{ID: "task-2", Title: "Create API endpoint", Labels: []string{"backend", "api"}},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 2 {
		t.Fatalf("Expected 2 assignments, got %d", len(plan.Assignments))
	}

	// Check that UI task goes to ui-engineer
	var uiAssignment, backendAssignment *Assignment
	for i := range plan.Assignments {
		if plan.Assignments[i].TaskID == "task-1" {
			uiAssignment = &plan.Assignments[i]
		} else if plan.Assignments[i].TaskID == "task-2" {
			backendAssignment = &plan.Assignments[i]
		}
	}

	if uiAssignment == nil || uiAssignment.DroidName != "ui-engineer" {
		t.Errorf("Expected task-1 assigned to ui-engineer, got %v", uiAssignment)
	}

	if backendAssignment == nil || backendAssignment.DroidName != "backend-engineer" {
		t.Errorf("Expected task-2 assigned to backend-engineer, got %v", backendAssignment)
	}
}

func TestAssigner_GeneratePlan_PriorityOrder(t *testing.T) {
	droids := []Droid{
		{Name: "general", Skills: []string{}, MaxLoad: 2},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "low-pri", Title: "Low priority task", Priority: 3},
		{ID: "high-pri", Title: "High priority task", Priority: 0},
		{ID: "med-pri", Title: "Medium priority task", Priority: 1},
	})

	plan := assigner.GeneratePlan()

	// Should assign in priority order (only 2 due to MaxLoad)
	if len(plan.Assignments) != 2 {
		t.Fatalf("Expected 2 assignments, got %d", len(plan.Assignments))
	}

	// High priority should be first
	if plan.Assignments[0].TaskID != "high-pri" {
		t.Errorf("Expected high-pri first, got %s", plan.Assignments[0].TaskID)
	}

	if plan.Assignments[1].TaskID != "med-pri" {
		t.Errorf("Expected med-pri second, got %s", plan.Assignments[1].TaskID)
	}

	// Low priority should be unassigned
	if len(plan.Unassigned) != 1 || plan.Unassigned[0] != "low-pri" {
		t.Errorf("Expected low-pri to be unassigned, got %v", plan.Unassigned)
	}
}

func TestAssigner_GeneratePlan_WorktreeAlignment(t *testing.T) {
	droids := []Droid{
		{Name: "droid-a", Skills: []string{"backend"}, MaxLoad: 3, PreferWorktree: "feature-auth"},
		{Name: "droid-b", Skills: []string{"backend"}, MaxLoad: 3, PreferWorktree: "feature-api"},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "auth-task", Title: "Auth work", Labels: []string{"backend"}, Worktree: "feature-auth"},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 1 {
		t.Fatalf("Expected 1 assignment, got %d", len(plan.Assignments))
	}

	// Should prefer droid-a due to worktree match
	if plan.Assignments[0].DroidName != "droid-a" {
		t.Errorf("Expected droid-a (worktree match), got %s", plan.Assignments[0].DroidName)
	}
}

func TestAssigner_GeneratePlan_LoadBalancing(t *testing.T) {
	droids := []Droid{
		{Name: "busy", Skills: []string{"test"}, CurrentLoad: 2, MaxLoad: 3},
		{Name: "free", Skills: []string{"test"}, CurrentLoad: 0, MaxLoad: 3},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "task-1", Title: "Test task", Labels: []string{"test"}},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 1 {
		t.Fatalf("Expected 1 assignment, got %d", len(plan.Assignments))
	}

	// Should prefer free droid due to higher availability
	if plan.Assignments[0].DroidName != "free" {
		t.Errorf("Expected free droid (higher availability), got %s", plan.Assignments[0].DroidName)
	}
}

func TestAssigner_GeneratePlan_CapacityLimit(t *testing.T) {
	droids := []Droid{
		{Name: "full", Skills: []string{"test"}, CurrentLoad: 3, MaxLoad: 3},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "task-1", Title: "Test task", Labels: []string{"test"}},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 0 {
		t.Errorf("Expected no assignments (droid at capacity), got %d", len(plan.Assignments))
	}

	if len(plan.Unassigned) != 1 {
		t.Errorf("Expected 1 unassigned task, got %d", len(plan.Unassigned))
	}
}

func TestAssigner_GeneratePlan_Warnings(t *testing.T) {
	droids := []Droid{
		{Name: "only-droid", Skills: []string{"ui"}, MaxLoad: 1},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "task-1", Title: "UI task", Labels: []string{"ui"}},
		{ID: "task-2", Title: "Backend task", Labels: []string{"backend"}},
	})

	plan := assigner.GeneratePlan()

	// Should have warnings about unassigned tasks and capacity
	if len(plan.Warnings) == 0 {
		t.Error("Expected warnings, got none")
	}

	foundCapacityWarning := false
	for _, w := range plan.Warnings {
		if w == "only-droid is at capacity." {
			foundCapacityWarning = true
		}
	}
	if !foundCapacityWarning {
		t.Errorf("Expected capacity warning, got %v", plan.Warnings)
	}
}

func TestAssigner_Confidence(t *testing.T) {
	droids := []Droid{
		{Name: "expert", Skills: []string{"ui", "frontend", "react"}, MaxLoad: 5},
		{Name: "generalist", Skills: []string{}, MaxLoad: 5},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "ui-task", Title: "React component", Labels: []string{"ui", "react"}},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 1 {
		t.Fatalf("Expected 1 assignment, got %d", len(plan.Assignments))
	}

	// Expert should get the task with high confidence
	if plan.Assignments[0].DroidName != "expert" {
		t.Errorf("Expected expert droid, got %s", plan.Assignments[0].DroidName)
	}

	if plan.Assignments[0].Confidence < 0.7 {
		t.Errorf("Expected high confidence for skill match, got %f", plan.Assignments[0].Confidence)
	}
}

func TestCalculateSkillMatch(t *testing.T) {
	tests := []struct {
		taskLabels  []string
		droidSkills []string
		minMatch    float64
		maxMatch    float64
	}{
		{[]string{}, []string{"ui"}, 0.4, 0.6},              // No labels = any droid
		{[]string{"ui"}, []string{}, 0.2, 0.4},              // No skills = low
		{[]string{"ui"}, []string{"ui"}, 0.9, 1.1},          // Full match
		{[]string{"ui", "react"}, []string{"ui"}, 0.4, 0.6}, // Partial match
		{[]string{"ui"}, []string{"backend"}, -0.1, 0.1},    // No overlap
	}

	for _, tc := range tests {
		score := calculateSkillMatch(tc.taskLabels, tc.droidSkills)
		if score < tc.minMatch || score > tc.maxMatch {
			t.Errorf("calculateSkillMatch(%v, %v) = %f, want between %f and %f",
				tc.taskLabels, tc.droidSkills, score, tc.minMatch, tc.maxMatch)
		}
	}
}

func TestAssigner_MultipleTasks(t *testing.T) {
	droids := []Droid{
		{Name: "ui-engineer", Skills: []string{"ui", "frontend"}, MaxLoad: 2},
		{Name: "backend-engineer", Skills: []string{"backend", "api"}, MaxLoad: 2},
		{Name: "qa-engineer", Skills: []string{"test", "qa"}, MaxLoad: 2},
	}

	assigner := NewAssigner(droids)
	assigner.SetTasks([]Task{
		{ID: "ui-1", Title: "Login form", Labels: []string{"ui"}, Priority: 1},
		{ID: "ui-2", Title: "Dashboard", Labels: []string{"ui"}, Priority: 2},
		{ID: "api-1", Title: "User API", Labels: []string{"backend", "api"}, Priority: 1},
		{ID: "api-2", Title: "Auth API", Labels: []string{"backend"}, Priority: 0},
		{ID: "test-1", Title: "E2E tests", Labels: []string{"test"}, Priority: 2},
	})

	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 5 {
		t.Fatalf("Expected 5 assignments, got %d (unassigned: %v)", len(plan.Assignments), plan.Unassigned)
	}

	// Check distribution
	counts := make(map[string]int)
	for _, a := range plan.Assignments {
		counts[a.DroidName]++
	}

	if counts["ui-engineer"] != 2 {
		t.Errorf("Expected ui-engineer to have 2 tasks, got %d", counts["ui-engineer"])
	}

	if counts["backend-engineer"] != 2 {
		t.Errorf("Expected backend-engineer to have 2 tasks, got %d", counts["backend-engineer"])
	}

	if counts["qa-engineer"] != 1 {
		t.Errorf("Expected qa-engineer to have 1 task, got %d", counts["qa-engineer"])
	}
}

func TestAssigner_EmptyInputs(t *testing.T) {
	// No droids
	assigner := NewAssigner([]Droid{})
	assigner.SetTasks([]Task{{ID: "task-1", Title: "Test"}})

	plan := assigner.GeneratePlan()
	if len(plan.Assignments) != 0 {
		t.Errorf("Expected no assignments with no droids, got %d", len(plan.Assignments))
	}

	// No tasks
	assigner = NewAssigner([]Droid{{Name: "droid", MaxLoad: 3}})
	assigner.SetTasks([]Task{})

	plan = assigner.GeneratePlan()
	if len(plan.Assignments) != 0 {
		t.Errorf("Expected no assignments with no tasks, got %d", len(plan.Assignments))
	}
}
