package cli

import (
	"github.com/spf13/cobra"
)

var msgTuiCmd = &cobra.Command{
	Use:   "tui",
	Short: "Interactive message viewer",
	Long:  "Browse messages with an interactive TUI. View global inbox or switch between agent inboxes.",
	RunE:  runMsgTuiCmd,
}

func init() {
	msgCmd.AddCommand(msgTuiCmd)
}

func runMsgTuiCmd(cmd *cobra.Command, args []string) error {
	return RunMsgTui()
}
