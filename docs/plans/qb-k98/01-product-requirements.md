# Product Requirements Plan: CI/CD Automation

## Overview
- **Issue ID**: qb-k98
- **Type**: task
- **Priority**: P1
- **Created**: 2025-12-16
- **Planning Session**: 2025-12-16

## Problem Statement

QueenBee currently has GitHub Actions for CI and release, but lacks:
1. **Git hooks** - No local enforcement of quality gates before commits
2. **queenui CI** - Only queen (Go) has CI, queenui (Node) is uncovered
3. **README install instructions** - Users must find INSTALL.md or queen/ subdirectory

## User Stories

### Developer Experience
- [ ] As a developer, I want pre-commit hooks to catch lint/test issues before push
- [ ] As a developer, I want commit messages validated for consistency
- [ ] As a developer, I want a single `make check` to validate before committing

### User Installation
- [ ] As a user, I want clear install instructions in the main README
- [ ] As a user, I want to install the latest release via curl/script
- [ ] As a user, I want to know what version I have and what's latest

### Release Management
- [ ] As a maintainer, I want automated releases on version tags
- [ ] As a maintainer, I want changelog generated from commits
- [ ] As a maintainer, I want both queen (Go) and queenui (Node) released

## Acceptance Criteria

### Must Have (P0)

#### Git Hooks
- [ ] Pre-commit hook runs: `go fmt`, `golangci-lint`, `go test` for queen/
- [ ] Pre-commit hook runs: `npm run lint`, `npm run tsc`, `npm test` for queenui/
- [ ] Hook system works cross-platform (macOS, Linux, Windows Git Bash)
- [ ] Hooks can be bypassed with `--no-verify` for emergencies

#### GitHub Actions
- [ ] CI runs on PR and push to main for both queen/ and queenui/
- [ ] CI matrix includes relevant OS/versions
- [ ] Release workflow handles monorepo structure

#### README
- [ ] Main README.md has ## Installation section
- [ ] Install section references latest GitHub release
- [ ] Quick one-liner install command (curl | bash)

### Should Have (P1)
- [ ] Commit message validation (conventional commits)
- [ ] Pre-push hook for longer tests
- [ ] Badge in README for CI status

### Nice to Have (P2)
- [ ] Automated version bumping based on commits
- [ ] Dependabot for dependency updates
- [ ] Release notification (GitHub Discussions/Discord)

## Out of Scope
- Deployment to cloud services (this is a CLI tool)
- Docker image builds
- Automated NPM publishing for queenui (local-only tool)

## Dependencies
- GitHub repository access for Actions secrets
- Homebrew tap repository for brew formulas

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Git hooks slow developer iteration | Med | Med | Make hooks fast (<10s), allow --no-verify |
| Cross-platform hook issues | Med | Low | Use lefthook (Go binary) or simple shell scripts |
| Release workflow fails | High | Low | Test with dry-run, manual fallback |

## Estimated Effort

| Domain | Estimate | Confidence |
|--------|----------|------------|
| Git Hooks Setup | 2 hours | High |
| GitHub Actions (queenui) | 1 hour | High |
| README Updates | 30 min | High |
| Testing & Verification | 1 hour | Med |
| **Total** | **~4.5 hours** | |
