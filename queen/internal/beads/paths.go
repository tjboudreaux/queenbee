// Package beads provides integration with the beads issue tracker.
package beads

import (
	"fmt"
	"os"
	"path/filepath"
)

// FindBeadsDir locates the .beads directory by walking up from the current directory.
func FindBeadsDir() (string, error) {
	// Check BEADS_DIR environment variable first
	if dir := os.Getenv("BEADS_DIR"); dir != "" {
		return dir, nil
	}

	cwd, err := os.Getwd()
	if err != nil {
		return "", fmt.Errorf("get working directory: %w", err)
	}

	dir := cwd
	for {
		beadsPath := filepath.Join(dir, ".beads")
		if info, err := os.Stat(beadsPath); err == nil && info.IsDir() {
			return beadsPath, nil
		}

		parent := filepath.Dir(dir)
		if parent == dir {
			break // Reached root
		}
		dir = parent
	}

	return "", fmt.Errorf(".beads directory not found (run 'bd init' first)")
}

// FindFactoryDir locates the .factory directory relative to the beads directory.
func FindFactoryDir(beadsDir string) string {
	// .factory/ is typically at the repo root, same level as .beads/
	repoRoot := filepath.Dir(beadsDir)
	return filepath.Join(repoRoot, ".factory")
}

// FindRepoRoot returns the repository root directory (parent of .beads).
func FindRepoRoot(beadsDir string) string {
	return filepath.Dir(beadsDir)
}
