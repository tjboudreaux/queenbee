package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"strings"

	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/decompose"
)

var (
	decomposeDryRun     bool
	decomposeOutputJSON bool
	decomposeCreate     bool
)

var decomposeCmd = &cobra.Command{
		Use:   "decompose <epic-id>",
		Short: "Decompose an epic into tasks",
		Long: `Analyze an epic's description and generate task suggestions.

The command extracts work items from:
- Deliverables sections
- Checklist items ([ ] / [x])
- Bullet points
- Phase descriptions

Examples:
  queen decompose qb-123              # Show suggested tasks
  queen decompose qb-123 --dry-run    # Preview without changes
  queen decompose qb-123 --json       # Output as JSON
  queen decompose qb-123 --create     # Create tasks in beads`,
		Args: cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			epicID := args[0]

			// Find beads directory
			beadsDir, err := beads.FindBeadsDir()
			if err != nil {
				return fmt.Errorf("beads directory not found: %w", err)
			}

			// Read the epic from beads
			issue, err := beads.GetIssueByID(beadsDir, epicID)
			if err != nil {
				return fmt.Errorf("failed to read epic %s: %w", epicID, err)
			}

			if issue.IssueType != "epic" {
				fmt.Fprintf(os.Stderr, "Warning: %s is type '%s', not 'epic'\n", epicID, issue.IssueType)
			}

			// Convert to decompose.Epic
			epic := decompose.Epic{
				ID:          issue.ID,
				Title:       issue.Title,
				Description: issue.Description,
				Priority:    formatPriority(issue.Priority),
				Labels:      nil, // Beads issues don't have labels in this format
			}

			// Decompose
			result := decompose.Decompose(epic)

			// Output
			if decomposeOutputJSON {
				enc := json.NewEncoder(os.Stdout)
				enc.SetIndent("", "  ")
				return enc.Encode(result)
			}

			// Text output
			fmt.Printf("Epic: %s - %s\n", result.EpicID, result.EpicTitle)
			fmt.Printf("Confidence: %.0f%%\n", result.Confidence*100)
			fmt.Println()

			if len(result.Warnings) > 0 {
				fmt.Println("Warnings:")
				for _, w := range result.Warnings {
					fmt.Printf("  ! %s\n", w)
				}
				fmt.Println()
			}

			if len(result.Tasks) == 0 {
				fmt.Println("No tasks extracted. Try adding a 'Deliverables:' section to the epic description.")
				return nil
			}

			fmt.Printf("Suggested Tasks (%d):\n\n", len(result.Tasks))
			for i, task := range result.Tasks {
				fmt.Printf("%d. %s\n", i+1, task.Title)
				fmt.Printf("   Type: %s  Priority: %s\n", task.Type, task.Priority)
				if len(task.Labels) > 0 {
					fmt.Printf("   Labels: %s\n", strings.Join(task.Labels, ", "))
				}
				if len(task.DependsOn) > 0 {
					deps := make([]string, len(task.DependsOn))
					for j, d := range task.DependsOn {
						deps[j] = fmt.Sprintf("#%d", d+1)
					}
					fmt.Printf("   Depends on: %s\n", strings.Join(deps, ", "))
				}
				fmt.Println()
			}

			if decomposeDryRun {
				fmt.Println("(dry-run: no tasks created)")
				return nil
			}

			if decomposeCreate {
				fmt.Println("Creating tasks...")
				// TODO: Implement task creation via bd CLI
				fmt.Println("Task creation not yet implemented. Use --json to export and create manually.")
			}

			return nil
		},
}

func init() {
	rootCmd.AddCommand(decomposeCmd)

	decomposeCmd.Flags().BoolVar(&decomposeDryRun, "dry-run", false, "Preview decomposition without creating tasks")
	decomposeCmd.Flags().BoolVar(&decomposeOutputJSON, "json", false, "Output as JSON")
	decomposeCmd.Flags().BoolVar(&decomposeCreate, "create", false, "Create tasks in beads (not yet implemented)")
}

func formatPriority(p int) string {
	if p >= 0 && p <= 4 {
		return "P" + strconv.Itoa(p)
	}
	return "P2"
}
