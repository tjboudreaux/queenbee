# AI Agent Coordination Protocol

This document defines how AI agents coordinate work in QueenBee projects. All agents MUST follow this protocol.

> **Terminology Note**: This document uses "droid" to refer to Factory's `.factory/droids/` agent definitions. The Queen CLI uses "agent" terminology internally (e.g., `--agent` flag, `Agent` field). Both terms refer to the same concept: an AI agent identity.

## Overview

QueenBee uses a hierarchical coordination model:

```
┌─────────────────────────────────────────────────────────────────┐
│                         HUMAN                                    │
│              (Strategic decisions, approvals)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        QUEEN DROID                               │
│   - Decomposes epics into tasks                                 │
│   - Assigns work to specialist droids                           │
│   - Resolves conflicts                                          │
│   - Escalates when uncertain                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Specialist Droid │ │ Specialist Droid │ │ Specialist Droid │
│  (ui-engineer)   │ │ (ux-strategist)  │ │ (quality-eng)    │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

## Agent Identity

### Droid Names as Identity

Agents identify themselves by their droid name from `.factory/droids/`:

```
ui-engineer
ux-strategist  
growth-engineer
quality-resilience-engineer
queen
```

**NOT** random names like "BlueMountain" or "GreenCastle".

### Registration

When starting a session, agents register their activity:

```bash
# Worker droid starting work
bd msg send queen "Starting session: ui-engineer on qb-42"
```

The queen tracks active agents and their current assignments.

## Session Protocol

### 1. Session Start (REQUIRED)

Every agent session MUST begin with:

```bash
# 1. Check for assigned work
bd list --assigned-to=ui-engineer

# 2. Check inbox for coordination messages
bd msg inbox

# 3. If no assigned work, check ready queue
bd ready

# 4. Claim work before starting
bd claim <issue-id>

# 5. Reserve files you'll edit
bd reserve src/components/Button/**

# 6. Announce to queen
bd msg send queen "[qb-42] Starting: Button component implementation"
```

### 2. During Work

While working, agents MUST:

```bash
# Check inbox periodically (every 15-20 min or after major steps)
bd msg inbox --since="20 minutes ago"

# Respond to urgent messages immediately
bd msg reply <msg-id> "Acknowledged, adjusting approach"

# Update progress on long tasks
bd msg send queen "[qb-42] Progress: 60% complete, tests passing"
```

### 3. Handling Blockers

When blocked:

```bash
# 1. Update issue status
bd update qb-42 --status=blocked

# 2. Add dependency if another issue blocks this
bd dep add qb-42 qb-41

# 3. Notify queen with details
bd msg send queen "[qb-42] BLOCKED: Waiting on API endpoint from qb-41"

# 4. Release file reservations (don't hold while blocked)
bd unreserve src/components/Button/**

# 5. Pick different work
bd ready
```

### 4. Session End (REQUIRED)

Before ending ANY session:

```bash
# 1. Release file reservations
bd unreserve --all

# 2. Update issue status
bd close qb-42 --reason="Implemented with tests"
# OR if incomplete:
bd update qb-42 --status=open  # Return to backlog

# 3. Send completion message
bd msg send queen "[qb-42] Completed: Button component
- Added variant support
- 100% test coverage
- Unblocks: qb-43, qb-44"

# 4. Sync and push
bd sync
git add .
git commit -m "feat(ui): implement Button component

Closes qb-42"
git push
```

## Message Protocol

### Message Format

All messages follow this structure:

```
[<issue-id>] <action>: <brief description>

<optional body with details>
```

Examples:
- `[qb-42] Starting: Button component implementation`
- `[qb-42] BLOCKED: Need design spec from qb-41`
- `[qb-42] Completed: All acceptance criteria met`
- `[qb-42] Question: Should we support icon variants?`

### Message Types

| Prefix | When to Use | Requires Response |
|--------|-------------|-------------------|
| `Starting:` | Beginning work on an issue | No |
| `Progress:` | Periodic updates on long work | No |
| `Completed:` | Finished an issue | No |
| `BLOCKED:` | Cannot proceed | Yes (from blocker owner) |
| `Question:` | Need decision/clarification | Yes |
| `Handoff:` | Passing work to another agent | Yes (acknowledgment) |
| `URGENT:` | Time-sensitive coordination | Yes (immediate) |

### Threading Convention

Messages are threaded by issue ID:

```bash
# All messages about qb-42 are in the same thread
bd msg thread qb-42

# Reply to a specific message
bd msg reply <msg-id> "Response text"
```

## File Reservation Protocol

### Why Reservations?

Multiple agents editing the same files causes merge conflicts and lost work. Reservations prevent this.

### Reservation Rules

1. **Reserve before editing**
   ```bash
   bd reserve src/components/Button/**
   ```

2. **Use specific patterns** (not broad globs)
   ```bash
   # GOOD
   bd reserve src/features/auth/login.ts
   bd reserve src/components/Button/**
   
   # BAD - too broad
   bd reserve src/**
   bd reserve **/*.ts
   ```

3. **Check for conflicts**
   ```bash
   bd reserved  # Shows all active reservations
   ```

4. **Release promptly**
   ```bash
   # When done with files
   bd unreserve src/components/Button/**
   
   # When blocked (don't hold files)
   bd unreserve --all
   
   # At session end (mandatory)
   bd unreserve --all
   ```

### Conflict Resolution

If files you need are reserved by another agent:

```bash
# 1. Check who has the reservation
bd reserved --path=src/components/Button

# 2. Message the holder
bd msg send ui-engineer "[qb-43] Request: Need Button.tsx for icon work"

# 3. Wait for release or coordinate
# Option A: They release, you reserve
# Option B: They include your changes
# Option C: Work on different files
```

## Queen Protocol

### Queen Responsibilities

The Queen droid manages orchestration:

1. **Task Decomposition**
   - Receives epics from humans
   - Breaks into tasks with dependencies
   - Estimates complexity and assigns priority

2. **Work Assignment**
   - Matches tasks to droid skills
   - Balances workload across agents
   - Respects worktree boundaries

3. **Conflict Resolution**
   - Detects overlapping reservations
   - Mediates assignment disputes
   - Re-routes blocked work

4. **Escalation**
   - Flags decisions requiring human input
   - Reports progress on major initiatives
   - Alerts on blocked critical path

### Queen Commands

```bash
# Start queen daemon
queen start

# Check queen status
queen status

# Trigger assignment cycle manually
queen assign

# View queen's assignment plan
queen plan

# Stop queen daemon
queen stop
```

### Assignment Algorithm

Queen assigns work based on:

1. **Skill Match** - Droid capabilities vs task requirements
2. **Availability** - Current assignment count
3. **Worktree** - Prefer same worktree for related work
4. **Dependencies** - Assign blockers first
5. **Priority** - P0 > P1 > P2 > P3

### Escalation Triggers

Queen escalates to human when:

- Confidence < 70% on decomposition
- No suitable droid for a task
- Conflicting priorities (multiple P0s)
- External dependency required
- Security/privacy implications detected

## Multi-Worktree Coordination

### Worktree Model

```
repo/
├── .beads/                    # SHARED database
│   ├── issues.jsonl
│   ├── queen_assignments.jsonl
│   ├── queen_messages.jsonl
│   └── queen_reservations.jsonl
├── worktrees/
│   ├── main/                  # Main development
│   ├── feature-auth/          # Auth feature branch
│   └── feature-ui/            # UI feature branch
```

All worktrees share the same `.beads/` directory.

### Worktree Assignment

Queen assigns work considering worktree boundaries:

```yaml
# Example assignment reasoning
issue: qb-42 (Button component)
worktree: feature-ui
assigned_to: ui-engineer
reason: "UI work belongs in feature-ui worktree. ui-engineer has capacity."

issue: qb-43 (Auth API endpoint)  
worktree: feature-auth
assigned_to: growth-engineer
reason: "Backend work belongs in feature-auth worktree. Skill match."
```

### Cross-Worktree Dependencies

When work in one worktree depends on another:

```bash
# 1. Queen detects dependency
# qb-42 (feature-ui) depends on qb-41 (feature-auth)

# 2. Queen sequences work
# qb-41 assigned first, qb-42 marked blocked

# 3. When qb-41 completes in feature-auth
bd close qb-41 --reason="API ready"
git push  # Push feature-auth

# 4. feature-ui pulls/rebases to get the changes
cd worktrees/feature-ui
git pull origin feature-auth

# 5. Queen unblocks qb-42
# Worker proceeds with UI implementation
```

## Quality Gates

### Before Marking Complete

Every agent MUST verify before closing an issue:

```bash
# Run project quality gates
pnpm lint        # No lint errors
pnpm typecheck   # No type errors  
pnpm test        # Tests pass

# If any fail, fix before closing
# If you can't fix, file a new issue and link it
```

### Completion Checklist

- [ ] Code changes committed
- [ ] Tests written and passing
- [ ] Lint/typecheck clean
- [ ] File reservations released
- [ ] Completion message sent
- [ ] Issue closed with reason
- [ ] `bd sync` run
- [ ] `git push` completed

## Common Scenarios

### Scenario: Starting Fresh Session

```bash
# 1. Check for work already assigned to you
bd list --assigned-to=ui-engineer
# If found, resume that work

# 2. If no assigned work, check ready queue
bd ready

# 3. Claim something appropriate for your skills
bd claim qb-42

# 4. Reserve files
bd reserve src/components/StatCard/**

# 5. Announce
bd msg send queen "[qb-42] Starting: StatCard implementation"

# 6. Work...
```

### Scenario: Someone Needs Files You Have

```bash
# You receive message:
# "[qb-43] Request: Need Button.tsx for icon work"

# Option A: Release if you're done with that file
bd unreserve src/components/Button/Button.tsx
bd msg reply <msg-id> "Released Button.tsx, it's yours"

# Option B: Coordinate changes
bd msg reply <msg-id> "I'm adding variants. Send me your icon changes and I'll include them"

# Option C: Almost done
bd msg reply <msg-id> "Finishing up, will release in ~15 min"
```

### Scenario: Discovering New Work

While working, you find a bug or needed refactor:

```bash
# 1. Create issue for it
bd create "Fix: Button doesn't handle disabled state" -t bug -p 2

# 2. Link it to your current work
bd dep add qb-new discovered-from:qb-42

# 3. Continue your original work
# Queen will assign the new issue appropriately
```

### Scenario: Handing Off Work

Need to stop mid-task:

```bash
# 1. Commit current progress
git add .
git commit -m "WIP(qb-42): Button variants 60% complete"

# 2. Document state for next agent
bd msg send queen "[qb-42] Handoff: Stopping at 60%
- Variants implemented: primary, secondary
- TODO: outline, ghost variants
- Tests written for completed variants
- See WIP commit for current state"

# 3. Release reservations
bd unreserve --all

# 4. Return to backlog (don't close)
bd update qb-42 --status=open

# 5. Sync
bd sync
git push
```

## Anti-Patterns (AVOID)

| Anti-Pattern | Why It's Bad | Do This Instead |
|--------------|--------------|-----------------|
| Working without claiming | Duplicate work, conflicts | Always `bd claim` first |
| Broad file reservations | Blocks other agents | Use specific paths |
| Forgetting to release | Files locked forever | Always release at session end |
| Ignoring inbox | Miss coordination | Check every 15-20 min |
| Closing without pushing | Work stranded locally | Always `git push` before closing |
| Not using issue IDs | Unthreaded messages | Always prefix `[qb-XX]` |
| Holding files when blocked | Unnecessary blocking | Release when blocked |

## Message Templates

### Starting Work
```
[qb-42] Starting: <brief title>

Plan:
1. First step
2. Second step

Reserving: src/components/X/**
ETA: ~2 hours
```

### Progress Update
```
[qb-42] Progress: 60% complete

Done:
- [x] Step 1
- [x] Step 2

In progress:
- [ ] Step 3

ETA: ~1 hour remaining
```

### Completion
```
[qb-42] Completed: <brief title>

Summary: What was accomplished

Changes:
- file1.ts - description
- file2.ts - description

Unblocks: qb-43, qb-44
```

### Blocked
```
[qb-42] BLOCKED: <reason>

Waiting on: qb-41 (API endpoint)
Owner: @growth-engineer

Workaround attempted: None viable

Files released: Yes
Ready to resume when unblocked.
```

### Handoff
```
[qb-42] Handoff: Stopping at X%

State:
- What's done
- What's remaining

Current commit: abc123 (WIP)
Files released: Yes
Notes for next agent: Any important context
```

## Summary

1. **Identity** - Use droid names, not random names
2. **Claim before working** - `bd claim <id>`
3. **Reserve before editing** - `bd reserve <paths>`
4. **Message with issue IDs** - `[qb-42] Action: description`
5. **Check inbox regularly** - Every 15-20 minutes
6. **Release when done/blocked** - `bd unreserve --all`
7. **Push before closing** - Never leave work stranded
8. **Let queen orchestrate** - Don't manually assign unless necessary
