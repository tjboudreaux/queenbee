package beads

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// Issue represents a beads issue from issues.jsonl.
type Issue struct {
	ID          string    `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Status      string    `json:"status"`
	Priority    int       `json:"priority"`
	IssueType   string    `json:"issue_type"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// Issue statuses
const (
	StatusOpen       = "open"
	StatusInProgress = "in_progress"
	StatusBlocked    = "blocked"
	StatusDone       = "done"
	StatusClosed     = "closed"
)

// ReadIssues reads all issues from the beads database.
func ReadIssues(beadsDir string) ([]Issue, error) {
	// Try issues.jsonl first (newer format), then beads.jsonl
	paths := []string{
		filepath.Join(beadsDir, "issues.jsonl"),
		filepath.Join(beadsDir, "beads.jsonl"),
	}

	var issuesPath string
	for _, p := range paths {
		if _, err := os.Stat(p); err == nil {
			issuesPath = p
			break
		}
	}

	if issuesPath == "" {
		return nil, fmt.Errorf("no issues file found in %s", beadsDir)
	}

	f, err := os.Open(issuesPath)
	if err != nil {
		return nil, fmt.Errorf("open issues file: %w", err)
	}
	defer f.Close()

	var issues []Issue
	scanner := bufio.NewScanner(f)
	lineNum := 0

	for scanner.Scan() {
		lineNum++
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}

		var issue Issue
		if err := json.Unmarshal(line, &issue); err != nil {
			// Skip malformed lines
			continue
		}
		issues = append(issues, issue)
	}

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("reading issues: %w", err)
	}

	return issues, nil
}

// GetIssueByID retrieves a specific issue by ID.
func GetIssueByID(beadsDir, id string) (*Issue, error) {
	issues, err := ReadIssues(beadsDir)
	if err != nil {
		return nil, err
	}

	// Find latest version (last entry with this ID wins)
	var found *Issue
	for i := range issues {
		if issues[i].ID == id {
			found = &issues[i]
		}
	}

	if found == nil {
		return nil, &IssueNotFoundError{ID: id}
	}

	return found, nil
}

// ValidateIssueExists checks if an issue ID exists and is valid.
func ValidateIssueExists(beadsDir, id string) error {
	if id == "" {
		return nil // Empty ID is valid (optional reference)
	}

	// Basic format validation
	if !strings.HasPrefix(id, "qb-") {
		return fmt.Errorf("invalid issue ID format: %s (expected qb-xxx)", id)
	}

	issue, err := GetIssueByID(beadsDir, id)
	if err != nil {
		return err
	}

	// Check if issue is in a terminal state
	if issue.Status == StatusDone || issue.Status == StatusClosed {
		return &IssueClosedError{ID: id, Status: issue.Status}
	}

	return nil
}

// ListOpenIssues returns all open (non-closed) issues.
func ListOpenIssues(beadsDir string) ([]Issue, error) {
	issues, err := ReadIssues(beadsDir)
	if err != nil {
		return nil, err
	}

	// Merge by ID (last entry wins)
	byID := make(map[string]*Issue)
	for i := range issues {
		issue := issues[i]
		byID[issue.ID] = &issue
	}

	var open []Issue
	for _, issue := range byID {
		if issue.Status != StatusDone && issue.Status != StatusClosed {
			open = append(open, *issue)
		}
	}

	return open, nil
}

// IssueNotFoundError indicates an issue was not found.
type IssueNotFoundError struct {
	ID string
}

func (e *IssueNotFoundError) Error() string {
	return "issue not found: " + e.ID
}

// IssueClosedError indicates an issue is closed.
type IssueClosedError struct {
	ID     string
	Status string
}

func (e *IssueClosedError) Error() string {
	return fmt.Sprintf("issue %s is %s", e.ID, e.Status)
}
