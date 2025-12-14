// Package messages provides message storage and operations.
package messages

import "time"

// Message represents an inter-agent message.
type Message struct {
	ID         string     `json:"id"`
	CreatedAt  time.Time  `json:"created_at"`
	From       string     `json:"from"`
	To         string     `json:"to"`
	Subject    string     `json:"subject"`
	Body       string     `json:"body"`
	IssueID    string     `json:"issue_id,omitempty"`
	ReplyTo    string     `json:"reply_to,omitempty"`
	ThreadID   string     `json:"thread_id,omitempty"`
	Importance string     `json:"importance"`
	Read       bool       `json:"read"`
	ReadAt     *time.Time `json:"read_at,omitempty"`
	Deleted    bool       `json:"deleted,omitempty"`
}

// Importance levels
const (
	ImportanceLow    = "low"
	ImportanceNormal = "normal"
	ImportanceHigh   = "high"
	ImportanceUrgent = "urgent"
)
