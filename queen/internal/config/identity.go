package config

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

// GetCurrentAgent determines the current agent identity from various sources.
// Priority: --agent flag > --droid flag > QUEEN_AGENT env > QUEEN_DROID env > FACTORY_DROID env > config file
func GetCurrentAgent(cmd *cobra.Command, cfg *Config) (string, error) {
	// 1. Check --agent flag (highest priority)
	if cmd != nil {
		//nolint:errcheck // GetString returns error only if flag doesn't exist; we check value
		if agent, _ := cmd.Flags().GetString("agent"); agent != "" {
			return agent, nil
		}
		// Backward compat: check --droid flag
		//nolint:errcheck // GetString returns error only if flag doesn't exist; we check value
		if agent, _ := cmd.Flags().GetString("droid"); agent != "" {
			return agent, nil
		}
	}

	// 2. Check QUEEN_AGENT environment variable
	if agent := os.Getenv("QUEEN_AGENT"); agent != "" {
		return agent, nil
	}

	// 3. Check QUEEN_DROID environment variable (backward compat)
	if agent := os.Getenv("QUEEN_DROID"); agent != "" {
		return agent, nil
	}

	// 4. Check FACTORY_DROID environment variable (Factory sets this)
	if agent := os.Getenv("FACTORY_DROID"); agent != "" {
		return agent, nil
	}

	// 5. Check config file (.beads/queen_config.yaml)
	if cfg != nil && cfg.Agent != "" {
		return cfg.Agent, nil
	}
	// Backward compat: check Droid field
	if cfg != nil && cfg.Droid != "" {
		return cfg.Droid, nil
	}

	return "", fmt.Errorf("no agent identity: set via 'queen config set agent <name>', QUEEN_AGENT env, or --agent flag")
}

// GetCurrentDroid is deprecated, use GetCurrentAgent instead.
func GetCurrentDroid(cmd *cobra.Command, cfg *Config) (string, error) {
	return GetCurrentAgent(cmd, cfg)
}
