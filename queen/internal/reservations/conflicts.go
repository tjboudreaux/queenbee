package reservations

import (
	"sort"
	"time"
)

// ConflictInfo provides detailed conflict information.
type ConflictInfo struct {
	ReservationA Reservation `json:"reservation_a"`
	ReservationB Reservation `json:"reservation_b"`
	OverlapType  string      `json:"overlap_type"` // "exact", "subset", "superset", "partial"
}

// Resolution represents a conflict resolution suggestion.
type Resolution struct {
	ConflictID  string `json:"conflict_id"`
	Action      string `json:"action"`      // "wait", "release", "coordinate", "alternative"
	Description string `json:"description"`
	Priority    int    `json:"priority"` // Lower is higher priority
}

// DetectConflicts finds all conflicting reservations in the store.
func (s *Store) DetectConflicts() ([]ConflictInfo, error) {
	active, err := s.GetActive("")
	if err != nil {
		return nil, err
	}

	var conflicts []ConflictInfo

	// Compare all pairs
	for i := 0; i < len(active); i++ {
		for j := i + 1; j < len(active); j++ {
			a, b := active[i], active[j]

			// Same droid doesn't conflict
			if a.Droid == b.Droid {
				continue
			}

			// Both must be exclusive for conflict
			if !a.Exclusive || !b.Exclusive {
				continue
			}

			// Check pattern overlap
			if PatternsOverlap(a.Pattern, b.Pattern) {
				conflicts = append(conflicts, ConflictInfo{
					ReservationA: a,
					ReservationB: b,
					OverlapType:  classifyOverlap(a.Pattern, b.Pattern),
				})
			}
		}
	}

	return conflicts, nil
}

// SuggestResolutions provides resolution options for a conflict.
func SuggestResolutions(conflict ConflictInfo) []Resolution {
	a, b := conflict.ReservationA, conflict.ReservationB

	// Determine which reservation has priority
	// Earlier reservation wins, or if same time, lexically smaller droid
	var winner, loser Reservation
	if a.CreatedAt.Before(b.CreatedAt) {
		winner, loser = a, b
	} else if b.CreatedAt.Before(a.CreatedAt) {
		winner, loser = b, a
	} else if a.Droid < b.Droid {
		winner, loser = a, b
	} else {
		winner, loser = b, a
	}

	timeUntilExpiry := time.Until(winner.ExpiresAt)
	waitTime := formatWaitTime(timeUntilExpiry)

	resolutions := []Resolution{
		{
			Action:      "wait",
			Description: "Wait for " + winner.Droid + "'s reservation to expire (" + waitTime + ")",
			Priority:    1,
		},
		{
			Action:      "coordinate",
			Description: "Coordinate with " + winner.Droid + " to merge changes",
			Priority:    2,
		},
		{
			Action:      "release",
			Description: loser.Droid + " releases their reservation on " + loser.Pattern,
			Priority:    3,
		},
	}

	// Suggest alternative patterns if possible
	if alt := suggestAlternative(loser.Pattern, winner.Pattern); alt != "" {
		resolutions = append(resolutions, Resolution{
			Action:      "alternative",
			Description: "Work on non-overlapping pattern: " + alt,
			Priority:    0, // Best option if available
		})
	}

	// Sort by priority
	sort.Slice(resolutions, func(i, j int) bool {
		return resolutions[i].Priority < resolutions[j].Priority
	})

	return resolutions
}

// ResolveConflict applies a resolution to a conflict.
func (s *Store) ResolveConflict(conflict ConflictInfo, resolution Resolution) error {
	switch resolution.Action {
	case "release":
		// Release the loser's reservation
		_, loser := determineWinnerLoser(conflict.ReservationA, conflict.ReservationB)
		return s.Release(loser.ID)

	case "wait", "coordinate", "alternative":
		// These don't modify reservations directly
		return nil

	default:
		return nil
	}
}

// GetConflictsForDroid returns conflicts involving a specific droid.
func (s *Store) GetConflictsForDroid(droid string) ([]ConflictInfo, error) {
	all, err := s.DetectConflicts()
	if err != nil {
		return nil, err
	}

	var result []ConflictInfo
	for _, c := range all {
		if c.ReservationA.Droid == droid || c.ReservationB.Droid == droid {
			result = append(result, c)
		}
	}

	return result, nil
}

// classifyOverlap determines the type of pattern overlap.
func classifyOverlap(a, b string) string {
	if a == b {
		return "exact"
	}

	aMatchesB := pathMatchesPattern(b, a)
	bMatchesA := pathMatchesPattern(a, b)

	if aMatchesB && !bMatchesA {
		return "superset" // a is more general
	}
	if bMatchesA && !aMatchesB {
		return "subset" // b is more general
	}

	return "partial"
}

// suggestAlternative suggests a non-overlapping pattern.
func suggestAlternative(pattern, conflictingPattern string) string {
	// Simple heuristic: if pattern is a glob, suggest a more specific path
	if len(pattern) > 2 && pattern[len(pattern)-2:] == "**" {
		// e.g., "src/**" conflicts with "src/api/**"
		// suggest working on different subdirectory
		return ""
	}

	// Can't automatically suggest alternatives
	return ""
}

// formatWaitTime formats a duration for display.
func formatWaitTime(d time.Duration) string {
	if d < 0 {
		return "expired"
	}
	if d < time.Minute {
		return "< 1 minute"
	}
	if d < time.Hour {
		return d.Round(time.Minute).String()
	}
	return d.Round(time.Minute).String()
}

// determineWinnerLoser determines which reservation has priority.
func determineWinnerLoser(a, b Reservation) (winner, loser Reservation) {
	if a.CreatedAt.Before(b.CreatedAt) {
		return a, b
	}
	if b.CreatedAt.Before(a.CreatedAt) {
		return b, a
	}
	if a.Droid < b.Droid {
		return a, b
	}
	return b, a
}

// determineWinner returns just the winner.
func determineWinner(a, b Reservation) Reservation {
	winner, _ := determineWinnerLoser(a, b)
	return winner
}
