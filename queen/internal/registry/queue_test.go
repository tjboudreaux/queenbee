package registry

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func TestWorkQueue_Enqueue(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	work := QueuedWork{
		Agent:    "test-agent",
		Command:  "work_issue",
		IssueID:  "qb-123",
		Priority: 1,
	}

	q.Enqueue(work)

	if q.Len() != 1 {
		t.Errorf("expected 1 item, got %d", q.Len())
	}

	// Check ID was generated
	items := q.List()
	if items[0].ID == "" {
		t.Error("expected ID to be generated")
	}

	// Check QueuedAt was set
	if items[0].QueuedAt.IsZero() {
		t.Error("expected QueuedAt to be set")
	}
}

func TestWorkQueue_Enqueue_Duplicate(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	work := QueuedWork{
		Agent:    "test-agent",
		Command:  "work_issue",
		IssueID:  "qb-123",
		Priority: 1,
	}

	q.Enqueue(work)
	q.Enqueue(work) // Duplicate

	if q.Len() != 1 {
		t.Errorf("expected 1 item (duplicate ignored), got %d", q.Len())
	}
}

func TestWorkQueue_Dequeue(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	work := QueuedWork{
		Agent:    "test-agent",
		Command:  "work_issue",
		IssueID:  "qb-123",
		Priority: 1,
	}

	q.Enqueue(work)

	dequeued, ok := q.Dequeue()
	if !ok {
		t.Error("expected to dequeue item")
	}

	if dequeued.IssueID != "qb-123" {
		t.Errorf("expected issue qb-123, got %s", dequeued.IssueID)
	}

	if q.Len() != 0 {
		t.Errorf("expected queue to be empty, got %d", q.Len())
	}
}

func TestWorkQueue_Dequeue_Empty(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	_, ok := q.Dequeue()
	if ok {
		t.Error("expected no item from empty queue")
	}
}

func TestWorkQueue_Peek(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	work := QueuedWork{
		Agent:    "test-agent",
		Command:  "work_issue",
		IssueID:  "qb-123",
		Priority: 1,
	}

	q.Enqueue(work)

	peeked, ok := q.Peek()
	if !ok {
		t.Error("expected to peek item")
	}

	if peeked.IssueID != "qb-123" {
		t.Errorf("expected issue qb-123, got %s", peeked.IssueID)
	}

	// Queue should still have the item
	if q.Len() != 1 {
		t.Errorf("expected queue to still have 1 item, got %d", q.Len())
	}
}

func TestWorkQueue_Peek_Empty(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	_, ok := q.Peek()
	if ok {
		t.Error("expected no item from empty queue")
	}
}

func TestWorkQueue_PriorityOrder(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	// Enqueue in reverse priority order
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "p3", Priority: 3})
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "p0", Priority: 0})
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "p2", Priority: 2})
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "p1", Priority: 1})

	// Should dequeue in priority order (0, 1, 2, 3)
	expected := []string{"p0", "p1", "p2", "p3"}
	for _, exp := range expected {
		work, ok := q.Dequeue()
		if !ok {
			t.Fatal("expected item")
		}
		if work.IssueID != exp {
			t.Errorf("expected %s, got %s", exp, work.IssueID)
		}
	}
}

func TestWorkQueue_Remove(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	q.Enqueue(QueuedWork{Agent: "agent1", Command: "cmd1", IssueID: "issue1", Priority: 1})
	q.Enqueue(QueuedWork{Agent: "agent2", Command: "cmd2", IssueID: "issue2", Priority: 2})

	removed := q.Remove("agent1", "cmd1", "issue1")
	if !removed {
		t.Error("expected item to be removed")
	}

	if q.Len() != 1 {
		t.Errorf("expected 1 item remaining, got %d", q.Len())
	}

	// Verify the right item was removed
	items := q.List()
	if items[0].IssueID != "issue2" {
		t.Errorf("expected issue2 to remain, got %s", items[0].IssueID)
	}
}

func TestWorkQueue_Remove_NotFound(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	q.Enqueue(QueuedWork{Agent: "agent1", Command: "cmd1", IssueID: "issue1", Priority: 1})

	removed := q.Remove("agent2", "cmd2", "issue2")
	if removed {
		t.Error("expected item not to be found")
	}

	if q.Len() != 1 {
		t.Errorf("expected 1 item remaining, got %d", q.Len())
	}
}

func TestWorkQueue_IsQueued(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	q.Enqueue(QueuedWork{Agent: "agent1", Command: "cmd1", IssueID: "issue1", Priority: 1})

	if !q.IsQueued("agent1", "cmd1", "issue1") {
		t.Error("expected item to be queued")
	}

	if q.IsQueued("agent2", "cmd2", "issue2") {
		t.Error("expected item not to be queued")
	}
}

func TestWorkQueue_Clear(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "i1", Priority: 1})
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "i2", Priority: 2})
	q.Enqueue(QueuedWork{Agent: "a", Command: "c", IssueID: "i3", Priority: 3})

	q.Clear()

	if q.Len() != 0 {
		t.Errorf("expected empty queue, got %d items", q.Len())
	}
}

func TestWorkQueue_Persistence(t *testing.T) {
	tmpDir := t.TempDir()

	// Create queue and add items
	q1 := NewWorkQueue(tmpDir)
	q1.Enqueue(QueuedWork{
		Agent:    "agent1",
		Command:  "cmd1",
		IssueID:  "issue1",
		Priority: 1,
	})
	q1.Enqueue(QueuedWork{
		Agent:    "agent2",
		Command:  "cmd2",
		IssueID:  "issue2",
		Priority: 0,
	})

	// Create new queue instance (should load from file)
	q2 := NewWorkQueue(tmpDir)

	if q2.Len() != 2 {
		t.Errorf("expected 2 items loaded, got %d", q2.Len())
	}

	// Verify priority order preserved
	peeked, _ := q2.Peek()
	if peeked.IssueID != "issue2" { // Priority 0 should be first
		t.Errorf("expected issue2 (priority 0) first, got %s", peeked.IssueID)
	}
}

func TestWorkQueue_Stats(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	now := time.Now()
	q.Enqueue(QueuedWork{
		Agent:    "agent1",
		Command:  "work_issue",
		IssueID:  "issue1",
		Priority: 1,
		QueuedAt: now.Add(-10 * time.Minute),
	})
	q.Enqueue(QueuedWork{
		Agent:    "agent1",
		Command:  "plan_issue",
		IssueID:  "issue2",
		Priority: 0,
		QueuedAt: now.Add(-5 * time.Minute),
	})
	q.Enqueue(QueuedWork{
		Agent:    "agent2",
		Command:  "work_issue",
		IssueID:  "issue3",
		Priority: 2,
		QueuedAt: now,
	})

	stats := q.Stats()

	if stats.TotalQueued != 3 {
		t.Errorf("expected 3 queued, got %d", stats.TotalQueued)
	}

	if stats.ByAgent["agent1"] != 2 {
		t.Errorf("expected 2 for agent1, got %d", stats.ByAgent["agent1"])
	}

	if stats.ByAgent["agent2"] != 1 {
		t.Errorf("expected 1 for agent2, got %d", stats.ByAgent["agent2"])
	}

	if stats.ByCommand["work_issue"] != 2 {
		t.Errorf("expected 2 work_issue, got %d", stats.ByCommand["work_issue"])
	}

	if stats.ByCommand["plan_issue"] != 1 {
		t.Errorf("expected 1 plan_issue, got %d", stats.ByCommand["plan_issue"])
	}

	// Oldest should be about 10 minutes
	if stats.OldestAge < 9*time.Minute || stats.OldestAge > 11*time.Minute {
		t.Errorf("expected oldest age around 10 minutes, got %v", stats.OldestAge)
	}
}

func TestWorkQueue_Stats_Empty(t *testing.T) {
	tmpDir := t.TempDir()
	q := NewWorkQueue(tmpDir)

	stats := q.Stats()

	if stats.TotalQueued != 0 {
		t.Errorf("expected 0 queued, got %d", stats.TotalQueued)
	}

	if stats.OldestAge != 0 {
		t.Errorf("expected 0 oldest age, got %v", stats.OldestAge)
	}
}

func TestWorkQueue_LoadState_InvalidJSON(t *testing.T) {
	tmpDir := t.TempDir()

	// Write invalid JSON
	stateFile := filepath.Join(tmpDir, "queen_queue.json")
	if err := os.WriteFile(stateFile, []byte("invalid json"), 0644); err != nil {
		t.Fatal(err)
	}

	// Should not panic, just start with empty queue
	q := NewWorkQueue(tmpDir)

	if q.Len() != 0 {
		t.Errorf("expected empty queue on invalid JSON, got %d items", q.Len())
	}
}

func TestWorkQueue_LoadState_NoFile(t *testing.T) {
	tmpDir := t.TempDir()

	// No state file exists
	q := NewWorkQueue(tmpDir)

	if q.Len() != 0 {
		t.Errorf("expected empty queue when no file, got %d items", q.Len())
	}
}
