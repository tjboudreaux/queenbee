// Package assignments provides assignment tracking and operations.
package assignments

import "time"

// Assignment represents a task assignment to an agent.
type Assignment struct {
	ID            string    `json:"id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	IssueID       string    `json:"issue_id"`
	Agent         string    `json:"agent"`
	Droid         string    `json:"droid,omitempty"` // Deprecated: use Agent
	AssignedBy    string    `json:"assigned_by"`
	Status        string    `json:"status"`
	Worktree      string    `json:"worktree,omitempty"`
	Reason        string    `json:"reason,omitempty"`
	PreviousAgent string    `json:"previous_agent,omitempty"`
	PreviousDroid string    `json:"previous_droid,omitempty"` // Deprecated: use PreviousAgent
}

// Assignment statuses
const (
	StatusActive     = "active"
	StatusCompleted  = "completed"
	StatusReleased   = "released"
	StatusReassigned = "reassigned"
)
