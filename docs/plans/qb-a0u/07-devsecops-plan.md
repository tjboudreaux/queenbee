# DevSecOps Plan: Phase 1 - Queen CLI Extensions

## Build & Release Strategy

### Target Platforms

| Platform | Architecture | Priority | Notes |
|----------|--------------|----------|-------|
| macOS | arm64 (Apple Silicon) | P0 | Primary development target |
| macOS | amd64 (Intel) | P0 | Legacy Mac support |
| Linux | amd64 | P1 | CI/server environments |
| Linux | arm64 | P2 | ARM servers, Raspberry Pi |
| Windows | amd64 | P2 | Windows developer support |

### Build Configuration

```yaml
# .goreleaser.yml
version: 2
project_name: queen

before:
  hooks:
    - go mod tidy
    - go generate ./...

builds:
  - id: queen
    main: ./cmd/queen
    binary: queen
    env:
      - CGO_ENABLED=0
    goos:
      - darwin
      - linux
      - windows
    goarch:
      - amd64
      - arm64
    ignore:
      - goos: windows
        goarch: arm64
    ldflags:
      - -s -w
      - -X main.Version={{.Version}}
      - -X main.Commit={{.Commit}}
      - -X main.Date={{.Date}}

archives:
  - id: queen
    builds:
      - queen
    name_template: "{{ .ProjectName }}_{{ .Version }}_{{ .Os }}_{{ .Arch }}"
    format: tar.gz
    format_overrides:
      - goos: windows
        format: zip

checksum:
  name_template: 'checksums.txt'

changelog:
  sort: asc
  filters:
    exclude:
      - '^docs:'
      - '^test:'
      - '^chore:'

release:
  github:
    owner: tjboudreaux
    name: queenbee
  draft: false
  prerelease: auto
```

### Version Management

```bash
# queen/cmd/queen/version.go
package main

var (
    Version = "dev"
    Commit  = "unknown"
    Date    = "unknown"
)

func versionCmd() *cobra.Command {
    return &cobra.Command{
        Use:   "version",
        Short: "Print version information",
        Run: func(cmd *cobra.Command, args []string) {
            fmt.Printf("queen %s (commit: %s, built: %s)\n", Version, Commit, Date)
        },
    }
}
```

## Installation Methods

### 1. Homebrew (macOS/Linux)

```ruby
# homebrew-queenbee/Formula/queen.rb
class Queen < Formula
  desc "Multi-agent coordination CLI for QueenBee"
  homepage "https://github.com/tjboudreaux/queenbee"
  version "0.1.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/tjboudreaux/queenbee/releases/download/v#{version}/queen_#{version}_darwin_arm64.tar.gz"
      sha256 "SHA256_HERE"
    end
    on_intel do
      url "https://github.com/tjboudreaux/queenbee/releases/download/v#{version}/queen_#{version}_darwin_amd64.tar.gz"
      sha256 "SHA256_HERE"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/tjboudreaux/queenbee/releases/download/v#{version}/queen_#{version}_linux_arm64.tar.gz"
      sha256 "SHA256_HERE"
    end
    on_intel do
      url "https://github.com/tjboudreaux/queenbee/releases/download/v#{version}/queen_#{version}_linux_amd64.tar.gz"
      sha256 "SHA256_HERE"
    end
  end

  def install
    bin.install "queen"
  end

  test do
    assert_match "queen", shell_output("#{bin}/queen version")
  end
end
```

### 2. go install

```bash
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@latest
```

### 3. Quick Install Script

```bash
# scripts/install.sh
#!/bin/bash
set -e

VERSION="${1:-latest}"
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64) ARCH="amd64" ;;
    aarch64|arm64) ARCH="arm64" ;;
esac

if [ "$VERSION" = "latest" ]; then
    VERSION=$(curl -s https://api.github.com/repos/tjboudreaux/queenbee/releases/latest | grep tag_name | cut -d'"' -f4)
fi

URL="https://github.com/tjboudreaux/queenbee/releases/download/${VERSION}/queen_${VERSION#v}_${OS}_${ARCH}.tar.gz"

echo "Installing queen $VERSION for $OS/$ARCH..."
curl -sL "$URL" | tar xz -C /tmp
sudo mv /tmp/queen /usr/local/bin/
echo "queen installed successfully!"
queen version
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
        go: ['1.22']
    runs-on: ${{ matrix.os }}
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: ${{ matrix.go }}
          cache: true
          cache-dependency-path: queen/go.sum
      
      - name: Test
        working-directory: queen
        run: go test -v -race -coverprofile=coverage.out ./...
      
      - name: Coverage Check
        if: matrix.os == 'ubuntu-latest'
        working-directory: queen
        run: |
          COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | tr -d '%')
          echo "Coverage: $COVERAGE%"
          if (( $(echo "$COVERAGE < 90" | bc -l) )); then
            echo "::error::Coverage $COVERAGE% is below 90% threshold"
            exit 1
          fi
      
      - name: Upload coverage
        if: matrix.os == 'ubuntu-latest'
        uses: codecov/codecov-action@v4
        with:
          file: queen/coverage.out

  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
          cache: true
          cache-dependency-path: queen/go.sum
      
      - uses: golangci/golangci-lint-action@v4
        with:
          version: latest
          working-directory: queen

  build:
    needs: [test, lint]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      
      - name: Build
        working-directory: queen
        run: |
          GOOS=darwin GOARCH=arm64 go build -o queen-darwin-arm64 ./cmd/queen
          GOOS=darwin GOARCH=amd64 go build -o queen-darwin-amd64 ./cmd/queen
          GOOS=linux GOARCH=amd64 go build -o queen-linux-amd64 ./cmd/queen
      
      - uses: actions/upload-artifact@v4
        with:
          name: binaries
          path: queen/queen-*
```

### Release Workflow

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      
      - name: Run GoReleaser
        uses: goreleaser/goreleaser-action@v5
        with:
          distribution: goreleaser
          version: latest
          args: release --clean
          workdir: queen
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  homebrew:
    needs: release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          repository: tjboudreaux/homebrew-queenbee
          token: ${{ secrets.HOMEBREW_TAP_TOKEN }}
      
      - name: Update Formula
        run: |
          VERSION=${GITHUB_REF#refs/tags/v}
          # Update version and checksums in Formula/queen.rb
          # (Script to fetch checksums and update formula)
      
      - name: Commit and Push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git commit -am "Update queen to $VERSION"
          git push
```

## Security Review

### Checklist

- [ ] **Input Validation**
  - [ ] Droid names validated against `.factory/droids/`
  - [ ] Issue IDs validated against beads
  - [ ] Glob patterns sanitized (no path traversal)
  - [ ] Message bodies length-limited
  
- [ ] **File Operations**
  - [ ] All paths resolved relative to `.beads/`
  - [ ] No arbitrary file read/write outside `.beads/`
  - [ ] File permissions: 0644 for JSONL files
  
- [ ] **No Secrets**
  - [ ] No API keys or credentials in code
  - [ ] No secrets in test fixtures
  - [ ] No sensitive data in error messages

### Security-Sensitive Code Paths

| Path | Risk | Mitigation |
|------|------|------------|
| File path handling | Path traversal | `filepath.Clean`, validate within `.beads/` |
| Glob pattern matching | ReDoS | Use `doublestar` library (safe) |
| JSON parsing | Memory exhaustion | Limit line length, streaming parse |
| Concurrent file access | Race conditions | Mutex locks per file |

### Dependency Security

```yaml
# .github/workflows/security.yml
name: Security

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly
  push:
    branches: [main]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      
      - name: Vulnerability scan
        working-directory: queen
        run: |
          go install golang.org/x/vuln/cmd/govulncheck@latest
          govulncheck ./...
      
      - name: Dependency audit
        working-directory: queen
        run: go list -m all | nancy sleuth
```

## Observability

### Logging

```go
// internal/log/log.go
import (
    "log/slog"
    "os"
)

var Logger *slog.Logger

func init() {
    level := slog.LevelInfo
    if os.Getenv("QUEEN_DEBUG") != "" {
        level = slog.LevelDebug
    }
    
    Logger = slog.New(slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{
        Level: level,
    }))
}

// Usage in commands
func runMsgSend(cmd *cobra.Command, args []string) error {
    log.Logger.Debug("sending message", "to", args[0])
    // ...
    log.Logger.Info("message sent", "id", msg.ID)
}
```

### Debug Mode

```bash
# Enable verbose logging
QUEEN_DEBUG=1 queen msg send bob "test"

# Output:
# DEBUG sending message to=bob
# DEBUG validating droid name=bob
# DEBUG appending to file path=.beads/queen_messages.jsonl
# INFO message sent id=qm-01HZ...
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | General error |
| 2 | Invalid arguments |
| 3 | File not found (.beads/) |
| 4 | Validation error (invalid droid, issue) |
| 5 | Conflict (reservation overlap) |

## Deployment Checklist

### Pre-Release
- [ ] All tests passing (90%+ coverage)
- [ ] Lint passing (`golangci-lint run`)
- [ ] Security scan clean (`govulncheck`)
- [ ] CHANGELOG.md updated
- [ ] Version bumped in code

### Release
- [ ] Create tag: `git tag -a v0.1.0 -m "Release v0.1.0"`
- [ ] Push tag: `git push origin v0.1.0`
- [ ] Verify GitHub Actions builds all platforms
- [ ] Verify release artifacts uploaded
- [ ] Update Homebrew formula

### Post-Release
- [ ] Test `brew install queen` works
- [ ] Test `go install` works
- [ ] Test install script works
- [ ] Announce release (if applicable)

## Rollback Procedure

### GitHub Release
```bash
# Mark release as pre-release (hides from latest)
gh release edit v0.1.0 --prerelease

# Or delete release entirely
gh release delete v0.1.0
git push --delete origin v0.1.0
```

### Homebrew
```bash
# Revert formula to previous version
cd homebrew-queenbee
git revert HEAD
git push
```

### Users
```bash
# Rollback via Homebrew
brew uninstall queen
brew install queen@0.0.9  # Previous version

# Or via go install
go install github.com/tjboudreaux/queenbee/queen/cmd/queen@v0.0.9
```

## Monitoring (Future)

For Phase 1, no runtime monitoring is needed (CLI tool, not a service).

Future considerations for Phase 2+ (Queen daemon):
- Health check endpoint
- Prometheus metrics
- Log aggregation
