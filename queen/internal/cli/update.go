package cli

import (
	"fmt"
	"os"
	"os/exec"
	"runtime"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/update"
)

var updateCmd = &cobra.Command{
	Use:   "update",
	Short: "Update queen to the latest version",
	Long: `Check for and install the latest version of queen.

This command will:
1. Check GitHub for the latest release
2. Download and install the new version
3. Replace the current binary

Examples:
  queen update           # Update to latest version
  queen update --check   # Only check, don't install`,
	Run: runUpdate,
}

func init() {
	rootCmd.AddCommand(updateCmd)
	updateCmd.Flags().Bool("check", false, "Only check for updates, don't install")
	updateCmd.Flags().Bool("force", false, "Force update even if already on latest version")
}

func runUpdate(cmd *cobra.Command, args []string) {
	checkOnly, _ := cmd.Flags().GetBool("check")
	force, _ := cmd.Flags().GetBool("force")

	fmt.Println("Checking for updates...")

	info, err := update.CheckForUpdate(version, true)
	if err != nil {
		color.Red("Failed to check for updates: %v", err)
		os.Exit(1)
	}

	if version == "dev" {
		color.Yellow("Running development build - update check skipped")
		fmt.Println("\nTo install a release version, run:")
		fmt.Printf("  %s\n", update.GetInstallCommand())
		return
	}

	fmt.Printf("Current version: %s\n", info.CurrentVersion)
	fmt.Printf("Latest version:  %s\n", info.LatestVersion)

	if !info.UpdateAvailable && !force {
		color.Green("\nYou're already on the latest version!")
		return
	}

	if info.UpdateAvailable {
		color.Yellow("\nUpdate available: %s -> %s", info.CurrentVersion, info.LatestVersion)
	}

	if checkOnly {
		fmt.Println("\nTo update, run:")
		fmt.Println("  queen update")
		fmt.Printf("\nRelease notes: %s\n", info.ReleaseURL)
		return
	}

	fmt.Println("\nInstalling update...")

	if err := runInstallScript(); err != nil {
		color.Red("Update failed: %v", err)
		fmt.Println("\nYou can try updating manually:")
		fmt.Printf("  %s\n", update.GetInstallCommand())
		os.Exit(1)
	}

	color.Green("\nUpdate complete!")
	fmt.Println("Run 'queen version' to verify the new version.")
}

func runInstallScript() error {
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("powershell", "-Command",
			"irm https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.ps1 | iex")
	default:
		cmd = exec.Command("bash", "-c",
			"curl -sSL https://raw.githubusercontent.com/tjboudreaux/queenbee/main/queen/install.sh | bash")
	}

	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin

	return cmd.Run()
}

func CheckAndPrintUpdateBanner() {
	// Skip in dev mode or if version not set
	if version == "" || version == "dev" {
		return
	}

	// Run check in background-friendly way (use cache, don't block)
	info, err := update.CheckForUpdate(version, false)
	if err != nil {
		return // Silently ignore errors for banner
	}

	if info.UpdateAvailable {
		banner := color.New(color.FgYellow).SprintFunc()
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, banner("╭─────────────────────────────────────────────────────────╮"))
		fmt.Fprintln(os.Stderr, banner(fmt.Sprintf("│  Update available: %s -> %-26s │", info.CurrentVersion, info.LatestVersion)))
		fmt.Fprintln(os.Stderr, banner("│  Run 'queen update' to install                          │"))
		fmt.Fprintln(os.Stderr, banner("╰─────────────────────────────────────────────────────────╯"))
		fmt.Fprintln(os.Stderr, "")
	}
}
