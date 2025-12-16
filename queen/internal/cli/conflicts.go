package cli

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/spf13/cobra"

	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
	"github.com/tjboudreaux/queenbee/queen/internal/reservations"
)

var conflictsCmd = &cobra.Command{
	Use:   "conflicts",
	Short: "Detect and manage reservation conflicts",
	Long:  "Detect overlapping exclusive reservations and suggest resolutions.",
	RunE:  runConflicts,
}

var (
	conflictsResolve bool
	conflictsMine    bool
)

func init() {
	rootCmd.AddCommand(conflictsCmd)

	conflictsCmd.Flags().BoolVar(&conflictsResolve, "resolve", false, "Interactively resolve conflicts")
	conflictsCmd.Flags().BoolVar(&conflictsMine, "mine", false, "Show only conflicts involving my droid")
}

func runConflicts(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store := reservations.NewStore(beadsDir)

	var conflicts []reservations.ConflictInfo

	if conflictsMine {
		var cfg *config.Config
		cfg, err = config.LoadConfig(beadsDir)
		if err != nil {
			return fmt.Errorf("loading config: %w", err)
		}

		var droid string
		droid, err = config.GetCurrentDroid(cmd, cfg)
		if err != nil {
			return err
		}

		conflicts, err = store.GetConflictsForDroid(droid)
		if err != nil {
			return err
		}
	} else {
		conflicts, err = store.DetectConflicts()
		if err != nil {
			return err
		}
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(conflicts)
	}

	if len(conflicts) == 0 {
		green := color.New(color.FgGreen).SprintFunc()
		fmt.Printf("%s No reservation conflicts detected\n", green("✓"))
		return nil
	}

	red := color.New(color.FgRed).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()
	gray := color.New(color.FgHiBlack).SprintFunc()

	fmt.Printf("%s %d reservation conflict(s) detected\n\n", red("⚠"), len(conflicts))

	for i, c := range conflicts {
		fmt.Printf("%s Conflict %d: %s\n", yellow("→"), i+1, c.OverlapType)
		fmt.Printf("  %s %s %s %s\n",
			c.ReservationA.Droid,
			gray("reserved"),
			c.ReservationA.Pattern,
			gray("("+formatAge(c.ReservationA.CreatedAt)+")"))
		fmt.Printf("  %s %s %s %s\n",
			c.ReservationB.Droid,
			gray("reserved"),
			c.ReservationB.Pattern,
			gray("("+formatAge(c.ReservationB.CreatedAt)+")"))

		if conflictsResolve {
			resolutions := reservations.SuggestResolutions(c)
			fmt.Println("\n  Suggested resolutions:")
			for j, r := range resolutions {
				fmt.Printf("    %d. [%s] %s\n", j+1, r.Action, r.Description)
			}
		}
		fmt.Println()
	}

	if !conflictsResolve && len(conflicts) > 0 {
		fmt.Println("Use --resolve to see resolution options")
	}

	return nil
}
