package droids

import (
	"fmt"
	"strings"
)

// ValidateDroid checks if a droid name exists in .factory/droids/.
func ValidateDroid(beadsDir, name string) error {
	droids, err := DiscoverDroids(beadsDir)
	if err != nil {
		return fmt.Errorf("failed to discover droids: %w", err)
	}

	for _, d := range droids {
		if d.Name == name {
			return nil
		}
	}

	// Suggest similar names
	suggestions := findSimilar(droids, name)
	if len(suggestions) > 0 {
		return fmt.Errorf("unknown droid %q, did you mean: %s", name, strings.Join(suggestions, ", "))
	}

	if len(droids) == 0 {
		return fmt.Errorf("unknown droid %q (no droids found in .factory/droids/)", name)
	}

	return fmt.Errorf("unknown droid %q, available droids: %s", name, strings.Join(ListDroidNames(droids), ", "))
}

// findSimilar finds droid names similar to the input (simple prefix/suffix matching).
func findSimilar(droids []Droid, name string) []string {
	var suggestions []string
	nameLower := strings.ToLower(name)

	for _, d := range droids {
		droidLower := strings.ToLower(d.Name)

		// Check for prefix match
		if strings.HasPrefix(droidLower, nameLower) || strings.HasPrefix(nameLower, droidLower) {
			suggestions = append(suggestions, d.Name)
			continue
		}

		// Check for substring match
		if strings.Contains(droidLower, nameLower) || strings.Contains(nameLower, droidLower) {
			suggestions = append(suggestions, d.Name)
			continue
		}
	}

	return suggestions
}
