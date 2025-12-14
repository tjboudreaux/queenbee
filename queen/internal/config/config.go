// Package config provides configuration management for queen.
package config

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"gopkg.in/yaml.v3"
)

// Config holds queen configuration settings.
type Config struct {
	Droid string        `yaml:"droid,omitempty"`
	TTL   time.Duration `yaml:"ttl,omitempty"`
}

// LoadConfig loads configuration from .beads/queen_config.yaml.
func LoadConfig(beadsDir string) (*Config, error) {
	path := filepath.Join(beadsDir, "queen_config.yaml")
	data, err := os.ReadFile(path)
	if err != nil {
		if os.IsNotExist(err) {
			return &Config{}, nil // Empty config is fine
		}
		return nil, err
	}

	var cfg Config
	if err := yaml.Unmarshal(data, &cfg); err != nil {
		return nil, fmt.Errorf("invalid config: %w", err)
	}
	return &cfg, nil
}

// SaveConfig saves configuration to .beads/queen_config.yaml.
func SaveConfig(beadsDir string, cfg *Config) error {
	path := filepath.Join(beadsDir, "queen_config.yaml")
	data, err := yaml.Marshal(cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

// Set sets a configuration value by key.
func (c *Config) Set(key, value string) error {
	switch key {
	case "droid":
		c.Droid = value
	case "ttl":
		d, err := time.ParseDuration(value)
		if err != nil {
			return fmt.Errorf("invalid duration: %w", err)
		}
		c.TTL = d
	default:
		return fmt.Errorf("unknown config key: %s (valid: droid, ttl)", key)
	}
	return nil
}

// Get retrieves a configuration value by key.
func (c *Config) Get(key string) (string, error) {
	switch key {
	case "droid":
		if c.Droid == "" {
			return "(not set)", nil
		}
		return c.Droid, nil
	case "ttl":
		if c.TTL == 0 {
			return "2h (default)", nil
		}
		return c.TTL.String(), nil
	default:
		return "", fmt.Errorf("unknown config key: %s", key)
	}
}

// GetTTL returns the configured TTL or the default (2 hours).
func (c *Config) GetTTL() time.Duration {
	if c.TTL == 0 {
		return 2 * time.Hour
	}
	return c.TTL
}
