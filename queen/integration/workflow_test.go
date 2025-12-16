package integration

import (
	"fmt"
	"testing"
	"time"
)

// WorkflowStep represents a single step in a workflow.
type WorkflowStep struct {
	Name   string
	Action func(*TestEnv) error
	Verify func(*TestEnv) error
}

// Workflow represents a multi-step integration test workflow.
type Workflow struct {
	Name  string
	Steps []WorkflowStep
}

// Run executes the workflow in the given test environment.
func (w *Workflow) Run(t *testing.T, env *TestEnv) {
	t.Helper()

	for i, step := range w.Steps {
		t.Logf("Step %d: %s", i+1, step.Name)

		// Execute action
		if step.Action != nil {
			if err := step.Action(env); err != nil {
				t.Fatalf("Step %d (%s) action failed: %v", i+1, step.Name, err)
			}
		}

		// Verify result
		if step.Verify != nil {
			if err := step.Verify(env); err != nil {
				t.Fatalf("Step %d (%s) verification failed: %v", i+1, step.Name, err)
			}
		}
	}
}

// TestWorkflow_BasicDroidDiscovery tests basic droid discovery workflow.
func TestWorkflow_BasicDroidDiscovery(t *testing.T) {
	env := NewTestEnv(t)

	workflow := &Workflow{
		Name: "Basic Droid Discovery",
		Steps: []WorkflowStep{
			{
				Name: "Create test droids",
				Action: func(e *TestEnv) error {
					e.CreateTestDroids()
					return nil
				},
			},
			{
				Name: "Discover droids",
				Verify: func(e *TestEnv) error {
					list, err := e.DiscoverDroids()
					if err != nil {
						return err
					}
					if len(list) != 3 {
						return fmt.Errorf("expected 3 droids, got %d", len(list))
					}
					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}

// TestWorkflow_MessageExchange tests message exchange between droids.
func TestWorkflow_MessageExchange(t *testing.T) {
	env := NewTestEnv(t)

	workflow := &Workflow{
		Name: "Message Exchange",
		Steps: []WorkflowStep{
			{
				Name: "Send message from droid A to droid B",
				Action: func(e *TestEnv) error {
					_, err := e.SendMessage(
						"frontend-engineer",
						"backend-engineer",
						"[qb-123] Request: Need API endpoint",
						"Please create the /api/users endpoint",
					)
					return err
				},
			},
			{
				Name: "Verify message received",
				Verify: func(e *TestEnv) error {
					msgs, err := e.GetMessagesFor("backend-engineer")
					if err != nil {
						return err
					}
					if len(msgs) != 1 {
						return fmt.Errorf("expected 1 message, got %d", len(msgs))
					}
					if msgs[0].Subject != "[qb-123] Request: Need API endpoint" {
						return fmt.Errorf("unexpected subject: %s", msgs[0].Subject)
					}
					return nil
				},
			},
			{
				Name: "Send reply",
				Action: func(e *TestEnv) error {
					_, err := e.SendMessage(
						"backend-engineer",
						"frontend-engineer",
						"Re: [qb-123] Request: Need API endpoint",
						"Done. Endpoint is ready at /api/users",
					)
					return err
				},
			},
			{
				Name: "Verify reply received",
				Verify: func(e *TestEnv) error {
					msgs, err := e.GetMessagesFor("frontend-engineer")
					if err != nil {
						return err
					}
					if len(msgs) != 1 {
						return fmt.Errorf("expected 1 reply, got %d", len(msgs))
					}
					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}

// TestWorkflow_AssignmentLifecycle tests the full assignment lifecycle.
func TestWorkflow_AssignmentLifecycle(t *testing.T) {
	env := NewTestEnv(t)

	workflow := &Workflow{
		Name: "Assignment Lifecycle",
		Steps: []WorkflowStep{
			{
				Name: "Create test droids",
				Action: func(e *TestEnv) error {
					e.CreateTestDroids()
					return nil
				},
			},
			{
				Name: "Assign issue to droid",
				Action: func(e *TestEnv) error {
					_, err := e.CreateAssignment("qb-42", "frontend-engineer")
					return err
				},
			},
			{
				Name: "Verify assignment created",
				Verify: func(e *TestEnv) error {
					active, err := e.GetActiveAssignments()
					if err != nil {
						return err
					}
					if len(active) != 1 {
						return fmt.Errorf("expected 1 active assignment, got %d", len(active))
					}
					if active[0].Agent != "frontend-engineer" {
						return fmt.Errorf("expected frontend-engineer, got %s", active[0].Agent)
					}
					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}

// TestWorkflow_ReservationConflict tests file reservation conflict detection.
func TestWorkflow_ReservationConflict(t *testing.T) {
	env := NewTestEnv(t)

	workflow := &Workflow{
		Name: "Reservation Conflict",
		Steps: []WorkflowStep{
			{
				Name: "Droid A reserves files",
				Action: func(e *TestEnv) error {
					_, _, err := e.CreateReservation(
						"frontend-engineer",
						"src/components/**",
						true,
						2*time.Hour,
					)
					return err
				},
			},
			{
				Name: "Verify reservation created",
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
				Name: "Droid B attempts overlapping reservation",
				Action: func(e *TestEnv) error {
					_, conflicts, err := e.CreateReservation(
						"backend-engineer",
						"src/components/Button.tsx",
						true,
						2*time.Hour,
					)
					if err != nil {
						return err
					}
					if len(conflicts) == 0 {
						return fmt.Errorf("expected conflict to be detected")
					}
					return nil
				},
			},
			{
				Name: "Verify conflict detected",
				Verify: func(e *TestEnv) error {
					// Only the first reservation should exist since conflict was detected
					active, err := e.GetActiveReservations()
					if err != nil {
						return err
					}
					if len(active) != 1 {
						return fmt.Errorf("expected 1 reservation (conflict blocked second), got %d", len(active))
					}
					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}

// TestWorkflow_MultiDroidCoordination tests coordination between multiple droids.
func TestWorkflow_MultiDroidCoordination(t *testing.T) {
	env := NewTestEnv(t)

	workflow := &Workflow{
		Name: "Multi-Droid Coordination",
		Steps: []WorkflowStep{
			{
				Name: "Setup droids",
				Action: func(e *TestEnv) error {
					e.CreateTestDroids()
					return nil
				},
			},
			{
				Name: "Assign tasks to multiple droids",
				Action: func(e *TestEnv) error {
					if _, err := e.CreateAssignment("qb-1", "frontend-engineer"); err != nil {
						return err
					}
					if _, err := e.CreateAssignment("qb-2", "backend-engineer"); err != nil {
						return err
					}
					if _, err := e.CreateAssignment("qb-3", "quality-engineer"); err != nil {
						return err
					}
					return nil
				},
			},
			{
				Name: "Droids reserve their respective files",
				Action: func(e *TestEnv) error {
					if _, _, err := e.CreateReservation("frontend-engineer", "src/ui/**", true, 2*time.Hour); err != nil {
						return err
					}
					if _, _, err := e.CreateReservation("backend-engineer", "src/api/**", true, 2*time.Hour); err != nil {
						return err
					}
					if _, _, err := e.CreateReservation("quality-engineer", "tests/**", true, 2*time.Hour); err != nil {
						return err
					}
					return nil
				},
			},
			{
				Name: "Verify no conflicts in non-overlapping reservations",
				Verify: func(e *TestEnv) error {
					active, err := e.GetActiveReservations()
					if err != nil {
						return err
					}
					if len(active) != 3 {
						return fmt.Errorf("expected 3 reservations, got %d", len(active))
					}
					return nil
				},
			},
			{
				Name: "Droids communicate about coordination",
				Action: func(e *TestEnv) error {
					// Frontend asks backend for API
					if _, err := e.SendMessage(
						"frontend-engineer",
						"backend-engineer",
						"[qb-1] Need API endpoint",
						"Please prioritize the /users endpoint",
					); err != nil {
						return err
					}
					// Backend acknowledges
					if _, err := e.SendMessage(
						"backend-engineer",
						"frontend-engineer",
						"Re: [qb-1] Need API endpoint",
						"Will do, ETA 30 minutes",
					); err != nil {
						return err
					}
					return nil
				},
			},
			{
				Name: "Verify message exchange",
				Verify: func(e *TestEnv) error {
					all, err := e.GetMessages()
					if err != nil {
						return err
					}
					if len(all) != 2 {
						return fmt.Errorf("expected 2 messages, got %d", len(all))
					}
					return nil
				},
			},
		},
	}

	workflow.Run(t, env)
}
