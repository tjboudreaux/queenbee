# Planning Summary: Phase 1 - Queen CLI Extensions

## Issue: qb-a0u
- **Status**: Planning Complete
- **Planning Date**: 2025-12-14
- **Issue Type**: Epic
- **Priority**: P1
- **Blocks**: qb-sh4 (Phase 2), qb-v83 (Phase 3)

## Plan Documents

| # | Document | Status | Key Decisions |
|---|----------|--------|---------------|
| 1 | [Product Requirements](./01-product-requirements.md) | ✓ | Standalone `queen` CLI, strict droid validation, 2hr default TTL |
| 4 | [Frontend Plan (CLI)](./04-frontend-plan.md) | ✓ | Cobra CLI, modular internal packages, JSON output mode |
| 5 | [Backend Plan (Storage)](./05-backend-plan.md) | ✓ | Append-only JSONL, ULID IDs, glob pattern matching |
| 6 | [QA Plan](./06-qa-plan.md) | ✓ | 90% coverage target, ~85 test cases, table-driven tests |
| 7 | [DevSecOps Plan](./07-devsecops-plan.md) | ✓ | GoReleaser, Homebrew tap, GitHub Actions CI/CD |

### Plans Not Applicable for Phase 1
- **02-design-system.md** - N/A (CLI tool, no UI)
- **03-ux-ui-plan.md** - N/A (CLI tool, no UI)
- **08-analytics-plan.md** - N/A (local tool, no telemetry)
- **09-documentation-plan.md** - Included in product requirements
- **10-mobile-plan.md** - N/A (CLI tool)

## Key Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| CLI binary name | `queen` (standalone) | Clear separation from beads, simpler command structure |
| Go module path | `github.com/tjboudreaux/queenbee` | User's GitHub namespace |
| Droid validation | Strict against `.factory/droids/` | Prevents typos, ensures coordination |
| Default TTL | 2 hours | Matches typical work session length |
| Thread ID strategy | issue_id as prefix | Links messages to beads issues naturally |
| Installation | Homebrew + go install + script | Follows beads pattern |
| Test coverage | 90% minimum | User requirement |
| Target platforms | macOS (arm64/amd64), Linux (amd64/arm64), Windows (amd64) | macOS first priority |
| **Conflict handling** | **Fail by default, --force to override** | Prevents accidental overwrites |
| **Droid identity** | **`queen config set droid` for persistence** | Reduces friction for manual testing |
| **Storage maintenance** | **P2: compact + archive commands** | Addresses JSONL growth concerns |

## Estimated Effort

| Component | Estimate | Confidence |
|-----------|----------|------------|
| Project setup & infrastructure | 1 day | High |
| Message storage & commands | 1 day | High |
| Assignment storage & commands | 0.5 days | High |
| Reservation storage & commands | 1 day | High |
| Testing (90% coverage) | 1.5 days | Medium |
| CI/CD & multi-platform builds | 0.5 days | High |
| Documentation | 0.5 days | High |
| **Total** | **6 days** | Medium |

## Open Questions (Resolved)

| Question | Resolution |
|----------|------------|
| How does agent identify itself? | `queen config set droid` > `QUEEN_DROID` env > `--droid` flag |
| What if droid name invalid? | Error with suggestions, strict by default |
| Conflict semantics? | **Fail by default** (exit 5), use `--force` to override |
| Persistent config? | `.beads/queen_config.yaml` for droid identity and default TTL |
| Storage growth? | P2 adds `queen compact` and `queen archive` commands |

## Implementation Order

1. **Week 1: Core Infrastructure**
   - [ ] Go module setup, directory structure
   - [ ] JSONL store with ULID generation
   - [ ] Droid discovery and validation
   - [ ] Basic CLI scaffolding with Cobra

2. **Week 1-2: Feature Implementation**
   - [ ] Message types, storage, and commands
   - [ ] Assignment types, storage, and commands
   - [ ] Reservation types, storage, and commands
   - [ ] Glob pattern matching and conflict detection

3. **Week 2: Quality & Release**
   - [ ] Unit tests (90%+ coverage)
   - [ ] Integration tests
   - [ ] CI/CD pipeline (GitHub Actions)
   - [ ] GoReleaser configuration
   - [ ] Homebrew formula

## Risks

| Risk | Mitigation |
|------|------------|
| Beads schema changes | Pin to beads version, detect changes |
| JSONL merge conflicts | Append-only semantics, ULID ordering |
| TTL race conditions | Use file modification time |

## Next Steps

1. ✅ Review plans with stakeholder (you)
2. Address any feedback or questions
3. Begin implementation: `bd claim qb-a0u`
4. Create child tasks for tracking:
   - `bd create "Set up queen Go module" --parent=qb-a0u`
   - `bd create "Implement JSONL store" --parent=qb-a0u`
   - etc.

---

**Ready for implementation?** If approved, I can:
1. Decompose this epic into trackable child tasks
2. Begin implementation starting with Go module setup
