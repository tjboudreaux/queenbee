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

func TestFindFactoryDir(t *testing.T) {
	beadsDir := "/some/repo/.beads"
	expected := "/some/repo/.factory"

	result := FindFactoryDir(beadsDir)
	if result != expected {
		t.Errorf("FindFactoryDir = %q, want %q", result, expected)
	}
}

func TestFindRepoRoot(t *testing.T) {
	beadsDir := "/some/repo/.beads"
	expected := "/some/repo"

	result := FindRepoRoot(beadsDir)
	if result != expected {
		t.Errorf("FindRepoRoot = %q, want %q", result, expected)
	}
}
