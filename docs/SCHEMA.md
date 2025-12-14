# QueenBee Schema Definitions

This document defines the JSONL schemas for QueenBee extensions to Beads.

## File Locations

All files live in `.beads/` directory (shared across worktrees):

```
.beads/
├── issues.jsonl              # Standard Beads (unchanged)
├── queen_messages.jsonl      # Inter-agent messages
├── queen_assignments.jsonl   # Task assignments
└── queen_reservations.jsonl  # File reservations
```

## Schema: Messages

**File:** `.beads/queen_messages.jsonl`

Messages enable inter-agent coordination. Each message is append-only.

### Message Record

```typescript
interface Message {
  // Identity
  id: string;           // Format: "qm-<ulid>" (e.g., "qm-01HZ...")
  
  // Timestamps
  created_at: string;   // ISO 8601 (e.g., "2024-12-14T10:30:00Z")
  
  // Routing
  from: string;         // Droid name (e.g., "ui-engineer", "queen")
  to: string;           // Droid name or "human"
  
  // Content
  subject: string;      // Brief subject line (≤100 chars recommended)
  body: string;         // Markdown body
  
  // Threading
  issue_id?: string;    // Related issue (e.g., "qb-42")
  reply_to?: string;    // Parent message ID (e.g., "qm-01HY...")
  thread_id?: string;   // Thread root ID (auto-set to first message)
  
  // Metadata
  importance: "low" | "normal" | "high" | "urgent";
  read: boolean;        // Has recipient read this?
  read_at?: string;     // When marked read
  
  // State (append new record to update)
  deleted?: boolean;    // Soft delete
}
```

### Example Messages

```jsonl
{"id":"qm-01HZ1A","created_at":"2024-12-14T10:30:00Z","from":"queen","to":"ui-engineer","subject":"[qb-42] Assigned: Button component","body":"You've been assigned...","issue_id":"qb-42","importance":"normal","read":false}
{"id":"qm-01HZ1B","created_at":"2024-12-14T10:35:00Z","from":"ui-engineer","to":"queen","subject":"[qb-42] Starting: Button component","body":"Claiming now...","issue_id":"qb-42","reply_to":"qm-01HZ1A","thread_id":"qm-01HZ1A","importance":"normal","read":false}
{"id":"qm-01HZ1A","created_at":"2024-12-14T10:36:00Z","from":"queen","to":"ui-engineer","read":true,"read_at":"2024-12-14T10:36:00Z"}
```

Note: Updates are appended with same ID. Latest record wins.

---

## Schema: Assignments

**File:** `.beads/queen_assignments.jsonl`

Assignments track which droid is working on which issue.

### Assignment Record

```typescript
interface Assignment {
  // Identity
  id: string;           // Format: "qa-<ulid>"
  
  // Timestamps
  created_at: string;   // When assigned
  updated_at: string;   // Last status change
  
  // Relationship
  issue_id: string;     // Beads issue ID (e.g., "qb-42")
  droid: string;        // Assigned droid (e.g., "ui-engineer")
  
  // Assignment metadata
  assigned_by: string;  // "queen" or "human" or droid name (self-claim)
  
  // Status
  status: "active" | "completed" | "released" | "reassigned";
  
  // Context
  worktree?: string;    // Which worktree (e.g., "feature-ui")
  reason?: string;      // Why assigned/released
  
  // For reassignment tracking
  previous_droid?: string;
}
```

### Assignment Lifecycle

```
Created (active) → Completed (completed)
                → Released (released)  
                → Reassigned (reassigned) → New assignment created
```

### Example Assignments

```jsonl
{"id":"qa-01HZ2A","created_at":"2024-12-14T10:30:00Z","updated_at":"2024-12-14T10:30:00Z","issue_id":"qb-42","droid":"ui-engineer","assigned_by":"queen","status":"active","worktree":"feature-ui"}
{"id":"qa-01HZ2A","created_at":"2024-12-14T10:30:00Z","updated_at":"2024-12-14T14:00:00Z","issue_id":"qb-42","droid":"ui-engineer","assigned_by":"queen","status":"completed","worktree":"feature-ui","reason":"Implementation complete"}
```

---

## Schema: Reservations

**File:** `.beads/queen_reservations.jsonl`

Reservations are advisory file locks to prevent edit conflicts.

### Reservation Record

```typescript
interface Reservation {
  // Identity
  id: string;           // Format: "qr-<ulid>"
  
  // Timestamps
  created_at: string;   // When reserved
  expires_at: string;   // TTL expiration
  released_at?: string; // When explicitly released
  
  // Scope
  pattern: string;      // Glob pattern (e.g., "src/components/Button/**")
  
  // Owner
  droid: string;        // Reserving droid
  issue_id?: string;    // Related issue
  
  // State
  status: "active" | "expired" | "released";
  
  // Type
  exclusive: boolean;   // If true, no other droid can reserve
  
  // Metadata
  reason?: string;      // Why reserving
}
```

### Reservation Rules

1. **Exclusive reservations** block other exclusive reservations on overlapping patterns
2. **Non-exclusive reservations** (read-only) can coexist
3. **Expiration** is automatic based on `expires_at`
4. **Release** is explicit via `released_at`

### Pattern Matching

Patterns use glob syntax:
- `src/components/Button.tsx` - Exact file
- `src/components/Button/**` - Directory and contents
- `src/**/*.test.ts` - All test files in src
- `*.md` - All markdown in root

Conflict detection uses symmetric matching:
```
matches(pattern_a, pattern_b) OR matches(pattern_b, pattern_a)
```

### Example Reservations

```jsonl
{"id":"qr-01HZ3A","created_at":"2024-12-14T10:30:00Z","expires_at":"2024-12-14T12:30:00Z","pattern":"src/components/Button/**","droid":"ui-engineer","issue_id":"qb-42","status":"active","exclusive":true,"reason":"Implementing Button component"}
{"id":"qr-01HZ3A","created_at":"2024-12-14T10:30:00Z","expires_at":"2024-12-14T12:30:00Z","released_at":"2024-12-14T11:45:00Z","pattern":"src/components/Button/**","droid":"ui-engineer","issue_id":"qb-42","status":"released","exclusive":true}
```

---

## ID Generation

All IDs use ULID (Universally Unique Lexicographically Sortable Identifier):

- **Prefix:** Type identifier (`qm-`, `qa-`, `qr-`)
- **Body:** 26-character ULID

Example: `qm-01HZ1A2B3C4D5E6F7G8H9J0K1L`

Benefits:
- Lexicographically sortable (time-ordered)
- URL-safe
- Case-insensitive
- 128-bit randomness

---

## Append-Only Semantics

All files use append-only semantics:

1. **Create:** Append new record
2. **Update:** Append record with same ID and updated fields
3. **Delete:** Append record with same ID and `deleted: true`

### Reading Latest State

To get current state of a record:

```go
func GetLatest(records []Record, id string) *Record {
    var latest *Record
    for _, r := range records {
        if r.ID == id {
            latest = &r
        }
    }
    return latest
}
```

### Why Append-Only?

1. **Git-friendly** - No conflicts on concurrent writes
2. **Auditable** - Full history preserved
3. **Simple** - No complex update logic
4. **Fast writes** - Just append, no read-modify-write

---

## Indexes (Optional)

For performance, implementations MAY maintain indexes:

```
.beads/
├── queen_messages.jsonl
├── queen_messages.idx.json    # Optional index
```

Index structure:
```typescript
interface MessageIndex {
  by_id: Record<string, number>;      // id → line number
  by_to: Record<string, string[]>;    // droid → message ids
  by_issue: Record<string, string[]>; // issue_id → message ids
  by_thread: Record<string, string[]>;// thread_id → message ids
}
```

Indexes are rebuilt from JSONL on startup and updated on writes.

---

## Cross-References

### Issue ↔ Messages

Messages reference issues via `issue_id`:

```jsonl
// queen_messages.jsonl
{"id":"qm-01HZ1A","issue_id":"qb-42",...}

// To find all messages for an issue:
grep '"issue_id":"qb-42"' .beads/queen_messages.jsonl
```

### Issue ↔ Assignments

Assignments reference issues via `issue_id`:

```jsonl
// queen_assignments.jsonl
{"id":"qa-01HZ2A","issue_id":"qb-42","droid":"ui-engineer",...}

// To find assignment for an issue:
grep '"issue_id":"qb-42"' .beads/queen_assignments.jsonl | tail -1
```

### Issue ↔ Reservations

Reservations optionally reference issues:

```jsonl
// queen_reservations.jsonl
{"id":"qr-01HZ3A","issue_id":"qb-42","pattern":"src/components/Button/**",...}
```

---

## Validation Rules

### Messages

- `id` must be unique (within append context)
- `from` must be valid droid name or "human"
- `to` must be valid droid name or "human"
- `reply_to` must reference existing message
- `thread_id` auto-set if `reply_to` exists

### Assignments

- `id` must be unique
- `issue_id` must exist in Beads
- `droid` must exist in `.factory/droids/`
- Only one `active` assignment per issue

### Reservations

- `id` must be unique
- `pattern` must be valid glob
- `expires_at` must be > `created_at`
- `droid` must exist in `.factory/droids/`

---

## Migration

When upgrading schemas:

1. Add new fields as optional
2. Append migration record:
   ```jsonl
   {"_migration":"v1_to_v2","at":"2024-12-14T10:00:00Z"}
   ```
3. New records use new schema
4. Old records remain valid (missing fields = default)

---

## CLI Mapping

| CLI Command | Schema | Operation |
|-------------|--------|-----------|
| `queen msg send` | Message | Create |
| `queen msg inbox` | Message | Read (filter by `to`) |
| `queen msg read` | Message | Update (`read: true`) |
| `queen msg reply` | Message | Create (with `reply_to`) |
| `queen assign` | Assignment | Create |
| `queen claim` | Assignment | Create (self-assign) |
| `queen release` | Assignment | Update (`status: released`) |
| `queen reserve` | Reservation | Create |
| `queen unreserve` | Reservation | Update (`status: released`) |
| `queen reserved` | Reservation | Read (filter active) |
