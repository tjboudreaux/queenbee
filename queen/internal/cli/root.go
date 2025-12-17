package cli

import (
	"os"

	"github.com/spf13/cobra"
)

var (
	version string
	commit  string
	date    string
)

var rootCmd = &cobra.Command{
	Use:   "queen",
	Short: "Multi-agent coordination for QueenBee",
	Long: `Queen CLI extends Beads with messaging, assignments, and file reservations
for coordinating multiple AI agents working on the same codebase.

All state is stored in .beads/queen_*.jsonl files, shared across git worktrees.`,
	PersistentPostRun: func(cmd *cobra.Command, args []string) {
		// Skip update check for certain commands
		skipCommands := map[string]bool{
			"update":     true,
			"version":    true,
			"help":       true,
			"completion": true,
		}
		if skipCommands[cmd.Name()] {
			return
		}
		// Only show banner if output is a terminal
		if fileInfo, _ := os.Stdout.Stat(); (fileInfo.Mode() & os.ModeCharDevice) != 0 {
			CheckAndPrintUpdateBanner()
		}
	},
}

func SetVersionInfo(v, c, d string) {
	version = v
	commit = c
	date = d
}

func Execute() error {
	return rootCmd.Execute()
}

func init() {
	rootCmd.PersistentFlags().String("agent", "", "Current agent identity (overrides QUEEN_AGENT env)")
	rootCmd.PersistentFlags().String("droid", "", "Deprecated: use --agent instead")
	rootCmd.PersistentFlags().Bool("json", false, "Output in JSON format")
	rootCmd.PersistentFlags().String("beads-dir", "", "Path to .beads directory (auto-detected if not set)")
}
