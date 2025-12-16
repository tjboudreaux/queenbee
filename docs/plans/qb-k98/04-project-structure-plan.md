# Project Structure Plan: CI/CD Automation

## Overview

QueenBee is a monorepo with two main projects:

```
queenbee/
├── queen/          # Go CLI (primary)
├── queenui/        # Node.js TUI (secondary)
├── docs/           # Documentation
└── .github/        # GitHub Actions
```

## Current CI/CD Status

### Queen (Go CLI) - ✅ Complete
- [x] CI workflow: test, lint, security, build
- [x] Release workflow: goreleaser on tags
- [x] Makefile with: build, test, lint, fmt
- [x] .golangci.yml linter config
- [x] .goreleaser.yml release config

### QueenUI (Node TUI) - ⚠️ Partial
- [x] package.json with scripts: lint, tsc, test, prettier
- [ ] GitHub Actions workflow (MISSING)
- [ ] Pre-commit integration (MISSING)

### Git Hooks - ❌ Missing
- [ ] No pre-commit hooks
- [ ] No commit-msg validation
- [ ] No pre-push hooks

## Proposed Structure

### Git Hooks (using lefthook or simple scripts)

```
queenbee/
├── .lefthook.yml           # Hook configuration
├── scripts/
│   └── pre-commit.sh       # Fallback shell script
```

### GitHub Actions Updates

```
.github/
├── workflows/
│   ├── ci.yml              # queen CI (existing, update paths)
│   ├── ci-ui.yml           # queenui CI (NEW)
│   ├── release.yml         # queen release (existing)
│   └── release-ui.yml      # queenui release (NEW, optional)
```

## New Files to Create

### .lefthook.yml (preferred approach)
```yaml
pre-commit:
  parallel: true
  commands:
    queen-fmt:
      root: queen/
      glob: "*.go"
      run: go fmt ./...
    queen-lint:
      root: queen/
      glob: "*.go"
      run: golangci-lint run --fix
    queen-test:
      root: queen/
      glob: "*.go"
      run: go test -short ./...
    ui-lint:
      root: queenui/
      glob: "*.{js,ts}"
      run: npm run lint
    ui-tsc:
      root: queenui/
      glob: "*.{js,ts}"
      run: npm run tsc
    ui-prettier:
      root: queenui/
      glob: "*.{js,ts,json,md}"
      run: npm run prettier:check

commit-msg:
  commands:
    conventional:
      run: |
        MSG=$(cat {1})
        if ! echo "$MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.+\))?!?: .+"; then
          echo "Error: Commit message must follow conventional commits format"
          echo "Example: feat(queen): add watch command"
          exit 1
        fi
```

### Alternative: scripts/pre-commit.sh
```bash
#!/bin/bash
set -e

# Check if queen/ files changed
if git diff --cached --name-only | grep -q "^queen/"; then
  echo "Running queen checks..."
  (cd queen && make check)
fi

# Check if queenui/ files changed  
if git diff --cached --name-only | grep -q "^queenui/"; then
  echo "Running queenui checks..."
  (cd queenui && npm run all)
fi
```

## Build Commands Summary

### Queen (Go)
```bash
cd queen
make build      # Build binary
make test       # Run tests
make lint       # Run linter
make check      # lint + test
make all        # tidy + fmt + lint + test + build
```

### QueenUI (Node)
```bash
cd queenui
npm run build   # Build frontend bundle
npm test        # Run vitest
npm run lint    # Run eslint
npm run tsc     # Type check
npm run all     # lint + tsc + test + prettier:check
```

## Implementation Order

1. [ ] Add .lefthook.yml configuration
2. [ ] Install lefthook: `brew install lefthook` or `go install github.com/evilmartians/lefthook@latest`
3. [ ] Run `lefthook install` to setup hooks
4. [ ] Create .github/workflows/ci-ui.yml for queenui
5. [ ] Update README with installation section
6. [ ] Test complete workflow

## Tool Choices

### Why lefthook over alternatives?

| Tool | Language | Pros | Cons |
|------|----------|------|------|
| **lefthook** | Go | Fast, parallel, monorepo-aware | Less common |
| husky | Node | Popular, well documented | Node-only, slower |
| pre-commit | Python | Comprehensive hooks | Python dependency |
| git hooks (raw) | Shell | No dependencies | Manual, less portable |

**Recommendation**: lefthook - single Go binary, works with both Go and Node projects, fast parallel execution.
