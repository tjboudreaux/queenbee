// Package assignments provides assignment tracking and operations.
package assignments

import "time"

// Assignment represents a task assignment to a droid.
type Assignment struct {
	ID            string    `json:"id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
	IssueID       string    `json:"issue_id"`
	Droid         string    `json:"droid"`
	AssignedBy    string    `json:"assigned_by"`
	Status        string    `json:"status"`
	Worktree      string    `json:"worktree,omitempty"`
	Reason        string    `json:"reason,omitempty"`
	PreviousDroid string    `json:"previous_droid,omitempty"`
}

// Assignment statuses
const (
	StatusActive     = "active"
	StatusCompleted  = "completed"
	StatusReleased   = "released"
	StatusReassigned = "reassigned"
)
