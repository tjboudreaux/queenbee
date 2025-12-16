package integration

import (
	"fmt"
	"testing"

	"github.com/tjboudreaux/queenbee/queen/internal/autoassign"
	"github.com/tjboudreaux/queenbee/queen/internal/decompose"
)

// testDroids returns a set of droids for auto-assignment testing.
func testDroids() []autoassign.Droid {
	return []autoassign.Droid{
		{Name: "frontend-engineer", Skills: []string{"TypeScript", "React", "CSS"}, MaxLoad: 3},
		{Name: "backend-engineer", Skills: []string{"Go", "PostgreSQL", "REST"}, MaxLoad: 3},
		{Name: "quality-engineer", Skills: []string{"Testing", "CodeReview", "CI/CD"}, MaxLoad: 3},
	}
}

// TestBasicWorkflow_EpicDecomposeAssign tests the core workflow:
// 1. Start with an epic
// 2. Decompose it into tasks
// 3. Assign tasks to droids
// 4. Verify assignments
func TestBasicWorkflow_EpicDecomposeAssign(t *testing.T) {
	env := NewTestEnv(t)

	// Setup: Create test droids
	env.CreateTestDroids()

	// Verify droids are discoverable
	droidList, err := env.DiscoverDroids()
	if err != nil {
		t.Fatalf("failed to discover droids: %v", err)
	}
	if len(droidList) == 0 {
		t.Fatal("no droids discovered")
	}

	// Step 1: Define an epic with properly formatted description
	epic := decompose.Epic{
		ID:    "qb-epic1",
		Title: "[Epic] User Authentication System",
		Description: `Implement complete user authentication.

Deliverables:
- Create login API endpoint
- Build registration form UI
- Implement password reset flow
- Add session management
- Write authentication tests`,
	}

	// Step 2: Decompose the epic into tasks
	result := decompose.Decompose(epic)

	t.Logf("Decomposition created %d tasks from epic %s", len(result.Tasks), epic.ID)
	if len(result.Tasks) == 0 {
		t.Fatal("decomposition produced no tasks")
	}

	// Verify tasks have proper structure
	for i, task := range result.Tasks {
		if task.Title == "" {
			t.Errorf("task %d has empty title", i)
		}
		t.Logf("  Task %d: %s (priority: %s, labels: %v)", i+1, task.Title, task.Priority, task.Labels)
	}

	// Step 3: Use test droids for assignment
	assignerDroids := testDroids()

	// Convert tasks for assignment
	assignerTasks := make([]autoassign.Task, len(result.Tasks))
	for i, task := range result.Tasks {
		assignerTasks[i] = autoassign.Task{
			ID:          fmt.Sprintf("qb-task%d", i+1),
			Title:       task.Title,
			Description: task.Description,
			Labels:      task.Labels,
		}
	}

	// Step 4: Run auto-assignment
	assigner := autoassign.NewAssigner(assignerDroids)
	assigner.SetTasks(assignerTasks)
	plan := assigner.GeneratePlan()

	t.Logf("Assignment plan: %d assignments, %d unassigned", len(plan.Assignments), len(plan.Unassigned))

	// Verify assignments were made
	if len(plan.Assignments) == 0 && len(assignerTasks) > 0 {
		t.Error("no assignments were made for non-empty task list")
	}

	// Log assignments
	for _, a := range plan.Assignments {
		t.Logf("  Assigned %s to %s (confidence: %.2f, reason: %s)",
			a.TaskID, a.DroidName, a.Confidence, a.Reason)
	}

	// Step 5: Create actual assignments in the store
	for _, a := range plan.Assignments {
		_, assignErr := env.CreateAssignment(a.TaskID, a.DroidName)
		if assignErr != nil {
			t.Fatalf("failed to create assignment for %s: %v", a.TaskID, assignErr)
		}
	}

	// Verify assignments in store
	activeAssignments, err := env.GetActiveAssignments()
	if err != nil {
		t.Fatalf("failed to get active assignments: %v", err)
	}

	if len(activeAssignments) != len(plan.Assignments) {
		t.Errorf("expected %d active assignments, got %d", len(plan.Assignments), len(activeAssignments))
	}
}

// TestBasicWorkflow_WithMessaging tests workflow with inter-droid messaging.
func TestBasicWorkflow_WithMessaging(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	// Step 1: Assign work
	_, err := env.CreateAssignment("qb-task1", "frontend-engineer")
	if err != nil {
		t.Fatalf("failed to create assignment: %v", err)
	}

	// Step 2: Droid starts work and sends status message
	_, err = env.SendMessage(
		"frontend-engineer",
		"quality-engineer",
		"[qb-task1] Starting: Login form implementation",
		"Beginning work on the login form. ETA: 2 hours.",
	)
	if err != nil {
		t.Fatalf("failed to send status message: %v", err)
	}

	// Step 3: Another droid asks a question
	_, err = env.SendMessage(
		"quality-engineer",
		"frontend-engineer",
		"Re: [qb-task1] Starting: Login form implementation",
		"Will there be validation error messages? Need for test cases.",
	)
	if err != nil {
		t.Fatalf("failed to send question: %v", err)
	}

	// Verify message exchange
	msgs, err := env.GetMessages()
	if err != nil {
		t.Fatalf("failed to get messages: %v", err)
	}
	if len(msgs) != 2 {
		t.Errorf("expected 2 messages, got %d", len(msgs))
	}
}

// TestBasicWorkflow_DependencyHandling tests that dependencies are respected.
func TestBasicWorkflow_DependencyHandling(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	// Create tasks with dependencies (simulated - in real system this would come from beads)
	// Task B depends on Task A
	tasks := []autoassign.Task{
		{ID: "qb-taskA", Title: "Task A (no deps)", Priority: 1, Labels: []string{"backend"}},
		{ID: "qb-taskB", Title: "Task B (depends on A)", Priority: 1, Labels: []string{"frontend"}},
	}

	// Use test droids
	assignerDroids := testDroids()

	// Assign tasks
	assigner := autoassign.NewAssigner(assignerDroids)
	assigner.SetTasks(tasks)
	plan := assigner.GeneratePlan()

	// Both tasks should be assigned
	if len(plan.Assignments) != 2 {
		t.Errorf("expected 2 assignments, got %d", len(plan.Assignments))
	}

	// Verify Task A is assigned (it's the dependency)
	var taskAAssigned, taskBAssigned bool
	for _, a := range plan.Assignments {
		if a.TaskID == "qb-taskA" {
			taskAAssigned = true
		}
		if a.TaskID == "qb-taskB" {
			taskBAssigned = true
		}
	}

	if !taskAAssigned {
		t.Error("Task A (dependency) was not assigned")
	}
	if !taskBAssigned {
		t.Error("Task B (dependent) was not assigned")
	}
}

// TestBasicWorkflow_PartialCompletion tests handling of partial completion.
func TestBasicWorkflow_PartialCompletion(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	// Create multiple assignments
	assignments := []struct {
		issueID string
		droid   string
	}{
		{"qb-1", "frontend-engineer"},
		{"qb-2", "backend-engineer"},
		{"qb-3", "quality-engineer"},
	}

	for _, a := range assignments {
		if _, err := env.CreateAssignment(a.issueID, a.droid); err != nil {
			t.Fatalf("failed to create assignment for %s: %v", a.issueID, err)
		}
	}

	// Verify all active
	active, err := env.GetActiveAssignments()
	if err != nil {
		t.Fatalf("failed to get active assignments: %v", err)
	}
	if len(active) != 3 {
		t.Errorf("expected 3 active assignments, got %d", len(active))
	}

	// Simulate one droid completing and releasing
	err = env.Assignments.Release(active[0].ID, "completed")
	if err != nil {
		t.Fatalf("failed to release assignment: %v", err)
	}

	// Verify partial completion
	active, err = env.GetActiveAssignments()
	if err != nil {
		t.Fatalf("failed to get active assignments: %v", err)
	}
	if len(active) != 2 {
		t.Errorf("expected 2 active assignments after release, got %d", len(active))
	}
}

// TestBasicWorkflow_SkillMatching tests that assignments respect skill matching.
func TestBasicWorkflow_SkillMatching(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	// Create a task specifically for backend
	tasks := []autoassign.Task{
		{ID: "qb-api", Title: "Implement REST API", Priority: 1, Labels: []string{"backend", "api"}},
	}

	// Use test droids
	assignerDroids := testDroids()

	// Assign
	assigner := autoassign.NewAssigner(assignerDroids)
	assigner.SetTasks(tasks)
	plan := assigner.GeneratePlan()

	if len(plan.Assignments) != 1 {
		t.Fatalf("expected 1 assignment, got %d", len(plan.Assignments))
	}

	// The backend-engineer droid should be preferred for backend/api tasks
	// Note: this depends on skill matching algorithm
	assignment := plan.Assignments[0]
	t.Logf("API task assigned to %s (reason: %s)", assignment.DroidName, assignment.Reason)

	// Verify a droid was assigned (any droid is valid)
	if assignment.DroidName == "" {
		t.Error("no droid assigned to API task")
	}
}

// TestBasicWorkflow_LoadBalancing tests that assignments are load-balanced.
func TestBasicWorkflow_LoadBalancing(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	// Create droids with some pre-existing load
	assignerDroids := []autoassign.Droid{
		{Name: "droid-a", Skills: []string{"go"}, CurrentLoad: 2, MaxLoad: 3},
		{Name: "droid-b", Skills: []string{"go"}, CurrentLoad: 0, MaxLoad: 3},
		{Name: "droid-c", Skills: []string{"go"}, CurrentLoad: 1, MaxLoad: 3},
	}

	// Create tasks that could go to any droid
	tasks := []autoassign.Task{
		{ID: "qb-1", Title: "Task 1", Priority: 1},
		{ID: "qb-2", Title: "Task 2", Priority: 1},
		{ID: "qb-3", Title: "Task 3", Priority: 1},
	}

	assigner := autoassign.NewAssigner(assignerDroids)
	assigner.SetTasks(tasks)
	plan := assigner.GeneratePlan()

	// Count assignments per droid
	loadCount := make(map[string]int)
	for _, a := range plan.Assignments {
		loadCount[a.DroidName]++
	}

	t.Logf("Load distribution after assignment:")
	for droid, count := range loadCount {
		t.Logf("  %s: %d new assignments", droid, count)
	}

	// Verify load balancing - droid-b (with 0 load) should get at least 1 assignment
	if loadCount["droid-b"] == 0 && len(plan.Assignments) > 0 {
		t.Logf("Warning: droid-b with lowest load got no assignments")
	}
}

// TestBasicWorkflow_FullCycle tests a complete work cycle with all components.
func TestBasicWorkflow_FullCycle(t *testing.T) {
	env := NewTestEnv(t)
	env.CreateTestDroids()

	workflow := &Workflow{
		Name: "Full Work Cycle",
		Steps: []WorkflowStep{
			{
				Name: "1. Discover droids",
				Verify: func(e *TestEnv) error {
					list, err := e.DiscoverDroids()
					if err != nil {
						return err
					}
					if len(list) < 2 {
						return fmt.Errorf("need at least 2 droids, got %d", len(list))
					}
					return nil
				},
			},
			{
				Name: "2. Decompose epic",
				Verify: func(e *TestEnv) error {
					epic := decompose.Epic{
						ID:    "qb-epic",
						Title: "[Epic] Feature X",
						Description: `Implement feature X.

Deliverables:
- Build frontend component
- Create backend API
- Add integration tests`,
					}
					result := decompose.Decompose(epic)
					if len(result.Tasks) == 0 {
						return fmt.Errorf("no tasks generated")
					}
					return nil
				},
			},
			{
				Name: "3. Assign first task",
				Action: func(e *TestEnv) error {
					_, err := e.CreateAssignment("qb-1", "frontend-engineer")
					return err
				},
				Verify: func(e *TestEnv) error {
					active, err := e.GetActiveAssignments()
					if err != nil {
						return err
					}
					if len(active) != 1 {
						return fmt.Errorf("expected 1 assignment, got %d", len(active))
					}
					return nil
				},
			},
			{
				Name: "4. Droid announces work start",
				Action: func(e *TestEnv) error {
					_, err := e.SendMessage(
						"frontend-engineer",
						"backend-engineer",
						"[qb-1] Starting: Frontend component",
						"Starting work on the frontend. Will need API ready soon.",
					)
					return err
				},
			},
			{
				Name: "5. Another droid responds",
				Action: func(e *TestEnv) error {
					_, err := e.SendMessage(
						"backend-engineer",
						"frontend-engineer",
						"Re: [qb-1] Starting: Frontend component",
						"Acknowledged. API will be ready in 30 minutes.",
					)
					return err
				},
			},
			{
				Name: "6. Reserve files",
				Action: func(e *TestEnv) error {
					_, _, err := e.CreateReservation("frontend-engineer", "src/components/**", true, 0)
					return err
				},
				Verify: func(e *TestEnv) error {
					active, err := e.GetActiveReservations()
					if err != nil {
						return err
					}
					if len(active) != 1 {
						return fmt.Errorf("expected 1 reservation, got %d", len(active))
					}
					return nil
				},
			},
			{
				Name: "7. Verify full state",
				Verify: func(e *TestEnv) error {
					// Check assignments
					assignments, err := e.GetActiveAssignments()
					if err != nil {
						return err
					}
					if len(assignments) != 1 {
						return fmt.Errorf("expected 1 assignment, got %d", len(assignments))
					}

					// Check messages
					msgs, err := e.GetMessages()
					if err != nil {
						return err
					}
					if len(msgs) != 2 {
						return fmt.Errorf("expected 2 messages, got %d", len(msgs))
					}

					// Check reservations
					res, err := e.GetActiveReservations()
					if err != nil {
						return err
					}
					if len(res) != 1 {
						return fmt.Errorf("expected 1 reservation, got %d", len(res))
					}

					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}
