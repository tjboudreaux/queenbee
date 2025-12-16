package beads

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFindBeadsDir_FromEnv(t *testing.T) {
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	os.MkdirAll(beadsDir, 0755)

	os.Setenv("BEADS_DIR", beadsDir)
	defer os.Unsetenv("BEADS_DIR")

	result, err := FindBeadsDir()
	if err != nil {
		t.Fatalf("FindBeadsDir failed: %v", err)
	}

	if result != beadsDir {
		t.Errorf("FindBeadsDir = %q, want %q", result, beadsDir)
	}
}

func TestFindBeadsDir_WalksUp(t *testing.T) {
	// Clear env var to test directory walking
	os.Unsetenv("BEADS_DIR")

	// Create a temp directory structure: /tmp/xxx/repo/.beads and /tmp/xxx/repo/src/pkg
	dir := t.TempDir()
	repoRoot := filepath.Join(dir, "repo")
	beadsDir := filepath.Join(repoRoot, ".beads")
	nestedDir := filepath.Join(repoRoot, "src", "pkg")

	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(nestedDir, 0755); err != nil {
		t.Fatal(err)
	}

	// Change to nested directory
	originalWd, _ := os.Getwd()
	defer os.Chdir(originalWd)

	if err := os.Chdir(nestedDir); err != nil {
		t.Fatal(err)
	}

	result, err := FindBeadsDir()
	if err != nil {
		t.Fatalf("FindBeadsDir failed: %v", err)
	}

	// Resolve symlinks for comparison (macOS /var -> /private/var)
	expectedResolved, _ := filepath.EvalSymlinks(beadsDir)
	resultResolved, _ := filepath.EvalSymlinks(result)

	if resultResolved != expectedResolved {
		t.Errorf("FindBeadsDir = %q, want %q", result, beadsDir)
	}
}

func TestFindBeadsDir_NotFound(t *testing.T) {
	// Clear env var
	os.Unsetenv("BEADS_DIR")

	// Create a temp dir with no .beads
	dir := t.TempDir()
	nested := filepath.Join(dir, "no", "beads", "here")
	os.MkdirAll(nested, 0755)

	originalWd, _ := os.Getwd()
	defer os.Chdir(originalWd)

	os.Chdir(nested)

	_, err := FindBeadsDir()
	if err == nil {
		t.Error("Expected error when .beads not found")
	}
}

func TestFindBeadsDir_FromCurrentDir(t *testing.T) {
	// Clear env var
	os.Unsetenv("BEADS_DIR")

	// Create a temp dir with .beads in current directory
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	os.MkdirAll(beadsDir, 0755)

	originalWd, _ := os.Getwd()
	defer os.Chdir(originalWd)

	os.Chdir(dir)

	result, err := FindBeadsDir()
	if err != nil {
		t.Fatalf("FindBeadsDir failed: %v", err)
	}

	// Resolve symlinks for comparison (macOS /var -> /private/var)
	expectedResolved, _ := filepath.EvalSymlinks(beadsDir)
	resultResolved, _ := filepath.EvalSymlinks(result)

	if resultResolved != expectedResolved {
		t.Errorf("FindBeadsDir = %q, want %q", result, beadsDir)
	}
}

func TestFindFactoryDir(t *testing.T) {
	beadsDir := filepath.Join("some", "repo", ".beads")
	expected := filepath.Join("some", "repo", ".factory")

	result := FindFactoryDir(beadsDir)
	if result != expected {
		t.Errorf("FindFactoryDir = %q, want %q", result, expected)
	}
}

func TestFindRepoRoot(t *testing.T) {
	beadsDir := filepath.Join("some", "repo", ".beads")
	expected := filepath.Join("some", "repo")

	result := FindRepoRoot(beadsDir)
	if result != expected {
		t.Errorf("FindRepoRoot = %q, want %q", result, expected)
	}
}
