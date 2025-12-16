package cli

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"

	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/daemon"
)

var startCmd = &cobra.Command{
	Use:   "start",
	Short: "Start the queen daemon",
	Long:  "Start the queen daemon for automated orchestration.",
	RunE:  runStart,
}

var stopCmd = &cobra.Command{
	Use:   "stop",
	Short: "Stop the queen daemon",
	Long:  "Stop a running queen daemon.",
	RunE:  runStop,
}

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Show queen daemon status",
	Long:  "Show the status of the queen daemon.",
	RunE:  runStatus,
}

var (
	daemonForeground bool
	daemonInterval   string
)

func init() {
	rootCmd.AddCommand(startCmd)
	rootCmd.AddCommand(stopCmd)
	rootCmd.AddCommand(statusCmd)

	startCmd.Flags().BoolVarP(&daemonForeground, "foreground", "f", false, "Run in foreground (don't daemonize)")
	startCmd.Flags().StringVar(&daemonInterval, "interval", "30s", "Poll interval (e.g., 30s, 1m)")
}

func runStart(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	interval, err := time.ParseDuration(daemonInterval)
	if err != nil {
		return fmt.Errorf("invalid interval: %w", err)
	}

	d := daemon.New(daemon.Config{
		BeadsDir:     beadsDir,
		PollInterval: interval,
	})

	if d.IsRunning() {
		status := d.GetStatus()
		return fmt.Errorf("daemon already running (pid: %d, uptime: %s)", status.PID, status.Uptime)
	}

	green := color.New(color.FgGreen).SprintFunc()

	if daemonForeground {
		fmt.Printf("%s Starting daemon in foreground (interval: %s)\n", green("✓"), interval)
		fmt.Println("Press Ctrl+C to stop")
		return d.Start(context.Background())
	}

	// Start as background process
	executable, err := os.Executable()
	if err != nil {
		return fmt.Errorf("finding executable: %w", err)
	}

	cmdArgs := []string{"start", "--foreground", "--interval", daemonInterval}
	if beadsDir != "" {
		cmdArgs = append(cmdArgs, "--beads-dir", beadsDir)
	}

	bgCmd := exec.Command(executable, cmdArgs...)
	bgCmd.Stdout = nil
	bgCmd.Stderr = nil
	bgCmd.Stdin = nil

	if err := bgCmd.Start(); err != nil {
		return fmt.Errorf("starting daemon: %w", err)
	}

	// Wait a moment for daemon to initialize
	time.Sleep(500 * time.Millisecond)

	if !d.IsRunning() {
		return fmt.Errorf("daemon failed to start (check logs)")
	}

	status := d.GetStatus()
	fmt.Printf("%s Daemon started (pid: %d, interval: %s)\n", green("✓"), status.PID, interval)
	return nil
}

func runStop(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	d := daemon.New(daemon.Config{BeadsDir: beadsDir})

	if !d.IsRunning() {
		return fmt.Errorf("daemon is not running")
	}

	status := d.GetStatus()
	if err := d.Stop(); err != nil {
		return fmt.Errorf("stopping daemon: %w", err)
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Daemon stopped (was pid: %d, uptime: %s)\n", green("✓"), status.PID, status.Uptime)
	return nil
}

func runStatus(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	d := daemon.New(daemon.Config{BeadsDir: beadsDir})
	status := d.GetStatus()

	if getJSONFlag(cmd) {
		fmt.Println(status.JSON())
		return nil
	}

	if status.Running {
		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s Daemon is running\n", green("●"))
		fmt.Printf("  PID:     %d\n", status.PID)
		fmt.Printf("  Started: %s\n", status.StartedAt.Format(time.RFC1123))
		fmt.Printf("  Uptime:  %s\n", status.Uptime)
	} else {
		gray := color.New(color.FgHiBlack).SprintFunc()
		fmt.Printf("%s Daemon is not running\n", gray("○"))
	}

	return nil
}
