# QA Automation Plan: CI/CD Automation

## Test Strategy Overview

This issue adds infrastructure (hooks, CI) rather than application code. QA focuses on:
1. Verifying hooks run correctly
2. Verifying CI workflows pass
3. Verifying release process works

## Test Categories

### Integration Tests (Hooks)

| ID | Test Case | Steps | Expected |
|----|-----------|-------|----------|
| HK-001 | Pre-commit runs on Go changes | 1. Modify queen/*.go 2. `git commit` | Lint/test runs |
| HK-002 | Pre-commit runs on Node changes | 1. Modify queenui/*.js 2. `git commit` | Lint/tsc/test runs |
| HK-003 | Pre-commit skips unchanged dirs | 1. Modify README.md 2. `git commit` | No lint/test runs |
| HK-004 | Pre-commit blocks bad code | 1. Add lint error 2. `git commit` | Commit blocked |
| HK-005 | --no-verify bypasses hooks | 1. Add lint error 2. `git commit --no-verify` | Commit succeeds |
| HK-006 | Commit-msg validates format | 1. `git commit -m "bad message"` | Commit blocked |
| HK-007 | Conventional commit accepted | 1. `git commit -m "feat: add X"` | Commit succeeds |

### Workflow Tests (CI)

| ID | Test Case | Trigger | Expected |
|----|-----------|---------|----------|
| CI-001 | Queen CI on PR | PR touching queen/ | All jobs pass |
| CI-002 | Queen CI on main push | Merge to main | All jobs pass |
| CI-003 | QueenUI CI on PR | PR touching queenui/ | All jobs pass |
| CI-004 | No-op for unrelated changes | PR touching docs/ only | No CI runs (or fast skip) |
| CI-005 | Release on tag | Push v* tag | GoReleaser creates release |
| CI-006 | Release artifacts exist | After release | Binaries for all platforms |

### Manual Verification Checklist

#### After Implementation
- [ ] Clone fresh repo, run `lefthook install` - hooks work
- [ ] Create PR with Go change - CI runs
- [ ] Create PR with Node change - CI runs  
- [ ] Push tag - release created
- [ ] Download release binary - works
- [ ] Follow README install instructions - works

#### Cross-Platform
- [ ] Test hooks on macOS
- [ ] Test hooks on Linux
- [ ] Test hooks on Windows (Git Bash)

## CI Pipeline Structure

### Queen CI Jobs
```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Test   │     │  Lint   │     │ Security │
│ (matrix)│     │         │     │ govulnck │
└────┬────┘     └────┬────┘     └────┬─────┘
     │               │                │
     └───────────────┴────────────────┘
                     │
                     ▼
               ┌──────────┐
               │  Build   │
               │  (needs  │
               │  test,   │
               │  lint)   │
               └──────────┘
```

### QueenUI CI Jobs
```
┌─────────┐     ┌─────────┐     ┌──────────┐
│  Lint   │     │  TSC    │     │   Test   │
│         │     │         │     │          │
└────┬────┘     └────┬────┘     └────┬─────┘
     │               │                │
     └───────────────┴────────────────┘
                     │
                     ▼
               ┌──────────┐
               │  Build   │
               │  (needs  │
               │  all)    │
               └──────────┘
```

## Coverage Requirements

Not directly applicable - this is infrastructure code. However:

### Queen Test Coverage
- Existing threshold: 40%
- No change required

### QueenUI Test Coverage  
- Current: via vitest
- Add coverage reporting to CI

## Quality Gates

### Pre-Commit (Local)
| Check | Tool | Threshold |
|-------|------|-----------|
| Go format | gofmt | Must pass |
| Go lint | golangci-lint | No errors |
| Go test | go test -short | Must pass |
| JS lint | eslint | No errors |
| TS check | tsc | No errors |
| Prettier | prettier --check | Must pass |

### CI (Remote)
| Check | Tool | Threshold |
|-------|------|-----------|
| All pre-commit checks | - | Must pass |
| Full test suite | go test / vitest | Must pass |
| Security scan | govulncheck | No vulnerabilities |
| Build | go build / esbuild | Must succeed |

## Test Implementation

No new test code required - this issue adds infrastructure that is verified by:
1. Successfully completing a commit (hooks work)
2. Green CI badges (workflows work)
3. Successful release (goreleaser works)

## Rollback Plan

If hooks cause issues:
1. Users can `--no-verify` immediately
2. Remove .lefthook.yml and run `lefthook uninstall`
3. CI continues to work as safety net
