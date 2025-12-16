package messages

import (
	"path/filepath"
	"strings"
	"time"

	"github.com/tjboudreaux/queenbee/queen/internal/store"
)

// Store manages message persistence.
type Store struct {
	jsonl *store.JSONLStore[Message]
}

// NewStore creates a new message store.
func NewStore(beadsDir string) (*Store, error) {
	path := filepath.Join(beadsDir, "queen_messages.jsonl")
	jsonl := store.NewJSONLStore[Message](path)
	return &Store{jsonl: jsonl}, nil
}

// Send creates and stores a new message.
func (s *Store) Send(from, to, subject, body string, opts SendOptions) (*Message, error) {
	now := time.Now().UTC()

	threadID := opts.ThreadID
	if threadID == "" && opts.IssueID != "" {
		threadID = "issue:" + opts.IssueID
	}

	importance := opts.Importance
	if importance == "" {
		importance = ImportanceNormal
	}

	msg := Message{
		ID:         store.NewMessageID(),
		CreatedAt:  now,
		From:       from,
		To:         to,
		Subject:    subject,
		Body:       body,
		IssueID:    opts.IssueID,
		ReplyTo:    opts.ReplyTo,
		ThreadID:   threadID,
		Importance: importance,
		Read:       false,
	}

	if err := s.jsonl.Append(msg); err != nil {
		return nil, err
	}

	return &msg, nil
}

// SendOptions configures a new message.
type SendOptions struct {
	IssueID    string
	ReplyTo    string
	ThreadID   string
	Importance string
}

// Reply creates a reply to an existing message.
func (s *Store) Reply(originalID, from, body string) (*Message, error) {
	original, err := s.GetByID(originalID)
	if err != nil {
		return nil, err
	}

	threadID := original.ThreadID
	if threadID == "" {
		threadID = original.ID
	}

	subject := original.Subject
	if !strings.HasPrefix(strings.ToLower(subject), "re:") {
		subject = "Re: " + subject
	}

	return s.Send(from, original.From, subject, body, SendOptions{
		IssueID:    original.IssueID,
		ReplyTo:    original.ID,
		ThreadID:   threadID,
		Importance: original.Importance,
	})
}

// GetByID retrieves a message by ID.
func (s *Store) GetByID(id string) (*Message, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Find the latest version of the message (last entry wins)
	var msg *Message
	for i := range all {
		if all[i].ID == id {
			m := all[i]
			msg = &m
		}
	}

	if msg == nil || msg.Deleted {
		return nil, &NotFoundError{ID: id}
	}

	return msg, nil
}

// MarkRead marks a message as read.
func (s *Store) MarkRead(id string) error {
	msg, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if msg.Read {
		return nil // Already read
	}

	now := time.Now().UTC()
	msg.Read = true
	msg.ReadAt = &now

	return s.jsonl.Append(*msg)
}

// GetInbox returns messages for a recipient.
func (s *Store) GetInbox(to string, opts InboxOptions) ([]Message, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID (last wins)
	byID := make(map[string]*Message)
	for i := range all {
		msg := all[i]
		if msg.Deleted {
			delete(byID, msg.ID)
			continue
		}
		byID[msg.ID] = &msg
	}

	var result []Message
	for _, msg := range byID {
		if msg.To != to {
			continue
		}
		if opts.UnreadOnly && msg.Read {
			continue
		}
		if !opts.Since.IsZero() && msg.CreatedAt.Before(opts.Since) {
			continue
		}
		result = append(result, *msg)
	}

	// Sort by CreatedAt descending (newest first)
	sortMessagesByDate(result, true)

	if opts.Limit > 0 && len(result) > opts.Limit {
		result = result[:opts.Limit]
	}

	return result, nil
}

// InboxOptions configures inbox queries.
type InboxOptions struct {
	UnreadOnly bool
	Since      time.Time
	Limit      int
}

// GetThread returns all messages in a thread.
func (s *Store) GetThread(threadID string) ([]Message, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID
	byID := make(map[string]*Message)
	for i := range all {
		msg := all[i]
		if msg.Deleted {
			delete(byID, msg.ID)
			continue
		}
		byID[msg.ID] = &msg
	}

	var result []Message
	for _, msg := range byID {
		if msg.ThreadID == threadID || msg.ID == threadID {
			result = append(result, *msg)
		}
	}

	// Sort by CreatedAt ascending (oldest first for thread view)
	sortMessagesByDate(result, false)

	return result, nil
}

// GetSent returns messages sent by a sender.
func (s *Store) GetSent(from string, limit int) ([]Message, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID
	byID := make(map[string]*Message)
	for i := range all {
		msg := all[i]
		if msg.Deleted {
			delete(byID, msg.ID)
			continue
		}
		byID[msg.ID] = &msg
	}

	var result []Message
	for _, msg := range byID {
		if msg.From == from {
			result = append(result, *msg)
		}
	}

	sortMessagesByDate(result, true)

	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}

	return result, nil
}

// Delete soft-deletes a message.
func (s *Store) Delete(id string) error {
	msg, err := s.GetByID(id)
	if err != nil {
		return err
	}

	msg.Deleted = true
	return s.jsonl.Append(*msg)
}

// NotFoundError indicates a message was not found.
type NotFoundError struct {
	ID string
}

func (e *NotFoundError) Error() string {
	return "message not found: " + e.ID
}

// sortMessagesByDate sorts messages by CreatedAt.
func sortMessagesByDate(msgs []Message, descending bool) {
	for i := 0; i < len(msgs)-1; i++ {
		for j := i + 1; j < len(msgs); j++ {
			shouldSwap := msgs[j].CreatedAt.After(msgs[i].CreatedAt)
			if !descending {
				shouldSwap = msgs[j].CreatedAt.Before(msgs[i].CreatedAt)
			}
			if shouldSwap {
				msgs[i], msgs[j] = msgs[j], msgs[i]
			}
		}
	}
}

// Stats holds global message statistics.
type Stats struct {
	Total       int            `json:"total"`
	Unread      int            `json:"unread"`
	ByAgent     map[string]int `json:"by_agent"`      // inbox count per agent
	BySender    map[string]int `json:"by_sender"`     // sent count per agent
	ByImportance map[string]int `json:"by_importance"`
	Since       time.Time      `json:"since,omitempty"`
	SinceTotal  int            `json:"since_total,omitempty"`
	SinceUnread int            `json:"since_unread,omitempty"`
}

// GetStats returns global message statistics.
func (s *Store) GetStats(since time.Time) (*Stats, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID (last wins)
	byID := make(map[string]*Message)
	for i := range all {
		msg := all[i]
		if msg.Deleted {
			delete(byID, msg.ID)
			continue
		}
		byID[msg.ID] = &msg
	}

	stats := &Stats{
		ByAgent:      make(map[string]int),
		BySender:     make(map[string]int),
		ByImportance: make(map[string]int),
		Since:        since,
	}

	for _, msg := range byID {
		stats.Total++
		if !msg.Read {
			stats.Unread++
		}
		stats.ByAgent[msg.To]++
		stats.BySender[msg.From]++
		stats.ByImportance[msg.Importance]++

		if !since.IsZero() && msg.CreatedAt.After(since) {
			stats.SinceTotal++
			if !msg.Read {
				stats.SinceUnread++
			}
		}
	}

	return stats, nil
}

// GetAllMessages returns all non-deleted messages, optionally filtered by since time.
func (s *Store) GetAllMessages(since time.Time, limit int) ([]Message, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Merge by ID (last wins)
	byID := make(map[string]*Message)
	for i := range all {
		msg := all[i]
		if msg.Deleted {
			delete(byID, msg.ID)
			continue
		}
		byID[msg.ID] = &msg
	}

	var result []Message
	for _, msg := range byID {
		if !since.IsZero() && msg.CreatedAt.Before(since) {
			continue
		}
		result = append(result, *msg)
	}

	sortMessagesByDate(result, true)

	if limit > 0 && len(result) > limit {
		result = result[:limit]
	}

	return result, nil
}

// GetAgentInboxCount returns the count of messages in an agent's inbox.
func (s *Store) GetAgentInboxCount(agent string, unreadOnly bool) (int, error) {
	msgs, err := s.GetInbox(agent, InboxOptions{UnreadOnly: unreadOnly})
	if err != nil {
		return 0, err
	}
	return len(msgs), nil
}
