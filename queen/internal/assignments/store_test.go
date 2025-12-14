package assignments

import (
	"os"
	"path/filepath"
	"testing"
)

func setupTestStore(t *testing.T) *Store {
	t.Helper()
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}
	return NewStore(beadsDir)
}

func TestStore_Assign(t *testing.T) {
	store := setupTestStore(t)

	assignment, err := store.Assign("qb-001", "alice", "bob", AssignOptions{
		Reason: "needs work",
	})
	if err != nil {
		t.Fatalf("Assign failed: %v", err)
	}

	if assignment.ID == "" {
		t.Error("Expected assignment to have ID")
	}
	if assignment.IssueID != "qb-001" {
		t.Errorf("IssueID = %q, want %q", assignment.IssueID, "qb-001")
	}
	if assignment.Droid != "alice" {
		t.Errorf("Droid = %q, want %q", assignment.Droid, "alice")
	}
	if assignment.AssignedBy != "bob" {
		t.Errorf("AssignedBy = %q, want %q", assignment.AssignedBy, "bob")
	}
	if assignment.Status != StatusActive {
		t.Errorf("Status = %q, want %q", assignment.Status, StatusActive)
	}
}

func TestStore_Assign_WithWorktree(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "bob", AssignOptions{
		Worktree: "/path/to/worktree",
	})

	if assignment.Worktree != "/path/to/worktree" {
		t.Errorf("Worktree = %q, want %q", assignment.Worktree, "/path/to/worktree")
	}
}

func TestStore_Assign_Reassign(t *testing.T) {
	store := setupTestStore(t)

	// First assignment
	first, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	// Reassign to bob
	second, err := store.Assign("qb-001", "bob", "queen", AssignOptions{})
	if err != nil {
		t.Fatalf("Reassign failed: %v", err)
	}

	// Check new assignment
	if second.Droid != "bob" {
		t.Errorf("New droid = %q, want %q", second.Droid, "bob")
	}
	if second.PreviousDroid != "alice" {
		t.Errorf("PreviousDroid = %q, want %q", second.PreviousDroid, "alice")
	}

	// Check original was marked reassigned
	original, _ := store.GetByID(first.ID)
	if original.Status != StatusReassigned {
		t.Errorf("Original status = %q, want %q", original.Status, StatusReassigned)
	}
}

func TestStore_Assign_SameDroid(t *testing.T) {
	store := setupTestStore(t)

	first, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})
	second, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	// Should return the existing assignment
	if first.ID != second.ID {
		t.Errorf("Assigning same droid should return existing assignment")
	}
}

func TestStore_Claim(t *testing.T) {
	store := setupTestStore(t)

	assignment, err := store.Claim("qb-001", "alice", AssignOptions{})
	if err != nil {
		t.Fatalf("Claim failed: %v", err)
	}

	if assignment.Droid != "alice" {
		t.Errorf("Droid = %q, want %q", assignment.Droid, "alice")
	}
	if assignment.AssignedBy != "alice" {
		t.Errorf("AssignedBy = %q, want %q (self-assigned)", assignment.AssignedBy, "alice")
	}
}

func TestStore_Release(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	if err := store.Release(assignment.ID, "done for now"); err != nil {
		t.Fatalf("Release failed: %v", err)
	}

	released, _ := store.GetByID(assignment.ID)
	if released.Status != StatusReleased {
		t.Errorf("Status = %q, want %q", released.Status, StatusReleased)
	}
	if released.Reason != "done for now" {
		t.Errorf("Reason = %q, want %q", released.Reason, "done for now")
	}
}

func TestStore_Release_Idempotent(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	// Release twice
	store.Release(assignment.ID, "first")
	err := store.Release(assignment.ID, "second")

	if err != nil {
		t.Errorf("Second release should not error: %v", err)
	}
}

func TestStore_Complete(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	if err := store.Complete(assignment.ID, "implemented"); err != nil {
		t.Fatalf("Complete failed: %v", err)
	}

	completed, _ := store.GetByID(assignment.ID)
	if completed.Status != StatusCompleted {
		t.Errorf("Status = %q, want %q", completed.Status, StatusCompleted)
	}
}

func TestStore_Complete_NotActive(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Release(assignment.ID, "")

	err := store.Complete(assignment.ID, "")
	if err == nil {
		t.Error("Complete should fail for non-active assignment")
	}
}

func TestStore_GetByID(t *testing.T) {
	store := setupTestStore(t)

	created, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})

	found, err := store.GetByID(created.ID)
	if err != nil {
		t.Fatalf("GetByID failed: %v", err)
	}

	if found.ID != created.ID {
		t.Errorf("ID = %q, want %q", found.ID, created.ID)
	}
}

func TestStore_GetByID_NotFound(t *testing.T) {
	store := setupTestStore(t)

	_, err := store.GetByID("nonexistent")
	if err == nil {
		t.Error("Expected error for nonexistent ID")
	}

	_, ok := err.(*NotFoundError)
	if !ok {
		t.Errorf("Expected NotFoundError, got %T", err)
	}
}

func TestStore_GetActiveForIssue(t *testing.T) {
	store := setupTestStore(t)

	store.Assign("qb-001", "alice", "queen", AssignOptions{})

	found, err := store.GetActiveForIssue("qb-001")
	if err != nil {
		t.Fatalf("GetActiveForIssue failed: %v", err)
	}

	if found.Droid != "alice" {
		t.Errorf("Droid = %q, want %q", found.Droid, "alice")
	}
}

func TestStore_GetActiveForIssue_NotFound(t *testing.T) {
	store := setupTestStore(t)

	_, err := store.GetActiveForIssue("qb-999")
	if err == nil {
		t.Error("Expected error when no active assignment")
	}
}

func TestStore_GetActiveForIssue_ExcludesReleased(t *testing.T) {
	store := setupTestStore(t)

	assignment, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Release(assignment.ID, "")

	_, err := store.GetActiveForIssue("qb-001")
	if err == nil {
		t.Error("Should not find released assignment")
	}
}

func TestStore_GetActiveForDroid(t *testing.T) {
	store := setupTestStore(t)

	store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Assign("qb-002", "alice", "queen", AssignOptions{})
	store.Assign("qb-003", "bob", "queen", AssignOptions{})

	alice, err := store.GetActiveForDroid("alice")
	if err != nil {
		t.Fatalf("GetActiveForDroid failed: %v", err)
	}

	if len(alice) != 2 {
		t.Errorf("Expected 2 assignments for alice, got %d", len(alice))
	}
}

func TestStore_GetActiveForDroid_ExcludesReleased(t *testing.T) {
	store := setupTestStore(t)

	a1, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Assign("qb-002", "alice", "queen", AssignOptions{})
	store.Release(a1.ID, "")

	alice, _ := store.GetActiveForDroid("alice")
	if len(alice) != 1 {
		t.Errorf("Expected 1 active assignment, got %d", len(alice))
	}
}

func TestStore_GetAll(t *testing.T) {
	store := setupTestStore(t)

	a1, _ := store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Assign("qb-002", "bob", "queen", AssignOptions{})
	store.Release(a1.ID, "")

	// All
	all, _ := store.GetAll("")
	if len(all) != 2 {
		t.Errorf("Expected 2 total assignments, got %d", len(all))
	}

	// Filter by active
	active, _ := store.GetAll(StatusActive)
	if len(active) != 1 {
		t.Errorf("Expected 1 active assignment, got %d", len(active))
	}

	// Filter by released
	released, _ := store.GetAll(StatusReleased)
	if len(released) != 1 {
		t.Errorf("Expected 1 released assignment, got %d", len(released))
	}
}

func TestStore_ReleaseAllForDroid(t *testing.T) {
	store := setupTestStore(t)

	store.Assign("qb-001", "alice", "queen", AssignOptions{})
	store.Assign("qb-002", "alice", "queen", AssignOptions{})
	store.Assign("qb-003", "bob", "queen", AssignOptions{})

	count, err := store.ReleaseAllForDroid("alice", "session ended")
	if err != nil {
		t.Fatalf("ReleaseAllForDroid failed: %v", err)
	}

	if count != 2 {
		t.Errorf("Released = %d, want 2", count)
	}

	// Verify alice has no active assignments
	alice, _ := store.GetActiveForDroid("alice")
	if len(alice) != 0 {
		t.Errorf("Alice should have 0 active, got %d", len(alice))
	}

	// Verify bob still has assignment
	bob, _ := store.GetActiveForDroid("bob")
	if len(bob) != 1 {
		t.Errorf("Bob should still have 1 active, got %d", len(bob))
	}
}

func TestNotFoundError(t *testing.T) {
	errWithID := &NotFoundError{ID: "qa-123"}
	if errWithID.Error() != "assignment not found: qa-123" {
		t.Errorf("Error() = %q", errWithID.Error())
	}

	errWithIssue := &NotFoundError{IssueID: "qb-001"}
	if errWithIssue.Error() != "no active assignment for issue: qb-001" {
		t.Errorf("Error() = %q", errWithIssue.Error())
	}
}
