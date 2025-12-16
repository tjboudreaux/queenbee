package decompose

import (
	"regexp"
	"strings"
)

// TaskSuggestion represents a suggested task from epic decomposition.
type TaskSuggestion struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Type        string   `json:"type"`
	Priority    string   `json:"priority"`
	Labels      []string `json:"labels"`
	DependsOn   []int    `json:"depends_on"` // Indices in the suggestions slice
}

// DecompositionResult contains the epic analysis and suggested tasks.
type DecompositionResult struct {
	EpicID     string           `json:"epic_id"`
	EpicTitle  string           `json:"epic_title"`
	Summary    string           `json:"summary"`
	Tasks      []TaskSuggestion `json:"tasks"`
	Confidence float64          `json:"confidence"`
	Warnings   []string         `json:"warnings"`
}

// Epic represents the minimal epic structure for decomposition.
type Epic struct {
	ID          string
	Title       string
	Description string
	Priority    string
	Labels      []string
}

// Decompose analyzes an epic and generates task suggestions.
func Decompose(epic Epic) DecompositionResult {
	result := DecompositionResult{
		EpicID:    epic.ID,
		EpicTitle: epic.Title,
	}

	// Extract deliverables section
	deliverables := extractDeliverables(epic.Description)

	// Extract components/phases
	phases := extractPhases(epic.Description)

	// Extract checklist items
	checklist := extractChecklist(epic.Description)

	// Extract bullet points
	bullets := extractBullets(epic.Description)

	// Combine and deduplicate work items
	items := deduplicateItems(append(append(append(deliverables, phases...), checklist...), bullets...))

	// Generate task suggestions
	for i, item := range items {
		task := generateTask(item, epic.Priority, i)
		task.Labels = inferLabels(item.text)
		result.Tasks = append(result.Tasks, task)
	}

	// Detect dependencies
	result.Tasks = detectDependencies(result.Tasks)

	// Calculate confidence
	result.Confidence = calculateConfidence(len(result.Tasks), epic.Description)

	// Add warnings
	result.Warnings = generateWarnings(result.Tasks)

	// Generate summary
	result.Summary = generateSummary(result.Tasks)

	return result
}

type workItem struct {
	text     string
	itemType string
	done     bool
}

func extractDeliverables(desc string) []workItem {
	var items []workItem
	lines := strings.Split(desc, "\n")

	inDeliverables := false
	for _, line := range lines {
		lower := strings.ToLower(line)
		if strings.Contains(lower, "deliverable") || strings.Contains(lower, "outcomes") {
			inDeliverables = true
			continue
		}
		if inDeliverables {
			if strings.TrimSpace(line) == "" {
				inDeliverables = false
				continue
			}
			if strings.HasPrefix(strings.TrimSpace(line), "-") || strings.HasPrefix(strings.TrimSpace(line), "*") {
				text := strings.TrimSpace(strings.TrimPrefix(strings.TrimPrefix(strings.TrimSpace(line), "-"), "*"))
				done := strings.Contains(strings.ToLower(text), "done") || strings.Contains(text, "[x]")
				text = strings.TrimSuffix(strings.TrimSuffix(text, " - DONE"), " [x]")
				items = append(items, workItem{text: text, itemType: "deliverable", done: done})
			}
		}
	}
	return items
}

func extractPhases(desc string) []workItem {
	var items []workItem

	// Look for numbered phases or sections
	phaseRegex := regexp.MustCompile(`(?i)phase\s*\d+[:\s]+([^\n]+)`)
	matches := phaseRegex.FindAllStringSubmatch(desc, -1)
	for _, m := range matches {
		items = append(items, workItem{text: strings.TrimSpace(m[1]), itemType: "phase"})
	}

	return items
}

func extractChecklist(desc string) []workItem {
	var items []workItem
	checkboxRegex := regexp.MustCompile(`(?m)^\s*[-*]\s*\[([ xX])\]\s*(.+)$`)
	matches := checkboxRegex.FindAllStringSubmatch(desc, -1)
	for _, m := range matches {
		done := strings.ToLower(m[1]) == "x"
		items = append(items, workItem{text: strings.TrimSpace(m[2]), itemType: "checklist", done: done})
	}
	return items
}

func extractBullets(desc string) []workItem {
	var items []workItem
	lines := strings.Split(desc, "\n")

	skipSections := map[string]bool{
		"deliverables": true,
		"depends on":   true,
		"blocks":       true,
		"labels":       true,
	}

	currentSection := ""
	for _, line := range lines {
		lower := strings.ToLower(strings.TrimSpace(line))

		// Track section headers
		if strings.HasSuffix(lower, ":") || strings.Contains(lower, "##") {
			currentSection = strings.TrimSuffix(strings.TrimPrefix(lower, "##"), ":")
			currentSection = strings.TrimSpace(currentSection)
			continue
		}

		// Skip certain sections
		if skipSections[currentSection] {
			continue
		}

		// Extract bullet points that look like tasks
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "-") || strings.HasPrefix(trimmed, "*") {
			text := strings.TrimSpace(strings.TrimPrefix(strings.TrimPrefix(trimmed, "-"), "*"))
			if len(text) > 10 && !strings.HasPrefix(text, "[") { // Skip checkboxes, need substantive text
				items = append(items, workItem{text: text, itemType: "bullet"})
			}
		}
	}

	return items
}

func deduplicateItems(items []workItem) []workItem {
	seen := make(map[string]bool)
	var result []workItem

	for _, item := range items {
		// Skip done items
		if item.done {
			continue
		}

		// Normalize for dedup
		key := strings.ToLower(strings.TrimSpace(item.text))
		if !seen[key] && len(key) > 5 { // Skip very short items
			seen[key] = true
			result = append(result, item)
		}
	}

	return result
}

func generateTask(item workItem, epicPriority string, index int) TaskSuggestion {
	title := item.text

	// Clean up title
	title = strings.TrimPrefix(title, "Implement ")
	title = strings.TrimPrefix(title, "Add ")
	title = strings.TrimPrefix(title, "Create ")

	// Truncate very long titles
	if len(title) > 80 {
		title = title[:77] + "..."
	}

	taskType := "task"
	if strings.Contains(strings.ToLower(item.text), "bug") || strings.Contains(strings.ToLower(item.text), "fix") {
		taskType = "bug"
	}

	// Inherit priority from epic, slightly lower for non-critical items
	priority := epicPriority
	if index > 3 {
		priority = lowerPriority(priority)
	}

	return TaskSuggestion{
		Title:       title,
		Description: item.text,
		Type:        taskType,
		Priority:    priority,
	}
}

func lowerPriority(p string) string {
	switch p {
	case "P0":
		return "P1"
	case "P1":
		return "P2"
	case "P2":
		return "P3"
	default:
		return p
	}
}

func inferLabels(text string) []string {
	text = strings.ToLower(text)
	var labels []string

	labelMap := map[string][]string{
		"ui":       {"ui", "frontend", "component", "button", "form", "page", "view", "css", "style"},
		"backend":  {"api", "endpoint", "database", "db", "server", "auth", "authentication"},
		"test":     {"test", "testing", "coverage", "spec", "unit", "integration"},
		"docs":     {"doc", "documentation", "readme", "guide"},
		"infra":    {"ci", "cd", "pipeline", "deploy", "docker", "kubernetes", "terraform"},
		"security": {"security", "auth", "permission", "encryption", "vulnerability"},
	}

	for label, keywords := range labelMap {
		for _, kw := range keywords {
			if strings.Contains(text, kw) {
				labels = append(labels, label)
				break
			}
		}
	}

	return labels
}

func detectDependencies(tasks []TaskSuggestion) []TaskSuggestion {
	// Simple heuristic: tasks later in list may depend on earlier ones
	// Look for explicit references
	for i := range tasks {
		taskText := strings.ToLower(tasks[i].Title + " " + tasks[i].Description)

		for j := 0; j < i; j++ {
			// Check if this task references an earlier one
			prevTitle := strings.ToLower(tasks[j].Title)
			words := strings.Fields(prevTitle)
			for _, word := range words {
				if len(word) > 4 && strings.Contains(taskText, word) {
					// Potential dependency
					tasks[i].DependsOn = append(tasks[i].DependsOn, j)
					break
				}
			}
		}
	}

	return tasks
}

func calculateConfidence(taskCount int, description string) float64 {
	if taskCount == 0 {
		return 0.3
	}
	if taskCount < 3 {
		return 0.5
	}
	if taskCount > 10 {
		return 0.7 // Too many might need refinement
	}

	// Higher confidence if description is well-structured
	confidence := 0.8
	if strings.Contains(description, "Deliverable") {
		confidence += 0.1
	}
	if strings.Contains(description, "[ ]") || strings.Contains(description, "[x]") {
		confidence += 0.05
	}

	if confidence > 1.0 {
		confidence = 1.0
	}
	return confidence
}

func generateWarnings(tasks []TaskSuggestion) []string {
	var warnings []string

	if len(tasks) == 0 {
		warnings = append(warnings, "No tasks extracted. Consider adding a Deliverables section.")
	}
	if len(tasks) > 15 {
		warnings = append(warnings, "Many tasks extracted. Consider splitting into sub-epics.")
	}

	// Check for tasks without labels
	unlabeled := 0
	for _, t := range tasks {
		if len(t.Labels) == 0 {
			unlabeled++
		}
	}
	if unlabeled > len(tasks)/2 {
		warnings = append(warnings, "Many tasks have no inferred labels. Add skill keywords to descriptions.")
	}

	return warnings
}

func generateSummary(tasks []TaskSuggestion) string {
	if len(tasks) == 0 {
		return "No tasks extracted from epic description."
	}

	labelCounts := make(map[string]int)
	for _, t := range tasks {
		for _, l := range t.Labels {
			labelCounts[l]++
		}
	}

	var areas []string
	for label := range labelCounts {
		areas = append(areas, label)
	}

	if len(areas) == 0 {
		return "Extracted " + string(rune('0'+len(tasks))) + " tasks from epic."
	}

	return "Extracted tasks spanning: " + strings.Join(areas, ", ")
}
