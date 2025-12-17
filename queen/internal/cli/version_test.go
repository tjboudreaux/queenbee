package cli

import "testing"

func TestSetVersionInfo(t *testing.T) {
	// Save original values
	origVersion := version
	origCommit := commit
	origDate := date
	defer func() {
		version = origVersion
		commit = origCommit
		date = origDate
	}()

	SetVersionInfo("1.2.3", "abc1234", "2025-01-15T10:00:00Z")

	if version != "1.2.3" {
		t.Errorf("expected version '1.2.3', got '%s'", version)
	}
	if commit != "abc1234" {
		t.Errorf("expected commit 'abc1234', got '%s'", commit)
	}
	if date != "2025-01-15T10:00:00Z" {
		t.Errorf("expected date '2025-01-15T10:00:00Z', got '%s'", date)
	}
}

func TestSetVersionInfo_DefaultValues(t *testing.T) {
	// Save original values
	origVersion := version
	origCommit := commit
	origDate := date
	defer func() {
		version = origVersion
		commit = origCommit
		date = origDate
	}()

	// Simulate ldflags not being set (default values from main.go)
	SetVersionInfo("dev", "unknown", "unknown")

	if version != "dev" {
		t.Errorf("expected version 'dev', got '%s'", version)
	}
	if commit != "unknown" {
		t.Errorf("expected commit 'unknown', got '%s'", commit)
	}
	if date != "unknown" {
		t.Errorf("expected date 'unknown', got '%s'", date)
	}
}
