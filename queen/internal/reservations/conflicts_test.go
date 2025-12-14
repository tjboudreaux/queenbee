package reservations

import (
	"testing"
	"time"
)

func TestStore_DetectConflicts_NoConflicts(t *testing.T) {
	store := setupTestStore(t)

	// Non-overlapping patterns
	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("bob", "tests/**", ReserveOptions{Exclusive: true})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	if len(conflicts) != 0 {
		t.Errorf("Expected 0 conflicts, got %d", len(conflicts))
	}
}

func TestStore_DetectConflicts_ExactMatch(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("bob", "src/**", ReserveOptions{Exclusive: true, Force: true})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	if len(conflicts) != 1 {
		t.Fatalf("Expected 1 conflict, got %d", len(conflicts))
	}

	c := conflicts[0]
	if c.OverlapType != "exact" {
		t.Errorf("OverlapType = %q, want %q", c.OverlapType, "exact")
	}
}

func TestStore_DetectConflicts_PartialOverlap(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("bob", "src/api/**", ReserveOptions{Exclusive: true, Force: true})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	if len(conflicts) != 1 {
		t.Fatalf("Expected 1 conflict, got %d", len(conflicts))
	}
}

func TestStore_DetectConflicts_SameDroidNoConflict(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("alice", "src/api/**", ReserveOptions{Exclusive: true})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	if len(conflicts) != 0 {
		t.Errorf("Same droid should not conflict, got %d conflicts", len(conflicts))
	}
}

func TestStore_DetectConflicts_NonExclusiveNoConflict(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: false})
	store.Reserve("bob", "src/**", ReserveOptions{Exclusive: false})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	if len(conflicts) != 0 {
		t.Errorf("Non-exclusive should not conflict, got %d conflicts", len(conflicts))
	}
}

func TestStore_DetectConflicts_MixedExclusivity(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("bob", "src/**", ReserveOptions{Exclusive: false})

	conflicts, err := store.DetectConflicts()
	if err != nil {
		t.Fatalf("DetectConflicts failed: %v", err)
	}

	// Only conflicts when BOTH are exclusive
	if len(conflicts) != 0 {
		t.Errorf("Mixed exclusivity should not conflict, got %d conflicts", len(conflicts))
	}
}

func TestStore_GetConflictsForDroid(t *testing.T) {
	store := setupTestStore(t)

	store.Reserve("alice", "src/**", ReserveOptions{Exclusive: true})
	store.Reserve("bob", "src/**", ReserveOptions{Exclusive: true, Force: true})
	store.Reserve("charlie", "tests/**", ReserveOptions{Exclusive: true})
	store.Reserve("david", "tests/**", ReserveOptions{Exclusive: true, Force: true})

	// Alice's conflicts
	aliceConflicts, _ := store.GetConflictsForDroid("alice")
	if len(aliceConflicts) != 1 {
		t.Errorf("Alice should have 1 conflict, got %d", len(aliceConflicts))
	}

	// Charlie's conflicts
	charlieConflicts, _ := store.GetConflictsForDroid("charlie")
	if len(charlieConflicts) != 1 {
		t.Errorf("Charlie should have 1 conflict, got %d", len(charlieConflicts))
	}

	// Eve has no conflicts
	eveConflicts, _ := store.GetConflictsForDroid("eve")
	if len(eveConflicts) != 0 {
		t.Errorf("Eve should have 0 conflicts, got %d", len(eveConflicts))
	}
}

func TestSuggestResolutions(t *testing.T) {
	now := time.Now()
	conflict := ConflictInfo{
		ReservationA: Reservation{
			ID:        "qr-001",
			Droid:     "alice",
			Pattern:   "src/**",
			CreatedAt: now,
			ExpiresAt: now.Add(2 * time.Hour),
			Exclusive: true,
		},
		ReservationB: Reservation{
			ID:        "qr-002",
			Droid:     "bob",
			Pattern:   "src/**",
			CreatedAt: now.Add(time.Minute), // Bob reserved later
			ExpiresAt: now.Add(2 * time.Hour),
			Exclusive: true,
		},
		OverlapType: "exact",
	}

	resolutions := SuggestResolutions(conflict)

	if len(resolutions) < 3 {
		t.Fatalf("Expected at least 3 resolutions, got %d", len(resolutions))
	}

	// Check that we have the expected resolution types
	actions := make(map[string]bool)
	for _, r := range resolutions {
		actions[r.Action] = true
	}

	if !actions["wait"] {
		t.Error("Expected 'wait' resolution")
	}
	if !actions["coordinate"] {
		t.Error("Expected 'coordinate' resolution")
	}
	if !actions["release"] {
		t.Error("Expected 'release' resolution")
	}
}

func TestDetermineWinnerLoser_ByTime(t *testing.T) {
	now := time.Now()
	earlier := Reservation{Droid: "alice", CreatedAt: now}
	later := Reservation{Droid: "bob", CreatedAt: now.Add(time.Minute)}

	winner, loser := determineWinnerLoser(earlier, later)
	if winner.Droid != "alice" {
		t.Errorf("Winner should be alice (earlier), got %s", winner.Droid)
	}
	if loser.Droid != "bob" {
		t.Errorf("Loser should be bob (later), got %s", loser.Droid)
	}
}

func TestDetermineWinnerLoser_SameTime(t *testing.T) {
	now := time.Now()
	a := Reservation{Droid: "alice", CreatedAt: now}
	b := Reservation{Droid: "bob", CreatedAt: now}

	winner, loser := determineWinnerLoser(a, b)
	// Lexically smaller wins
	if winner.Droid != "alice" {
		t.Errorf("Winner should be alice (lexically smaller), got %s", winner.Droid)
	}
	if loser.Droid != "bob" {
		t.Errorf("Loser should be bob, got %s", loser.Droid)
	}
}

func TestClassifyOverlap(t *testing.T) {
	tests := []struct {
		a, b     string
		expected string
	}{
		{"src/**", "src/**", "exact"},
		{"**", "src/**", "superset"}, // ** is more general than src/**
		{"src/**", "**", "subset"},   // src/** is more specific than **
		{"src/a/**", "src/b/**", "partial"}, // Neither contains the other
	}

	for _, tc := range tests {
		result := classifyOverlap(tc.a, tc.b)
		if result != tc.expected {
			t.Errorf("classifyOverlap(%q, %q) = %q, want %q", tc.a, tc.b, result, tc.expected)
		}
	}
}

func TestFormatWaitTime(t *testing.T) {
	tests := []struct {
		duration time.Duration
		contains string
	}{
		{-time.Hour, "expired"},
		{30 * time.Second, "< 1 minute"},
		{5 * time.Minute, "5m"},
		{90 * time.Minute, "1h30m"},
		{2 * time.Hour, "2h"},
	}

	for _, tc := range tests {
		result := formatWaitTime(tc.duration)
		if result != tc.contains && !containsString(result, tc.contains) {
			t.Errorf("formatWaitTime(%v) = %q, want to contain %q", tc.duration, result, tc.contains)
		}
	}
}

func containsString(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || findSubstring(s, substr))
}

func findSubstring(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
