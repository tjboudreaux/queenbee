package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

func init() {
	rootCmd.AddCommand(newRegistryCmd())
	rootCmd.AddCommand(newRunningCmd())
}

func newRegistryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "registry",
		Short: "View and validate the agent registry",
		Long: `View and validate the .queen.yaml agent registry.

The registry defines:
  - Available agents and their skills
  - Commands each agent can execute (work_issue, plan_issue)
  - Assignment rules matching labels to agents
  - Daemon configuration (max_agents, poll_interval)

Example .queen.yaml:

  version: 1
  
  daemon:
    max_agents: 4
    poll_interval: 30s
  
  agents:
    ui-engineer:
      skills: [react, typescript, css]
      commands:
        work_issue:
          run: "factory run --issue T_ISSUE_ID --droid ui-engineer"
          max_concurrent: 2
        plan_issue:
          run: "factory plan --issue T_ISSUE_ID --spec-only"
  
  rules:
    - match:
        labels: [frontend, ui]
      agent: ui-engineer`,
	}

	cmd.AddCommand(newRegistryShowCmd())
	cmd.AddCommand(newRegistryValidateCmd())
	cmd.AddCommand(newRegistryMatchCmd())

	return cmd
}

func newRegistryShowCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "show",
		Short: "Show the current registry configuration",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")
			jsonOutput, _ := cmd.Flags().GetBool("json")

			workDir := filepath.Dir(beadsDir)
			if beadsDir == "" {
				var err error
				workDir, err = os.Getwd()
				if err != nil {
					return err
				}
			}

			reg, err := registry.Load(workDir)
			if err != nil {
				return fmt.Errorf("loading registry: %w", err)
			}

			if jsonOutput {
				data, _ := json.MarshalIndent(reg, "", "  ")
				fmt.Println(string(data))
				return nil
			}

			// Pretty print
			fmt.Println("Queen Registry")
			fmt.Println("==============")
			fmt.Printf("Version: %d\n", reg.Version)
			fmt.Println()

			fmt.Println("Daemon Configuration:")
			fmt.Printf("  max_agents: %d\n", reg.Daemon.MaxAgents)
			fmt.Printf("  poll_interval: %s\n", reg.Daemon.PollInterval)
			fmt.Printf("  stale_hours: %d\n", reg.Daemon.StaleHours)
			fmt.Println()

			fmt.Printf("Agents (%d):\n", len(reg.Agents))
			for name, agent := range reg.Agents {
				fmt.Printf("  %s:\n", name)
				fmt.Printf("    skills: %v\n", agent.Skills)
				fmt.Printf("    commands:\n")
				for cmdName, cmd := range agent.Commands {
					fmt.Printf("      %s: (max_concurrent: %d)\n", cmdName, cmd.MaxConcurrent)
					fmt.Printf("        run: %s\n", cmd.Run)
				}
			}
			fmt.Println()

			fmt.Printf("Rules (%d):\n", len(reg.Rules))
			for i, rule := range reg.Rules {
				fmt.Printf("  %d. match labels=%v → %s\n", i+1, rule.Match.Labels, rule.Agent)
			}

			if reg.DefaultAgent != "" {
				fmt.Printf("\nDefault agent: %s\n", reg.DefaultAgent)
			}

			return nil
		},
	}
}

func newRegistryValidateCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "validate",
		Short: "Validate the registry configuration",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")

			workDir := filepath.Dir(beadsDir)
			if beadsDir == "" {
				var err error
				workDir, err = os.Getwd()
				if err != nil {
					return err
				}
			}

			_, err := registry.Load(workDir)
			if err != nil {
				fmt.Printf("✗ Registry invalid: %v\n", err)
				os.Exit(1)
			}

			fmt.Println("✓ Registry is valid")
			return nil
		},
	}
}

func newRegistryMatchCmd() *cobra.Command {
	var labels []string
	var issueType string
	var priority string

	cmd := &cobra.Command{
		Use:   "match",
		Short: "Test which agent would be matched for given criteria",
		Example: `  queen registry match --labels frontend,ui
  queen registry match --labels backend --type task --priority P1`,
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")

			workDir := filepath.Dir(beadsDir)
			if beadsDir == "" {
				var err error
				workDir, err = os.Getwd()
				if err != nil {
					return err
				}
			}

			reg, err := registry.Load(workDir)
			if err != nil {
				return fmt.Errorf("loading registry: %w", err)
			}

			agent := reg.MatchAgent(labels, issueType, priority)
			if agent == "" {
				fmt.Println("No agent matched")
				return nil
			}

			fmt.Printf("Matched agent: %s\n", agent)
			
			// Show available commands
			if a, ok := reg.GetAgent(agent); ok {
				fmt.Println("Available commands:")
				for cmdName, cmd := range a.Commands {
					fmt.Printf("  %s (max_concurrent: %d)\n", cmdName, cmd.MaxConcurrent)
				}
			}

			return nil
		},
	}

	cmd.Flags().StringSliceVar(&labels, "labels", nil, "Labels to match")
	cmd.Flags().StringVar(&issueType, "type", "", "Issue type (task, epic, bug)")
	cmd.Flags().StringVar(&priority, "priority", "", "Priority (P0, P1, P2, P3)")

	return cmd
}

func newRunningCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "running",
		Short: "Show currently running agent commands",
		RunE: func(cmd *cobra.Command, args []string) error {
			beadsDir, _ := cmd.Flags().GetString("beads-dir")
			jsonOutput, _ := cmd.Flags().GetBool("json")

			workDir := filepath.Dir(beadsDir)
			if beadsDir == "" {
				var err error
				workDir, err = os.Getwd()
				if err != nil {
					return err
				}
			}

			reg, err := registry.Load(workDir)
			if err != nil {
				return fmt.Errorf("loading registry: %w", err)
			}

			if beadsDir == "" {
				beadsDir = filepath.Join(workDir, ".beads")
			}

			runner := registry.NewRunner(reg, beadsDir, workDir)
			running := runner.List()

			if jsonOutput {
				data, _ := json.MarshalIndent(running, "", "  ")
				fmt.Println(string(data))
				return nil
			}

			if len(running) == 0 {
				fmt.Println("No commands currently running")
				return nil
			}

			fmt.Printf("Running commands (%d/%d max_agents):\n", len(running), reg.Daemon.MaxAgents)
			fmt.Println()
			for _, rc := range running {
				fmt.Printf("  %s\n", rc.HashID)
				fmt.Printf("    Agent: %s\n", rc.Agent)
				fmt.Printf("    Command: %s\n", rc.Command)
				fmt.Printf("    Issue: %s\n", rc.IssueID)
				fmt.Printf("    PID: %d\n", rc.PID)
				fmt.Printf("    Started: %s\n", rc.StartedAt.Format("2006-01-02 15:04:05"))
				fmt.Println()
			}

			return nil
		},
	}
}
