# Backend Engineer Plan: JSONL Storage Design

## Overview

This document covers the storage layer for QueenBee - a pure JSONL, git-backed persistence system with no external databases.

## Storage Philosophy

### Why JSONL?
1. **Git-native** - Line-based diffs, easy merges
2. **Append-only** - No complex write-ahead logs
3. **Human-readable** - Debug with cat/grep/jq
4. **Beads-compatible** - Same pattern as issues.jsonl

### Why NOT SQLite?
- Beads uses SQLite with JSONL sync - dual persistence causes issues
- SQLite binary files cause git merge conflicts
- HTTP daemon required for multi-process access
- QueenBee wants CLI-first, git-only persistence

## File Layout

```
.beads/
├── issues.jsonl              # Standard Beads (read-only for queen)
├── queen_messages.jsonl      # Inter-agent messages
├── queen_assignments.jsonl   # Task assignments
└── queen_reservations.jsonl  # File reservations
```

All files share the `.beads/` directory, which is:
- Symlinked in git worktrees to a common location
- Tracked in git (but with `.gitignore` for temp files)

## Schema Definitions

### Messages Schema
```typescript
// queen_messages.jsonl - one JSON object per line
interface Message {
  // Identity
  id: string;           // "qm-<ULID>" e.g., "qm-01HZ1A2B3C..."
  
  // Timestamps
  created_at: string;   // ISO 8601 UTC
  
  // Routing
  from: string;         // Droid name
  to: string;           // Droid name
  
  // Content
  subject: string;      // Brief subject (≤100 chars)
  body: string;         // Markdown body
  
  // Threading
  issue_id?: string;    // Related beads issue "qb-xxx"
  reply_to?: string;    // Parent message ID
  thread_id?: string;   // Thread root (issue_id or first msg ID)
  
  // Metadata
  importance: "low" | "normal" | "high" | "urgent";
  read: boolean;
  read_at?: string;     // ISO 8601 when marked read
  deleted?: boolean;    // Soft delete
}
```

### Assignments Schema
```typescript
// queen_assignments.jsonl
interface Assignment {
  // Identity
  id: string;           // "qa-<ULID>"
  
  // Timestamps
  created_at: string;
  updated_at: string;
  
  // Relationship
  issue_id: string;     // Beads issue ID
  droid: string;        // Assigned droid name
  
  // Metadata
  assigned_by: string;  // "queen", "human", or droid name
  status: "active" | "completed" | "released" | "reassigned";
  worktree?: string;    // Git worktree name
  reason?: string;      // Why assigned/released
  previous_droid?: string; // For reassignment tracking
}
```

### Reservations Schema
```typescript
// queen_reservations.jsonl
interface Reservation {
  // Identity
  id: string;           // "qr-<ULID>"
  
  // Timestamps
  created_at: string;
  expires_at: string;   // TTL expiration
  released_at?: string; // Explicit release
  
  // Scope
  pattern: string;      // Glob pattern
  
  // Owner
  droid: string;        // Reserving droid
  issue_id?: string;    // Related issue
  
  // State
  status: "active" | "expired" | "released";
  exclusive: boolean;   // Block other exclusive reservations
  reason?: string;
}

// Conflict represents a reservation conflict
interface Conflict {
  pattern: string;
  droid: string;
  issue_id?: string;
  expires_at: string;
}
```

### Conflict Error Type
```go
// ConflictError is returned when reserve fails due to conflicts
type ConflictError struct {
    Conflicts []Conflict
}

func (e *ConflictError) Error() string {
    var patterns []string
    for _, c := range e.Conflicts {
        patterns = append(patterns, fmt.Sprintf("%s (held by %s)", c.Pattern, c.Droid))
    }
    return fmt.Sprintf("reservation conflict: %s\nUse --force to override or --notify to message holders", 
        strings.Join(patterns, ", "))
}

// Exit code 5 for conflict errors
func (e *ConflictError) ExitCode() int {
    return 5
}
```

## ID Generation

```go
// internal/store/id.go
import (
    "sync"
    "time"
    "github.com/oklog/ulid/v2"
    "crypto/rand"
)

var (
    idMu      sync.Mutex
    entropy   = ulid.Monotonic(rand.Reader, 0)
)

func NewMessageID() string {
    return "qm-" + generateULID()
}

func NewAssignmentID() string {
    return "qa-" + generateULID()
}

func NewReservationID() string {
    return "qr-" + generateULID()
}

func generateULID() string {
    idMu.Lock()
    defer idMu.Unlock()
    return ulid.MustNew(ulid.Timestamp(time.Now()), entropy).String()
}
```

## Append-Only Store

```go
// internal/store/jsonl.go
type JSONLStore[T any] struct {
    path string
    mu   sync.RWMutex
}

func NewJSONLStore[T any](path string) *JSONLStore[T] {
    return &JSONLStore[T]{path: path}
}

// Append writes a new record (create or update)
func (s *JSONLStore[T]) Append(record T) error {
    s.mu.Lock()
    defer s.mu.Unlock()
    
    f, err := os.OpenFile(s.path, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
    if err != nil {
        return fmt.Errorf("open file: %w", err)
    }
    defer f.Close()
    
    data, err := json.Marshal(record)
    if err != nil {
        return fmt.Errorf("marshal: %w", err)
    }
    
    if _, err := f.Write(append(data, '\n')); err != nil {
        return fmt.Errorf("write: %w", err)
    }
    
    return nil
}

// ReadAll reads all records from the file
func (s *JSONLStore[T]) ReadAll() ([]T, error) {
    s.mu.RLock()
    defer s.mu.RUnlock()
    
    f, err := os.Open(s.path)
    if err != nil {
        if os.IsNotExist(err) {
            return nil, nil
        }
        return nil, fmt.Errorf("open: %w", err)
    }
    defer f.Close()
    
    var records []T
    scanner := bufio.NewScanner(f)
    lineNum := 0
    for scanner.Scan() {
        lineNum++
        line := scanner.Bytes()
        if len(line) == 0 {
            continue
        }
        
        var record T
        if err := json.Unmarshal(line, &record); err != nil {
            // Log warning but continue - don't fail on corrupt lines
            log.Printf("WARN: line %d parse error: %v", lineNum, err)
            continue
        }
        records = append(records, record)
    }
    
    return records, scanner.Err()
}

// GetLatest returns the latest version of a record by ID
// Since we use append-only, later records override earlier ones
func (s *JSONLStore[T]) GetLatest(records []T, getID func(T) string, targetID string) *T {
    var latest *T
    for i := range records {
        if getID(records[i]) == targetID {
            latest = &records[i]
        }
    }
    return latest
}
```

## Domain-Specific Stores

### Message Store
```go
// internal/messages/store.go
type MessageStore struct {
    store *store.JSONLStore[Message]
}

func NewMessageStore(beadsDir string) *MessageStore {
    return &MessageStore{
        store: store.NewJSONLStore[Message](
            filepath.Join(beadsDir, "queen_messages.jsonl"),
        ),
    }
}

func (s *MessageStore) Send(msg *Message) error {
    msg.ID = store.NewMessageID()
    msg.CreatedAt = time.Now().UTC()
    msg.Read = false
    
    // Set thread_id from issue_id or reply chain
    if msg.IssueID != "" && msg.ThreadID == "" {
        msg.ThreadID = msg.IssueID
    } else if msg.ReplyTo != "" && msg.ThreadID == "" {
        // Find parent and inherit thread
        parent, _ := s.GetByID(msg.ReplyTo)
        if parent != nil {
            msg.ThreadID = parent.ThreadID
        }
    }
    
    return s.store.Append(*msg)
}

func (s *MessageStore) MarkRead(id string) error {
    msg, err := s.GetByID(id)
    if err != nil {
        return err
    }
    if msg == nil {
        return fmt.Errorf("message not found: %s", id)
    }
    
    now := time.Now().UTC()
    update := *msg
    update.Read = true
    update.ReadAt = &now
    
    return s.store.Append(update)
}

func (s *MessageStore) GetInbox(droid string, opts InboxOptions) ([]Message, error) {
    all, err := s.store.ReadAll()
    if err != nil {
        return nil, err
    }
    
    // Build latest-state map
    latest := make(map[string]*Message)
    for i := range all {
        latest[all[i].ID] = &all[i]
    }
    
    // Filter for inbox
    var inbox []Message
    for _, msg := range latest {
        if msg.Deleted {
            continue
        }
        if msg.To != droid {
            continue
        }
        if opts.UnreadOnly && msg.Read {
            continue
        }
        if opts.Since != nil && msg.CreatedAt.Before(*opts.Since) {
            continue
        }
        inbox = append(inbox, *msg)
    }
    
    // Sort by created_at descending
    sort.Slice(inbox, func(i, j int) bool {
        return inbox[i].CreatedAt.After(inbox[j].CreatedAt)
    })
    
    return inbox, nil
}

func (s *MessageStore) GetThread(issueID string) ([]Message, error) {
    all, err := s.store.ReadAll()
    if err != nil {
        return nil, err
    }
    
    // Build latest-state map
    latest := make(map[string]*Message)
    for i := range all {
        latest[all[i].ID] = &all[i]
    }
    
    // Filter by thread_id (which is issue_id for issue-based threads)
    var thread []Message
    for _, msg := range latest {
        if msg.Deleted {
            continue
        }
        if msg.ThreadID == issueID || msg.IssueID == issueID {
            thread = append(thread, *msg)
        }
    }
    
    // Sort by created_at ascending (chronological)
    sort.Slice(thread, func(i, j int) bool {
        return thread[i].CreatedAt.Before(thread[j].CreatedAt)
    })
    
    return thread, nil
}
```

### Assignment Store
```go
// internal/assignments/store.go
type AssignmentStore struct {
    store *store.JSONLStore[Assignment]
}

func NewAssignmentStore(beadsDir string) *AssignmentStore {
    return &AssignmentStore{
        store: store.NewJSONLStore[Assignment](
            filepath.Join(beadsDir, "queen_assignments.jsonl"),
        ),
    }
}

func (s *AssignmentStore) Assign(issueID, droid, assignedBy string, opts AssignOptions) error {
    // Check for existing active assignment
    existing, err := s.GetActiveForIssue(issueID)
    if err != nil {
        return err
    }
    if existing != nil {
        return fmt.Errorf("issue %s already assigned to %s", issueID, existing.Droid)
    }
    
    now := time.Now().UTC()
    assignment := Assignment{
        ID:         store.NewAssignmentID(),
        CreatedAt:  now,
        UpdatedAt:  now,
        IssueID:    issueID,
        Droid:      droid,
        AssignedBy: assignedBy,
        Status:     "active",
        Worktree:   opts.Worktree,
        Reason:     opts.Reason,
    }
    
    return s.store.Append(assignment)
}

func (s *AssignmentStore) Release(issueID, droid, reason string) error {
    existing, err := s.GetActiveForIssue(issueID)
    if err != nil {
        return err
    }
    if existing == nil {
        return fmt.Errorf("no active assignment for issue %s", issueID)
    }
    if existing.Droid != droid {
        return fmt.Errorf("issue %s assigned to %s, not %s", issueID, existing.Droid, droid)
    }
    
    update := *existing
    update.UpdatedAt = time.Now().UTC()
    update.Status = "released"
    update.Reason = reason
    
    return s.store.Append(update)
}

func (s *AssignmentStore) GetActiveForIssue(issueID string) (*Assignment, error) {
    all, err := s.store.ReadAll()
    if err != nil {
        return nil, err
    }
    
    // Build latest-state map by ID
    latest := make(map[string]*Assignment)
    for i := range all {
        latest[all[i].ID] = &all[i]
    }
    
    // Find active assignment for this issue
    for _, a := range latest {
        if a.IssueID == issueID && a.Status == "active" {
            return a, nil
        }
    }
    
    return nil, nil
}

func (s *AssignmentStore) GetActiveForDroid(droid string) ([]Assignment, error) {
    all, err := s.store.ReadAll()
    if err != nil {
        return nil, err
    }
    
    // Build latest-state map
    latest := make(map[string]*Assignment)
    for i := range all {
        latest[all[i].ID] = &all[i]
    }
    
    var active []Assignment
    for _, a := range latest {
        if a.Droid == droid && a.Status == "active" {
            active = append(active, *a)
        }
    }
    
    return active, nil
}
```

### Reservation Store
```go
// internal/reservations/store.go
type ReservationStore struct {
    store *store.JSONLStore[Reservation]
}

func NewReservationStore(beadsDir string) *ReservationStore {
    return &ReservationStore{
        store: store.NewJSONLStore[Reservation](
            filepath.Join(beadsDir, "queen_reservations.jsonl"),
        ),
    }
}

type ReserveOptions struct {
    IssueID   string
    TTL       time.Duration
    Exclusive bool
    Reason    string
    Force     bool   // Override conflicts
    Notify    bool   // Auto-message conflict holders
}

func (s *ReservationStore) Reserve(pattern, droid string, opts ReserveOptions) (*Reservation, []Conflict, error) {
    // Check for conflicts with existing active reservations
    active, err := s.GetActive()
    if err != nil {
        return nil, nil, err
    }
    
    var conflicts []Conflict
    for _, existing := range active {
        if existing.Droid == droid {
            continue // Can't conflict with yourself
        }
        if !existing.Exclusive && !opts.Exclusive {
            continue // Non-exclusive don't conflict
        }
        if PatternsOverlap(pattern, existing.Pattern) {
            conflicts = append(conflicts, Conflict{
                Pattern:   existing.Pattern,
                Droid:     existing.Droid,
                IssueID:   existing.IssueID,
                ExpiresAt: existing.ExpiresAt,
            })
        }
    }
    
    // FAIL BY DEFAULT on exclusive conflicts unless --force
    if len(conflicts) > 0 && opts.Exclusive && !opts.Force {
        return nil, conflicts, &ConflictError{Conflicts: conflicts}
    }
    
    now := time.Now().UTC()
    ttl := opts.TTL
    if ttl == 0 {
        ttl = 2 * time.Hour // Default TTL
    }
    
    reservation := &Reservation{
        ID:        store.NewReservationID(),
        CreatedAt: now,
        ExpiresAt: now.Add(ttl),
        Pattern:   pattern,
        Droid:     droid,
        IssueID:   opts.IssueID,
        Status:    "active",
        Exclusive: opts.Exclusive,
        Reason:    opts.Reason,
    }
    
    if err := s.store.Append(*reservation); err != nil {
        return nil, nil, err
    }
    
    return reservation, conflicts, nil
}

func (s *ReservationStore) Release(pattern, droid string) error {
    active, err := s.GetActiveForDroid(droid)
    if err != nil {
        return err
    }
    
    now := time.Now().UTC()
    released := 0
    
    for _, r := range active {
        if r.Pattern == pattern || PatternsOverlap(pattern, r.Pattern) {
            update := r
            update.Status = "released"
            update.ReleasedAt = &now
            if err := s.store.Append(update); err != nil {
                return err
            }
            released++
        }
    }
    
    if released == 0 {
        return fmt.Errorf("no matching reservations found for pattern %q", pattern)
    }
    
    return nil
}

func (s *ReservationStore) ReleaseAll(droid string) (int, error) {
    active, err := s.GetActiveForDroid(droid)
    if err != nil {
        return 0, err
    }
    
    now := time.Now().UTC()
    for _, r := range active {
        update := r
        update.Status = "released"
        update.ReleasedAt = &now
        if err := s.store.Append(update); err != nil {
            return 0, err
        }
    }
    
    return len(active), nil
}

func (s *ReservationStore) GetActive() ([]Reservation, error) {
    all, err := s.store.ReadAll()
    if err != nil {
        return nil, err
    }
    
    now := time.Now().UTC()
    latest := make(map[string]*Reservation)
    for i := range all {
        latest[all[i].ID] = &all[i]
    }
    
    var active []Reservation
    for _, r := range latest {
        if r.Status == "released" {
            continue
        }
        if r.ExpiresAt.Before(now) {
            continue // Expired
        }
        active = append(active, *r)
    }
    
    return active, nil
}
```

## Glob Pattern Matching

```go
// internal/reservations/matcher.go
import "github.com/bmatcuk/doublestar/v4"

// PatternsOverlap checks if two glob patterns could match the same file
// This is symmetric: Overlap(a,b) == Overlap(b,a)
func PatternsOverlap(a, b string) bool {
    // Exact match
    if a == b {
        return true
    }
    
    // Check if either pattern matches the other as a path
    if matches, _ := doublestar.Match(a, b); matches {
        return true
    }
    if matches, _ := doublestar.Match(b, a); matches {
        return true
    }
    
    // Check common prefixes for directory patterns
    // e.g., "src/components/**" overlaps with "src/components/Button/**"
    aBase := extractBase(a)
    bBase := extractBase(b)
    
    if strings.HasPrefix(aBase, bBase) || strings.HasPrefix(bBase, aBase) {
        return true
    }
    
    return false
}

func extractBase(pattern string) string {
    // Remove glob wildcards to get base path
    idx := strings.IndexAny(pattern, "*?[")
    if idx == -1 {
        return pattern
    }
    return pattern[:idx]
}

// CheckPath checks if a specific path is reserved
func (s *ReservationStore) CheckPath(path string) (*Reservation, error) {
    active, err := s.GetActive()
    if err != nil {
        return nil, err
    }
    
    for _, r := range active {
        if matched, _ := doublestar.Match(r.Pattern, path); matched {
            return &r, nil
        }
    }
    
    return nil, nil
}
```

## Beads Integration

```go
// internal/beads/integration.go
import (
    "encoding/json"
    "os"
    "path/filepath"
)

type BeadsIssue struct {
    ID          string `json:"id"`
    Title       string `json:"title"`
    Status      string `json:"status"`
    Priority    int    `json:"priority"`
    IssueType   string `json:"issue_type"`
}

// ReadIssues reads all issues from beads JSONL file
func ReadIssues(beadsDir string) ([]BeadsIssue, error) {
    // Try issues.jsonl first (new canonical name), then beads.jsonl (legacy)
    jsonlPath := filepath.Join(beadsDir, "issues.jsonl")
    if _, err := os.Stat(jsonlPath); os.IsNotExist(err) {
        jsonlPath = filepath.Join(beadsDir, "beads.jsonl")
    }
    
    f, err := os.Open(jsonlPath)
    if err != nil {
        if os.IsNotExist(err) {
            return nil, nil
        }
        return nil, err
    }
    defer f.Close()
    
    var issues []BeadsIssue
    scanner := bufio.NewScanner(f)
    for scanner.Scan() {
        var issue BeadsIssue
        if err := json.Unmarshal(scanner.Bytes(), &issue); err != nil {
            continue
        }
        issues = append(issues, issue)
    }
    
    return issues, scanner.Err()
}

// ValidateIssueExists checks if an issue ID exists in beads
func ValidateIssueExists(beadsDir, issueID string) error {
    issues, err := ReadIssues(beadsDir)
    if err != nil {
        return fmt.Errorf("failed to read issues: %w", err)
    }
    
    for _, issue := range issues {
        if issue.ID == issueID {
            return nil
        }
    }
    
    return fmt.Errorf("issue not found: %s", issueID)
}
```

## Path Discovery

```go
// internal/beads/paths.go
func FindBeadsDir() (string, error) {
    // 1. Check --beads-dir flag (passed via context)
    // 2. Check BEADS_DIR environment variable
    // 3. Walk up from current directory looking for .beads/
    
    if dir := os.Getenv("BEADS_DIR"); dir != "" {
        return dir, nil
    }
    
    cwd, err := os.Getwd()
    if err != nil {
        return "", err
    }
    
    dir := cwd
    for {
        beadsPath := filepath.Join(dir, ".beads")
        if info, err := os.Stat(beadsPath); err == nil && info.IsDir() {
            return beadsPath, nil
        }
        
        parent := filepath.Dir(dir)
        if parent == dir {
            break // Reached root
        }
        dir = parent
    }
    
    return "", fmt.Errorf(".beads directory not found (run 'bd init' first)")
}

func FindFactoryDir(beadsDir string) string {
    // .factory/ is typically at the repo root, same level as .beads/
    repoRoot := filepath.Dir(beadsDir)
    return filepath.Join(repoRoot, ".factory")
}
```

## Performance Considerations

### File Size Growth
- **Messages**: ~500 bytes/message, 1000 messages = 500KB
- **Assignments**: ~300 bytes/assignment, 500 assignments = 150KB  
- **Reservations**: ~400 bytes/reservation, 200 reservations = 80KB

For most projects, files stay under 1MB. At 10MB, consider:
- Compaction (remove old updates, keep only latest)
- Archival (move old messages to archive file)

### P2 Storage Maintenance Commands

```go
// queen compact - Rewrite JSONL keeping only latest state per record
func Compact(beadsDir string) error {
    for _, file := range []string{"queen_messages.jsonl", "queen_assignments.jsonl", "queen_reservations.jsonl"} {
        path := filepath.Join(beadsDir, file)
        // 1. Read all records
        // 2. Build latest-state map by ID
        // 3. Write new file with only latest records
        // 4. Atomic rename
    }
    return nil
}

// queen archive --before=<date> - Move old messages to archive
func ArchiveMessages(beadsDir string, before time.Time) error {
    // 1. Read all messages
    // 2. Split into keep (after date) and archive (before date)
    // 3. Append to queen_messages_archive.jsonl
    // 4. Rewrite queen_messages.jsonl with only kept messages
    return nil
}
```

### Read Performance
- Full file scan on every read (acceptable for <10MB)
- In-memory index if needed (rebuild on file change)
- File locking via mutex (process-level only)

### Write Performance
- Append-only, single write per operation
- No read-modify-write cycles
- Concurrent writes safe (OS-level append atomicity)

## Testing Strategy

### Unit Tests
| Module | Test Cases | Coverage Target |
|--------|------------|-----------------|
| `store/jsonl.go` | Append, ReadAll, GetLatest | 95% |
| `messages/store.go` | CRUD, inbox filtering, threading | 90% |
| `assignments/store.go` | CRUD, uniqueness, status transitions | 90% |
| `reservations/store.go` | CRUD, TTL expiration, conflict detection | 90% |
| `reservations/matcher.go` | Overlap detection, edge cases | 95% |

### Integration Tests
| Scenario | Validation |
|----------|------------|
| Concurrent appends | No data loss or corruption |
| Large files (1MB+) | Acceptable read latency (<100ms) |
| Cross-worktree access | Same data visible |
| File doesn't exist | Graceful creation |
