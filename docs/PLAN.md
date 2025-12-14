# QueenBee Implementation Plan

This document outlines the phased implementation roadmap for QueenBee.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 QueenBee                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐         │
│  │   queen CLI     │    │   queen droid   │    │    queenui      │         │
│  │   (Go binary)   │    │ (Factory droid) │    │   (TUI - Go)    │         │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘         │
│           │                      │                      │                   │
│           └──────────────────────┼──────────────────────┘                   │
│                                  │                                          │
│                                  ▼                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         .beads/ (shared)                              │  │
│  │  ├── issues.jsonl           # Standard Beads (unchanged)              │  │
│  │  ├── queen_messages.jsonl   # Inter-agent messages                    │  │
│  │  ├── queen_assignments.jsonl # Task assignments                       │  │
│  │  └── queen_reservations.jsonl # File locks                            │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Phase 0: Documentation (Current)

**Goal:** Comprehensive documentation before any code.

### Deliverables

- [x] `README.md` - Project overview, architecture, quick start
- [x] `AGENTS.md` - Agent coordination protocol
- [x] `docs/PLAN.md` - This implementation roadmap
- [ ] `docs/SCHEMA.md` - JSONL schema definitions
- [ ] `docs/COMPARISON.md` - QueenBee vs Agent Mail vs Claude Flow
- [ ] `.factory/droids/queen.md` - Queen droid definition

### Success Criteria

- Clear understanding of what we're building
- Documented decisions and trade-offs
- Schema definitions for all extensions

---

## Phase 1: Queen Extensions (Go Binary)

**Goal:** Extend `bd` CLI with messaging, assignments, and reservations.

### Approach

Two options:
1. **Fork Beads** - Modify beads source directly
2. **Companion Binary** - Separate `queen` CLI that reads/writes .beads/

**Chosen: Companion Binary** - Less maintenance burden, can upstream later.

### Components

#### 1.1 Message Storage

```go
// queen/messages.go

type Message struct {
    ID        string    `json:"id"`        // qm-<ulid>
    Timestamp time.Time `json:"ts"`
    From      string    `json:"from"`      // droid name
    To        string    `json:"to"`        // droid name or "queen"
    IssueID   string    `json:"issue_id"`  // qb-42 (optional)
    Subject   string    `json:"subject"`
    Body      string    `json:"body"`
    ReplyTo   string    `json:"reply_to"`  // qm-<ulid> (optional)
    Read      bool      `json:"read"`
}
```

**CLI Commands:**
```bash
queen msg send <to> "<message>" [--issue=<id>]
queen msg inbox [--unread] [--since=<duration>]
queen msg thread <issue-id>
queen msg reply <msg-id> "<message>"
queen msg read <msg-id>
```

#### 1.2 Assignment Tracking

```go
// queen/assignments.go

type Assignment struct {
    ID        string    `json:"id"`        // qa-<ulid>
    IssueID   string    `json:"issue_id"`  // qb-42
    Droid     string    `json:"droid"`     // ui-engineer
    AssignedBy string   `json:"assigned_by"` // queen or human
    AssignedAt time.Time `json:"assigned_at"`
    Status    string    `json:"status"`    // active, completed, released
    Worktree  string    `json:"worktree"`  // feature-ui (optional)
}
```

**CLI Commands:**
```bash
queen assign <issue-id> <droid> [--worktree=<name>]
queen claim <issue-id>           # Assign to self
queen release <issue-id>         # Release assignment
queen assignments [--droid=<name>] [--status=<status>]
```

#### 1.3 File Reservations

```go
// queen/reservations.go

type Reservation struct {
    ID        string    `json:"id"`        // qr-<ulid>
    Pattern   string    `json:"pattern"`   // src/components/Button/**
    Droid     string    `json:"droid"`     // ui-engineer
    IssueID   string    `json:"issue_id"`  // qb-42 (optional)
    CreatedAt time.Time `json:"created_at"`
    ExpiresAt time.Time `json:"expires_at"` // TTL-based expiry
    Released  bool      `json:"released"`
}
```

**CLI Commands:**
```bash
queen reserve <pattern...> [--issue=<id>] [--ttl=<duration>]
queen reserved [--droid=<name>] [--path=<pattern>]
queen unreserve <pattern...>
queen unreserve --all
```

### File Structure

```
queen/
├── cmd/
│   └── queen/
│       └── main.go           # CLI entry point
├── internal/
│   ├── messages/
│   │   ├── message.go        # Message type
│   │   ├── store.go          # JSONL storage
│   │   └── commands.go       # CLI handlers
│   ├── assignments/
│   │   ├── assignment.go
│   │   ├── store.go
│   │   └── commands.go
│   ├── reservations/
│   │   ├── reservation.go
│   │   ├── store.go
│   │   └── commands.go
│   └── beads/
│       └── integration.go    # Read beads issues
├── go.mod
└── go.sum
```

### Success Criteria

- [ ] `queen msg` commands work
- [ ] `queen assign/claim/release` commands work
- [ ] `queen reserve/unreserve` commands work
- [ ] All state persists to `.beads/queen_*.jsonl`
- [ ] Works across git worktrees (shared .beads/)
- [ ] Unit tests for all storage operations

---

## Phase 2: Queen Droid

**Goal:** Automated orchestration via Factory droid.

### Droid Definition

```yaml
# .factory/droids/queen.md
name: queen
model: claude-opus-4-5-20251101
description: |
  Orchestrates multi-agent work by decomposing epics, 
  assigning tasks, and resolving conflicts.

skills:
  - tools-beads-basics
  - tools-beads-workflow
  - thinking-systems
  - thinking-first-principles

autonomy: high

triggers:
  - new epic created
  - issue status changed
  - assignment conflict detected
  - escalation requested
```

### Queen Behaviors

#### 2.1 Epic Decomposition

When a new epic is created:

```
1. Analyze epic description and acceptance criteria
2. Identify distinct work items
3. Determine dependencies between items
4. Create child tasks with:
   - Clear titles
   - Acceptance criteria
   - Skill requirements (labels)
   - Dependency links
5. Estimate complexity (P1-P4)
```

#### 2.2 Task Assignment

When tasks become ready (no blockers):

```
1. Get list of ready tasks: `bd ready`
2. Get available droids from .factory/droids/
3. Match tasks to droids by:
   - Required skills vs droid capabilities
   - Current assignment count (balance load)
   - Worktree affinity (keep related work together)
4. Create assignments: `queen assign <id> <droid>`
5. Notify assignees via message
```

#### 2.3 Conflict Resolution

When reservation conflicts detected:

```
1. Identify conflicting reservations
2. Check if either can release
3. If same issue: coordinate merge
4. If different issues: priority wins
5. Message affected droids with resolution
```

#### 2.4 Escalation

When confidence < 70%:

```
1. Draft proposed action
2. List uncertainties
3. Send to human via message
4. Wait for approval before proceeding
```

### Daemon Mode

```bash
# Start queen watching for changes
queen start

# Queen polls every N seconds:
# 1. Check for new epics → decompose
# 2. Check for ready tasks → assign
# 3. Check for conflicts → resolve
# 4. Check inbox for questions → respond

queen status  # Show daemon status
queen stop    # Stop daemon
```

### Success Criteria

- [ ] Queen droid definition in `.factory/droids/queen.md`
- [ ] Epic decomposition works (creates child tasks)
- [ ] Task assignment algorithm implemented
- [ ] Conflict resolution logic works
- [ ] Daemon mode polls and processes
- [ ] Escalation creates human-review items
- [ ] Integration test: full workflow

---

## Phase 3: Unified TUI

**Goal:** Single interface showing issues, messages, reservations, worktrees.

### Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ QueenBee                                        [main] [feature-ui] [auth]  │
├──────────────────────┬──────────────────────────────────────────────────────┤
│ ISSUES               │ DETAIL                                               │
│ ──────               │ ──────                                               │
│ ▸ qb-42 Button comp  │ qb-42: Implement Button component                   │
│   qb-43 Icon system  │                                                      │
│   qb-44 Form inputs  │ Status: in_progress                                  │
│                      │ Assigned: ui-engineer                                │
│ MESSAGES (3 unread)  │ Worktree: feature-ui                                 │
│ ────────             │                                                      │
│ ▸ [qb-42] Starting.. │ Reserved files:                                      │
│   [qb-41] Completed  │ • src/components/Button/**                           │
│   [queen] Assigned   │                                                      │
│                      │ ─────────────────────────────────────────────────────│
│ RESERVATIONS         │ THREAD                                               │
│ ────────────         │                                                      │
│ Button/** ui-eng     │ [12:30] ui-engineer: Starting Button implementation  │
│ auth/** growth-eng   │ [12:45] queen: Acknowledged. ETA noted.              │
│                      │ [13:00] ui-engineer: Progress: 40% complete          │
│ DROIDS               │                                                      │
│ ──────               │ > Reply: _                                           │
│ ● ui-engineer        │                                                      │
│ ● growth-engineer    │                                                      │
│ ○ ux-strategist      │                                                      │
└──────────────────────┴──────────────────────────────────────────────────────┘
```

### Components

1. **Issue Panel** - List of issues (like current bv)
2. **Message Panel** - Recent messages, unread count
3. **Reservation Panel** - Active file locks
4. **Droid Panel** - Agent status (active/idle)
5. **Detail Panel** - Selected item details
6. **Thread Panel** - Message thread for selected issue
7. **Worktree Tabs** - Switch between worktree views

### Implementation

Fork `bv` (beads viewer) and extend:

```go
// queenui/main.go

func main() {
    // Load beads issues
    issues := beads.LoadIssues()
    
    // Load queen extensions
    messages := queen.LoadMessages()
    assignments := queen.LoadAssignments()
    reservations := queen.LoadReservations()
    droids := queen.LoadDroids()
    
    // Build TUI
    app := tview.NewApplication()
    // ... panels ...
    app.Run()
}
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j/k` | Navigate list |
| `Tab` | Switch panel |
| `Enter` | Select/expand |
| `m` | Compose message |
| `r` | Reply to message |
| `c` | Claim selected issue |
| `R` | Reserve files for issue |
| `1-4` | Switch worktree |
| `q` | Quit |

### Success Criteria

- [ ] All panels render correctly
- [ ] Navigation works (j/k, Tab)
- [ ] Issue detail shows assignments and reservations
- [ ] Message thread displays inline
- [ ] Can compose and send messages from TUI
- [ ] Worktree switching works
- [ ] Real-time updates when files change

---

## Phase 4: Integration Testing

**Goal:** Validate full multi-agent workflow.

### Test Scenarios

#### 4.1 Basic Workflow

```
1. Human creates epic
2. Queen decomposes into tasks
3. Queen assigns to droids
4. Droids claim and work
5. Droids complete and close
6. All synced to git
```

#### 4.2 Multi-Worktree

```
1. Two droids in different worktrees
2. Cross-worktree dependency exists
3. Queen sequences correctly
4. First droid completes, pushes
5. Second droid gets unblocked
6. Work proceeds without conflicts
```

#### 4.3 Conflict Resolution

```
1. Two droids reserve overlapping files
2. Queen detects conflict
3. Queen resolves based on priority
4. Lower-priority droid gets alternate work
5. No merge conflicts occur
```

#### 4.4 Escalation

```
1. Ambiguous epic submitted
2. Queen analyzes, confidence < 70%
3. Queen escalates to human
4. Human provides clarification
5. Queen proceeds with decomposition
```

### Success Criteria

- [ ] All scenarios pass
- [ ] No data loss or corruption
- [ ] Performance acceptable (< 100ms for common operations)
- [ ] Works with 5-10 concurrent agents
- [ ] Git history is clean (no merge conflicts)

---

## Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Documentation | 1 day | None |
| Phase 1: CLI Extensions | 3-5 days | Phase 0 |
| Phase 2: Queen Droid | 3-5 days | Phase 1 |
| Phase 3: Unified TUI | 5-7 days | Phase 1 |
| Phase 4: Integration | 2-3 days | Phase 2, 3 |
| **Total** | **2-3 weeks** | |

## Open Questions

1. **Beads Integration** - Should we upstream queen extensions to beads?
2. **Daemon vs On-Demand** - Should queen run continuously or on-demand?
3. **Multi-Project** - How to handle multiple projects with one queen?
4. **Remote Agents** - Can agents run on different machines?
5. **Persistence** - Should messages have TTL or persist forever?

## Risks

| Risk | Mitigation |
|------|------------|
| Beads schema changes break queen | Pin beads version, add migration scripts |
| Git conflicts on .beads/ | Use JSONL append-only, conflict resolution |
| Queen makes bad assignments | Confidence thresholds, escalation |
| TUI complexity | Start minimal, iterate |
| Performance with many agents | Batch operations, caching |

## Next Steps

1. Complete Phase 0 documentation
2. Set up Go module for queen CLI
3. Implement message storage first (most used)
4. Test with manual workflow before automation
