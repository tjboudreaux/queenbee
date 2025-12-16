package droids

import (
	"strings"
	"testing"
)

func TestValidateDroid_ValidDroid(t *testing.T) {
	beadsDir := setupTestDroids(t, []string{"ui-engineer", "queen", "backend-dev"})

	err := ValidateDroid(beadsDir, "ui-engineer")
	if err != nil {
		t.Errorf("ValidateDroid should pass for existing droid: %v", err)
	}

	err = ValidateDroid(beadsDir, "queen")
	if err != nil {
		t.Errorf("ValidateDroid should pass for existing droid: %v", err)
	}
}

func TestValidateDroid_InvalidDroid(t *testing.T) {
	beadsDir := setupTestDroids(t, []string{"ui-engineer", "queen"})

	err := ValidateDroid(beadsDir, "nonexistent")
	if err == nil {
		t.Error("ValidateDroid should fail for non-existent droid")
	}

	// Error should mention the invalid name
	if !strings.Contains(err.Error(), "nonexistent") {
		t.Errorf("Error should mention the invalid droid name: %v", err)
	}
}

func TestValidateDroid_SuggestsSimilarNames(t *testing.T) {
	beadsDir := setupTestDroids(t, []string{"ui-engineer", "ux-designer", "backend-engineer"})

	tests := []struct {
		input      string
		shouldFind string
	}{
		{"ui-eng", "ui-engineer"},       // Prefix match
		{"engineer", "ui-engineer"},     // Substring match
		{"ux", "ux-designer"},           // Prefix match
		{"backend", "backend-engineer"}, // Prefix match
	}

	for _, tc := range tests {
		err := ValidateDroid(beadsDir, tc.input)
		if err == nil {
			t.Errorf("ValidateDroid(%s) should fail", tc.input)
			continue
		}

		errStr := err.Error()
		if !strings.Contains(errStr, "did you mean") {
			t.Errorf("Error for %s should suggest alternatives: %v", tc.input, err)
			continue
		}

		if !strings.Contains(errStr, tc.shouldFind) {
			t.Errorf("Error for %s should suggest %s: %v", tc.input, tc.shouldFind, err)
		}
	}
}

func TestValidateDroid_NoSuggestionsForUnrelatedName(t *testing.T) {
	beadsDir := setupTestDroids(t, []string{"ui-engineer", "queen"})

	err := ValidateDroid(beadsDir, "xyz123")
	if err == nil {
		t.Error("ValidateDroid should fail")
	}

	// Should list available droids since no suggestions
	errStr := err.Error()
	if !strings.Contains(errStr, "available droids") {
		t.Errorf("Error should list available droids: %v", err)
	}
}

func TestValidateDroid_NoDroidsDirectory(t *testing.T) {
	dir := t.TempDir()
	beadsDir := dir + "/.beads"

	err := ValidateDroid(beadsDir, "any-droid")
	if err == nil {
		t.Error("ValidateDroid should fail when no droids exist")
	}

	if !strings.Contains(err.Error(), "no droids found") {
		t.Errorf("Error should mention no droids found: %v", err)
	}
}

func TestValidateDroid_CaseSensitive(t *testing.T) {
	beadsDir := setupTestDroids(t, []string{"UI-Engineer"})

	// Exact case should work
	err := ValidateDroid(beadsDir, "UI-Engineer")
	if err != nil {
		t.Errorf("Exact case should work: %v", err)
	}

	// Different case should fail (but suggest)
	err = ValidateDroid(beadsDir, "ui-engineer")
	if err == nil {
		t.Error("Different case should fail")
	}
}

func TestFindSimilar(t *testing.T) {
	droids := []Droid{
		{Name: "ui-engineer"},
		{Name: "ux-designer"},
		{Name: "backend-dev"},
		{Name: "queen"},
	}

	tests := []struct {
		input    string
		expected []string
	}{
		{"ui", []string{"ui-engineer"}},
		{"engineer", []string{"ui-engineer"}},
		{"design", []string{"ux-designer"}},
		{"back", []string{"backend-dev"}},
		{"xyz", nil},
		{"ux-des", []string{"ux-designer"}},
	}

	for _, tc := range tests {
		result := findSimilar(droids, tc.input)

		if tc.expected == nil {
			if len(result) != 0 {
				t.Errorf("findSimilar(%s) = %v, want empty", tc.input, result)
			}
			continue
		}

		if len(result) != len(tc.expected) {
			t.Errorf("findSimilar(%s) = %v, want %v", tc.input, result, tc.expected)
			continue
		}

		for i, exp := range tc.expected {
			if result[i] != exp {
				t.Errorf("findSimilar(%s)[%d] = %s, want %s", tc.input, i, result[i], exp)
			}
		}
	}
}
