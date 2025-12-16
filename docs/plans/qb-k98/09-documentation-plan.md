# Documentation Plan: CI/CD Automation

## README Updates

### Current State
- Main README.md has Quick Start section but no Installation section
- Install instructions are in queen/INSTALL.md (subdirectory)
- Users must navigate to find installation

### Proposed Changes

#### Add Installation Section to README.md

Location: After "Architecture" section, before "Core Concepts"

```markdown
## Installation

### Quick Install

**macOS/Linux** (recommended):
```bash
curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash
```

**Homebrew** (macOS/Linux):
```bash
brew tap tjboudreaux/tap
brew install queen
```

**Go**:
```bash
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@latest
```

### Verify Installation

```bash
queen version
```

### QueenUI (Optional)

For the browser-based dashboard:

```bash
cd queenui
npm install
npm start
```

Then open http://localhost:3000

See [queen/INSTALL.md](queen/INSTALL.md) for detailed installation options.
```

#### Add CI Status Badges

Location: Top of README, after title

```markdown
![QueenBee](queenbee.jpeg)

# QueenBee

[![CI - Queen](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml/badge.svg)](https://github.com/tjboudreaux/queenbee/actions/workflows/ci.yml)
[![CI - QueenUI](https://github.com/tjboudreaux/queenbee/actions/workflows/ci-ui.yml/badge.svg)](https://github.com/tjboudreaux/queenbee/actions/workflows/ci-ui.yml)
[![Release](https://img.shields.io/github/v/release/tjboudreaux/queenbee?include_prereleases)](https://github.com/tjboudreaux/queenbee/releases)
```

## Developer Documentation

### Add CONTRIBUTING.md (Optional)

```markdown
# Contributing to QueenBee

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Go tools
   go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
   
   # Node dependencies
   cd queenui && npm install
   
   # Git hooks
   brew install lefthook  # or: go install github.com/evilmartians/lefthook@latest
   lefthook install
   ```

## Making Changes

### Before Committing

Pre-commit hooks will automatically run:
- Go: format, lint, tests
- Node: lint, typecheck, tests, prettier

To run manually:
```bash
lefthook run pre-commit
```

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):

```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore, build, ci, perf, revert
```

Examples:
- `feat(queen): add watch command`
- `fix(queenui): handle empty inbox`
- `docs: update installation instructions`

### Running Tests

```bash
# Queen (Go)
cd queen && make test

# QueenUI (Node)
cd queenui && npm test
```

## Pull Requests

1. Create a branch from `main`
2. Make your changes
3. Ensure all checks pass locally
4. Push and create PR
5. CI will run automatically
```

## Code Documentation

### No Changes Required

This issue is infrastructure-focused. Code documentation is not affected.

## Help/Support Content

### Update queen/INSTALL.md

Add note about lefthook:
```markdown
## Development Setup

If you're developing QueenBee, also install git hooks:

```bash
brew install lefthook
lefthook install
```

This ensures code quality checks run before each commit.
```

## Release Notes Template

For future releases:
```markdown
## What's New

### Features
- Feature description

### Bug Fixes
- Fix description

### Developer Experience
- Added pre-commit hooks for local quality enforcement
- Added CI for queenui project
- Updated README with installation instructions

## Installation

See [Installation Guide](queen/INSTALL.md) or run:
```bash
curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash
```
```

## Documentation Checklist

- [ ] Add Installation section to main README.md
- [ ] Add CI status badges to README.md
- [ ] Update queen/INSTALL.md with lefthook note (optional)
- [ ] Create CONTRIBUTING.md (optional)
- [ ] Verify all install commands work with latest release
