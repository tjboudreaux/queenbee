package cli

import (
	"testing"
	"time"

	"github.com/tjboudreaux/queenbee/queen/internal/messages"
)

// ============================================================================
// Tests for helper functions in msgtui_tea.go
// ============================================================================

func TestTruncateStr2(t *testing.T) {
	tests := []struct {
		input    string
		max      int
		expected string
	}{
		{"hello", 10, "hello"},
		{"hello world", 5, "hell…"},
		{"", 5, ""},
		{"hi", 2, "hi"},
		{"hello", 5, "hello"},
		{"hello", 4, "hel…"},
	}

	for _, tt := range tests {
		result := truncateStr2(tt.input, tt.max)
		if result != tt.expected {
			t.Errorf("truncateStr2(%q, %d) = %q, want %q", tt.input, tt.max, result, tt.expected)
		}
	}
}

func TestFormatRelativeTime(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name     string
		input    time.Time
		expected string
	}{
		{"just now", now.Add(-30 * time.Second), "now"},
		{"minutes ago", now.Add(-5 * time.Minute), "5m"},
		{"hours ago", now.Add(-3 * time.Hour), "3h"},
		{"days ago", now.Add(-2 * 24 * time.Hour), "2d"},
		{"week ago", now.Add(-10 * 24 * time.Hour), now.Add(-10 * 24 * time.Hour).Format("Jan 2")},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := formatRelativeTime(tt.input)
			if result != tt.expected {
				t.Errorf("formatRelativeTime() = %q, want %q", result, tt.expected)
			}
		})
	}
}

// ============================================================================
// Tests for helper functions in watch_tea.go
// ============================================================================

func TestTruncateDash(t *testing.T) {
	tests := []struct {
		input    string
		max      int
		expected string
	}{
		{"hello", 10, "hello"},
		{"hello world foo", 8, "hello..."},
		{"", 5, ""},
		{"hi", 2, "hi"},
		{"hello", 5, "hello"},
	}

	for _, tt := range tests {
		result := truncateDash(tt.input, tt.max)
		if result != tt.expected {
			t.Errorf("truncateDash(%q, %d) = %q, want %q", tt.input, tt.max, result, tt.expected)
		}
	}
}

func TestPluralizeTea(t *testing.T) {
	tests := []struct {
		input    int
		expected string
	}{
		{0, "s"},
		{1, ""},
		{2, "s"},
		{100, "s"},
	}

	for _, tt := range tests {
		result := pluralizeTea(tt.input)
		if result != tt.expected {
			t.Errorf("pluralizeTea(%d) = %q, want %q", tt.input, result, tt.expected)
		}
	}
}

func TestMinInt(t *testing.T) {
	tests := []struct {
		a, b     int
		expected int
	}{
		{1, 2, 1},
		{2, 1, 1},
		{5, 5, 5},
		{-1, 1, -1},
		{0, 0, 0},
	}

	for _, tt := range tests {
		result := minInt(tt.a, tt.b)
		if result != tt.expected {
			t.Errorf("minInt(%d, %d) = %d, want %d", tt.a, tt.b, result, tt.expected)
		}
	}
}

// ============================================================================
// Tests for helper functions in styles.go
// ============================================================================

func TestStylesExist(t *testing.T) {
	// Verify that key styles are defined and non-nil
	styles := []struct {
		name  string
		style interface{}
	}{
		{"TitleStyle", TitleStyle},
		{"SubtitleStyle", SubtitleStyle},
		{"HelpStyle", HelpStyle},
		{"ErrorStyle", ErrorStyle},
		{"SuccessStyle", SuccessStyle},
		{"ActiveTabStyle", ActiveTabStyle},
		{"InactiveTabStyle", InactiveTabStyle},
		{"SelectedStyle", SelectedStyle},
		{"UnreadStyle", UnreadStyle},
		{"UrgentStyle", UrgentStyle},
	}

	for _, s := range styles {
		t.Run(s.name, func(t *testing.T) {
			if s.style == nil {
				t.Errorf("%s should not be nil", s.name)
			}
		})
	}
}

func TestIconsExist(t *testing.T) {
	icons := []struct {
		name  string
		value string
	}{
		{"IconInbox", IconInbox},
		{"IconSent", IconSent},
		{"IconMessage", IconMessage},
		{"IconUrgent", IconUrgent},
		{"IconAgent", IconAgent},
		{"IconQueue", IconQueue},
		{"IconCrown", IconCrown},
		{"IconCheck", IconCheck},
		{"IconDot", IconDot},
	}

	for _, icon := range icons {
		t.Run(icon.name, func(t *testing.T) {
			if icon.value == "" {
				t.Errorf("%s should not be empty", icon.name)
			}
		})
	}
}

// ============================================================================
// Tests for msg.go helper functions
// ============================================================================

func TestFormatAge(t *testing.T) {
	now := time.Now()

	tests := []struct {
		name     string
		input    time.Time
		expected string
	}{
		{"just now", now.Add(-30 * time.Second), "just now"},
		{"minutes", now.Add(-5 * time.Minute), "5m ago"},
		{"hours", now.Add(-3 * time.Hour), "3h ago"},
		{"days", now.Add(-2 * 24 * time.Hour), "2d ago"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := formatAge(tt.input)
			if result != tt.expected {
				t.Errorf("formatAge() = %q, want %q", result, tt.expected)
			}
		})
	}
}

func TestParseDuration(t *testing.T) {
	tests := []struct {
		name    string
		input   string
		wantErr bool
	}{
		{"relative hours", "1h", false},
		{"relative minutes", "30m", false},
		{"RFC3339", "2024-01-01T00:00:00Z", false},
		{"date only", "2024-01-01", false},
		{"invalid", "not-a-date", true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			_, err := parseDuration(tt.input)
			if (err != nil) != tt.wantErr {
				t.Errorf("parseDuration(%q) error = %v, wantErr %v", tt.input, err, tt.wantErr)
			}
		})
	}
}

func TestSortedMapEntries(t *testing.T) {
	m := map[string]int{
		"a": 10,
		"b": 30,
		"c": 20,
	}

	result := sortedMapEntries(m)

	if len(result) != 3 {
		t.Fatalf("Expected 3 entries, got %d", len(result))
	}

	// Should be sorted descending by value
	if result[0].key != "b" || result[0].value != 30 {
		t.Errorf("First entry should be b:30, got %s:%d", result[0].key, result[0].value)
	}
	if result[1].key != "c" || result[1].value != 20 {
		t.Errorf("Second entry should be c:20, got %s:%d", result[1].key, result[1].value)
	}
	if result[2].key != "a" || result[2].value != 10 {
		t.Errorf("Third entry should be a:10, got %s:%d", result[2].key, result[2].value)
	}
}

// ============================================================================
// Tests for messageItem interface
// ============================================================================

func TestMessageItem_FilterValue(t *testing.T) {
	item := messageItem{
		msg: messages.Message{
			Subject: "Test Subject",
			From:    "alice",
			To:      "bob",
			Body:    "Message body",
		},
	}

	filterValue := item.FilterValue()

	if !contains(filterValue, "Test Subject") {
		t.Error("FilterValue should contain subject")
	}
	if !contains(filterValue, "alice") {
		t.Error("FilterValue should contain from")
	}
	if !contains(filterValue, "bob") {
		t.Error("FilterValue should contain to")
	}
	if !contains(filterValue, "Message body") {
		t.Error("FilterValue should contain body")
	}
}

func TestMessageItem_Title(t *testing.T) {
	item := messageItem{
		msg: messages.Message{
			Subject: "Test Subject",
		},
	}

	if item.Title() != "Test Subject" {
		t.Errorf("Title() = %q, want %q", item.Title(), "Test Subject")
	}
}

func TestMessageItem_Description(t *testing.T) {
	item := messageItem{
		msg: messages.Message{
			From: "alice",
		},
	}

	if item.Description() != "alice" {
		t.Errorf("Description() = %q, want %q", item.Description(), "alice")
	}
}

func contains(s, substr string) bool {
	return len(s) >= len(substr) && (s == substr || len(s) > 0 && containsHelper(s, substr))
}

func containsHelper(s, substr string) bool {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return true
		}
	}
	return false
}
