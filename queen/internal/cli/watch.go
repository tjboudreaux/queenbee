package cli

import (
	"time"

	"github.com/spf13/cobra"
)

var watchCmd = &cobra.Command{
	Use:   "watch",
	Short: "Live status dashboard",
	Long:  "Display a live-updating status dashboard with issues, agents, queue, and messages.",
	RunE:  runWatchCmd,
}

var (
	watchInterval time.Duration
)

func init() {
	rootCmd.AddCommand(watchCmd)
	watchCmd.Flags().DurationVarP(&watchInterval, "interval", "i", 5*time.Second, "Refresh interval (e.g., 5s, 10s)")
}

func runWatchCmd(cmd *cobra.Command, args []string) error {
	return RunWatch(watchInterval)
}
