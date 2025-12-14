package integration

import (
	"os"
	"path/filepath"
	"testing"
)

// BeadsFixture represents a test beads issue database fixture.
type BeadsFixture struct {
	Issues []IssueFixture
}

// IssueFixture represents a single issue for testing.
type IssueFixture struct {
	ID          string
	Title       string
	Description string
	Type        string // "epic", "task", "bug", "feature"
	Priority    int    // 0-4
	Status      string // "open", "in_progress", "blocked", "closed"
	Labels      []string
	DependsOn   []string
}

// StandardEpicFixture returns a standard epic with child tasks.
func StandardEpicFixture() BeadsFixture {
	return BeadsFixture{
		Issues: []IssueFixture{
			{
				ID:          "qb-epic1",
				Title:       "[Epic] User Authentication",
				Description: "Implement user authentication system",
				Type:        "epic",
				Priority:    1,
				Status:      "open",
				Labels:      []string{"auth", "security"},
			},
			{
				ID:          "qb-task1",
				Title:       "Implement login API",
				Description: "POST /api/login endpoint",
				Type:        "task",
				Priority:    1,
				Status:      "open",
				Labels:      []string{"backend", "api"},
				DependsOn:   []string{"qb-epic1"},
			},
			{
				ID:          "qb-task2",
				Title:       "Create login form UI",
				Description: "React login form component",
				Type:        "task",
				Priority:    1,
				Status:      "open",
				Labels:      []string{"frontend", "ui"},
				DependsOn:   []string{"qb-task1"},
			},
			{
				ID:          "qb-task3",
				Title:       "Add authentication tests",
				Description: "E2E tests for authentication flow",
				Type:        "task",
				Priority:    2,
				Status:      "open",
				Labels:      []string{"testing", "quality"},
				DependsOn:   []string{"qb-task1", "qb-task2"},
			},
		},
	}
}

// ConflictScenarioFixture returns issues that create file conflicts.
func ConflictScenarioFixture() BeadsFixture {
	return BeadsFixture{
		Issues: []IssueFixture{
			{
				ID:          "qb-refactor1",
				Title:       "Refactor Button component",
				Description: "Update Button component styling",
				Type:        "task",
				Priority:    1,
				Status:      "open",
				Labels:      []string{"ui", "refactor"},
			},
			{
				ID:          "qb-refactor2",
				Title:       "Add Button variants",
				Description: "Add primary, secondary variants to Button",
				Type:        "task",
				Priority:    1,
				Status:      "open",
				Labels:      []string{"ui", "feature"},
			},
		},
	}
}

// WriteBeadsIssuesFile creates a minimal issues.jsonl for testing.
// Note: This creates a simplified format that may not be fully compatible
// with the actual beads CLI, but works for Queen integration testing.
func WriteBeadsIssuesFile(t *testing.T, beadsDir string, fixture BeadsFixture) {
	t.Helper()

	issuesPath := filepath.Join(beadsDir, "issues.jsonl")

	var lines []byte
	for _, issue := range fixture.Issues {
		// Simple JSONL format - just enough for Queen to read
		line := `{"id":"` + issue.ID + `","title":"` + issue.Title + `",` +
			`"description":"` + issue.Description + `",` +
			`"type":"` + issue.Type + `","priority":` + string(rune('0'+issue.Priority)) + `,` +
			`"status":"` + issue.Status + `"}`
		lines = append(lines, []byte(line+"\n")...)
	}

	if err := os.WriteFile(issuesPath, lines, 0644); err != nil {
		t.Fatalf("failed to write issues.jsonl: %v", err)
	}
}

// DruidFixture represents a test droid configuration.
type DroidFixture struct {
	Name        string
	Skills      []string
	Labels      []string
	Description string
}

// StandardDroidsFixture returns a set of standard test droids.
func StandardDroidsFixture() []DroidFixture {
	return []DroidFixture{
		{
			Name:        "ui-engineer",
			Skills:      []string{"React", "TypeScript", "CSS"},
			Labels:      []string{"ui", "frontend"},
			Description: "Frontend UI development specialist",
		},
		{
			Name:        "api-engineer",
			Skills:      []string{"Go", "REST", "PostgreSQL"},
			Labels:      []string{"backend", "api"},
			Description: "Backend API development specialist",
		},
		{
			Name:        "qa-engineer",
			Skills:      []string{"Testing", "E2E", "CI/CD"},
			Labels:      []string{"testing", "quality"},
			Description: "Quality assurance specialist",
		},
		{
			Name:        "devops-engineer",
			Skills:      []string{"Docker", "Kubernetes", "Terraform"},
			Labels:      []string{"infra", "devops"},
			Description: "Infrastructure and DevOps specialist",
		},
	}
}

// WriteDroidFiles creates droid markdown files from fixtures.
func WriteDroidFiles(t *testing.T, droidsDir string, droids []DroidFixture) {
	t.Helper()

	for _, droid := range droids {
		content := "# " + droid.Name + "\n\n"
		content += droid.Description + "\n\n"
		content += "## Skills\n"
		for _, skill := range droid.Skills {
			content += "- " + skill + "\n"
		}
		content += "\n## Labels\n"
		for _, label := range droid.Labels {
			content += "- " + label + "\n"
		}

		path := filepath.Join(droidsDir, droid.Name+".md")
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatalf("failed to write droid file %s: %v", droid.Name, err)
		}
	}
}

// SetupStandardFixtures creates a test environment with standard fixtures.
func SetupStandardFixtures(t *testing.T, env *TestEnv) {
	t.Helper()

	// Write standard droids
	WriteDroidFiles(t, env.DroidsDir(), StandardDroidsFixture())

	// Write standard epic
	WriteBeadsIssuesFile(t, env.BeadsDir(), StandardEpicFixture())
}

// SetupConflictScenario creates a test environment for conflict testing.
func SetupConflictScenario(t *testing.T, env *TestEnv) {
	t.Helper()

	// Write standard droids
	WriteDroidFiles(t, env.DroidsDir(), StandardDroidsFixture())

	// Write conflict scenario issues
	WriteBeadsIssuesFile(t, env.BeadsDir(), ConflictScenarioFixture())
}
