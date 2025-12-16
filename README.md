![QueenBee](queenbee.jpeg)

# QueenBee

**Unified AI Agent Orchestration for Factory Droids**

QueenBee is a CLI-first orchestration layer that extends [Beads](https://github.com/jeffrydegrande/beads) with multi-agent coordination capabilities. It replaces MCP-based Agent Mail with git-backed messaging, automated task assignment via a Queen droid, and a unified TUI for observing all agent activity.

## Why QueenBee?

### The Problem

Current multi-agent workflows suffer from:

1. **Tool Sprawl** - Beads for issues, Agent Mail for messaging, separate TUIs for each
2. **MCP Brittleness** - HTTP server dependencies, dual persistence (SQLite + Git), sync failures
3. **Manual Orchestration** - Humans must assign work, monitor agents, resolve conflicts
4. **Worktree Blindness** - No visibility into parallel work across git worktrees

### The Solution

QueenBee provides:

| Feature | Agent Mail | QueenBee |
|---------|------------|----------|
| **Messaging** | Separate MCP server | Beads extension (`bd msg`) |
| **File Reservations** | HTTP API | Beads extension (`bd reserve`) |
| **Task Assignment** | Manual | Automated (Queen droid) |
| **Persistence** | SQLite + Git (dual) | Git-only (JSONL) |
| **TUI** | Separate tool | Unified with Beads (`bv`) |
| **Worktree Support** | Per-worktree servers | Shared DB, multi-worktree view |

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              HUMAN OPERATOR                                  │
│                    (Strategic direction, approvals)                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            QUEEN DROID                                       │
│   Factory custom droid (Opus) running via `droid exec --headless`           │
│   - Monitors .beads/ for new issues and status changes                      │
│   - Decomposes epics into tasks with dependencies                           │
│   - Assigns work to specialist droids based on skills                       │
│   - Resolves conflicts and re-routes blocked work                           │
│   - Escalates to human when confidence is low                               │
└─────────────────────────────────────────────────────────────────────────────┘
                    │               │               │
          ┌─────────┴─────────┬─────┴─────┬─────────┴─────────┐
          ▼                   ▼           ▼                   ▼
┌──────────────────┐ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
│  ux-strategist   │ │  ui-engineer  │ │ growth-engnr  │ │ quality-eng   │
│  (design work)   │ │  (frontend)   │ │  (analytics)  │ │  (testing)    │
└──────────────────┘ └───────────────┘ └───────────────┘ └───────────────┘
          │                   │               │                   │
          └───────────────────┴───────────────┴───────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BEADS + QUEEN EXTENSIONS                             │
│   .beads/                                                                    │
│   ├── issues.jsonl          # Standard Beads issues                         │
│   ├── queen_assignments.jsonl   # Who is assigned to what                   │
│   ├── queen_messages.jsonl      # Inter-agent communication                 │
│   └── queen_reservations.jsonl  # File lock claims                          │
│                                                                              │
│   Shared across all git worktrees via single .beads/ directory              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Core Concepts

### 1. Droids as Identity

Agent identities come from Factory's `.factory/droids/` directory. Each droid has:
- A name (e.g., `ui-engineer`, `queen`)
- A model (e.g., `claude-opus-4-5-20251101`)
- Skills and capabilities
- Autonomy level

No more random adjective+noun names like "BlueMountain" - droids are the identity system.

### 2. Git-Backed Everything

All state lives in `.beads/` as JSONL files:
- **No SQLite** - Pure append-only logs, git-mergeable
- **No HTTP servers** - CLI reads/writes files directly
- **No sync issues** - Git is the single source of truth

### 3. Queen Orchestration

The Queen droid runs as a background process:
```bash
# Start queen (daemon mode)
queen start

# Or run interactively
droid exec queen "Process inbox and assign ready work"
```

Queen responsibilities:
- **Decomposition** - Break epics into tasks with proper dependencies
- **Assignment** - Match tasks to droids based on skills and availability
- **Conflict Resolution** - Handle overlapping file reservations
- **Escalation** - Flag decisions requiring human input

### 4. Multi-Worktree Coordination

Git worktrees share the same `.beads/` database:

```
repo/
├── .beads/               # Shared coordination database
├── main/                 # Main worktree
│   └── .beads -> ../.beads
├── feature-auth/         # Feature worktree
│   └── .beads -> ../.beads
└── feature-ui/           # Another feature worktree
    └── .beads -> ../.beads
```

Workers see all activity, Queen assigns based on worktree boundaries.

## CLI Commands

### Standard Beads (unchanged)
```bash
bd init                    # Initialize beads
bd create "Task title"     # Create issue
bd list                    # List issues
bd ready                   # Show unblocked work
bd close <id>              # Close issue
bd sync                    # Sync with git
```

### Queen Extensions
```bash
# Messaging
bd msg send <to-droid> "message"     # Send message
bd msg inbox                          # View inbox
bd msg thread <issue-id>              # View thread for issue

# Assignments
bd assign <issue-id> <droid>         # Assign (or let queen auto-assign)
bd claim <issue-id>                  # Claim for self
bd release <issue-id>                # Release assignment

# File Reservations
bd reserve <paths...>                # Reserve files
bd reserved                          # List reservations
bd unreserve <paths...>              # Release files

# Queen Operations
queen start                          # Start queen daemon
queen status                         # Check queen status
queen assign                         # Trigger assignment cycle
queen stop                           # Stop queen daemon
```

## Quick Start

```bash
# 1. Clone and enter project
cd ~/Sandbox/queenbee

# 2. Initialize beads (if not already)
bd init

# 3. Create the queen droid
cat .factory/droids/queen.md  # Already exists

# 4. Start queen daemon
queen start

# 5. Create some work
bd create "Implement authentication" -t epic -p 1
bd create "Design auth flow" -t task -p 1

# 6. Queen auto-assigns based on skills
queen assign

# 7. Check assignments
bd list --assigned

# 8. Claim and work
bd claim qb-2
bd reserve src/auth/**
# ... do work ...
bd unreserve src/auth/**
bd close qb-2 --reason "Implemented"
```

## Design Goals

### What We Want

- [x] **Single tool** - `bd` + queen extensions, not bd + Agent Mail
- [x] **Git-backed** - JSONL only, no SQLite, no HTTP servers
- [x] **CLI-first** - Commands, not MCP tools
- [x] **Droid identities** - From `.factory/droids/`, not random names
- [x] **Multi-worktree** - Shared DB, coordinated assignment
- [x] **Unified TUI** - Issues + messages + reservations + worktrees in one view
- [x] **Queen orchestration** - Automated decomposition and assignment

### What We Don't Want

- [ ] MCP/HTTP server dependencies
- [ ] Dual persistence (SQLite + Git) with sync brittleness
- [ ] Separate messaging tool
- [ ] Generic swarm (100+ agents) - optimize for 5-10 specialists
- [ ] Human orchestration burden - queen automates assignment
- [ ] Random agent names - use droid identities

## Project Status

**Phase 0: Documentation** ← We are here
- [x] README.md - This file
- [x] AGENTS.md - Agent protocol
- [x] docs/PLAN.md - Implementation roadmap
- [ ] docs/SCHEMA.md - Extension schema

**Phase 1: Queen Extensions (Go)**
- [ ] Message storage and retrieval
- [ ] Assignment tracking
- [ ] File reservation system
- [ ] CLI commands

**Phase 2: Queen Droid**
- [ ] Droid definition
- [ ] Decomposition logic
- [ ] Assignment algorithm
- [ ] Daemon mode

**Phase 3: Unified TUI**
- [ ] Fork bv/bdui
- [ ] Multi-worktree panel
- [ ] Message threads view
- [ ] Reservation status

**Phase 4: Integration Testing**
- [ ] Multi-agent workflow test
- [ ] Worktree coordination test
- [ ] Queen escalation test

## Contributing

This is an experimental project exploring alternatives to MCP-based agent coordination. The core hypothesis is that git-backed, CLI-first tooling provides better reliability and developer experience than HTTP-based protocols.

## License

MIT

## Related Projects

- [Beads](https://github.com/jeffrydegrande/beads) - Git-backed issue tracker (foundation)
- [Factory](https://factory.ai) - AI agent platform (droid system)
- [Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail) - MCP coordination (what we're replacing)
- [Claude Flow](https://github.com/Dicklesworthstone/claude-flow) - TypeScript orchestration (inspiration)
