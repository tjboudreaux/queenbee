// Package reservations provides file reservation management.
package reservations

import "time"

// Reservation represents an advisory file lock.
type Reservation struct {
	ID         string     `json:"id"`
	CreatedAt  time.Time  `json:"created_at"`
	ExpiresAt  time.Time  `json:"expires_at"`
	ReleasedAt *time.Time `json:"released_at,omitempty"`
	Pattern    string     `json:"pattern"`
	Agent      string     `json:"agent"`
	Droid      string     `json:"droid,omitempty"` // Deprecated: use Agent
	IssueID    string     `json:"issue_id,omitempty"`
	Status     string     `json:"status"`
	Exclusive  bool       `json:"exclusive"`
	Reason     string     `json:"reason,omitempty"`
}

// Reservation statuses
const (
	StatusActive   = "active"
	StatusExpired  = "expired"
	StatusReleased = "released"
)

// Conflict represents a reservation conflict.
type Conflict struct {
	Pattern   string    `json:"pattern"`
	Agent     string    `json:"agent"`
	Droid     string    `json:"droid,omitempty"` // Deprecated: use Agent
	IssueID   string    `json:"issue_id,omitempty"`
	ExpiresAt time.Time `json:"expires_at"`
}
