package store

import (
	"strings"
	"sync"
	"testing"
)

func TestNewMessageID_Format(t *testing.T) {
	id := NewMessageID()

	if !strings.HasPrefix(id, "qm-") {
		t.Errorf("Message ID should start with 'qm-', got %s", id)
	}

	// ULID is 26 chars, plus "qm-" prefix = 29
	if len(id) != 29 {
		t.Errorf("Message ID should be 29 chars, got %d: %s", len(id), id)
	}
}

func TestNewAssignmentID_Format(t *testing.T) {
	id := NewAssignmentID()

	if !strings.HasPrefix(id, "qa-") {
		t.Errorf("Assignment ID should start with 'qa-', got %s", id)
	}

	if len(id) != 29 {
		t.Errorf("Assignment ID should be 29 chars, got %d: %s", len(id), id)
	}
}

func TestNewReservationID_Format(t *testing.T) {
	id := NewReservationID()

	if !strings.HasPrefix(id, "qr-") {
		t.Errorf("Reservation ID should start with 'qr-', got %s", id)
	}

	if len(id) != 29 {
		t.Errorf("Reservation ID should be 29 chars, got %d: %s", len(id), id)
	}
}

func TestID_Uniqueness(t *testing.T) {
	const count = 1000
	ids := make(map[string]bool, count)

	for i := 0; i < count; i++ {
		id := NewMessageID()
		if ids[id] {
			t.Fatalf("Duplicate ID generated: %s", id)
		}
		ids[id] = true
	}
}

func TestID_Monotonic(t *testing.T) {
	const count = 100
	ids := make([]string, count)

	for i := 0; i < count; i++ {
		ids[i] = NewMessageID()
	}

	// ULIDs should be lexicographically increasing
	for i := 1; i < count; i++ {
		if ids[i] <= ids[i-1] {
			t.Errorf("IDs not monotonic at index %d: %s <= %s", i, ids[i], ids[i-1])
		}
	}
}

func TestID_ConcurrentUniqueness(t *testing.T) {
	const numGoroutines = 10
	const idsPerGoroutine = 100

	var mu sync.Mutex
	allIDs := make(map[string]bool)
	var wg sync.WaitGroup
	wg.Add(numGoroutines)

	for g := 0; g < numGoroutines; g++ {
		go func() {
			defer wg.Done()
			localIDs := make([]string, idsPerGoroutine)
			for i := 0; i < idsPerGoroutine; i++ {
				localIDs[i] = NewMessageID()
			}

			mu.Lock()
			for _, id := range localIDs {
				if allIDs[id] {
					t.Errorf("Duplicate ID in concurrent generation: %s", id)
				}
				allIDs[id] = true
			}
			mu.Unlock()
		}()
	}

	wg.Wait()

	expected := numGoroutines * idsPerGoroutine
	if len(allIDs) != expected {
		t.Errorf("Expected %d unique IDs, got %d", expected, len(allIDs))
	}
}

func TestID_AllTypes(t *testing.T) {
	msgID := NewMessageID()
	assignID := NewAssignmentID()
	resID := NewReservationID()

	// All should be unique
	if msgID == assignID || msgID == resID || assignID == resID {
		t.Error("IDs from different types should be unique")
	}

	// All should have correct prefixes
	if !strings.HasPrefix(msgID, "qm-") {
		t.Errorf("Message ID prefix wrong: %s", msgID)
	}
	if !strings.HasPrefix(assignID, "qa-") {
		t.Errorf("Assignment ID prefix wrong: %s", assignID)
	}
	if !strings.HasPrefix(resID, "qr-") {
		t.Errorf("Reservation ID prefix wrong: %s", resID)
	}
}

func BenchmarkNewMessageID(b *testing.B) {
	for i := 0; i < b.N; i++ {
		NewMessageID()
	}
}

func BenchmarkNewMessageID_Parallel(b *testing.B) {
	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			NewMessageID()
		}
	})
}
