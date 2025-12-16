# DevSecOps Plan: CI/CD Automation

## Overview

This is the **primary planning document** for qb-k98 as it covers:
- Git hooks implementation
- GitHub Actions configuration
- Release automation
- Security considerations

## Git Hooks Architecture

### Tool Selection: lefthook

**Rationale**: 
- Single Go binary (no Node/Python deps)
- Parallel execution (fast)
- Monorepo-aware (glob patterns, root directories)
- Cross-platform (macOS, Linux, Windows)

**Installation**:
```bash
# macOS
brew install lefthook

# Go
go install github.com/evilmartians/lefthook@latest

# NPM (if preferred)
npm install -g lefthook
```

### Hook Configuration

```yaml
# .lefthook.yml
assert_lefthook_installed: true

pre-commit:
  parallel: true
  commands:
    # Queen (Go) checks
    queen-fmt:
      root: queen/
      glob: "*.go"
      run: gofmt -l -d . && test -z "$(gofmt -l .)"
      
    queen-lint:
      root: queen/
      glob: "*.go"
      run: golangci-lint run
      
    queen-test-short:
      root: queen/
      glob: "*.go"
      run: go test -short ./...
      
    # QueenUI (Node) checks  
    ui-lint:
      root: queenui/
      glob: "*.{js,ts}"
      run: npm run lint
      
    ui-tsc:
      root: queenui/
      glob: "*.{js,ts}"
      run: npm run tsc
      
    ui-test:
      root: queenui/
      glob: "*.{js,ts}"
      run: npm test
      
    ui-prettier:
      root: queenui/
      glob: "*.{js,ts,json,css,html}"
      run: npm run prettier:check

commit-msg:
  commands:
    conventional-commits:
      run: |
        MSG=$(cat {1})
        if ! echo "$MSG" | grep -qE "^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.+\))?!?: .{1,}"; then
          echo "❌ Commit message must follow Conventional Commits"
          echo ""
          echo "Format: <type>(<scope>): <description>"
          echo ""
          echo "Types: feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert"
          echo "Examples:"
          echo "  feat(queen): add watch command"
          echo "  fix(queenui): handle empty inbox"
          echo "  docs: update installation instructions"
          exit 1
        fi

pre-push:
  parallel: true
  commands:
    queen-test-full:
      root: queen/
      glob: "*.go"
      run: go test -race ./...
```

### Setup Commands

```bash
# One-time setup after clone
lefthook install

# Verify hooks installed
ls -la .git/hooks/pre-commit

# Uninstall if needed
lefthook uninstall
```

## GitHub Actions Configuration

### ci-ui.yml (New Workflow)

```yaml
name: CI - QueenUI

on:
  push:
    branches: [main]
    paths:
      - 'queenui/**'
      - '.github/workflows/ci-ui.yml'
  pull_request:
    branches: [main]
    paths:
      - 'queenui/**'
      - '.github/workflows/ci-ui.yml'

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: queenui/package-lock.json
      - run: npm ci
        working-directory: queenui
      - run: npm run lint
        working-directory: queenui

  typecheck:
    name: TypeCheck
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: queenui/package-lock.json
      - run: npm ci
        working-directory: queenui
      - run: npm run tsc
        working-directory: queenui

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: queenui/package-lock.json
      - run: npm ci
        working-directory: queenui
      - run: npm test
        working-directory: queenui

  prettier:
    name: Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: queenui/package-lock.json
      - run: npm ci
        working-directory: queenui
      - run: npm run prettier:check
        working-directory: queenui

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test, prettier]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'
          cache-dependency-path: queenui/package-lock.json
      - run: npm ci
        working-directory: queenui
      - run: npm run build
        working-directory: queenui
```

### Updates to Existing ci.yml

Add paths trigger for new hook/workflow files:
```yaml
paths:
  - 'queen/**'
  - '.github/workflows/ci.yml'
  - '.lefthook.yml'  # Add this
```

## Release Process

### Current Flow (Queen)
```
Developer tags → GitHub Actions → GoReleaser → GitHub Release + Homebrew
```

**Trigger**: `git tag v1.2.3 && git push --tags`

### Release Checklist

Before tagging a release:
1. [ ] All CI checks passing on main
2. [ ] CHANGELOG.md updated (or auto-generated)
3. [ ] Version in go.mod/package.json matches tag (if applicable)
4. [ ] README install instructions point to correct release

### GoReleaser Notes

Current .goreleaser.yml already handles:
- Cross-compilation (linux/darwin/windows × amd64/arm64)
- Archive creation (tar.gz/zip)
- Checksums
- Homebrew tap update (requires HOMEBREW_TAP_TOKEN secret)
- Debian/RPM packages

## Security Considerations

### Secrets Required

| Secret | Purpose | Where |
|--------|---------|-------|
| GITHUB_TOKEN | Release creation | Auto-provided |
| HOMEBREW_TAP_TOKEN | Tap repo push | Repository secrets |

### Security Checks in CI

1. **govulncheck** - Scans Go dependencies for vulnerabilities
2. **npm audit** - Should add for queenui
3. **No secrets in code** - Pre-commit could add secret detection

### Adding Secret Detection (Optional Enhancement)

```yaml
# Add to .lefthook.yml
pre-commit:
  commands:
    secrets:
      glob: "*"
      run: |
        # Simple pattern check
        if git diff --cached | grep -iE "(api_key|secret|password|token)\s*=\s*['\"]?[A-Za-z0-9]+" ; then
          echo "❌ Potential secret detected"
          exit 1
        fi
```

## Monitoring & Alerts

### CI Status Badges

Add to README.md:
```markdown
[![CI - Queen](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml/badge.svg)](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml)
[![CI - QueenUI](https://github.com/tjboudreaux/queenbee/actions/workflows/ci-ui.yml/badge.svg)](https://github.com/tjboudreaux/queenbee/actions/workflows/ci-ui.yml)
```

### GitHub Notifications
- Enable notifications for failed CI on main branch
- Enable release notifications

## Implementation Order

1. **Create .lefthook.yml** - Hook configuration
2. **Create .github/workflows/ci-ui.yml** - QueenUI CI
3. **Update ci.yml** - Add path triggers
4. **Test hooks locally** - `lefthook install && lefthook run pre-commit`
5. **Test CI via PR** - Create test PR
6. **Update README** - Installation section + badges
7. **Verify release flow** - Tag and watch release workflow

## Rollback Plan

### If hooks break development:
```bash
# Immediate bypass
git commit --no-verify

# Disable hooks
lefthook uninstall

# Or remove config
rm .lefthook.yml
```

### If CI breaks:
- Workflows are in separate files, can be disabled independently
- Main branch protection can be temporarily relaxed

### If release breaks:
- Manual release via GitHub UI
- Or run goreleaser locally: `cd queen && goreleaser release --clean`
