package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
	"github.com/tjboudreaux/queenbee/queen/internal/reservations"
)

var reserveCmd = &cobra.Command{
	Use:   "reserve <pattern>...",
	Short: "Reserve files for exclusive editing",
	Long: `Reserve one or more file patterns to signal intent to other agents.
Patterns use glob syntax (e.g., src/components/Button/**).
Conflicts with existing exclusive reservations will be reported.`,
	Args: cobra.MinimumNArgs(1),
	RunE: runReserve,
}

var reservedCmd = &cobra.Command{
	Use:   "reserved",
	Short: "List active reservations",
	Long:  "Show all active file reservations in the project.",
	RunE:  runReserved,
}

var unreserveCmd = &cobra.Command{
	Use:   "unreserve [pattern]...",
	Short: "Release file reservations",
	Long:  "Release reservations for patterns or use --all to release everything.",
	RunE:  runUnreserve,
}

var (
	resIssue     string
	resTTL       string
	resExclusive bool
	resReason    string
	resForce     bool
	resPath      string
	resAll       bool
)

func init() {
	rootCmd.AddCommand(reserveCmd)
	rootCmd.AddCommand(reservedCmd)
	rootCmd.AddCommand(unreserveCmd)

	// reserve flags
	reserveCmd.Flags().StringVar(&resIssue, "issue", "", "Related issue ID")
	reserveCmd.Flags().StringVar(&resTTL, "ttl", "2h", "Reservation duration (e.g., 1h, 30m)")
	reserveCmd.Flags().BoolVarP(&resExclusive, "exclusive", "x", true, "Exclusive reservation (conflicts with others)")
	reserveCmd.Flags().StringVarP(&resReason, "reason", "r", "", "Reason for reservation")
	reserveCmd.Flags().BoolVarP(&resForce, "force", "f", false, "Override conflicts")

	// reserved flags
	reservedCmd.Flags().StringVar(&resPath, "path", "", "Check if a specific path is reserved")

	// unreserve flags
	unreserveCmd.Flags().BoolVarP(&resAll, "all", "a", false, "Release all reservations")
}

func runReserve(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	droid, err := config.GetCurrentDroid(cmd, cfg)
	if err != nil {
		return err
	}

	store := reservations.NewStore(beadsDir)

	ttl, err := time.ParseDuration(resTTL)
	if err != nil {
		return fmt.Errorf("invalid --ttl: %w", err)
	}

	opts := reservations.ReserveOptions{
		IssueID:   resIssue,
		TTL:       ttl,
		Exclusive: resExclusive,
		Reason:    resReason,
		Force:     resForce,
	}

	var created []*reservations.Reservation
	var allConflicts []reservations.Conflict

	for _, pattern := range args {
		res, conflicts, err := store.Reserve(droid, pattern, opts)
		if err != nil {
			return fmt.Errorf("reserving %s: %w", pattern, err)
		}

		if len(conflicts) > 0 {
			allConflicts = append(allConflicts, conflicts...)
			continue
		}

		created = append(created, res)
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(map[string]any{
			"reserved":  created,
			"conflicts": allConflicts,
		})
	}

	green := color.New(color.FgGreen).SprintFunc()
	red := color.New(color.FgRed).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()

	for _, res := range created {
		fmt.Printf("%s Reserved: %s (expires %s)\n", green("✓"), res.Pattern, formatDuration(time.Until(res.ExpiresAt)))
	}

	if len(allConflicts) > 0 {
		fmt.Printf("\n%s Conflicts detected:\n", red("✗"))
		for _, c := range allConflicts {
			fmt.Printf("  %s %s held by %s (expires %s)\n",
				yellow("→"), c.Pattern, c.Droid, formatDuration(time.Until(c.ExpiresAt)))
		}
		if !resForce {
			fmt.Println("\nUse --force to override conflicts")
		}
	}

	return nil
}

func runReserved(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store := reservations.NewStore(beadsDir)

	// Check specific path
	if resPath != "" {
		reservations, err := store.CheckPath(resPath)
		if err != nil {
			return err
		}

		if getJSONFlag(cmd) {
			return json.NewEncoder(os.Stdout).Encode(reservations)
		}

		if len(reservations) == 0 {
			fmt.Printf("Path %s is not reserved\n", resPath)
			return nil
		}

		fmt.Printf("Path %s is covered by:\n\n", resPath)
		for _, r := range reservations {
			printReservation(r)
		}
		return nil
	}

	// List all active reservations
	active, err := store.GetActive("")
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(active)
	}

	if len(active) == 0 {
		fmt.Println("No active reservations")
		return nil
	}

	fmt.Printf("📁 Active reservations (%d)\n\n", len(active))
	for _, r := range active {
		printReservation(r)
	}

	return nil
}

func runUnreserve(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	droid, err := config.GetCurrentDroid(cmd, cfg)
	if err != nil {
		return err
	}

	store := reservations.NewStore(beadsDir)

	green := color.New(color.FgGreen).SprintFunc()

	if resAll {
		count, err := store.ReleaseAll(droid)
		if err != nil {
			return err
		}

		if getJSONFlag(cmd) {
			return json.NewEncoder(os.Stdout).Encode(map[string]int{"released": count})
		}

		fmt.Printf("%s Released %d reservation(s)\n", green("✓"), count)
		return nil
	}

	if len(args) == 0 {
		return fmt.Errorf("specify patterns to release or use --all")
	}

	total := 0
	for _, pattern := range args {
		count, err := store.ReleasePattern(droid, pattern)
		if err != nil {
			return fmt.Errorf("releasing %s: %w", pattern, err)
		}
		total += count
		if count > 0 {
			fmt.Printf("%s Released: %s\n", green("✓"), pattern)
		}
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(map[string]int{"released": total})
	}

	if total == 0 {
		fmt.Println("No matching reservations found")
	}

	return nil
}

func printReservation(r reservations.Reservation) {
	gray := color.New(color.FgHiBlack).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()

	excl := ""
	if r.Exclusive {
		excl = yellow(" [exclusive]")
	}

	fmt.Printf("  %s%s\n", r.Pattern, excl)
	fmt.Printf("    %s %s | expires %s\n", gray("Droid:"), r.Droid, formatDuration(time.Until(r.ExpiresAt)))
	if r.IssueID != "" {
		fmt.Printf("    %s %s\n", gray("Issue:"), r.IssueID)
	}
	if r.Reason != "" {
		fmt.Printf("    %s %s\n", gray("Reason:"), r.Reason)
	}
	fmt.Println()
}

func formatDuration(d time.Duration) string {
	if d < 0 {
		return "expired"
	}
	if d < time.Minute {
		return fmt.Sprintf("%ds", int(d.Seconds()))
	}
	if d < time.Hour {
		return fmt.Sprintf("%dm", int(d.Minutes()))
	}
	return fmt.Sprintf("%dh %dm", int(d.Hours()), int(d.Minutes())%60)
}
