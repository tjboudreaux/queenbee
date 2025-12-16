package reservations

import (
	"path/filepath"
	"strings"
	"time"

	"github.com/bmatcuk/doublestar/v4"

	"github.com/tjboudreaux/queenbee/queen/internal/store"
)

// DefaultTTL is the default reservation duration.
const DefaultTTL = 2 * time.Hour

// Store manages reservation persistence.
type Store struct {
	jsonl *store.JSONLStore[Reservation]
}

// NewStore creates a new reservation store.
func NewStore(beadsDir string) *Store {
	path := filepath.Join(beadsDir, "queen_reservations.jsonl")
	return &Store{jsonl: store.NewJSONLStore[Reservation](path)}
}

// Reserve creates a new file reservation.
func (s *Store) Reserve(droid, pattern string, opts ReserveOptions) (*Reservation, []Conflict, error) {
	now := time.Now().UTC()

	ttl := opts.TTL
	if ttl == 0 {
		ttl = DefaultTTL
	}

	// Check for conflicts with active exclusive reservations
	conflicts, err := s.checkConflicts(pattern, droid, opts.Exclusive)
	if err != nil {
		return nil, nil, err
	}
	if len(conflicts) > 0 && !opts.Force {
		return nil, conflicts, nil
	}

	res := Reservation{
		ID:        store.NewReservationID(),
		CreatedAt: now,
		ExpiresAt: now.Add(ttl),
		Pattern:   pattern,
		Agent:     droid,
		IssueID:   opts.IssueID,
		Status:    StatusActive,
		Exclusive: opts.Exclusive,
		Reason:    opts.Reason,
	}

	if err := s.jsonl.Append(res); err != nil {
		return nil, nil, err
	}

	return &res, nil, nil
}

// ReserveOptions configures a new reservation.
type ReserveOptions struct {
	IssueID   string
	TTL       time.Duration
	Exclusive bool
	Reason    string
	Force     bool // Override conflicts
}

// Release releases a specific reservation.
func (s *Store) Release(id string) error {
	res, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if res.Status != StatusActive {
		return nil // Already released or expired
	}

	now := time.Now().UTC()
	res.Status = StatusReleased
	res.ReleasedAt = &now

	return s.jsonl.Append(*res)
}

// ReleaseAll releases all active reservations for a droid.
func (s *Store) ReleaseAll(droid string) (int, error) {
	active, err := s.GetActive(droid)
	if err != nil {
		return 0, err
	}

	now := time.Now().UTC()
	count := 0
	for _, res := range active {
		res.Status = StatusReleased
		res.ReleasedAt = &now
		if err := s.jsonl.Append(res); err != nil {
			return count, err
		}
		count++
	}

	return count, nil
}

// ReleasePattern releases reservations matching a pattern for a droid.
func (s *Store) ReleasePattern(droid, pattern string) (int, error) {
	active, err := s.GetActive(droid)
	if err != nil {
		return 0, err
	}

	now := time.Now().UTC()
	count := 0
	for _, res := range active {
		if res.Pattern == pattern {
			res.Status = StatusReleased
			res.ReleasedAt = &now
			if err := s.jsonl.Append(res); err != nil {
				return count, err
			}
			count++
		}
	}

	return count, nil
}

// GetByID retrieves a reservation by ID.
func (s *Store) GetByID(id string) (*Reservation, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	// Find the latest version (last entry wins)
	var res *Reservation
	for i := range all {
		if all[i].ID == id {
			r := all[i]
			res = &r
		}
	}

	if res == nil {
		return nil, &NotFoundError{ID: id}
	}

	// Update status if expired
	if res.Status == StatusActive && time.Now().After(res.ExpiresAt) {
		res.Status = StatusExpired
	}

	return res, nil
}

// GetActive returns all active reservations, optionally filtered by droid.
func (s *Store) GetActive(droid string) ([]Reservation, error) {
	all, err := s.jsonl.ReadAll()
	if err != nil {
		return nil, err
	}

	now := time.Now().UTC()

	// Merge by ID (last entry wins)
	byID := make(map[string]*Reservation)
	for i := range all {
		r := all[i]
		byID[r.ID] = &r
	}

	var result []Reservation
	for _, r := range byID {
		// Skip non-active
		if r.Status != StatusActive {
			continue
		}
		// Skip expired
		if now.After(r.ExpiresAt) {
			continue
		}
		// Filter by agent if specified
		if droid != "" {
			resAgent := r.Agent
			if resAgent == "" {
				resAgent = r.Droid // Backward compat
			}
			if resAgent != droid {
				continue
			}
		}
		result = append(result, *r)
	}

	return result, nil
}

// CheckPath checks if a path is covered by any active reservation.
func (s *Store) CheckPath(path string) ([]Reservation, error) {
	active, err := s.GetActive("")
	if err != nil {
		return nil, err
	}

	var matching []Reservation
	for _, r := range active {
		if pathMatchesPattern(path, r.Pattern) {
			matching = append(matching, r)
		}
	}

	return matching, nil
}

// Renew extends a reservation's expiration time.
func (s *Store) Renew(id string, extension time.Duration) error {
	res, err := s.GetByID(id)
	if err != nil {
		return err
	}

	if res.Status != StatusActive {
		return &NotActiveError{ID: id}
	}

	now := time.Now().UTC()
	// Extend from whichever is later: now or current expiry
	base := res.ExpiresAt
	if now.After(base) {
		base = now
	}
	res.ExpiresAt = base.Add(extension)

	return s.jsonl.Append(*res)
}

// checkConflicts finds conflicting active reservations.
func (s *Store) checkConflicts(pattern, droid string, exclusive bool) ([]Conflict, error) {
	active, err := s.GetActive("")
	if err != nil {
		return nil, err
	}

	var conflicts []Conflict
	for _, r := range active {
		// Same agent doesn't conflict with itself
		resAgent := r.Agent
		if resAgent == "" {
			resAgent = r.Droid // Backward compat
		}
		if resAgent == droid {
			continue
		}
		// Only exclusive reservations can conflict
		if !r.Exclusive && !exclusive {
			continue
		}
		// Check if patterns overlap
		if PatternsOverlap(pattern, r.Pattern) {
			conflicts = append(conflicts, Conflict{
				Pattern:   r.Pattern,
				Agent:     resAgent,
				IssueID:   r.IssueID,
				ExpiresAt: r.ExpiresAt,
			})
		}
	}

	return conflicts, nil
}

// PatternsOverlap checks if two glob patterns could match the same path.
func PatternsOverlap(a, b string) bool {
	// Exact match
	if a == b {
		return true
	}

	// Try matching each pattern against the other
	// This handles cases like "src/*.go" and "src/main.go"
	//nolint:errcheck // Match only returns error on invalid pattern syntax
	if matchedA, _ := doublestar.Match(a, b); matchedA {
		return true
	}
	//nolint:errcheck // Match only returns error on invalid pattern syntax
	if matchedB, _ := doublestar.Match(b, a); matchedB {
		return true
	}

	// Check for directory overlap with ** patterns
	// e.g., "src/**" overlaps with "src/components/**"
	aBase := getPatternBase(a)
	bBase := getPatternBase(b)

	// Only consider overlap if one contains ** (recursive glob)
	aRecursive := strings.Contains(a, "**")
	bRecursive := strings.Contains(b, "**")

	if aRecursive || bRecursive {
		if strings.HasPrefix(aBase, bBase) || strings.HasPrefix(bBase, aBase) {
			return true
		}
	}

	return false
}

// pathMatchesPattern checks if a path matches a glob pattern.
func pathMatchesPattern(path, pattern string) bool {
	//nolint:errcheck // Match only returns error on invalid pattern syntax
	matched, _ := doublestar.Match(pattern, path)
	return matched
}

// getPatternBase extracts the non-wildcard prefix from a pattern.
func getPatternBase(pattern string) string {
	// Find the first wildcard character
	for i, c := range pattern {
		if c == '*' || c == '?' || c == '[' {
			if i == 0 {
				return ""
			}
			// Return up to the last separator before wildcard
			prefix := pattern[:i]
			if idx := strings.LastIndex(prefix, "/"); idx >= 0 {
				return prefix[:idx+1]
			}
			return prefix
		}
	}
	return pattern
}

// NotFoundError indicates a reservation was not found.
type NotFoundError struct {
	ID string
}

func (e *NotFoundError) Error() string {
	return "reservation not found: " + e.ID
}

// NotActiveError indicates a reservation is not active.
type NotActiveError struct {
	ID string
}

func (e *NotActiveError) Error() string {
	return "reservation not active: " + e.ID
}
