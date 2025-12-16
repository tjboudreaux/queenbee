package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/spf13/cobra"

	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

func init() {
	rootCmd.AddCommand(newQueueCmd())
}

func newQueueCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "queue",
		Short: "View and manage the work queue",
		Long: `View and manage queued work items.

Work is queued when max_agents is reached. Items are processed 
in priority order when capacity becomes available.`,
	}

	cmd.AddCommand(newQueueListCmd())
	cmd.AddCommand(newQueueClearCmd())
	cmd.AddCommand(newQueueStatsCmd())

	return cmd
}

func newQueueListCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "list",
		Short: "List queued work items",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")
			jsonOutput, _ := cmd.Flags().GetBool("json")

			if beadsDir == "" {
				cwd, err := os.Getwd()
				if err != nil {
					return err
				}
				beadsDir = filepath.Join(cwd, ".beads")
			}

			queue := registry.NewWorkQueue(beadsDir)
			items := queue.List()

			if jsonOutput {
				data, _ := json.MarshalIndent(items, "", "  ")
				fmt.Println(string(data))
				return nil
			}

			if len(items) == 0 {
				fmt.Println("No items in queue")
				return nil
			}

			fmt.Printf("Queued work items (%d):\n\n", len(items))
			for _, item := range items {
				age := time.Since(item.QueuedAt).Round(time.Second)
				fmt.Printf("  %s\n", item.ID)
				fmt.Printf("    Agent: %s\n", item.Agent)
				fmt.Printf("    Command: %s\n", item.Command)
				fmt.Printf("    Issue: %s (%s)\n", item.IssueID, item.IssueType)
				fmt.Printf("    Priority: P%d\n", item.Priority)
				fmt.Printf("    Queued: %s ago\n", age)
				fmt.Printf("    Reason: %s\n", item.Reason)
				fmt.Println()
			}

			return nil
		},
	}
}

func newQueueClearCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "clear",
		Short: "Clear all queued work items",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")

			if beadsDir == "" {
				cwd, err := os.Getwd()
				if err != nil {
					return err
				}
				beadsDir = filepath.Join(cwd, ".beads")
			}

			queue := registry.NewWorkQueue(beadsDir)
			count := queue.Len()
			queue.Clear()

			fmt.Printf("Cleared %d items from queue\n", count)
			return nil
		},
	}
}

func newQueueStatsCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "stats",
		Short: "Show queue statistics",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")
			jsonOutput, _ := cmd.Flags().GetBool("json")

			if beadsDir == "" {
				cwd, err := os.Getwd()
				if err != nil {
					return err
				}
				beadsDir = filepath.Join(cwd, ".beads")
			}

			queue := registry.NewWorkQueue(beadsDir)
			stats := queue.Stats()

			if jsonOutput {
				data, _ := json.MarshalIndent(stats, "", "  ")
				fmt.Println(string(data))
				return nil
			}

			fmt.Println("Queue Statistics")
			fmt.Println("================")
			fmt.Printf("Total queued: %d\n", stats.TotalQueued)

			if stats.OldestAge > 0 {
				fmt.Printf("Oldest item: %s ago\n", stats.OldestAge.Round(time.Second))
			}

			if len(stats.ByAgent) > 0 {
				fmt.Println("\nBy Agent:")
				for agent, count := range stats.ByAgent {
					fmt.Printf("  %s: %d\n", agent, count)
				}
			}

			if len(stats.ByCommand) > 0 {
				fmt.Println("\nBy Command:")
				for command, count := range stats.ByCommand {
					fmt.Printf("  %s: %d\n", command, count)
				}
			}

			return nil
		},
	}
}
