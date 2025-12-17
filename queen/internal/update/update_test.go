package update

import (
	"testing"
)

func TestNormalizeVersion(t *testing.T) {
	tests := []struct {
		input    string
		expected string
	}{
		{"v1.0.0", "1.0.0"},
		{"V1.0.0", "1.0.0"},
		{"1.0.0", "1.0.0"},
		{"v2.3.4", "2.3.4"},
	}

	for _, tt := range tests {
		result := normalizeVersion(tt.input)
		if result != tt.expected {
			t.Errorf("normalizeVersion(%q) = %q, want %q", tt.input, result, tt.expected)
		}
	}
}

func TestParseVersion(t *testing.T) {
	tests := []struct {
		input      string
		major      int
		minor      int
		patch      int
		prerelease string
	}{
		{"1.0.0", 1, 0, 0, ""},
		{"v2.3.4", 2, 3, 4, ""},
		{"1.0.0-beta.1", 1, 0, 0, "beta.1"},
		{"v3.2.1-rc.2", 3, 2, 1, "rc.2"},
		{"0.0.1", 0, 0, 1, ""},
	}

	for _, tt := range tests {
		major, minor, patch, prerelease := parseVersion(tt.input)
		if major != tt.major || minor != tt.minor || patch != tt.patch || prerelease != tt.prerelease {
			t.Errorf("parseVersion(%q) = (%d, %d, %d, %q), want (%d, %d, %d, %q)",
				tt.input, major, minor, patch, prerelease,
				tt.major, tt.minor, tt.patch, tt.prerelease)
		}
	}
}

func TestCompareVersions(t *testing.T) {
	tests := []struct {
		current  string
		latest   string
		expected int // <0 means current < latest, 0 means equal, >0 means current > latest
	}{
		// current < latest (update available)
		{"1.0.0", "1.0.1", -1},
		{"1.0.0", "1.1.0", -1},
		{"1.0.0", "2.0.0", -1},
		{"v1.0.0", "v1.0.1", -1},

		// current == latest (no update)
		{"1.0.0", "1.0.0", 0},
		{"v1.0.0", "1.0.0", 0},

		// current > latest (no update)
		{"1.0.1", "1.0.0", 1},
		{"2.0.0", "1.9.9", 1},

		// prerelease handling
		{"1.0.0", "1.0.1-beta.1", -1},     // 1.0.0 < 1.0.1-beta.1 (patch version differs)
		{"1.0.1", "1.0.1-beta.1", 1},      // 1.0.1 release > 1.0.1-beta.1 prerelease
		{"1.0.0-beta.1", "1.0.0", -1},     // prerelease < release
		{"1.0.0-alpha", "1.0.0-beta", -1}, // alpha < beta
	}

	for _, tt := range tests {
		result := CompareVersions(tt.current, tt.latest)
		// Check sign matches
		if (result < 0) != (tt.expected < 0) || (result > 0) != (tt.expected > 0) || (result == 0) != (tt.expected == 0) {
			t.Errorf("CompareVersions(%q, %q) = %d, want sign of %d",
				tt.current, tt.latest, result, tt.expected)
		}
	}
}

func TestCompareVersions_UpdateAvailable(t *testing.T) {
	// These should all indicate update is available (result < 0)
	updates := []struct {
		current string
		latest  string
	}{
		{"1.0.0", "1.0.1"},
		{"1.0.0", "1.1.0"},
		{"1.0.0", "2.0.0"},
		{"1.0.2", "1.0.3"},
		{"1.0.3", "1.1.0"},
	}

	for _, tt := range updates {
		result := CompareVersions(tt.current, tt.latest)
		if result >= 0 {
			t.Errorf("CompareVersions(%q, %q) = %d, expected < 0 (update available)",
				tt.current, tt.latest, result)
		}
	}
}

func TestCompareVersions_NoUpdate(t *testing.T) {
	// These should all indicate no update needed (result >= 0)
	noUpdates := []struct {
		current string
		latest  string
	}{
		{"1.0.0", "1.0.0"},
		{"1.0.1", "1.0.0"},
		{"2.0.0", "1.9.9"},
		{"1.1.0", "1.0.5"},
	}

	for _, tt := range noUpdates {
		result := CompareVersions(tt.current, tt.latest)
		if result < 0 {
			t.Errorf("CompareVersions(%q, %q) = %d, expected >= 0 (no update)",
				tt.current, tt.latest, result)
		}
	}
}

func TestGetInstallCommand(t *testing.T) {
	cmd := GetInstallCommand()
	if cmd == "" {
		t.Error("GetInstallCommand() returned empty string")
	}
	// Should contain curl or irm depending on platform
	if len(cmd) < 10 {
		t.Errorf("GetInstallCommand() returned suspiciously short command: %q", cmd)
	}
}

func TestCheckForUpdate_DevBuild(t *testing.T) {
	info, err := CheckForUpdate("dev", false)
	if err != nil {
		t.Fatalf("CheckForUpdate(dev) returned error: %v", err)
	}
	if info.UpdateAvailable {
		t.Error("CheckForUpdate(dev) should not report update available")
	}
}

func TestCheckForUpdate_EmptyVersion(t *testing.T) {
	info, err := CheckForUpdate("", false)
	if err != nil {
		t.Fatalf("CheckForUpdate('') returned error: %v", err)
	}
	if info.UpdateAvailable {
		t.Error("CheckForUpdate('') should not report update available")
	}
}
