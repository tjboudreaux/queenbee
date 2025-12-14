package droids

import (
	"os"
	"path/filepath"
	"testing"
)

func setupTestDroids(t *testing.T, droidNames []string) string {
	t.Helper()
	dir := t.TempDir()

	// Create .beads directory
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Create .factory/droids directory
	droidsDir := filepath.Join(dir, ".factory", "droids")
	if err := os.MkdirAll(droidsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Create droid files
	for _, name := range droidNames {
		path := filepath.Join(droidsDir, name+".md")
		content := "# " + name + "\n\nTest droid definition."
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatal(err)
		}
	}

	return beadsDir
}

func TestDiscoverDroids_WithDroids(t *testing.T) {
	expectedDroids := []string{"ui-engineer", "queen", "quality-resilience-engineer"}
	beadsDir := setupTestDroids(t, expectedDroids)

	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		t.Fatalf("DiscoverDroids failed: %v", err)
	}

	if len(droids) != len(expectedDroids) {
		t.Fatalf("Expected %d droids, got %d", len(expectedDroids), len(droids))
	}

	// Check all expected droids are found
	foundNames := make(map[string]bool)
	for _, d := range droids {
		foundNames[d.Name] = true
		if d.Path == "" {
			t.Errorf("Droid %s has empty path", d.Name)
		}
	}

	for _, expected := range expectedDroids {
		if !foundNames[expected] {
			t.Errorf("Expected droid %s not found", expected)
		}
	}
}

func TestDiscoverDroids_EmptyDirectory(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Create empty .factory/droids directory
	droidsDir := filepath.Join(dir, ".factory", "droids")
	if err := os.MkdirAll(droidsDir, 0755); err != nil {
		t.Fatal(err)
	}

	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		t.Fatalf("DiscoverDroids failed: %v", err)
	}

	if len(droids) != 0 {
		t.Errorf("Expected 0 droids in empty directory, got %d", len(droids))
	}
}

func TestDiscoverDroids_NoDroidsDirectory(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}
	// Don't create .factory/droids

	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		t.Fatalf("DiscoverDroids should not error for missing directory: %v", err)
	}

	if droids != nil && len(droids) != 0 {
		t.Errorf("Expected nil or empty slice, got %v", droids)
	}
}

func TestDiscoverDroids_IgnoresNonMdFiles(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	droidsDir := filepath.Join(dir, ".factory", "droids")
	if err := os.MkdirAll(droidsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Create various file types
	files := map[string]string{
		"valid-droid.md":   "# Valid Droid",
		"not-a-droid.txt":  "text file",
		"another.json":     "{}",
		"readme.MD":        "# Readme", // Different case
		".hidden-droid.md": "# Hidden",
	}

	for name, content := range files {
		path := filepath.Join(droidsDir, name)
		if err := os.WriteFile(path, []byte(content), 0644); err != nil {
			t.Fatal(err)
		}
	}

	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		t.Fatalf("DiscoverDroids failed: %v", err)
	}

	// Should only find the .md file (lowercase)
	if len(droids) != 1 {
		t.Fatalf("Expected 1 droid, got %d: %+v", len(droids), droids)
	}

	if droids[0].Name != "valid-droid" {
		t.Errorf("Expected 'valid-droid', got %s", droids[0].Name)
	}
}

func TestDiscoverDroids_IgnoresDirectories(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}

	droidsDir := filepath.Join(dir, ".factory", "droids")
	if err := os.MkdirAll(droidsDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Create a file and a directory with .md extension
	if err := os.WriteFile(filepath.Join(droidsDir, "real-droid.md"), []byte("# Real"), 0644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(droidsDir, "fake-droid.md"), 0755); err != nil {
		t.Fatal(err)
	}

	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		t.Fatalf("DiscoverDroids failed: %v", err)
	}

	if len(droids) != 1 {
		t.Fatalf("Expected 1 droid (ignoring directory), got %d", len(droids))
	}

	if droids[0].Name != "real-droid" {
		t.Errorf("Expected 'real-droid', got %s", droids[0].Name)
	}
}

func TestListDroidNames(t *testing.T) {
	droids := []Droid{
		{Name: "alpha", Path: "/path/alpha.md"},
		{Name: "beta", Path: "/path/beta.md"},
		{Name: "gamma", Path: "/path/gamma.md"},
	}

	names := ListDroidNames(droids)

	if len(names) != 3 {
		t.Fatalf("Expected 3 names, got %d", len(names))
	}

	expected := []string{"alpha", "beta", "gamma"}
	for i, name := range names {
		if name != expected[i] {
			t.Errorf("Name %d: expected %s, got %s", i, expected[i], name)
		}
	}
}

func TestListDroidNames_Empty(t *testing.T) {
	names := ListDroidNames(nil)
	if len(names) != 0 {
		t.Errorf("Expected empty slice, got %v", names)
	}

	names = ListDroidNames([]Droid{})
	if len(names) != 0 {
		t.Errorf("Expected empty slice, got %v", names)
	}
}
