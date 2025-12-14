package cli

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
)

var configCmd = &cobra.Command{
	Use:   "config",
	Short: "Manage queen configuration",
	Long: `View and modify queen configuration settings.
Settings are stored in .beads/queen_config.yaml.`,
}

var configSetCmd = &cobra.Command{
	Use:   "set <key> <value>",
	Short: "Set a configuration value",
	Long: `Set a configuration value.
Supported keys:
  droid - Default droid identity for messages and reservations
  ttl   - Default reservation TTL (e.g., 2h, 30m)`,
	Args: cobra.ExactArgs(2),
	RunE: runConfigSet,
}

var configGetCmd = &cobra.Command{
	Use:   "get <key>",
	Short: "Get a configuration value",
	Args:  cobra.ExactArgs(1),
	RunE:  runConfigGet,
}

var configListCmd = &cobra.Command{
	Use:   "list",
	Short: "List all configuration values",
	RunE:  runConfigList,
}

func init() {
	rootCmd.AddCommand(configCmd)

	configCmd.AddCommand(configSetCmd)
	configCmd.AddCommand(configGetCmd)
	configCmd.AddCommand(configListCmd)
}

func runConfigSet(cmd *cobra.Command, args []string) error {
	key, value := args[0], args[1]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	if err := cfg.Set(key, value); err != nil {
		return err
	}

	if err := config.SaveConfig(beadsDir, cfg); err != nil {
		return fmt.Errorf("saving config: %w", err)
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(map[string]string{key: value})
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Set %s = %s\n", green("✓"), key, value)
	return nil
}

func runConfigGet(cmd *cobra.Command, args []string) error {
	key := args[0]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	value, err := cfg.Get(key)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(map[string]string{key: value})
	}

	fmt.Println(value)
	return nil
}

func runConfigList(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	// Get all known keys
	keys := []string{"droid", "ttl"}
	result := make(map[string]string)
	for _, k := range keys {
		v, _ := cfg.Get(k)
		result[k] = v
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(result)
	}

	fmt.Println("Queen Configuration")
	fmt.Println("-------------------")
	for _, k := range keys {
		gray := color.New(color.FgHiBlack).SprintFunc()
		fmt.Printf("  %s: %s\n", k, gray(result[k]))
	}

	return nil
}
