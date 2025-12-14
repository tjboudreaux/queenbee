# Product Requirements Plan: Phase 1 - Queen CLI Extensions

## Overview
- **Issue ID**: qb-a0u
- **Type**: Epic
- **Priority**: P1
- **Created**: 2025-12-13
- **Planning Session**: 2025-12-14
- **Blocks**: qb-sh4 (Phase 2: Queen Droid), qb-v83 (Phase 3: Unified TUI)

## Problem Statement

Current multi-agent AI workflows lack a unified, git-native coordination mechanism. Agents need to:
1. **Communicate** - Send messages about task status, blockers, and handoffs
2. **Claim work** - Know who is assigned to which task
3. **Avoid conflicts** - Reserve files to prevent merge conflicts

Existing solutions (Agent Mail MCP) suffer from:
- HTTP server dependencies and SQLite sync issues
- Separate tooling from the issue tracker (Beads)
- Random agent identities instead of meaningful droid names

## Solution

Build a `queen` CLI companion to Beads that adds:
- **Messaging** (`queen msg`) - Git-backed inter-agent communication
- **Assignments** (`queen assign/claim/release`) - Track who owns what
- **File Reservations** (`queen reserve/unreserve`) - Advisory file locks

All state stored in `.beads/queen_*.jsonl` files, shared across git worktrees.

## User Stories

### Messaging
- [ ] As an agent, I want to send messages to other droids so that I can coordinate work
- [ ] As an agent, I want to check my inbox so that I see messages addressed to me
- [ ] As an agent, I want to reply to messages so that conversations are threaded
- [ ] As an agent, I want to filter messages by issue so that I see relevant context

### Assignments
- [ ] As an agent, I want to claim an issue so that others know I'm working on it
- [ ] As an agent, I want to see all assignments so that I know what's taken
- [ ] As an agent, I want to release an assignment so that work returns to the queue
- [ ] As a queen droid, I want to assign issues to droids based on skills

### File Reservations
- [ ] As an agent, I want to reserve files before editing so that I avoid conflicts
- [ ] As an agent, I want to see active reservations so that I know what's locked
- [ ] As an agent, I want reservations to auto-expire so that abandoned work unlocks
- [ ] As an agent, I want to release reservations when done so that files are available

## Acceptance Criteria

### Must Have (P0)

#### Messaging
- [ ] `queen msg send <to> "<message>"` creates message in queen_messages.jsonl
- [ ] `queen msg inbox` shows messages addressed to current droid
- [ ] `queen msg reply <msg-id> "<message>"` creates threaded reply
- [ ] `queen msg read <msg-id>` marks message as read
- [ ] Messages include: id, from, to, subject, body, timestamp, issue_id (optional)
- [ ] Messages support importance levels: low, normal, high, urgent

#### Assignments  
- [ ] `queen assign <issue-id> <droid>` creates assignment record
- [ ] `queen claim <issue-id>` assigns issue to current droid
- [ ] `queen release <issue-id>` marks assignment as released
- [ ] `queen assignments` lists active assignments with droid and issue
- [ ] Only one active assignment per issue (enforced)
- [ ] Assignments reference valid beads issues

#### File Reservations
- [ ] `queen reserve <pattern...>` creates reservation with TTL
- [ ] `queen reserved` lists active (non-expired, non-released) reservations
- [ ] `queen unreserve <pattern...>` releases specific reservations
- [ ] `queen unreserve --all` releases all reservations for current droid
- [ ] Default TTL: 2 hours (configurable via `--ttl=<duration>`)
- [ ] Conflict detection for overlapping exclusive reservations
- [ ] **Fail by default** on exclusive conflict (exit code 5)
- [ ] `--force` flag to override conflicts and create reservation anyway
- [ ] `--notify` flag to auto-message the conflict holder

#### Infrastructure
- [ ] All data stored in `.beads/queen_*.jsonl` (append-only)
- [ ] Works across git worktrees (shared .beads/ directory)
- [ ] Strict droid name validation against `.factory/droids/`
- [ ] ULID-based IDs for all records (qm-, qa-, qr- prefixes)

#### Configuration
- [ ] `queen config set <key> <value>` persists settings to `.beads/queen_config.yaml`
- [ ] `queen config get <key>` retrieves current setting
- [ ] `queen config list` shows all settings
- [ ] Supported keys: `droid` (default identity), `ttl` (default reservation TTL)
- [ ] Config file is project-local (in `.beads/`)

### Should Have (P1)

- [ ] `queen msg thread <issue-id>` shows all messages for an issue
- [ ] `queen msg inbox --unread` filters to unread only
- [ ] `queen msg inbox --since=<duration>` filters by time
- [ ] `queen assignments --droid=<name>` filters by assignee
- [ ] `queen reserved --path=<pattern>` checks if specific path is reserved
- [ ] JSON output mode for all commands (`--json` flag)

### Nice to Have (P2)

- [ ] Droid name mappings/aliases (e.g., "frontend" → "ui-engineer")
- [ ] `queen msg delete <msg-id>` soft-deletes messages
- [ ] Message templates for common patterns
- [ ] `queen compact` rewrites JSONL files keeping only latest state per record
- [ ] `queen archive --before=<date>` moves old messages to archive file
- [ ] `queen msg threads` lists all active threads (for non-issue threads)

### Future (P3)

- [ ] Support for non-Factory agents (Codex, Gemini, Claude Code)
- [ ] Cross-repository messaging
- [ ] Message expiration/archival

## Out of Scope

- Queen droid automation (Phase 2)
- TUI/GUI interface (Phase 3)
- Real-time notifications/webhooks
- Message encryption
- User authentication (trust droid identity)

## Dependencies

### Upstream
- Beads CLI installed and functional
- `.beads/` directory initialized (`bd init`)
- `.factory/droids/` directory with droid definitions

### Downstream (blocked by this)
- qb-sh4: Phase 2 - Queen Droid (needs CLI to operate)
- qb-v83: Phase 3 - Unified TUI (needs data layer)

## Success Metrics

| Metric | Definition | Target |
|--------|------------|--------|
| Command Coverage | % of specified commands implemented | 100% |
| Test Coverage | Line coverage of Go code | 90%+ |
| Cross-Platform | Builds successfully for target platforms | macOS, Linux, Windows |
| Worktree Support | Data shared correctly across worktrees | 100% scenarios pass |

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Beads schema changes | High | Medium | Pin beads version, detect breaking changes |
| Git merge conflicts on JSONL | Medium | Medium | Append-only semantics, ULID ordering |
| Droid name validation too strict | Medium | Low | Allow override flag, suggest corrections |
| TTL expiration race conditions | Low | Low | Use file modification time, not memory |

## Open Questions

1. **Droid discovery**: Should queen scan `.factory/droids/` on every command, or cache the list?
   - **Decision**: Scan on every command (droids change rarely, files are local)

2. **Current droid identity**: How does an agent identify itself?
   - **Decision**: Environment variable `QUEEN_DROID` or `--droid` flag, with auto-detection from Factory session if possible

3. **Conflict semantics**: What happens when two droids reserve overlapping patterns?
   - **Decision**: **Fail by default** on exclusive conflicts (exit code 5). Use `--force` to override.

4. **Persistent droid identity**: How can users avoid passing `--droid` every time?
   - **Decision**: `queen config set droid <name>` stores default in `.beads/queen_config.yaml`

5. **Storage growth**: What happens when JSONL files get large?
   - **Decision**: P2 adds `queen compact` and `queen archive` commands for maintenance

## Estimated Effort

| Component | Estimate | Confidence |
|-----------|----------|------------|
| CLI scaffolding & infrastructure | 1 day | High |
| Message storage & commands | 1 day | High |
| Assignment storage & commands | 0.5 days | High |
| Reservation storage & commands | 1 day | High |
| Testing (90% coverage) | 1.5 days | Medium |
| CI/CD & multi-platform builds | 0.5 days | High |
| Documentation | 0.5 days | High |
| **Total** | **6 days** | Medium |
