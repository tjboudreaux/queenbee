![QueenBee](queenbee.jpeg)

# QueenBee

[![CI](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml/badge.svg)](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/tjboudreaux/queenbee?include_prereleases)](https://github.com/tjboudreaux/queenbee/releases)

**Multi-Agent Coordination for AI-Assisted Development**

QueenBee is a CLI tool that extends [Beads](https://github.com/jeffrydegrande/beads) with multi-agent coordination capabilities. It provides git-backed messaging, automated task assignment, file reservations, and a unified interface for orchestrating multiple AI agents working on the same codebase.

## Features

- **Inter-Agent Messaging** - Agents communicate via `queen msg` commands
- **Task Assignment** - Automated or manual assignment of issues to agents
- **File Reservations** - Prevent merge conflicts with exclusive file locks
- **Work Queue** - View ready, blocked, and assigned work
- **Live Dashboard** - Real-time monitoring with `queen watch`
- **Git-Backed** - All state stored as JSONL in `.beads/`, no external databases
- **Multi-Worktree** - Shared coordination across git worktrees

## Installation

**macOS/Linux:**
```bash
curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash
```

**Go:**
```bash
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@latest
```

**Verify:**
```bash
queen version
```

See [queen/INSTALL.md](queen/INSTALL.md) for more options.

## Quick Start

```bash
# Initialize beads in your project
bd init

# Set your agent identity
export QUEEN_AGENT=my-agent

# Create and assign work
bd create "Implement feature X" -t task -p 1
queen claim qb-1

# Reserve files before editing
queen reserve src/feature/**

# Communicate with other agents
queen msg send other-agent "Starting work on qb-1"

# When done
queen unreserve --all
bd close qb-1 --reason="Implemented"
```

## Commands

### Daemon
```bash
queen start              # Start background daemon
queen stop               # Stop daemon
queen status             # Check daemon status
queen watch              # Live monitoring dashboard
queen watch -i 5s        # Watch with 5 second refresh
```

### Messaging
```bash
queen msg send <agent> "message"    # Send message
queen msg send @all "broadcast"     # Broadcast to all
queen msg inbox                     # View inbox
queen msg reply <id> "response"     # Reply to message
queen msg thread <issue-id>         # View issue thread
```

### Assignments
```bash
queen assign <issue> <agent>  # Assign issue
queen claim <issue>           # Claim for yourself
queen release <issue>         # Release assignment
queen assignments             # List all assignments
queen assignments --agent=x   # List assignments for agent
```

### File Reservations
```bash
queen reserve <paths...>      # Reserve files
queen reserve --exclusive     # Exclusive reservation
queen reserved                # List reservations
queen unreserve <paths...>    # Release files
queen unreserve --all         # Release all
queen conflicts               # Check for conflicts
```

### Work Queue
```bash
queen queue list              # List queued work items
queen queue stats             # Show queue statistics
queen queue clear             # Clear all queued work
queen auto-assign             # Auto-assign ready work
```

### Task Decomposition
```bash
queen decompose <epic-id>     # Suggest tasks from epic
queen decompose --dry-run     # Preview without changes
queen decompose --create      # Create tasks in beads
```

### Configuration
```bash
queen config get <key>        # Get config value
queen config set <key> <val>  # Set config value
queen registry list           # List registered agents
```

## Configuration

Queen uses two configuration files:

**`.queen.yaml`** (project root) - Agent registry and orchestration rules:

```yaml
version: 1
daemon:
  max_agents: 4
  poll_interval: 30s
agents:
  frontend-agent:
    skills: [ui, react, css]
  backend-agent:
    skills: [api, database, go]
rules:
  - match:
      labels: [frontend, ui]
    agent: frontend-agent
```

**`.beads/queen_config.yaml`** - Runtime settings (managed via `queen config`):

```bash
queen config set agent my-agent
queen config set ttl 4h
```

Agent identity can be set via (in priority order):
1. `--agent` flag
2. `QUEEN_AGENT` environment variable
3. `queen config set agent <name>`

## Architecture

```
.beads/
├── issues.jsonl              # Beads issues
├── queen_assignments.jsonl   # Agent assignments
├── queen_messages.jsonl      # Inter-agent messages
└── queen_reservations.jsonl  # File reservations
```

All state is git-backed JSONL. No SQLite, no HTTP servers, no sync issues.

## Agent Protocol

See [AGENTS.md](AGENTS.md) for the full coordination protocol agents should follow.

**Session start:**
1. Check inbox: `queen msg inbox`
2. Claim work: `queen claim <id>`
3. Reserve files: `queen reserve <paths>`
4. Announce: `queen msg send queen "[id] Starting: description"`

**Session end:**
1. Release files: `queen unreserve --all`
2. Close issue: `bd close <id> --reason="done"`
3. Notify: `queen msg send queen "[id] Completed"`
4. Push: `git push`

## License

MIT

## Related

- [Beads](https://github.com/jeffrydegrande/beads) - Git-backed issue tracker
