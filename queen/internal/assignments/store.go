package assignments

import (
	"fmt"
	"path/filepath"
	"time"

	"github.com/tjboudreaux/queenbee/queen/internal/store"
)

// Store manages assignment persistence.
type Store struct {
	jsonl *store.JSONLStore[Assignment]
}

// NewStore creates a new assignment store.
func NewStore(beadsDir string) *Store {
	path := filepath.Join(beadsDir, "queen_assignments.jsonl")
	return &Store{jsonl: store.NewJSONLStore[Assignment](path)}
}

// Assign creates a new assignment for an issue.
func (s *Store) Assign(issueID, agent, assignedBy string, opts AssignOptions) (*Assignment, error) {
	// Check for existing active assignment
	existing, err := s.GetActiveForIssue(issueID)
	if err != nil && !isNotFoundError(err) {
		return nil, err
	}

	now := time.Now().UTC()

	// If there's an existing assignment, mark it as reassigned
	if existing != nil {
		existingAgent := existing.Agent
		if existingAgent == "" {
			existingAgent = existing.Droid // Backward compat
		}
		if existingAgent == agent {
			return existing, nil // Already assigned to this agent
		}

		existing.Status = StatusReassigned
		existing.UpdatedAt = now
		if err := s.jsonl.Append(*existing); err != nil {
			return nil, err
		}
	}

	assignment := Assignment{
		ID:         store.NewAssignmentID(),
		CreatedAt:  now,
		UpdatedAt:  now,
		IssueID:    issueID,
		Agent:      agent,
		AssignedBy: assignedBy,
		Status:     StatusActive,
		Worktree:   opts.Worktree,
		Reason:     opts.Reason,
	}

	if existing != nil {
		existingAgent := existing.Agent
		if existingAgent == "" {
			existingAgent = existing.Droid // Backward compat
		}
		assignment.PreviousAgent = existingAgent
	}

	if err := s.jsonl.Append(assignment); err != nil {
		return nil, err
	}

	return &assignment, nil
}

// AssignOptions configures a new assignment.
type AssignOptions struct {
	Worktree string
	Reason   string
}

// Claim is like Assign but the agent assigns themselves.
func (s *Store) Claim(issueID, agent string, opts AssignOptions) (*Assignment, error) {
	return s.Assign(issueID, agent, agent, opts)
}

// Release releases an assignment.
func (s *Store) Release(id string, reason string) error {
	assignment, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if assignment.Status != StatusActive {
		return nil // Already released
	}

	now := time.Now().UTC()
	assignment.Status = StatusReleased
	assignment.UpdatedAt = now
	if reason != "" {
		assignment.Reason = reason
	}

	return s.jsonl.Append(*assignment)
}

// Complete marks an assignment as completed.
func (s *Store) Complete(id string, reason string) error {
	assignment, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if assignment.Status != StatusActive {
		return fmt.Errorf("assignment %s is not active (status: %s)", id, assignment.Status)
	}

	now := time.Now().UTC()
	assignment.Status = StatusCompleted
	assignment.UpdatedAt = now
	if reason != "" {
		assignment.Reason = reason
	}

	return s.jsonl.Append(*assignment)
}

// GetByID retrieves an assignment by ID.
func (s *Store) GetByID(id string) (*Assignment, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Find latest version (last entry wins)
	var assignment *Assignment
	for i := range all {
		if all[i].ID == id {
			a := all[i]
			assignment = &a
		}
	}

	if assignment == nil {
		return nil, &NotFoundError{ID: id}
	}

	return assignment, nil
}

// GetActiveForIssue returns the active assignment for an issue.
func (s *Store) GetActiveForIssue(issueID string) (*Assignment, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID (last entry wins)
	byID := make(map[string]*Assignment)
	for i := range all {
		a := all[i]
		byID[a.ID] = &a
	}

	// Find active assignment for this issue
	for _, a := range byID {
		if a.IssueID == issueID && a.Status == StatusActive {
			return a, nil
		}
	}

	return nil, &NotFoundError{IssueID: issueID}
}

// GetActiveForAgent returns all active assignments for an agent.
func (s *Store) GetActiveForAgent(agent string) ([]Assignment, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID
	byID := make(map[string]*Assignment)
	for i := range all {
		a := all[i]
		byID[a.ID] = &a
	}

	var result []Assignment
	for _, a := range byID {
		assignee := a.Agent
		if assignee == "" {
			assignee = a.Droid // Backward compat
		}
		if assignee == agent && a.Status == StatusActive {
			result = append(result, *a)
		}
	}

	return result, nil
}

// GetActiveForDroid is deprecated, use GetActiveForAgent instead.
func (s *Store) GetActiveForDroid(agent string) ([]Assignment, error) {
	return s.GetActiveForAgent(agent)
}

// GetAll returns all assignments, optionally filtered by status.
func (s *Store) GetAll(statusFilter string) ([]Assignment, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID
	byID := make(map[string]*Assignment)
	for i := range all {
		a := all[i]
		byID[a.ID] = &a
	}

	var result []Assignment
	for _, a := range byID {
		if statusFilter == "" || a.Status == statusFilter {
			result = append(result, *a)
		}
	}

	return result, nil
}

// ReleaseAllForAgent releases all active assignments for an agent.
func (s *Store) ReleaseAllForAgent(agent, reason string) (int, error) {
	active, err := s.GetActiveForAgent(agent)
	if err != nil {
		return 0, err
	}

	now := time.Now().UTC()
	count := 0
	for _, a := range active {
		a.Status = StatusReleased
		a.UpdatedAt = now
		if reason != "" {
			a.Reason = reason
		}
		if err := s.jsonl.Append(a); err != nil {
			return count, err
		}
		count++
	}

	return count, nil
}

// ReleaseAllForDroid is deprecated, use ReleaseAllForAgent instead.
func (s *Store) ReleaseAllForDroid(agent, reason string) (int, error) {
	return s.ReleaseAllForAgent(agent, reason)
}

// NotFoundError indicates an assignment was not found.
type NotFoundError struct {
	ID      string
	IssueID string
}

func (e *NotFoundError) Error() string {
	if e.ID != "" {
		return "assignment not found: " + e.ID
	}
	return "no active assignment for issue: " + e.IssueID
}

func isNotFoundError(err error) bool {
	_, ok := err.(*NotFoundError)
	return ok
}
