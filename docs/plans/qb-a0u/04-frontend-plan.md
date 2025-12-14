# Frontend Engineer Plan: Queen CLI Architecture

## Overview

This document covers the Go CLI architecture for the `queen` binary. Despite being a CLI tool, this is the "frontend" that users interact with.

## Module Structure

```
github.com/tjboudreaux/queenbee/
├── queen/
│   ├── cmd/
│   │   └── queen/
│   │       └── main.go           # CLI entry point
│   ├── internal/
│   │   ├── cli/
│   │   │   ├── root.go           # Root command (cobra)
│   │   │   ├── msg.go            # msg subcommands
│   │   │   ├── assign.go         # assign/claim/release commands
│   │   │   ├── reserve.go        # reserve/unreserve commands
│   │   │   └── version.go        # version command
│   │   ├── messages/
│   │   │   ├── message.go        # Message type
│   │   │   ├── store.go          # JSONL storage
│   │   │   └── store_test.go
│   │   ├── assignments/
│   │   │   ├── assignment.go     # Assignment type
│   │   │   ├── store.go          # JSONL storage
│   │   │   └── store_test.go
│   │   ├── reservations/
│   │   │   ├── reservation.go    # Reservation type
│   │   │   ├── store.go          # JSONL storage
│   │   │   ├── matcher.go        # Glob pattern matching
│   │   │   └── store_test.go
│   │   ├── droids/
│   │   │   ├── discovery.go      # Scan .factory/droids/
│   │   │   ├── validation.go     # Validate droid names
│   │   │   └── discovery_test.go
│   │   ├── beads/
│   │   │   ├── integration.go    # Read beads issues
│   │   │   └── paths.go          # Find .beads/ directory
│   │   └── config/
│   │       ├── config.go         # CLI configuration
│   │       └── identity.go       # Current droid identity
│   ├── go.mod
│   ├── go.sum
│   └── Makefile
```

## Dependencies

### External
| Package | Purpose | Version |
|---------|---------|---------|
| `github.com/spf13/cobra` | CLI framework | v1.8+ |
| `github.com/oklog/ulid/v2` | ULID generation | v2.1+ |
| `github.com/fatih/color` | Colored output | v1.16+ |
| `github.com/bmatcuk/doublestar/v4` | Glob matching | v4.6+ |

### Standard Library
- `encoding/json` - JSONL serialization
- `os` / `path/filepath` - File operations
- `time` - Timestamps and TTL
- `sync` - Mutex for ID generation

## CLI Commands

### Root Command
```go
// internal/cli/root.go
var rootCmd = &cobra.Command{
    Use:   "queen",
    Short: "Multi-agent coordination for QueenBee",
    Long:  `Queen CLI extends Beads with messaging, assignments, and file reservations.`,
}

func Execute() error {
    return rootCmd.Execute()
}

func init() {
    rootCmd.PersistentFlags().String("droid", "", "Current droid identity (default: $QUEEN_DROID)")
    rootCmd.PersistentFlags().Bool("json", false, "Output in JSON format")
    rootCmd.PersistentFlags().String("beads-dir", "", "Path to .beads directory")
}
```

### Message Commands
```go
// internal/cli/msg.go
var msgCmd = &cobra.Command{
    Use:   "msg",
    Short: "Inter-agent messaging",
}

var msgSendCmd = &cobra.Command{
    Use:   "send <to> <message>",
    Short: "Send a message to another droid",
    Args:  cobra.ExactArgs(2),
    RunE:  runMsgSend,
}

var msgInboxCmd = &cobra.Command{
    Use:   "inbox",
    Short: "View messages addressed to you",
    RunE:  runMsgInbox,
}

var msgReplyCmd = &cobra.Command{
    Use:   "reply <msg-id> <message>",
    Short: "Reply to a message",
    Args:  cobra.ExactArgs(2),
    RunE:  runMsgReply,
}

var msgReadCmd = &cobra.Command{
    Use:   "read <msg-id>",
    Short: "Mark a message as read",
    Args:  cobra.ExactArgs(1),
    RunE:  runMsgRead,
}

var msgThreadCmd = &cobra.Command{
    Use:   "thread <issue-id>",
    Short: "View message thread for an issue",
    Args:  cobra.ExactArgs(1),
    RunE:  runMsgThread,
}

func init() {
    msgCmd.AddCommand(msgSendCmd, msgInboxCmd, msgReplyCmd, msgReadCmd, msgThreadCmd)
    
    msgSendCmd.Flags().String("issue", "", "Related issue ID")
    msgSendCmd.Flags().String("subject", "", "Message subject")
    msgSendCmd.Flags().String("importance", "normal", "Importance: low|normal|high|urgent")
    
    msgInboxCmd.Flags().Bool("unread", false, "Show only unread messages")
    msgInboxCmd.Flags().Duration("since", 0, "Show messages since duration (e.g., 1h, 24h)")
    
    rootCmd.AddCommand(msgCmd)
}
```

### Assignment Commands
```go
// internal/cli/assign.go
var assignCmd = &cobra.Command{
    Use:   "assign <issue-id> <droid>",
    Short: "Assign an issue to a droid",
    Args:  cobra.ExactArgs(2),
    RunE:  runAssign,
}

var claimCmd = &cobra.Command{
    Use:   "claim <issue-id>",
    Short: "Claim an issue for yourself",
    Args:  cobra.ExactArgs(1),
    RunE:  runClaim,
}

var releaseCmd = &cobra.Command{
    Use:   "release <issue-id>",
    Short: "Release your assignment on an issue",
    Args:  cobra.ExactArgs(1),
    RunE:  runRelease,
}

var assignmentsCmd = &cobra.Command{
    Use:   "assignments",
    Short: "List active assignments",
    RunE:  runAssignments,
}

func init() {
    assignCmd.Flags().String("worktree", "", "Worktree context")
    assignCmd.Flags().String("reason", "", "Reason for assignment")
    
    assignmentsCmd.Flags().String("droid", "", "Filter by droid")
    assignmentsCmd.Flags().String("status", "active", "Filter by status")
    
    rootCmd.AddCommand(assignCmd, claimCmd, releaseCmd, assignmentsCmd)
}
```

### Reservation Commands
```go
// internal/cli/reserve.go
var reserveCmd = &cobra.Command{
    Use:   "reserve <pattern...>",
    Short: "Reserve files for editing",
    Args:  cobra.MinimumNArgs(1),
    RunE:  runReserve,
}

var reservedCmd = &cobra.Command{
    Use:   "reserved",
    Short: "List active file reservations",
    RunE:  runReserved,
}

var unreserveCmd = &cobra.Command{
    Use:   "unreserve [pattern...]",
    Short: "Release file reservations",
    RunE:  runUnreserve,
}

func init() {
    reserveCmd.Flags().String("issue", "", "Related issue ID")
    reserveCmd.Flags().Duration("ttl", 2*time.Hour, "Time to live")
    reserveCmd.Flags().Bool("exclusive", true, "Exclusive reservation")
    reserveCmd.Flags().String("reason", "", "Reason for reservation")
    reserveCmd.Flags().Bool("force", false, "Override existing conflicts")
    reserveCmd.Flags().Bool("notify", false, "Auto-message conflict holder")
    
    reservedCmd.Flags().String("droid", "", "Filter by droid")
    reservedCmd.Flags().String("path", "", "Check specific path")
    
    unreserveCmd.Flags().Bool("all", false, "Release all reservations")
    
    rootCmd.AddCommand(reserveCmd, reservedCmd, unreserveCmd)
}
```

### Config Commands
```go
// internal/cli/config.go
var configCmd = &cobra.Command{
    Use:   "config",
    Short: "Manage queen configuration",
}

var configSetCmd = &cobra.Command{
    Use:   "set <key> <value>",
    Short: "Set a configuration value",
    Args:  cobra.ExactArgs(2),
    RunE:  runConfigSet,
}

var configGetCmd = &cobra.Command{
    Use:   "get <key>",
    Short: "Get a configuration value",
    Args:  cobra.ExactArgs(1),
    RunE:  runConfigGet,
}

var configListCmd = &cobra.Command{
    Use:   "list",
    Short: "List all configuration values",
    RunE:  runConfigList,
}

func init() {
    configCmd.AddCommand(configSetCmd, configGetCmd, configListCmd)
    rootCmd.AddCommand(configCmd)
}
```

## Type Definitions

```go
// internal/messages/message.go
type Message struct {
    ID         string    `json:"id"`
    CreatedAt  time.Time `json:"created_at"`
    From       string    `json:"from"`
    To         string    `json:"to"`
    Subject    string    `json:"subject"`
    Body       string    `json:"body"`
    IssueID    string    `json:"issue_id,omitempty"`
    ReplyTo    string    `json:"reply_to,omitempty"`
    ThreadID   string    `json:"thread_id,omitempty"`
    Importance string    `json:"importance"`
    Read       bool      `json:"read"`
    ReadAt     *time.Time `json:"read_at,omitempty"`
    Deleted    bool      `json:"deleted,omitempty"`
}

// internal/assignments/assignment.go
type Assignment struct {
    ID           string    `json:"id"`
    CreatedAt    time.Time `json:"created_at"`
    UpdatedAt    time.Time `json:"updated_at"`
    IssueID      string    `json:"issue_id"`
    Droid        string    `json:"droid"`
    AssignedBy   string    `json:"assigned_by"`
    Status       string    `json:"status"` // active, completed, released, reassigned
    Worktree     string    `json:"worktree,omitempty"`
    Reason       string    `json:"reason,omitempty"`
    PreviousDroid string   `json:"previous_droid,omitempty"`
}

// internal/reservations/reservation.go
type Reservation struct {
    ID         string    `json:"id"`
    CreatedAt  time.Time `json:"created_at"`
    ExpiresAt  time.Time `json:"expires_at"`
    ReleasedAt *time.Time `json:"released_at,omitempty"`
    Pattern    string    `json:"pattern"`
    Droid      string    `json:"droid"`
    IssueID    string    `json:"issue_id,omitempty"`
    Status     string    `json:"status"` // active, expired, released
    Exclusive  bool      `json:"exclusive"`
    Reason     string    `json:"reason,omitempty"`
}
```

## Droid Identity

```go
// internal/config/identity.go
func GetCurrentDroid(cmd *cobra.Command, cfg *Config) (string, error) {
    // 1. Check --droid flag (highest priority)
    if droid, _ := cmd.Flags().GetString("droid"); droid != "" {
        return droid, nil
    }
    
    // 2. Check QUEEN_DROID environment variable
    if droid := os.Getenv("QUEEN_DROID"); droid != "" {
        return droid, nil
    }
    
    // 3. Check FACTORY_DROID environment variable (Factory sets this)
    if droid := os.Getenv("FACTORY_DROID"); droid != "" {
        return droid, nil
    }
    
    // 4. Check config file (.beads/queen_config.yaml)
    if cfg != nil && cfg.Droid != "" {
        return cfg.Droid, nil
    }
    
    return "", fmt.Errorf("no droid identity: set via 'queen config set droid <name>', QUEEN_DROID env, or --droid flag")
}
```

## Configuration

```go
// internal/config/config.go
import "gopkg.in/yaml.v3"

type Config struct {
    Droid string        `yaml:"droid,omitempty"`
    TTL   time.Duration `yaml:"ttl,omitempty"`
}

func LoadConfig(beadsDir string) (*Config, error) {
    path := filepath.Join(beadsDir, "queen_config.yaml")
    data, err := os.ReadFile(path)
    if err != nil {
        if os.IsNotExist(err) {
            return &Config{}, nil // Empty config is fine
        }
        return nil, err
    }
    
    var cfg Config
    if err := yaml.Unmarshal(data, &cfg); err != nil {
        return nil, fmt.Errorf("invalid config: %w", err)
    }
    return &cfg, nil
}

func SaveConfig(beadsDir string, cfg *Config) error {
    path := filepath.Join(beadsDir, "queen_config.yaml")
    data, err := yaml.Marshal(cfg)
    if err != nil {
        return err
    }
    return os.WriteFile(path, data, 0644)
}

func (c *Config) Set(key, value string) error {
    switch key {
    case "droid":
        c.Droid = value
    case "ttl":
        d, err := time.ParseDuration(value)
        if err != nil {
            return fmt.Errorf("invalid duration: %w", err)
        }
        c.TTL = d
    default:
        return fmt.Errorf("unknown config key: %s (valid: droid, ttl)", key)
    }
    return nil
}

func (c *Config) Get(key string) (string, error) {
    switch key {
    case "droid":
        return c.Droid, nil
    case "ttl":
        if c.TTL == 0 {
            return "2h (default)", nil
        }
        return c.TTL.String(), nil
    default:
        return "", fmt.Errorf("unknown config key: %s", key)
    }
}
```

## Droid Validation

```go
// internal/droids/validation.go
func ValidateDroid(beadsDir, name string) error {
    droids, err := DiscoverDroids(beadsDir)
    if err != nil {
        return fmt.Errorf("failed to discover droids: %w", err)
    }
    
    for _, d := range droids {
        if d.Name == name {
            return nil
        }
    }
    
    // Suggest similar names
    suggestions := findSimilar(droids, name)
    if len(suggestions) > 0 {
        return fmt.Errorf("unknown droid %q, did you mean: %s", name, strings.Join(suggestions, ", "))
    }
    
    return fmt.Errorf("unknown droid %q, available droids: %s", name, listDroids(droids))
}

// internal/droids/discovery.go
type Droid struct {
    Name  string
    Path  string
    Model string
}

func DiscoverDroids(beadsDir string) ([]Droid, error) {
    // Find .factory/droids/ relative to beads dir or git root
    factoryDir := findFactoryDir(beadsDir)
    droidsDir := filepath.Join(factoryDir, "droids")
    
    entries, err := os.ReadDir(droidsDir)
    if err != nil {
        if os.IsNotExist(err) {
            return nil, nil // No droids directory
        }
        return nil, err
    }
    
    var droids []Droid
    for _, e := range entries {
        if !e.IsDir() && strings.HasSuffix(e.Name(), ".md") {
            name := strings.TrimSuffix(e.Name(), ".md")
            droids = append(droids, Droid{
                Name: name,
                Path: filepath.Join(droidsDir, e.Name()),
            })
        }
    }
    
    return droids, nil
}
```

## Output Formatting

```go
// internal/cli/output.go
type OutputFormatter struct {
    JSON   bool
    Writer io.Writer
}

func (o *OutputFormatter) Print(v interface{}) error {
    if o.JSON {
        enc := json.NewEncoder(o.Writer)
        enc.SetIndent("", "  ")
        return enc.Encode(v)
    }
    
    // Human-readable output
    switch val := v.(type) {
    case *Message:
        return o.printMessage(val)
    case []Message:
        return o.printMessages(val)
    case *Assignment:
        return o.printAssignment(val)
    // ... etc
    }
    
    return fmt.Errorf("unknown type: %T", v)
}

func (o *OutputFormatter) printMessage(m *Message) error {
    color.New(color.FgCyan, color.Bold).Fprintf(o.Writer, "[%s] ", m.ID)
    if m.Importance == "urgent" {
        color.New(color.FgRed, color.Bold).Fprint(o.Writer, "URGENT ")
    }
    fmt.Fprintf(o.Writer, "From: %s → %s\n", m.From, m.To)
    fmt.Fprintf(o.Writer, "Subject: %s\n", m.Subject)
    fmt.Fprintf(o.Writer, "%s\n", m.Body)
    return nil
}
```

## Error Handling

```go
// internal/cli/errors.go
type UserError struct {
    Message    string
    Suggestion string
}

func (e *UserError) Error() string {
    if e.Suggestion != "" {
        return fmt.Sprintf("%s\n\nSuggestion: %s", e.Message, e.Suggestion)
    }
    return e.Message
}

// Usage in commands
func runMsgSend(cmd *cobra.Command, args []string) error {
    to := args[0]
    body := args[1]
    
    if err := droids.ValidateDroid(beadsDir, to); err != nil {
        return &UserError{
            Message:    fmt.Sprintf("Invalid recipient: %s", err),
            Suggestion: "Run 'queen droids' to see available droids",
        }
    }
    
    // ... rest of command
}
```

## Testing Strategy

### Unit Tests
| Component | Test Focus | Priority |
|-----------|------------|----------|
| `messages/store.go` | CRUD, append-only, latest resolution | P0 |
| `assignments/store.go` | CRUD, unique constraint | P0 |
| `reservations/store.go` | CRUD, TTL expiration | P0 |
| `reservations/matcher.go` | Glob overlap detection | P0 |
| `droids/discovery.go` | Scan .factory/droids/ | P0 |
| `droids/validation.go` | Name validation, suggestions | P1 |
| `config/identity.go` | Flag/env precedence | P1 |

### Integration Tests
| Flow | Description | Priority |
|------|-------------|----------|
| Message round-trip | Send → Inbox → Read → Reply | P0 |
| Assignment lifecycle | Assign → Work → Complete/Release | P0 |
| Reservation lifecycle | Reserve → Check → Unreserve | P0 |
| Conflict detection | Overlapping reservations | P0 |
| Cross-worktree | Verify shared .beads/ | P1 |

## Build Configuration

```makefile
# queen/Makefile
VERSION ?= $(shell git describe --tags --always --dirty)
COMMIT ?= $(shell git rev-parse --short HEAD)
LDFLAGS := -ldflags "-X main.Version=$(VERSION) -X main.Commit=$(COMMIT)"

.PHONY: build install test lint

build:
	go build $(LDFLAGS) -o queen ./cmd/queen

install:
	go install $(LDFLAGS) ./cmd/queen

test:
	go test -v -race -coverprofile=coverage.out ./...
	go tool cover -func=coverage.out

lint:
	golangci-lint run

clean:
	rm -f queen coverage.out
```

## Implementation Order

1. [ ] Project setup: go.mod, directory structure, Makefile
2. [ ] Core infrastructure: JSONL store, ULID generation, path discovery
3. [ ] Droid discovery and validation
4. [ ] Message types and storage
5. [ ] Message CLI commands (send, inbox, reply, read, thread)
6. [ ] Assignment types and storage
7. [ ] Assignment CLI commands (assign, claim, release, assignments)
8. [ ] Reservation types and storage
9. [ ] Glob pattern matching and conflict detection
10. [ ] Reservation CLI commands (reserve, reserved, unreserve)
11. [ ] JSON output mode for all commands
12. [ ] Integration tests
13. [ ] CI/CD pipeline
