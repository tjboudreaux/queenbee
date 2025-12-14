package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/autoassign"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/droids"
)

var (
	autoassignDryRun     bool
	autoassignOutputJSON bool
	autoassignWorktree   string
)

var autoassignCmd = &cobra.Command{
	Use:   "auto-assign",
	Short: "Automatically assign unassigned tasks to available droids",
	Long: `Analyze unassigned tasks and propose assignments based on:
- Skill/label matching between tasks and droids
- Droid workload (current active assignments)
- Worktree alignment preferences
- Task priority

The algorithm calculates a confidence score for each assignment.

Examples:
  queen auto-assign              # Show assignment plan
  queen auto-assign --dry-run    # Preview without applying
  queen auto-assign --json       # Output plan as JSON
  queen auto-assign --worktree=feature-x  # Prefer droids in this worktree`,
	RunE: func(cmd *cobra.Command, args []string) error {
		// Find beads directory
		beadsDir, err := beads.FindBeadsDir()
		if err != nil {
			return fmt.Errorf("beads directory not found: %w", err)
		}

		// Discover available droids
		availableDroids, err := droids.DiscoverDroids(beadsDir)
		if err != nil {
			return fmt.Errorf("failed to discover droids: %w", err)
		}

		if len(availableDroids) == 0 {
			return fmt.Errorf("no droids found. Create droids in .factory/droids/")
		}

		// Convert to autoassign.Droid format
		assignableDroids := make([]autoassign.Droid, 0, len(availableDroids))
		for _, d := range availableDroids {
			assignableDroids = append(assignableDroids, autoassign.Droid{
				Name:           d.Name,
				Skills:         extractSkillsFromName(d.Name),
				CurrentLoad:    0, // TODO: query from assignments store
				MaxLoad:        3, // Default max concurrent assignments
				PreferWorktree: autoassignWorktree,
			})
		}

		// Get unassigned tasks from beads
		issues, err := beads.ListOpenIssues(beadsDir)
		if err != nil {
			return fmt.Errorf("failed to read issues: %w", err)
		}

		// Filter to unassigned tasks
		tasks := make([]autoassign.Task, 0)
		for _, issue := range issues {
			// Skip epics (they contain tasks, not assignable directly)
			if issue.IssueType == "epic" {
				continue
			}

			tasks = append(tasks, autoassign.Task{
				ID:          issue.ID,
				Title:       issue.Title,
				Description: issue.Description,
				Priority:    issue.Priority,
				Labels:      inferTaskLabels(issue.Title + " " + issue.Description),
				Worktree:    autoassignWorktree,
			})
		}

		if len(tasks) == 0 {
			fmt.Println("No unassigned tasks found.")
			return nil
		}

		// Generate assignment plan
		assigner := autoassign.NewAssigner(assignableDroids)
		assigner.SetTasks(tasks)
		plan := assigner.GeneratePlan()

		// Output
		if autoassignOutputJSON {
			enc := json.NewEncoder(os.Stdout)
			enc.SetIndent("", "  ")
			return enc.Encode(plan)
		}

		// Text output
		fmt.Printf("Assignment Plan (%d tasks, %d droids)\n", len(tasks), len(assignableDroids))
		fmt.Println(strings.Repeat("-", 50))

		if len(plan.Warnings) > 0 {
			fmt.Println("\nWarnings:")
			for _, w := range plan.Warnings {
				fmt.Printf("  ! %s\n", w)
			}
		}

		if len(plan.Assignments) > 0 {
			fmt.Printf("\nProposed Assignments (%d):\n\n", len(plan.Assignments))
			for _, a := range plan.Assignments {
				fmt.Printf("  %s -> %s\n", a.TaskID, a.DroidName)
				fmt.Printf("    Task: %s\n", truncateString(a.TaskTitle, 50))
				fmt.Printf("    Confidence: %.0f%% (%s)\n", a.Confidence*100, a.Reason)
				fmt.Println()
			}
		}

		if len(plan.Unassigned) > 0 {
			fmt.Printf("\nUnassigned Tasks (%d):\n", len(plan.Unassigned))
			for _, id := range plan.Unassigned {
				fmt.Printf("  - %s\n", id)
			}
		}

		if autoassignDryRun {
			fmt.Println("\n(dry-run: no assignments applied)")
		} else if len(plan.Assignments) > 0 {
			fmt.Println("\nTo apply assignments, use: queen assign <task-id> <droid-name>")
		}

		return nil
	},
}

func init() {
	rootCmd.AddCommand(autoassignCmd)

	autoassignCmd.Flags().BoolVar(&autoassignDryRun, "dry-run", false, "Preview assignments without applying")
	autoassignCmd.Flags().BoolVar(&autoassignOutputJSON, "json", false, "Output as JSON")
	autoassignCmd.Flags().StringVar(&autoassignWorktree, "worktree", "", "Prefer droids working in this worktree")
}

// extractSkillsFromName extracts skill labels from a droid name.
func extractSkillsFromName(name string) []string {
	// Look for common skill keywords in droid name
	text := strings.ToLower(name)

	skillKeywords := map[string][]string{
		"ui":       {"ui", "frontend", "react", "vue", "angular", "css", "component"},
		"backend":  {"backend", "api", "server", "database", "db"},
		"test":     {"test", "qa", "quality", "coverage"},
		"infra":    {"infra", "devops", "ci", "cd", "deploy", "kubernetes", "docker"},
		"security": {"security", "auth", "encryption"},
		"docs":     {"docs", "documentation", "readme"},
	}

	var skills []string
	for skill, keywords := range skillKeywords {
		for _, kw := range keywords {
			if strings.Contains(text, kw) {
				skills = append(skills, skill)
				break
			}
		}
	}

	return skills
}

// inferTaskLabels infers skill labels from task text.
func inferTaskLabels(text string) []string {
	text = strings.ToLower(text)

	labelMap := map[string][]string{
		"ui":       {"ui", "frontend", "component", "button", "form", "page", "view", "css", "style"},
		"backend":  {"api", "endpoint", "database", "db", "server", "auth", "authentication"},
		"test":     {"test", "testing", "coverage", "spec", "unit", "integration"},
		"docs":     {"doc", "documentation", "readme", "guide"},
		"infra":    {"ci", "cd", "pipeline", "deploy", "docker", "kubernetes", "terraform"},
		"security": {"security", "auth", "permission", "encryption", "vulnerability"},
	}

	var labels []string
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

func truncateString(s string, maxLen int) string {
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen-3] + "..."
}
