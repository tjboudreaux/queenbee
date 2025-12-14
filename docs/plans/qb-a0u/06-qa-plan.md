# QA Automation Plan: Phase 1 - Queen CLI Extensions

## Test Strategy

### Coverage Target: 90%

Based on user requirement for 90% test coverage. Strategy:
- Unit tests for all business logic (95%+ coverage)
- Integration tests for CLI commands and storage
- No E2E tests needed for Phase 1 (CLI-only, no UI)

### Test Pyramid

| Level | Count | Scope | Coverage Target |
|-------|-------|-------|-----------------|
| Unit | ~60 | Functions, methods | 95% |
| Integration | ~25 | Commands, stores | 85% |
| E2E | 0 | N/A for Phase 1 | - |

## Unit Test Cases

### JSONL Store (`internal/store/jsonl_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-001 | Append to new file | Record, non-existent file | File created, record written | P0 |
| UT-002 | Append to existing file | Record, existing file | Record appended on new line | P0 |
| UT-003 | ReadAll empty file | Empty file | Empty slice, no error | P0 |
| UT-004 | ReadAll with records | File with 3 records | 3 records returned | P0 |
| UT-005 | ReadAll with corrupt line | File with 1 bad JSON line | Skip bad line, return others | P0 |
| UT-006 | GetLatest single record | Records, target ID | Matching record | P0 |
| UT-007 | GetLatest multiple versions | 3 versions same ID | Last version returned | P0 |
| UT-008 | GetLatest not found | Records, unknown ID | nil | P0 |
| UT-009 | Concurrent append safety | 10 goroutines | All records written | P1 |

### ID Generation (`internal/store/id_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-010 | NewMessageID format | - | Starts with "qm-", 29 chars | P0 |
| UT-011 | NewAssignmentID format | - | Starts with "qa-", 29 chars | P0 |
| UT-012 | NewReservationID format | - | Starts with "qr-", 29 chars | P0 |
| UT-013 | ID uniqueness | Generate 1000 IDs | All unique | P0 |
| UT-014 | ID monotonic | Generate in sequence | Lexicographically increasing | P1 |

### Message Store (`internal/messages/store_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-020 | Send creates message | Valid message | ID assigned, stored | P0 |
| UT-021 | Send sets timestamp | Message without timestamp | CreatedAt set | P0 |
| UT-022 | Send inherits thread from issue | Message with issue_id | thread_id = issue_id | P0 |
| UT-023 | Send inherits thread from reply | Reply to existing msg | thread_id from parent | P0 |
| UT-024 | GetByID existing | Valid ID | Message returned | P0 |
| UT-025 | GetByID not found | Invalid ID | nil, no error | P0 |
| UT-026 | GetInbox filters by recipient | Multiple messages | Only "to" matches | P0 |
| UT-027 | GetInbox unread filter | Mix of read/unread | Only unread | P0 |
| UT-028 | GetInbox since filter | Messages at various times | Only recent | P0 |
| UT-029 | GetInbox excludes deleted | Deleted message | Not returned | P0 |
| UT-030 | MarkRead updates status | Unread message ID | read=true, read_at set | P0 |
| UT-031 | MarkRead already read | Read message ID | No error, timestamp preserved | P1 |
| UT-032 | GetThread by issue | Messages with issue_id | All matching messages | P0 |
| UT-033 | GetThread chronological order | Multiple messages | Sorted by created_at asc | P0 |

### Assignment Store (`internal/assignments/store_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-040 | Assign new issue | issue_id, droid | Assignment created | P0 |
| UT-041 | Assign duplicate | Same issue_id | Error: already assigned | P0 |
| UT-042 | Claim self | issue_id | Assignment with assigned_by=self | P0 |
| UT-043 | Release active | issue_id, correct droid | Status = released | P0 |
| UT-044 | Release wrong droid | issue_id, different droid | Error: not your assignment | P0 |
| UT-045 | Release non-existent | Unknown issue_id | Error: no assignment | P0 |
| UT-046 | GetActiveForIssue | issue_id | Active assignment or nil | P0 |
| UT-047 | GetActiveForDroid | droid name | List of active assignments | P0 |
| UT-048 | Complete assignment | issue_id | Status = completed | P0 |
| UT-049 | Reassign from another | issue_id, new droid | Previous droid released | P1 |

### Reservation Store (`internal/reservations/store_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-050 | Reserve new pattern | "src/**", droid | Reservation created | P0 |
| UT-051 | Reserve with TTL | pattern, 1h TTL | ExpiresAt = now + 1h | P0 |
| UT-052 | Reserve default TTL | pattern, no TTL | ExpiresAt = now + 2h | P0 |
| UT-053 | Reserve conflict detected | Overlapping exclusive | Conflict returned | P0 |
| UT-054 | Reserve no conflict same droid | Same droid overlap | No conflict | P0 |
| UT-055 | Reserve non-exclusive no conflict | Both non-exclusive | No conflict | P1 |
| UT-056 | Release by pattern | Exact pattern | Status = released | P0 |
| UT-057 | Release by overlap | Overlapping pattern | All overlapping released | P1 |
| UT-058 | ReleaseAll for droid | droid name | All droid's reservations | P0 |
| UT-059 | GetActive excludes expired | Expired reservation | Not returned | P0 |
| UT-060 | GetActive excludes released | Released reservation | Not returned | P0 |
| UT-061 | CheckPath reserved | Reserved path | Matching reservation | P0 |
| UT-062 | CheckPath not reserved | Unreserved path | nil | P0 |

### Glob Matcher (`internal/reservations/matcher_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-070 | Exact match | "a.txt", "a.txt" | true | P0 |
| UT-071 | No match | "a.txt", "b.txt" | false | P0 |
| UT-072 | Wildcard matches literal | "*.txt", "a.txt" | true | P0 |
| UT-073 | Double star directory | "src/**", "src/a/b/c.go" | true | P0 |
| UT-074 | Nested overlap | "src/a/**", "src/a/b/**" | true | P0 |
| UT-075 | No overlap different dirs | "src/**", "test/**" | false | P0 |
| UT-076 | Single file vs dir | "src/a.go", "src/**" | true | P0 |
| UT-077 | Extension wildcard | "**/*.ts", "**/*.tsx" | false | P1 |
| UT-078 | Question mark wildcard | "?.txt", "a.txt" | true | P1 |

### Droid Discovery (`internal/droids/discovery_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-080 | Discover droids | .factory/droids/ with files | List of droid names | P0 |
| UT-081 | No droids directory | Missing .factory/droids/ | Empty list, no error | P0 |
| UT-082 | Empty droids directory | Empty .factory/droids/ | Empty list | P0 |
| UT-083 | Ignore non-md files | Mix of .md and others | Only .md files | P0 |
| UT-084 | Validate known droid | Existing droid name | nil error | P0 |
| UT-085 | Validate unknown droid | Non-existent name | Error with suggestions | P0 |
| UT-086 | Suggest similar names | "ui-eng" vs "ui-engineer" | Suggestion included | P1 |

### Identity (`internal/config/identity_test.go`)

| ID | Test Case | Input | Expected | Priority |
|----|-----------|-------|----------|----------|
| UT-090 | Flag takes precedence | --droid=x, QUEEN_DROID=y | "x" | P0 |
| UT-091 | Env var fallback | No flag, QUEEN_DROID=y | "y" | P0 |
| UT-092 | Factory env fallback | No flag, FACTORY_DROID=z | "z" | P0 |
| UT-093 | No identity error | No flag, no env | Error | P0 |

## Integration Test Cases

### Message Commands (`cmd/queen/msg_test.go`)

| ID | Scenario | Setup | Steps | Expected |
|----|----------|-------|-------|----------|
| IT-001 | Send and receive | Init .beads/ | 1. `queen msg send bob "hi"` 2. `queen msg inbox` (as bob) | Message visible in inbox |
| IT-002 | Reply threading | Message exists | 1. `queen msg reply <id> "reply"` 2. `queen msg thread <issue>` | Thread shows both messages |
| IT-003 | Mark read | Unread message | 1. `queen msg read <id>` 2. `queen msg inbox --unread` | Message not in unread |
| IT-004 | Issue-based thread | - | 1. Send with --issue=qb-1 2. Send with --issue=qb-1 3. `queen msg thread qb-1` | Both messages in thread |
| IT-005 | JSON output | - | `queen msg inbox --json` | Valid JSON array |

### Assignment Commands (`cmd/queen/assign_test.go`)

| ID | Scenario | Setup | Steps | Expected |
|----|----------|-------|-------|----------|
| IT-010 | Assign and list | Issue exists | 1. `queen assign qb-1 ui-engineer` 2. `queen assignments` | Assignment shown |
| IT-011 | Claim self | Issue exists | 1. `queen claim qb-1` | Assigned to current droid |
| IT-012 | Release assignment | Assignment exists | 1. `queen release qb-1` | Status = released |
| IT-013 | Prevent duplicate | Already assigned | `queen assign qb-1 other` | Error: already assigned |
| IT-014 | Filter by droid | Multiple assignments | `queen assignments --droid=ui-engineer` | Only ui-engineer's |
| IT-015 | Invalid droid | - | `queen assign qb-1 unknown-droid` | Error: unknown droid |

### Reservation Commands (`cmd/queen/reserve_test.go`)

| ID | Scenario | Setup | Steps | Expected |
|----|----------|-------|-------|----------|
| IT-020 | Reserve and list | - | 1. `queen reserve "src/**"` 2. `queen reserved` | Reservation shown |
| IT-021 | Unreserve specific | Reservation exists | `queen unreserve "src/**"` | Status = released |
| IT-022 | Unreserve all | Multiple reservations | `queen unreserve --all` | All released |
| IT-023 | Conflict detected | Existing exclusive | `queen reserve "src/**"` (other droid) | Conflict warning |
| IT-024 | Custom TTL | - | `queen reserve "src/**" --ttl=1h` | ExpiresAt correct |
| IT-025 | Check path | Reservation exists | `queen reserved --path=src/a.go` | Shows matching reservation |
| IT-026 | Expired not shown | Expired reservation | `queen reserved` | Not in list |

### Cross-Worktree (`integration/worktree_test.go`)

| ID | Scenario | Setup | Steps | Expected |
|----|----------|-------|-------|----------|
| IT-030 | Shared messages | Two worktrees | 1. Send in WT1 2. Inbox in WT2 | Message visible |
| IT-031 | Shared assignments | Two worktrees | 1. Assign in WT1 2. List in WT2 | Assignment visible |
| IT-032 | Shared reservations | Two worktrees | 1. Reserve in WT1 2. Conflict in WT2 | Conflict detected |

## Coverage Verification

```bash
# Run tests with coverage
go test -v -race -coverprofile=coverage.out ./...

# Generate HTML report
go tool cover -html=coverage.out -o coverage.html

# Check coverage meets 90% threshold
go tool cover -func=coverage.out | grep total | awk '{print $3}' | \
  awk -F'%' '{if ($1 < 90) exit 1}'
```

### Coverage by Package Target

| Package | Target | Critical Paths |
|---------|--------|----------------|
| `internal/store` | 95% | Append, ReadAll, GetLatest |
| `internal/messages` | 90% | Send, Inbox, MarkRead, Thread |
| `internal/assignments` | 90% | Assign, Claim, Release |
| `internal/reservations` | 90% | Reserve, Conflict, Release |
| `internal/droids` | 85% | Discovery, Validation |
| `internal/config` | 85% | Identity resolution |
| `internal/cli` | 80% | Command handlers |

## Test Fixtures

```go
// internal/testutil/fixtures.go

func SetupTestBeads(t *testing.T) string {
    t.Helper()
    dir := t.TempDir()
    beadsDir := filepath.Join(dir, ".beads")
    if err := os.MkdirAll(beadsDir, 0755); err != nil {
        t.Fatal(err)
    }
    return beadsDir
}

func SetupTestDroids(t *testing.T, dir string, droids []string) {
    t.Helper()
    droidsDir := filepath.Join(dir, ".factory", "droids")
    if err := os.MkdirAll(droidsDir, 0755); err != nil {
        t.Fatal(err)
    }
    for _, d := range droids {
        path := filepath.Join(droidsDir, d+".md")
        if err := os.WriteFile(path, []byte("# "+d), 0644); err != nil {
            t.Fatal(err)
        }
    }
}

func CreateTestMessage(t *testing.T, store *MessageStore, from, to, body string) *Message {
    t.Helper()
    msg := &Message{From: from, To: to, Body: body, Importance: "normal"}
    if err := store.Send(msg); err != nil {
        t.Fatal(err)
    }
    return msg
}
```

## Test Execution

### Local Development
```bash
# Quick test (skip slow tests)
go test -v -short ./...

# Full test with race detection
go test -v -race ./...

# Specific package
go test -v ./internal/messages/...

# Specific test
go test -v -run TestSendMessage ./internal/messages/...
```

### CI Pipeline
```yaml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-go@v5
      with:
        go-version: '1.22'
    - name: Test with coverage
      run: |
        go test -v -race -coverprofile=coverage.out ./...
        go tool cover -func=coverage.out
    - name: Check coverage threshold
      run: |
        COVERAGE=$(go tool cover -func=coverage.out | grep total | awk '{print $3}' | tr -d '%')
        if (( $(echo "$COVERAGE < 90" | bc -l) )); then
          echo "Coverage $COVERAGE% is below 90% threshold"
          exit 1
        fi
```

## Test Maintenance

### Adding New Tests
1. Create test file in same package (`*_test.go`)
2. Add test ID to this document
3. Update coverage targets if new package

### Test Naming Convention
```go
// Unit tests: TestFunctionName_Scenario
func TestSend_WithIssueID(t *testing.T) {}

// Integration tests: TestScenarioName
func TestMessageRoundTrip(t *testing.T) {}

// Table-driven tests: TestFunctionName
func TestPatternsOverlap(t *testing.T) {
    tests := []struct {
        name string
        a, b string
        want bool
    }{
        {"exact match", "a.txt", "a.txt", true},
        // ...
    }
    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            // ...
        })
    }
}
```
