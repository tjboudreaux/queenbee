package config

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// GetCurrentDroid determines the current droid identity from various sources.
// Priority: --droid flag > QUEEN_DROID env > FACTORY_DROID env > config file
func GetCurrentDroid(cmd *cobra.Command, cfg *Config) (string, error) {
	// 1. Check --droid flag (highest priority)
	if cmd != nil {
		if droid, _ := cmd.Flags().GetString("droid"); droid != "" {
			return droid, nil
		}
	}

	// 2. Check QUEEN_DROID environment variable
	if droid := os.Getenv("QUEEN_DROID"); droid != "" {
		return droid, nil
	}

	// 3. Check FACTORY_DROID environment variable (Factory sets this)
	if droid := os.Getenv("FACTORY_DROID"); droid != "" {
		return droid, nil
	}

	// 4. Check config file (.beads/queen_config.yaml)
	if cfg != nil && cfg.Droid != "" {
		return cfg.Droid, nil
	}

	return "", fmt.Errorf("no droid identity: set via 'queen config set droid <name>', QUEEN_DROID env, or --droid flag")
}
