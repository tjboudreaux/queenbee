package beads

import (
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
	"time"
)

func setupTestBeads(t *testing.T, issues []Issue) string {
	t.Helper()
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Write issues.jsonl
	if len(issues) > 0 {
		f, err := os.Create(filepath.Join(beadsDir, "issues.jsonl"))
		if err != nil {
			t.Fatal(err)
		}
		defer f.Close()

		for _, issue := range issues {
			data, _ := json.Marshal(issue)
			f.Write(data)
			f.Write([]byte("\n"))
		}
	}

	return beadsDir
}

func TestReadIssues(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "First issue", Status: StatusOpen, Priority: 1},
		{ID: "qb-002", Title: "Second issue", Status: StatusInProgress, Priority: 2},
	}
	beadsDir := setupTestBeads(t, issues)

	result, err := ReadIssues(beadsDir)
	if err != nil {
		t.Fatalf("ReadIssues failed: %v", err)
	}

	if len(result) != 2 {
		t.Fatalf("Expected 2 issues, got %d", len(result))
	}

	if result[0].ID != "qb-001" {
		t.Errorf("First issue ID = %q, want %q", result[0].ID, "qb-001")
	}
	if result[1].Status != StatusInProgress {
		t.Errorf("Second issue status = %q, want %q", result[1].Status, StatusInProgress)
	}
}

func TestReadIssues_NoFile(t *testing.T) {
	beadsDir := setupTestBeads(t, nil)

	_, err := ReadIssues(beadsDir)
	if err == nil {
		t.Error("Expected error when no issues file exists")
	}
}

func TestReadIssues_EmptyFile(t *testing.T) {
	beadsDir := setupTestBeads(t, []Issue{})

	// Create empty file
	os.WriteFile(filepath.Join(beadsDir, "issues.jsonl"), []byte(""), 0644)

	result, err := ReadIssues(beadsDir)
	if err != nil {
		t.Fatalf("ReadIssues failed: %v", err)
	}

	if len(result) != 0 {
		t.Errorf("Expected 0 issues, got %d", len(result))
	}
}

func TestReadIssues_MalformedLines(t *testing.T) {
	beadsDir := setupTestBeads(t, nil)

	// Create file with mixed valid and invalid lines
	content := `{"id":"qb-001","title":"Valid","status":"open","priority":1}
not valid json
{"id":"qb-002","title":"Also Valid","status":"open","priority":2}
`
	os.WriteFile(filepath.Join(beadsDir, "issues.jsonl"), []byte(content), 0644)

	result, err := ReadIssues(beadsDir)
	if err != nil {
		t.Fatalf("ReadIssues failed: %v", err)
	}

	// Should skip invalid line and return 2 issues
	if len(result) != 2 {
		t.Errorf("Expected 2 issues (skipping invalid), got %d", len(result))
	}
}

func TestGetIssueByID(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "First", Status: StatusOpen},
		{ID: "qb-002", Title: "Second", Status: StatusInProgress},
	}
	beadsDir := setupTestBeads(t, issues)

	issue, err := GetIssueByID(beadsDir, "qb-002")
	if err != nil {
		t.Fatalf("GetIssueByID failed: %v", err)
	}

	if issue.Title != "Second" {
		t.Errorf("Title = %q, want %q", issue.Title, "Second")
	}
}

func TestGetIssueByID_NotFound(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "First", Status: StatusOpen},
	}
	beadsDir := setupTestBeads(t, issues)

	_, err := GetIssueByID(beadsDir, "qb-999")
	if err == nil {
		t.Error("Expected error for nonexistent issue")
	}

	_, ok := err.(*IssueNotFoundError)
	if !ok {
		t.Errorf("Expected IssueNotFoundError, got %T", err)
	}
}

func TestGetIssueByID_LastVersionWins(t *testing.T) {
	// Simulate issue being updated
	issues := []Issue{
		{ID: "qb-001", Title: "Original", Status: StatusOpen},
		{ID: "qb-001", Title: "Updated", Status: StatusInProgress},
	}
	beadsDir := setupTestBeads(t, issues)

	issue, err := GetIssueByID(beadsDir, "qb-001")
	if err != nil {
		t.Fatalf("GetIssueByID failed: %v", err)
	}

	// Should return the latest version
	if issue.Title != "Updated" {
		t.Errorf("Title = %q, want %q (last version)", issue.Title, "Updated")
	}
	if issue.Status != StatusInProgress {
		t.Errorf("Status = %q, want %q", issue.Status, StatusInProgress)
	}
}

func TestValidateIssueExists_Valid(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "Test", Status: StatusOpen},
	}
	beadsDir := setupTestBeads(t, issues)

	err := ValidateIssueExists(beadsDir, "qb-001")
	if err != nil {
		t.Errorf("ValidateIssueExists failed for valid issue: %v", err)
	}
}

func TestValidateIssueExists_Empty(t *testing.T) {
	beadsDir := setupTestBeads(t, nil)

	// Empty ID should be valid (optional reference)
	err := ValidateIssueExists(beadsDir, "")
	if err != nil {
		t.Errorf("Empty ID should be valid: %v", err)
	}
}

func TestValidateIssueExists_InvalidFormat(t *testing.T) {
	beadsDir := setupTestBeads(t, nil)

	err := ValidateIssueExists(beadsDir, "invalid-id")
	if err == nil {
		t.Error("Expected error for invalid ID format")
	}
}

func TestValidateIssueExists_NotFound(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "Test", Status: StatusOpen},
	}
	beadsDir := setupTestBeads(t, issues)

	err := ValidateIssueExists(beadsDir, "qb-999")
	if err == nil {
		t.Error("Expected error for nonexistent issue")
	}
}

func TestValidateIssueExists_Closed(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "Test", Status: StatusClosed},
	}
	beadsDir := setupTestBeads(t, issues)

	err := ValidateIssueExists(beadsDir, "qb-001")
	if err == nil {
		t.Error("Expected error for closed issue")
	}

	_, ok := err.(*IssueClosedError)
	if !ok {
		t.Errorf("Expected IssueClosedError, got %T", err)
	}
}

func TestListOpenIssues(t *testing.T) {
	now := time.Now()
	issues := []Issue{
		{ID: "qb-001", Title: "Open", Status: StatusOpen, CreatedAt: now},
		{ID: "qb-002", Title: "In Progress", Status: StatusInProgress, CreatedAt: now},
		{ID: "qb-003", Title: "Closed", Status: StatusClosed, CreatedAt: now},
		{ID: "qb-004", Title: "Done", Status: StatusDone, CreatedAt: now},
		{ID: "qb-005", Title: "Blocked", Status: StatusBlocked, CreatedAt: now},
	}
	beadsDir := setupTestBeads(t, issues)

	open, err := ListOpenIssues(beadsDir)
	if err != nil {
		t.Fatalf("ListOpenIssues failed: %v", err)
	}

	// Should return open, in_progress, blocked (not done/closed)
	if len(open) != 3 {
		t.Errorf("Expected 3 open issues, got %d", len(open))
	}
}

func TestListOpenIssues_MergesUpdates(t *testing.T) {
	issues := []Issue{
		{ID: "qb-001", Title: "Test", Status: StatusOpen},
		{ID: "qb-001", Title: "Test", Status: StatusClosed}, // Updated to closed
	}
	beadsDir := setupTestBeads(t, issues)

	open, err := ListOpenIssues(beadsDir)
	if err != nil {
		t.Fatalf("ListOpenIssues failed: %v", err)
	}

	// Should be 0 since the issue was closed
	if len(open) != 0 {
		t.Errorf("Expected 0 open issues (issue was closed), got %d", len(open))
	}
}

func TestIssueNotFoundError(t *testing.T) {
	err := &IssueNotFoundError{ID: "qb-123"}
	expected := "issue not found: qb-123"
	if err.Error() != expected {
		t.Errorf("Error() = %q, want %q", err.Error(), expected)
	}
}

func TestIssueClosedError(t *testing.T) {
	err := &IssueClosedError{ID: "qb-123", Status: "closed"}
	expected := "issue qb-123 is closed"
	if err.Error() != expected {
		t.Errorf("Error() = %q, want %q", err.Error(), expected)
	}
}
