package registry

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
	"time"
)

// QueuedWork represents work waiting to be executed.
type QueuedWork struct {
	ID        string    `json:"id"`
	Agent     string    `json:"agent"`
	Command   string    `json:"command"`
	IssueID   string    `json:"issue_id"`
	IssueType string    `json:"issue_type"`
	Priority  int       `json:"priority"`
	QueuedAt  time.Time `json:"queued_at"`
	Reason    string    `json:"reason"` // Why it was queued (e.g., "max_agents reached")
}

// WorkQueue manages queued work items.
type WorkQueue struct {
	items     []QueuedWork
	mu        sync.RWMutex
	stateFile string
}

// NewWorkQueue creates a new work queue.
func NewWorkQueue(beadsDir string) *WorkQueue {
	q := &WorkQueue{
		items:     make([]QueuedWork, 0),
		stateFile: filepath.Join(beadsDir, "queen_queue.json"),
	}
	q.loadState()
	return q
}

// Enqueue adds work to the queue.
func (q *WorkQueue) Enqueue(work QueuedWork) {
	q.mu.Lock()
	defer q.mu.Unlock()

	// Check for duplicates
	for _, item := range q.items {
		if item.Agent == work.Agent && item.Command == work.Command && item.IssueID == work.IssueID {
			return // Already queued
		}
	}

	if work.QueuedAt.IsZero() {
		work.QueuedAt = time.Now()
	}
	if work.ID == "" {
		work.ID = CommandHash(work.Agent, work.Command, work.IssueID)
	}

	q.items = append(q.items, work)
	q.sortByPriority()
	_ = q.saveState() //nolint:errcheck // Best-effort persistence
}

// Dequeue removes and returns the highest priority work item.
func (q *WorkQueue) Dequeue() (QueuedWork, bool) {
	q.mu.Lock()
	defer q.mu.Unlock()

	if len(q.items) == 0 {
		return QueuedWork{}, false
	}

	work := q.items[0]
	q.items = q.items[1:]
	_ = q.saveState() //nolint:errcheck // Best-effort persistence

	return work, true
}

// Peek returns the highest priority work item without removing it.
func (q *WorkQueue) Peek() (QueuedWork, bool) {
	q.mu.RLock()
	defer q.mu.RUnlock()

	if len(q.items) == 0 {
		return QueuedWork{}, false
	}

	return q.items[0], true
}

// Remove removes a specific work item from the queue.
func (q *WorkQueue) Remove(agent, command, issueID string) bool {
	q.mu.Lock()
	defer q.mu.Unlock()

	for i, item := range q.items {
		if item.Agent == agent && item.Command == command && item.IssueID == issueID {
			q.items = append(q.items[:i], q.items[i+1:]...)
			_ = q.saveState() //nolint:errcheck // Best-effort persistence
			return true
		}
	}
	return false
}

// List returns all queued work items.
func (q *WorkQueue) List() []QueuedWork {
	q.mu.RLock()
	defer q.mu.RUnlock()

	result := make([]QueuedWork, len(q.items))
	copy(result, q.items)
	return result
}

// Len returns the number of items in the queue.
func (q *WorkQueue) Len() int {
	q.mu.RLock()
	defer q.mu.RUnlock()
	return len(q.items)
}

// IsQueued checks if work is already queued.
func (q *WorkQueue) IsQueued(agent, command, issueID string) bool {
	q.mu.RLock()
	defer q.mu.RUnlock()

	for _, item := range q.items {
		if item.Agent == agent && item.Command == command && item.IssueID == issueID {
			return true
		}
	}
	return false
}

// Clear removes all items from the queue.
func (q *WorkQueue) Clear() {
	q.mu.Lock()
	defer q.mu.Unlock()

	q.items = make([]QueuedWork, 0)
	_ = q.saveState() //nolint:errcheck // Best-effort persistence
}

// sortByPriority sorts items by priority (lower number = higher priority).
func (q *WorkQueue) sortByPriority() {
	// Simple insertion sort (queue is typically small)
	for i := 1; i < len(q.items); i++ {
		key := q.items[i]
		j := i - 1
		for j >= 0 && q.items[j].Priority > key.Priority {
			q.items[j+1] = q.items[j]
			j--
		}
		q.items[j+1] = key
	}
}

// saveState persists the queue to disk.
func (q *WorkQueue) saveState() error {
	data, err := json.MarshalIndent(q.items, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(q.stateFile, data, 0644)
}

// loadState loads the queue from disk.
func (q *WorkQueue) loadState() {
	data, err := os.ReadFile(q.stateFile)
	if err != nil {
		return
	}

	var items []QueuedWork
	if err := json.Unmarshal(data, &items); err != nil {
		return
	}

	q.items = items
}

// QueueStats returns queue statistics.
type QueueStats struct {
	TotalQueued int            `json:"total_queued"`
	ByAgent     map[string]int `json:"by_agent"`
	ByCommand   map[string]int `json:"by_command"`
	OldestAge   time.Duration  `json:"oldest_age,omitempty"`
}

// Stats returns current queue statistics.
func (q *WorkQueue) Stats() QueueStats {
	q.mu.RLock()
	defer q.mu.RUnlock()

	stats := QueueStats{
		TotalQueued: len(q.items),
		ByAgent:     make(map[string]int),
		ByCommand:   make(map[string]int),
	}

	var oldest time.Time
	for _, item := range q.items {
		stats.ByAgent[item.Agent]++
		stats.ByCommand[item.Command]++
		if oldest.IsZero() || item.QueuedAt.Before(oldest) {
			oldest = item.QueuedAt
		}
	}

	if !oldest.IsZero() {
		stats.OldestAge = time.Since(oldest)
	}

	return stats
}
