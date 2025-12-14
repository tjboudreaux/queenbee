package reservations

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
	return NewStore(beadsDir)
}

func TestStore_Reserve(t *testing.T) {
	store := setupTestStore(t)

	res, conflicts, err := store.Reserve("alice", "src/**/*.go", ReserveOptions{
		Exclusive: true,
		Reason:    "refactoring",
	})
	if err != nil {
		t.Fatalf("Reserve failed: %v", err)
	}
	if len(conflicts) > 0 {
		t.Errorf("Unexpected conflicts: %v", conflicts)
	}

	if res.ID == "" {
		t.Error("Expected reservation to have ID")
	}
	if res.Droid != "alice" {
		t.Errorf("Droid = %q, want %q", res.Droid, "alice")
	}
	if res.Pattern != "src/**/*.go" {
		t.Errorf("Pattern = %q, want %q", res.Pattern, "src/**/*.go")
	}
	if !res.Exclusive {
		t.Error("Expected exclusive reservation")
	}
	if res.Reason != "refactoring" {
		t.Errorf("Reason = %q, want %q", res.Reason, "refactoring")
	}
	if res.Status != StatusActive {
		t.Errorf("Status = %q, want %q", res.Status, StatusActive)
	}
}

func TestStore_Reserve_WithTTL(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{
		TTL: 30 * time.Minute,
	})

	expectedExpiry := time.Now().Add(30 * time.Minute)
	if res.ExpiresAt.Sub(expectedExpiry) > time.Second {
		t.Errorf("ExpiresAt = %v, want ~%v", res.ExpiresAt, expectedExpiry)
	}
}

func TestStore_Reserve_Conflict(t *testing.T) {
	store := setupTestStore(t)

	// Alice reserves src/**
	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})

	// Bob tries to reserve src/main.go (overlaps)
	_, conflicts, err := store.Reserve("bob", "src/main.go", ReserveOptions{Exclusive: true})
	if err != nil {
		t.Fatalf("Reserve failed: %v", err)
	}

	if len(conflicts) != 1 {
		t.Fatalf("Expected 1 conflict, got %d", len(conflicts))
	}
	if conflicts[0].Droid != "alice" {
		t.Errorf("Conflict droid = %q, want %q", conflicts[0].Droid, "alice")
	}
}

func TestStore_Reserve_NoConflict_SameDroid(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})

	// Alice can reserve overlapping pattern
	res, conflicts, _ := store.Reserve("alice", "src/main.go", ReserveOptions{Exclusive: true})

	if len(conflicts) > 0 {
		t.Errorf("Same droid should not conflict with self: %v", conflicts)
	}
	if res == nil {
		t.Error("Expected reservation to be created")
	}
}

func TestStore_Reserve_NoConflict_NonExclusive(t *testing.T) {
	store := setupTestStore(t)

	// Non-exclusive reservation
	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: false})

	// Another non-exclusive shouldn't conflict
	res, conflicts, _ := store.Reserve("bob", "src/main.go", ReserveOptions{Exclusive: false})

	if len(conflicts) > 0 {
		t.Errorf("Non-exclusive should not conflict: %v", conflicts)
	}
	if res == nil {
		t.Error("Expected reservation to be created")
	}
}

func TestStore_Reserve_Force(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})

	// Force override conflict
	res, _, err := store.Reserve("bob", "src/main.go", ReserveOptions{
		Exclusive: true,
		Force:     true,
	})
	if err != nil {
		t.Fatalf("Force reserve failed: %v", err)
	}
	if res == nil {
		t.Error("Expected reservation with force")
	}
}

func TestStore_Release(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{})

	if err := store.Release(res.ID); err != nil {
		t.Fatalf("Release failed: %v", err)
	}

	released, _ := store.GetByID(res.ID)
	if released.Status != StatusReleased {
		t.Errorf("Status = %q, want %q", released.Status, StatusReleased)
	}
	if released.ReleasedAt == nil {
		t.Error("ReleasedAt should be set")
	}
}

func TestStore_ReleaseAll(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{})
	store.Reserve("alice", "tests/**", ReserveOptions{})
	store.Reserve("bob", "docs/**", ReserveOptions{})

	count, err := store.ReleaseAll("alice")
	if err != nil {
		t.Fatalf("ReleaseAll failed: %v", err)
	}
	if count != 2 {
		t.Errorf("Released = %d, want 2", count)
	}

	// Alice should have no active reservations
	active, _ := store.GetActive("alice")
	if len(active) != 0 {
		t.Errorf("Alice should have 0 active, got %d", len(active))
	}

	// Bob's should still be active
	active, _ = store.GetActive("bob")
	if len(active) != 1 {
		t.Errorf("Bob should have 1 active, got %d", len(active))
	}
}

func TestStore_ReleasePattern(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{})
	store.Reserve("alice", "tests/**", ReserveOptions{})

	count, err := store.ReleasePattern("alice", "src/**")
	if err != nil {
		t.Fatalf("ReleasePattern failed: %v", err)
	}
	if count != 1 {
		t.Errorf("Released = %d, want 1", count)
	}

	active, _ := store.GetActive("alice")
	if len(active) != 1 {
		t.Fatalf("Expected 1 active, got %d", len(active))
	}
	if active[0].Pattern != "tests/**" {
		t.Errorf("Wrong reservation remaining: %v", active[0].Pattern)
	}
}

func TestStore_GetByID(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{})

	got, err := store.GetByID(res.ID)
	if err != nil {
		t.Fatalf("GetByID failed: %v", err)
	}
	if got.ID != res.ID {
		t.Errorf("ID = %q, want %q", got.ID, res.ID)
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

func TestStore_GetActive(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{})
	store.Reserve("bob", "tests/**", ReserveOptions{})

	all, err := store.GetActive("")
	if err != nil {
		t.Fatalf("GetActive failed: %v", err)
	}
	if len(all) != 2 {
		t.Errorf("Expected 2 active, got %d", len(all))
	}

	alice, _ := store.GetActive("alice")
	if len(alice) != 1 {
		t.Errorf("Expected 1 for alice, got %d", len(alice))
	}
}

func TestStore_GetActive_ExcludesExpired(t *testing.T) {
	store := setupTestStore(t)

	// Create with very short TTL
	store.Reserve("alice", "src/**", ReserveOptions{TTL: time.Millisecond})

	// Wait for expiry
	time.Sleep(5 * time.Millisecond)

	active, _ := store.GetActive("")
	if len(active) != 0 {
		t.Errorf("Expected 0 active (expired), got %d", len(active))
	}
}

func TestStore_GetActive_ExcludesReleased(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{})
	store.Release(res.ID)

	active, _ := store.GetActive("")
	if len(active) != 0 {
		t.Errorf("Expected 0 active (released), got %d", len(active))
	}
}

func TestStore_CheckPath(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**/*.go", ReserveOptions{})
	store.Reserve("bob", "tests/**", ReserveOptions{})

	tests := []struct {
		path     string
		expected int
	}{
		{"src/main.go", 1},
		{"src/pkg/util.go", 1},
		{"tests/foo_test.go", 1},
		{"docs/readme.md", 0},
		{"src/main.ts", 0}, // Wrong extension
	}

	for _, tc := range tests {
		reservations, err := store.CheckPath(tc.path)
		if err != nil {
			t.Fatalf("CheckPath(%q) failed: %v", tc.path, err)
		}
		if len(reservations) != tc.expected {
			t.Errorf("CheckPath(%q) = %d reservations, want %d", tc.path, len(reservations), tc.expected)
		}
	}
}

func TestStore_Renew(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{TTL: time.Hour})
	originalExpiry := res.ExpiresAt

	if err := store.Renew(res.ID, 2*time.Hour); err != nil {
		t.Fatalf("Renew failed: %v", err)
	}

	renewed, _ := store.GetByID(res.ID)
	if !renewed.ExpiresAt.After(originalExpiry) {
		t.Errorf("ExpiresAt should be extended: %v vs %v", renewed.ExpiresAt, originalExpiry)
	}
}

func TestStore_Renew_NotActive(t *testing.T) {
	store := setupTestStore(t)

	res, _, _ := store.Reserve("alice", "src/**", ReserveOptions{})
	store.Release(res.ID)

	err := store.Renew(res.ID, time.Hour)
	if err == nil {
		t.Error("Expected error when renewing released reservation")
	}
	_, ok := err.(*NotActiveError)
	if !ok {
		t.Errorf("Expected NotActiveError, got %T", err)
	}
}

func TestPatternsOverlap(t *testing.T) {
	tests := []struct {
		a, b     string
		expected bool
	}{
		// Exact match
		{"src/**", "src/**", true},

		// Prefix overlap
		{"src/**", "src/main.go", true},
		{"src/components/**", "src/**", true},

		// Glob expansion overlap
		{"src/*.go", "src/main.go", true},
		{"*.go", "main.go", true},

		// No overlap
		{"src/**", "tests/**", false},
		{"src/*.go", "src/*.ts", false},
		{"docs/**", "tests/**", false},

		// Different directories
		{"a/b/c.go", "x/y/z.go", false},
	}

	for _, tc := range tests {
		result := PatternsOverlap(tc.a, tc.b)
		if result != tc.expected {
			t.Errorf("PatternsOverlap(%q, %q) = %v, want %v", tc.a, tc.b, result, tc.expected)
		}
	}
}

func TestNotFoundError(t *testing.T) {
	err := &NotFoundError{ID: "qr-123"}
	expected := "reservation not found: qr-123"
	if err.Error() != expected {
		t.Errorf("Error() = %q, want %q", err.Error(), expected)
	}
}

func TestNotActiveError(t *testing.T) {
	err := &NotActiveError{ID: "qr-123"}
	expected := "reservation not active: qr-123"
	if err.Error() != expected {
		t.Errorf("Error() = %q, want %q", err.Error(), expected)
	}
}
