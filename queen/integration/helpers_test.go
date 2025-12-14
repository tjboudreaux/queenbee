package integration

import (
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/tjboudreaux/queenbee/queen/internal/assignments"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
	"github.com/tjboudreaux/queenbee/queen/internal/droids"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
	"github.com/tjboudreaux/queenbee/queen/internal/reservations"
)

// TestEnv provides an isolated test environment for integration tests.
type TestEnv struct {
	t         *testing.T
	dir       string
	beadsDir  string
	droidsDir string

	Messages     *messages.Store
	Assignments  *assignments.Store
	Reservations *reservations.Store
}

// NewTestEnv creates a new isolated test environment with all stores initialized.
func NewTestEnv(t *testing.T) *TestEnv {
	t.Helper()

	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	droidsDir := filepath.Join(dir, ".factory", "droids")

	// Create directories
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatalf("failed to create .beads dir: %v", err)
	}
	if err := os.MkdirAll(droidsDir, 0755); err != nil {
		t.Fatalf("failed to create .factory/droids dir: %v", err)
	}

	env := &TestEnv{
		t:         t,
		dir:       dir,
		beadsDir:  beadsDir,
		droidsDir: droidsDir,
	}

	// Initialize stores
	var err error
	env.Messages, err = messages.NewStore(beadsDir)
	if err != nil {
		t.Fatalf("failed to create messages store: %v", err)
	}
	env.Assignments = assignments.NewStore(beadsDir)
	env.Reservations = reservations.NewStore(beadsDir)

	return env
}

// Dir returns the root directory of the test environment.
func (e *TestEnv) Dir() string {
	return e.dir
}

// BeadsDir returns the .beads directory path.
func (e *TestEnv) BeadsDir() string {
	return e.beadsDir
}

// DroidsDir returns the .factory/droids directory path.
func (e *TestEnv) DroidsDir() string {
	return e.droidsDir
}

// CreateDroid creates a test droid configuration file.
func (e *TestEnv) CreateDroid(name string, content string) {
	e.t.Helper()

	path := filepath.Join(e.droidsDir, name+".md")
	if err := os.WriteFile(path, []byte(content), 0644); err != nil {
		e.t.Fatalf("failed to create droid %s: %v", name, err)
	}
}

// CreateTestDroids creates a set of standard test droids.
func (e *TestEnv) CreateTestDroids() {
	e.t.Helper()

	e.CreateDroid("frontend-engineer", `# frontend-engineer

A test droid for frontend work.

## Skills
- TypeScript
- React
- CSS

## Labels
- ui
- frontend
`)

	e.CreateDroid("backend-engineer", `# backend-engineer

A test droid for backend work.

## Skills
- Go
- PostgreSQL
- REST APIs

## Labels
- backend
- api
`)

	e.CreateDroid("quality-engineer", `# quality-engineer

A test droid for quality assurance.

## Skills
- Testing
- Code Review
- CI/CD

## Labels
- quality
- testing
`)
}

// DiscoverDroids discovers droids in the test environment.
func (e *TestEnv) DiscoverDroids() ([]droids.Droid, error) {
	return droids.DiscoverDroids(e.beadsDir)
}

// SendMessage sends a test message.
func (e *TestEnv) SendMessage(from, to, subject, body string) (*messages.Message, error) {
	return e.Messages.Send(from, to, subject, body, messages.SendOptions{})
}

// CreateAssignment creates a test assignment.
func (e *TestEnv) CreateAssignment(issueID, droidName string) (*assignments.Assignment, error) {
	return e.Assignments.Assign(issueID, droidName, "test", assignments.AssignOptions{})
}

// CreateReservation creates a test file reservation.
func (e *TestEnv) CreateReservation(droidName, pattern string, exclusive bool, ttl time.Duration) (*reservations.Reservation, []reservations.Conflict, error) {
	return e.Reservations.Reserve(droidName, pattern, reservations.ReserveOptions{
		Exclusive: exclusive,
		TTL:       ttl,
	})
}

// GetActiveReservations returns all active (non-expired) reservations.
func (e *TestEnv) GetActiveReservations() ([]reservations.Reservation, error) {
	return e.Reservations.GetActive("")
}

// GetMessages returns messages sent to test droids.
func (e *TestEnv) GetMessages() ([]messages.Message, error) {
	var all []messages.Message
	for _, droid := range []string{"frontend-engineer", "backend-engineer", "quality-engineer"} {
		msgs, err := e.Messages.GetInbox(droid, messages.InboxOptions{Limit: 100})
		if err != nil {
			continue
		}
		all = append(all, msgs...)
	}
	return all, nil
}

// GetMessagesFor returns messages for a specific recipient.
func (e *TestEnv) GetMessagesFor(recipient string) ([]messages.Message, error) {
	return e.Messages.GetInbox(recipient, messages.InboxOptions{Limit: 100})
}

// GetAssignments returns all assignments.
func (e *TestEnv) GetAssignments() ([]assignments.Assignment, error) {
	return e.Assignments.GetAll("")
}

// GetActiveAssignments returns active assignments.
func (e *TestEnv) GetActiveAssignments() ([]assignments.Assignment, error) {
	return e.Assignments.GetAll("active")
}

// LoadConfig loads the config from the test environment.
func (e *TestEnv) LoadConfig() (*config.Config, error) {
	return config.LoadConfig(e.beadsDir)
}

// SaveConfig saves a config to the test environment.
func (e *TestEnv) SaveConfig(cfg *config.Config) error {
	return config.SaveConfig(e.beadsDir, cfg)
}
