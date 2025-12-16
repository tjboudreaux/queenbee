package messages

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func setupTestStore(t *testing.T) *Store {
	t.Helper()
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	store, err := NewStore(beadsDir)
	if err != nil {
		t.Fatal(err)
	}
	return store
}

func TestStore_Send(t *testing.T) {
	store := setupTestStore(t)

	msg, err := store.Send("alice", "bob", "Test Subject", "Test body", SendOptions{})
	if err != nil {
		t.Fatalf("Send failed: %v", err)
	}

	if msg.ID == "" {
		t.Error("Expected message to have ID")
	}
	if msg.From != "alice" {
		t.Errorf("From = %q, want %q", msg.From, "alice")
	}
	if msg.To != "bob" {
		t.Errorf("To = %q, want %q", msg.To, "bob")
	}
	if msg.Subject != "Test Subject" {
		t.Errorf("Subject = %q, want %q", msg.Subject, "Test Subject")
	}
	if msg.Body != "Test body" {
		t.Errorf("Body = %q, want %q", msg.Body, "Test body")
	}
	if msg.Read {
		t.Error("New message should be unread")
	}
	if msg.Importance != ImportanceNormal {
		t.Errorf("Importance = %q, want %q", msg.Importance, ImportanceNormal)
	}
}

func TestStore_SendWithOptions(t *testing.T) {
	store := setupTestStore(t)

	msg, err := store.Send("alice", "bob", "Bug Report", "Details here", SendOptions{
		IssueID:    "qb-123",
		Importance: ImportanceHigh,
	})
	if err != nil {
		t.Fatalf("Send failed: %v", err)
	}

	if msg.IssueID != "qb-123" {
		t.Errorf("IssueID = %q, want %q", msg.IssueID, "qb-123")
	}
	if msg.ThreadID != "issue:qb-123" {
		t.Errorf("ThreadID = %q, want %q", msg.ThreadID, "issue:qb-123")
	}
	if msg.Importance != ImportanceHigh {
		t.Errorf("Importance = %q, want %q", msg.Importance, ImportanceHigh)
	}
}

func TestStore_GetByID(t *testing.T) {
	store := setupTestStore(t)

	sent, _ := store.Send("alice", "bob", "Test", "Body", SendOptions{})

	got, err := store.GetByID(sent.ID)
	if err != nil {
		t.Fatalf("GetByID failed: %v", err)
	}

	if got.ID != sent.ID {
		t.Errorf("ID = %q, want %q", got.ID, sent.ID)
	}
	if got.Subject != "Test" {
		t.Errorf("Subject = %q, want %q", got.Subject, "Test")
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

func TestStore_MarkRead(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "Test", "Body", SendOptions{})
	if msg.Read {
		t.Error("New message should be unread")
	}

	if err := store.MarkRead(msg.ID); err != nil {
		t.Fatalf("MarkRead failed: %v", err)
	}

	got, _ := store.GetByID(msg.ID)
	if !got.Read {
		t.Error("Message should be marked as read")
	}
	if got.ReadAt == nil {
		t.Error("ReadAt should be set")
	}
}

func TestStore_MarkRead_Idempotent(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "Test", "Body", SendOptions{})

	// Mark read twice
	if err := store.MarkRead(msg.ID); err != nil {
		t.Fatalf("First MarkRead failed: %v", err)
	}
	if err := store.MarkRead(msg.ID); err != nil {
		t.Fatalf("Second MarkRead failed: %v", err)
	}

	got, _ := store.GetByID(msg.ID)
	if !got.Read {
		t.Error("Message should still be read")
	}
}

func TestStore_GetInbox(t *testing.T) {
	store := setupTestStore(t)

	// Send multiple messages to bob
	store.Send("alice", "bob", "Message 1", "", SendOptions{})
	store.Send("charlie", "bob", "Message 2", "", SendOptions{})
	store.Send("alice", "david", "Message 3", "", SendOptions{}) // Not to bob

	msgs, err := store.GetInbox("bob", InboxOptions{})
	if err != nil {
		t.Fatalf("GetInbox failed: %v", err)
	}

	if len(msgs) != 2 {
		t.Fatalf("Expected 2 messages, got %d", len(msgs))
	}

	// Should be sorted newest first
	if msgs[0].Subject != "Message 2" {
		t.Errorf("First message should be newest: %v", msgs[0].Subject)
	}
}

func TestStore_GetInbox_UnreadOnly(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Read", "", SendOptions{})
	store.Send("alice", "bob", "Unread", "", SendOptions{})

	store.MarkRead(msg1.ID)

	msgs, err := store.GetInbox("bob", InboxOptions{UnreadOnly: true})
	if err != nil {
		t.Fatalf("GetInbox failed: %v", err)
	}

	if len(msgs) != 1 {
		t.Fatalf("Expected 1 unread message, got %d", len(msgs))
	}
	if msgs[0].Subject != "Unread" {
		t.Errorf("Expected unread message, got %v", msgs[0].Subject)
	}
}

func TestStore_GetInbox_Since(t *testing.T) {
	store := setupTestStore(t)

	// Create old message
	msg1, _ := store.Send("alice", "bob", "Old", "", SendOptions{})
	// Manually modify time
	msg1.CreatedAt = time.Now().Add(-2 * time.Hour)
	store.jsonl.Append(*msg1) // Update with old time

	// Create recent message
	store.Send("alice", "bob", "New", "", SendOptions{})

	since := time.Now().Add(-1 * time.Hour)
	msgs, err := store.GetInbox("bob", InboxOptions{Since: since})
	if err != nil {
		t.Fatalf("GetInbox failed: %v", err)
	}

	if len(msgs) != 1 {
		t.Fatalf("Expected 1 recent message, got %d", len(msgs))
	}
	if msgs[0].Subject != "New" {
		t.Errorf("Expected recent message, got %v", msgs[0].Subject)
	}
}

func TestStore_GetInbox_Limit(t *testing.T) {
	store := setupTestStore(t)

	for i := 0; i < 10; i++ {
		store.Send("alice", "bob", "Message", "", SendOptions{})
	}

	msgs, err := store.GetInbox("bob", InboxOptions{Limit: 3})
	if err != nil {
		t.Fatalf("GetInbox failed: %v", err)
	}

	if len(msgs) != 3 {
		t.Errorf("Expected 3 messages (limit), got %d", len(msgs))
	}
}

func TestStore_Reply(t *testing.T) {
	store := setupTestStore(t)

	original, _ := store.Send("alice", "bob", "Question?", "What's the status?", SendOptions{
		IssueID:    "qb-123",
		Importance: ImportanceHigh,
	})

	reply, err := store.Reply(original.ID, "bob", "All good!")
	if err != nil {
		t.Fatalf("Reply failed: %v", err)
	}

	// Check reply fields
	if reply.From != "bob" {
		t.Errorf("From = %q, want %q", reply.From, "bob")
	}
	if reply.To != "alice" {
		t.Errorf("To = %q, want %q", reply.To, "alice")
	}
	if reply.Subject != "Re: Question?" {
		t.Errorf("Subject = %q, want %q", reply.Subject, "Re: Question?")
	}
	if reply.ReplyTo != original.ID {
		t.Errorf("ReplyTo = %q, want %q", reply.ReplyTo, original.ID)
	}
	if reply.ThreadID != original.ThreadID {
		t.Errorf("ThreadID = %q, want %q", reply.ThreadID, original.ThreadID)
	}
	if reply.Importance != ImportanceHigh {
		t.Errorf("Importance = %q, want %q", reply.Importance, ImportanceHigh)
	}
}

func TestStore_Reply_ChainedRe(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Original", "", SendOptions{})
	msg2, _ := store.Reply(msg1.ID, "bob", "Reply 1")
	msg3, _ := store.Reply(msg2.ID, "alice", "Reply 2")

	// Should not double "Re:"
	if msg3.Subject != "Re: Original" {
		t.Errorf("Subject = %q, should not double Re:", msg3.Subject)
	}

	// All should have same thread
	if msg2.ThreadID != msg1.ID {
		t.Errorf("msg2 ThreadID = %q, want %q", msg2.ThreadID, msg1.ID)
	}
	if msg3.ThreadID != msg1.ID {
		t.Errorf("msg3 ThreadID = %q, want %q", msg3.ThreadID, msg1.ID)
	}
}

func TestStore_GetThread(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Start", "", SendOptions{})
	store.Reply(msg1.ID, "bob", "Reply 1")
	store.Reply(msg1.ID, "alice", "Reply 2")

	// Unrelated message
	store.Send("charlie", "david", "Other", "", SendOptions{})

	thread, err := store.GetThread(msg1.ID)
	if err != nil {
		t.Fatalf("GetThread failed: %v", err)
	}

	if len(thread) != 3 {
		t.Fatalf("Expected 3 messages in thread, got %d", len(thread))
	}

	// Should be sorted oldest first
	if thread[0].Subject != "Start" {
		t.Errorf("First message should be original: %v", thread[0].Subject)
	}
}

func TestStore_GetSent(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "From Alice 1", "", SendOptions{})
	store.Send("alice", "charlie", "From Alice 2", "", SendOptions{})
	store.Send("bob", "alice", "From Bob", "", SendOptions{})

	sent, err := store.GetSent("alice", 10)
	if err != nil {
		t.Fatalf("GetSent failed: %v", err)
	}

	if len(sent) != 2 {
		t.Fatalf("Expected 2 sent messages, got %d", len(sent))
	}
}

func TestStore_Delete(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "Test", "", SendOptions{})

	if err := store.Delete(msg.ID); err != nil {
		t.Fatalf("Delete failed: %v", err)
	}

	_, err := store.GetByID(msg.ID)
	if err == nil {
		t.Error("Deleted message should not be found")
	}
}

func TestStore_Delete_HidesFromInbox(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "To Delete", "", SendOptions{})
	store.Send("alice", "bob", "Keep", "", SendOptions{})

	store.Delete(msg.ID)

	msgs, _ := store.GetInbox("bob", InboxOptions{})
	if len(msgs) != 1 {
		t.Fatalf("Expected 1 message after delete, got %d", len(msgs))
	}
	if msgs[0].Subject != "Keep" {
		t.Errorf("Wrong message kept: %v", msgs[0].Subject)
	}
}

func TestNotFoundError(t *testing.T) {
	err := &NotFoundError{ID: "qm-123"}
	expected := "message not found: qm-123"
	if err.Error() != expected {
		t.Errorf("Error() = %q, want %q", err.Error(), expected)
	}
}

func TestSortMessagesByDate(t *testing.T) {
	now := time.Now()
	msgs := []Message{
		{ID: "1", CreatedAt: now.Add(-1 * time.Hour)},
		{ID: "2", CreatedAt: now.Add(-3 * time.Hour)},
		{ID: "3", CreatedAt: now.Add(-2 * time.Hour)},
	}

	// Descending (newest first)
	sortMessagesByDate(msgs, true)
	if msgs[0].ID != "1" || msgs[1].ID != "3" || msgs[2].ID != "2" {
		t.Errorf("Descending sort failed: %v", []string{msgs[0].ID, msgs[1].ID, msgs[2].ID})
	}

	// Ascending (oldest first)
	sortMessagesByDate(msgs, false)
	if msgs[0].ID != "2" || msgs[1].ID != "3" || msgs[2].ID != "1" {
		t.Errorf("Ascending sort failed: %v", []string{msgs[0].ID, msgs[1].ID, msgs[2].ID})
	}
}

func TestStore_GetSent_WithLimit(t *testing.T) {
	store := setupTestStore(t)

	for i := 0; i < 10; i++ {
		store.Send("alice", "bob", "Message", "", SendOptions{})
	}

	sent, err := store.GetSent("alice", 3)
	if err != nil {
		t.Fatalf("GetSent failed: %v", err)
	}

	if len(sent) != 3 {
		t.Errorf("Expected 3 messages (limit), got %d", len(sent))
	}
}

func TestStore_GetSent_ExcludesDeleted(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Keep", "", SendOptions{})
	msg2, _ := store.Send("alice", "charlie", "Delete", "", SendOptions{})

	store.Delete(msg2.ID)

	sent, _ := store.GetSent("alice", 10)
	if len(sent) != 1 {
		t.Fatalf("Expected 1 sent message after delete, got %d", len(sent))
	}
	if sent[0].ID != msg1.ID {
		t.Errorf("Wrong message: expected %s, got %s", msg1.ID, sent[0].ID)
	}
}

func TestStore_GetThread_ExcludesDeleted(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Start", "", SendOptions{})
	msg2, _ := store.Reply(msg1.ID, "bob", "Reply")

	store.Delete(msg2.ID)

	thread, _ := store.GetThread(msg1.ID)
	if len(thread) != 1 {
		t.Fatalf("Expected 1 message in thread after delete, got %d", len(thread))
	}
}

func TestStore_GetThread_IncludesRoot(t *testing.T) {
	store := setupTestStore(t)

	// Message with no explicit thread ID (root of its own thread)
	msg, _ := store.Send("alice", "bob", "Standalone", "", SendOptions{})

	thread, _ := store.GetThread(msg.ID)
	if len(thread) != 1 {
		t.Fatalf("Expected 1 message (the root), got %d", len(thread))
	}
	if thread[0].ID != msg.ID {
		t.Errorf("Expected root message in thread")
	}
}

func TestStore_Delete_NotFound(t *testing.T) {
	store := setupTestStore(t)

	err := store.Delete("nonexistent")
	if err == nil {
		t.Error("Expected error for nonexistent message")
	}
}

func TestStore_MarkRead_NotFound(t *testing.T) {
	store := setupTestStore(t)

	err := store.MarkRead("nonexistent")
	if err == nil {
		t.Error("Expected error for nonexistent message")
	}
}

func TestStore_Reply_NotFound(t *testing.T) {
	store := setupTestStore(t)

	_, err := store.Reply("nonexistent", "bob", "Reply")
	if err == nil {
		t.Error("Expected error for nonexistent original message")
	}
}

func TestStore_GetByID_DeletedMessage(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "Test", "", SendOptions{})
	store.Delete(msg.ID)

	_, err := store.GetByID(msg.ID)
	if err == nil {
		t.Error("Expected error for deleted message")
	}
}

func TestStore_SendWithExplicitThreadID(t *testing.T) {
	store := setupTestStore(t)

	msg, _ := store.Send("alice", "bob", "Test", "", SendOptions{
		ThreadID: "custom-thread-123",
	})

	if msg.ThreadID != "custom-thread-123" {
		t.Errorf("ThreadID = %q, want %q", msg.ThreadID, "custom-thread-123")
	}
}

func TestStore_GetInbox_Empty(t *testing.T) {
	store := setupTestStore(t)

	msgs, err := store.GetInbox("nobody", InboxOptions{})
	if err != nil {
		t.Fatalf("GetInbox failed: %v", err)
	}

	if len(msgs) != 0 {
		t.Errorf("Expected empty inbox, got %d messages", len(msgs))
	}
}

// ============================================================================
// Tests for GetStats
// ============================================================================

func TestStore_GetStats_Empty(t *testing.T) {
	store := setupTestStore(t)

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.Total != 0 {
		t.Errorf("Total = %d, want 0", stats.Total)
	}
	if stats.Unread != 0 {
		t.Errorf("Unread = %d, want 0", stats.Unread)
	}
}

func TestStore_GetStats_Counts(t *testing.T) {
	store := setupTestStore(t)

	// Create messages with different importance levels
	store.Send("alice", "bob", "Normal 1", "", SendOptions{})
	store.Send("alice", "bob", "Normal 2", "", SendOptions{})
	store.Send("alice", "charlie", "High", "", SendOptions{Importance: ImportanceHigh})
	store.Send("alice", "david", "Urgent", "", SendOptions{Importance: ImportanceUrgent})
	msg5, _ := store.Send("alice", "bob", "Read", "", SendOptions{})
	store.MarkRead(msg5.ID)

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.Total != 5 {
		t.Errorf("Total = %d, want 5", stats.Total)
	}
	if stats.Unread != 4 {
		t.Errorf("Unread = %d, want 4", stats.Unread)
	}
}

func TestStore_GetStats_ByAgent(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "To Bob 1", "", SendOptions{})
	store.Send("alice", "bob", "To Bob 2", "", SendOptions{})
	store.Send("alice", "charlie", "To Charlie", "", SendOptions{})

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.ByAgent["bob"] != 2 {
		t.Errorf("ByAgent[bob] = %d, want 2", stats.ByAgent["bob"])
	}
	if stats.ByAgent["charlie"] != 1 {
		t.Errorf("ByAgent[charlie] = %d, want 1", stats.ByAgent["charlie"])
	}
}

func TestStore_GetStats_BySender(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "From Alice 1", "", SendOptions{})
	store.Send("alice", "charlie", "From Alice 2", "", SendOptions{})
	store.Send("bob", "alice", "From Bob", "", SendOptions{})

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.BySender["alice"] != 2 {
		t.Errorf("BySender[alice] = %d, want 2", stats.BySender["alice"])
	}
	if stats.BySender["bob"] != 1 {
		t.Errorf("BySender[bob] = %d, want 1", stats.BySender["bob"])
	}
}

func TestStore_GetStats_ByImportance(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "Normal", "", SendOptions{})
	store.Send("alice", "bob", "High", "", SendOptions{Importance: ImportanceHigh})
	store.Send("alice", "bob", "Urgent", "", SendOptions{Importance: ImportanceUrgent})
	store.Send("alice", "bob", "Low", "", SendOptions{Importance: ImportanceLow})

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.ByImportance[ImportanceNormal] != 1 {
		t.Errorf("ByImportance[normal] = %d, want 1", stats.ByImportance[ImportanceNormal])
	}
	if stats.ByImportance[ImportanceHigh] != 1 {
		t.Errorf("ByImportance[high] = %d, want 1", stats.ByImportance[ImportanceHigh])
	}
	if stats.ByImportance[ImportanceUrgent] != 1 {
		t.Errorf("ByImportance[urgent] = %d, want 1", stats.ByImportance[ImportanceUrgent])
	}
	if stats.ByImportance[ImportanceLow] != 1 {
		t.Errorf("ByImportance[low] = %d, want 1", stats.ByImportance[ImportanceLow])
	}
}

func TestStore_GetStats_Since(t *testing.T) {
	store := setupTestStore(t)

	// Create old message
	oldMsg, _ := store.Send("alice", "bob", "Old", "", SendOptions{})
	oldMsg.CreatedAt = time.Now().Add(-2 * time.Hour)
	store.jsonl.Append(*oldMsg)

	// Create recent messages
	store.Send("alice", "bob", "New 1", "", SendOptions{})
	store.Send("alice", "bob", "New 2", "", SendOptions{})

	since := time.Now().Add(-1 * time.Hour)
	stats, err := store.GetStats(since)
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.Total != 3 {
		t.Errorf("Total = %d, want 3", stats.Total)
	}
	if stats.SinceTotal != 2 {
		t.Errorf("SinceTotal = %d, want 2", stats.SinceTotal)
	}
	if stats.SinceUnread != 2 {
		t.Errorf("SinceUnread = %d, want 2", stats.SinceUnread)
	}
}

func TestStore_GetStats_ExcludesDeleted(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "Keep", "", SendOptions{})
	msg2, _ := store.Send("alice", "bob", "Delete", "", SendOptions{})
	store.Delete(msg2.ID)

	stats, err := store.GetStats(time.Time{})
	if err != nil {
		t.Fatalf("GetStats failed: %v", err)
	}

	if stats.Total != 1 {
		t.Errorf("Total = %d, want 1 (deleted excluded)", stats.Total)
	}
}

// ============================================================================
// Tests for GetAllMessages
// ============================================================================

func TestStore_GetAllMessages_Empty(t *testing.T) {
	store := setupTestStore(t)

	msgs, err := store.GetAllMessages(time.Time{}, 100)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if len(msgs) != 0 {
		t.Errorf("Expected empty list, got %d messages", len(msgs))
	}
}

func TestStore_GetAllMessages_ReturnsAll(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "Msg 1", "", SendOptions{})
	store.Send("charlie", "david", "Msg 2", "", SendOptions{})
	store.Send("alice", "charlie", "Msg 3", "", SendOptions{})

	msgs, err := store.GetAllMessages(time.Time{}, 100)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if len(msgs) != 3 {
		t.Errorf("Expected 3 messages, got %d", len(msgs))
	}
}

func TestStore_GetAllMessages_SortedNewestFirst(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "First", "", SendOptions{})
	time.Sleep(10 * time.Millisecond)
	store.Send("alice", "bob", "Second", "", SendOptions{})
	time.Sleep(10 * time.Millisecond)
	store.Send("alice", "bob", "Third", "", SendOptions{})

	msgs, err := store.GetAllMessages(time.Time{}, 100)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if msgs[0].Subject != "Third" {
		t.Errorf("First message should be newest, got %s", msgs[0].Subject)
	}
	if msgs[2].Subject != "First" {
		t.Errorf("Last message should be oldest, got %s", msgs[2].Subject)
	}
}

func TestStore_GetAllMessages_Since(t *testing.T) {
	store := setupTestStore(t)

	// Create old message
	oldMsg, _ := store.Send("alice", "bob", "Old", "", SendOptions{})
	oldMsg.CreatedAt = time.Now().Add(-2 * time.Hour)
	store.jsonl.Append(*oldMsg)

	// Create recent message
	store.Send("alice", "bob", "New", "", SendOptions{})

	since := time.Now().Add(-1 * time.Hour)
	msgs, err := store.GetAllMessages(since, 100)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if len(msgs) != 1 {
		t.Errorf("Expected 1 recent message, got %d", len(msgs))
	}
	if msgs[0].Subject != "New" {
		t.Errorf("Expected new message, got %s", msgs[0].Subject)
	}
}

func TestStore_GetAllMessages_Limit(t *testing.T) {
	store := setupTestStore(t)

	for i := 0; i < 10; i++ {
		store.Send("alice", "bob", "Message", "", SendOptions{})
	}

	msgs, err := store.GetAllMessages(time.Time{}, 5)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if len(msgs) != 5 {
		t.Errorf("Expected 5 messages (limit), got %d", len(msgs))
	}
}

func TestStore_GetAllMessages_ExcludesDeleted(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "Keep", "", SendOptions{})
	msg2, _ := store.Send("alice", "bob", "Delete", "", SendOptions{})
	store.Delete(msg2.ID)

	msgs, err := store.GetAllMessages(time.Time{}, 100)
	if err != nil {
		t.Fatalf("GetAllMessages failed: %v", err)
	}

	if len(msgs) != 1 {
		t.Errorf("Expected 1 message (deleted excluded), got %d", len(msgs))
	}
}

// ============================================================================
// Tests for GetAgentInboxCount
// ============================================================================

func TestStore_GetAgentInboxCount(t *testing.T) {
	store := setupTestStore(t)

	store.Send("alice", "bob", "Msg 1", "", SendOptions{})
	store.Send("alice", "bob", "Msg 2", "", SendOptions{})
	store.Send("alice", "charlie", "Msg 3", "", SendOptions{})

	count, err := store.GetAgentInboxCount("bob", false)
	if err != nil {
		t.Fatalf("GetAgentInboxCount failed: %v", err)
	}

	if count != 2 {
		t.Errorf("Count = %d, want 2", count)
	}
}

func TestStore_GetAgentInboxCount_UnreadOnly(t *testing.T) {
	store := setupTestStore(t)

	msg1, _ := store.Send("alice", "bob", "Read", "", SendOptions{})
	store.Send("alice", "bob", "Unread", "", SendOptions{})
	store.MarkRead(msg1.ID)

	count, err := store.GetAgentInboxCount("bob", true)
	if err != nil {
		t.Fatalf("GetAgentInboxCount failed: %v", err)
	}

	if count != 1 {
		t.Errorf("Unread count = %d, want 1", count)
	}
}

func TestStore_GetAgentInboxCount_Empty(t *testing.T) {
	store := setupTestStore(t)

	count, err := store.GetAgentInboxCount("nobody", false)
	if err != nil {
		t.Fatalf("GetAgentInboxCount failed: %v", err)
	}

	if count != 0 {
		t.Errorf("Count = %d, want 0", count)
	}
}
