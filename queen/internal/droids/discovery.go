// Package droids provides droid discovery and validation.
package droids

import (
	"os"
	"path/filepath"
	"strings"
)

// Droid represents a discovered droid from .factory/droids/.
type Droid struct {
	Name string
	Path string
}

// DiscoverDroids scans .factory/droids/ for available droids.
func DiscoverDroids(beadsDir string) ([]Droid, error) {
	factoryDir := findFactoryDir(beadsDir)
	droidsDir := filepath.Join(factoryDir, "droids")

	entries, err := os.ReadDir(droidsDir)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil // No droids directory
		}
		return nil, err
	}

	var droids []Droid
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".md") {
			name := strings.TrimSuffix(e.Name(), ".md")
			droids = append(droids, Droid{
				Name: name,
				Path: filepath.Join(droidsDir, e.Name()),
			})
		}
	}

	return droids, nil
}

// ListDroidNames returns a list of droid names.
func ListDroidNames(droids []Droid) []string {
	names := make([]string, len(droids))
	for i, d := range droids {
		names[i] = d.Name
	}
	return names
}

func findFactoryDir(beadsDir string) string {
	repoRoot := filepath.Dir(beadsDir)
	return filepath.Join(repoRoot, ".factory")
}
