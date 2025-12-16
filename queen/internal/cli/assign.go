package cli

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/spf13/cobra"

	"github.com/tjboudreaux/queenbee/queen/internal/assignments"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
)

var assignCmd = &cobra.Command{
	Use:   "assign <issue-id> <agent>",
	Short: "Assign an issue to an agent",
	Long:  "Assign an issue to a specific agent. Reassigns if already assigned.",
	Args:  cobra.ExactArgs(2),
	RunE:  runAssign,
}

var claimCmd = &cobra.Command{
	Use:   "claim <issue-id>",
	Short: "Claim an issue for yourself",
	Long:  "Claim an issue, assigning it to your current agent identity.",
	Args:  cobra.ExactArgs(1),
	RunE:  runClaim,
}

var releaseCmd = &cobra.Command{
	Use:   "release <issue-id>",
	Short: "Release an assignment",
	Long:  "Release your assignment on an issue, making it available for others.",
	Args:  cobra.ExactArgs(1),
	RunE:  runRelease,
}

var assignmentsCmd = &cobra.Command{
	Use:   "assignments",
	Short: "List assignments",
	Long:  "List issue assignments for agents.",
	RunE:  runAssignments,
}

var (
	assignWorktree string
	assignReason   string
	assignStatus   string
	assignAgent    string
)

func init() {
	rootCmd.AddCommand(assignCmd)
	rootCmd.AddCommand(claimCmd)
	rootCmd.AddCommand(releaseCmd)
	rootCmd.AddCommand(assignmentsCmd)

	// assign flags
	assignCmd.Flags().StringVar(&assignWorktree, "worktree", "", "Git worktree path for this work")
	assignCmd.Flags().StringVarP(&assignReason, "reason", "r", "", "Reason for assignment")

	// claim flags
	claimCmd.Flags().StringVar(&assignWorktree, "worktree", "", "Git worktree path for this work")
	claimCmd.Flags().StringVarP(&assignReason, "reason", "r", "", "Reason for claiming")

	// release flags
	releaseCmd.Flags().StringVarP(&assignReason, "reason", "r", "", "Reason for releasing")

	// assignments flags
	assignmentsCmd.Flags().StringVar(&assignStatus, "status", "", "Filter by status (active, completed, released, reassigned)")
	assignmentsCmd.Flags().StringVar(&assignAgent, "agent", "", "Filter by agent")
}

func runAssign(cmd *cobra.Command, args []string) error {
	issueID, agent := args[0], args[1]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	assignedBy, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	// Validate issue exists
	if validateErr := beads.ValidateIssueExists(beadsDir, issueID); validateErr != nil {
		return fmt.Errorf("invalid issue: %w", validateErr)
	}

	store := assignments.NewStore(beadsDir)

	assignment, err := store.Assign(issueID, agent, assignedBy, assignments.AssignOptions{
		Worktree: assignWorktree,
		Reason:   assignReason,
	})
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(assignment)
	}

	green := color.New(color.FgGreen).SprintFunc()
	if assignment.PreviousAgent != "" {
		fmt.Printf("%s Reassigned %s: %s → %s\n", green("✓"), issueID, assignment.PreviousAgent, agent)
	} else {
		fmt.Printf("%s Assigned %s to %s\n", green("✓"), issueID, agent)
	}
	return nil
}

func runClaim(cmd *cobra.Command, args []string) error {
	issueID := args[0]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	agent, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	// Validate issue exists
	if validateErr := beads.ValidateIssueExists(beadsDir, issueID); validateErr != nil {
		return fmt.Errorf("invalid issue: %w", validateErr)
	}

	store := assignments.NewStore(beadsDir)

	assignment, err := store.Claim(issueID, agent, assignments.AssignOptions{
		Worktree: assignWorktree,
		Reason:   assignReason,
	})
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(assignment)
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Claimed %s\n", green("✓"), issueID)
	return nil
}

func runRelease(cmd *cobra.Command, args []string) error {
	issueID := args[0]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store := assignments.NewStore(beadsDir)

	// Find active assignment for issue
	assignment, err := store.GetActiveForIssue(issueID)
	if err != nil {
		return fmt.Errorf("no active assignment for %s: %w", issueID, err)
	}

	if err := store.Release(assignment.ID, assignReason); err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(map[string]string{
			"released": assignment.ID,
			"issue_id": issueID,
		})
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Released assignment for %s\n", green("✓"), issueID)
	return nil
}

func runAssignments(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store := assignments.NewStore(beadsDir)

	var result []assignments.Assignment

	if assignAgent != "" {
		// Filter by agent (only active)
		result, err = store.GetActiveForAgent(assignAgent)
	} else {
		// Get all with optional status filter
		result, err = store.GetAll(assignStatus)
	}

	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(result)
	}

	if len(result) == 0 {
		fmt.Println("No assignments found")
		return nil
	}

	fmt.Printf("📋 Assignments (%d)\n\n", len(result))
	for _, a := range result {
		printAssignment(a)
	}

	return nil
}

func printAssignment(a assignments.Assignment) {
	gray := color.New(color.FgHiBlack).SprintFunc()
	green := color.New(color.FgGreen).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()
	red := color.New(color.FgRed).SprintFunc()

	statusColor := gray
	switch a.Status {
	case assignments.StatusActive:
		statusColor = green
	case assignments.StatusCompleted:
		statusColor = green
	case assignments.StatusReleased:
		statusColor = yellow
	case assignments.StatusReassigned:
		statusColor = red
	}

	fmt.Printf("  %s → %s %s\n", a.IssueID, a.Agent, statusColor("["+a.Status+"]"))
	fmt.Printf("    %s %s | %s %s\n", gray("ID:"), a.ID, gray("Assigned by:"), a.AssignedBy)
	if a.Worktree != "" {
		fmt.Printf("    %s %s\n", gray("Worktree:"), a.Worktree)
	}
	if a.Reason != "" {
		fmt.Printf("    %s %s\n", gray("Reason:"), a.Reason)
	}
	fmt.Println()
}
