package config

import (
	"os"
	"testing"

	"github.com/spf13/cobra"
)

func TestGetCurrentDroid_FromConfig(t *testing.T) {
	cfg := &Config{Droid: "config-droid"}

	// Clear env vars
	os.Unsetenv("QUEEN_DROID")
	os.Unsetenv("FACTORY_DROID")

	droid, err := GetCurrentDroid(nil, cfg)
	if err != nil {
		t.Fatalf("GetCurrentDroid failed: %v", err)
	}
	if droid != "config-droid" {
		t.Errorf("droid = %q, want %q", droid, "config-droid")
	}
}

func TestGetCurrentDroid_FromEnv_QUEEN(t *testing.T) {
	cfg := &Config{Droid: "config-droid"}

	os.Setenv("QUEEN_DROID", "env-queen-droid")
	defer os.Unsetenv("QUEEN_DROID")
	os.Unsetenv("FACTORY_DROID")

	droid, err := GetCurrentDroid(nil, cfg)
	if err != nil {
		t.Fatalf("GetCurrentDroid failed: %v", err)
	}
	if droid != "env-queen-droid" {
		t.Errorf("droid = %q, want %q (QUEEN_DROID should take priority)", droid, "env-queen-droid")
	}
}

func TestGetCurrentDroid_FromEnv_FACTORY(t *testing.T) {
	cfg := &Config{Droid: "config-droid"}

	os.Unsetenv("QUEEN_DROID")
	os.Setenv("FACTORY_DROID", "env-factory-droid")
	defer os.Unsetenv("FACTORY_DROID")

	droid, err := GetCurrentDroid(nil, cfg)
	if err != nil {
		t.Fatalf("GetCurrentDroid failed: %v", err)
	}
	if droid != "env-factory-droid" {
		t.Errorf("droid = %q, want %q (FACTORY_DROID should take priority over config)", droid, "env-factory-droid")
	}
}

func TestGetCurrentDroid_FromFlag(t *testing.T) {
	cfg := &Config{Droid: "config-droid"}

	os.Setenv("QUEEN_DROID", "env-droid")
	defer os.Unsetenv("QUEEN_DROID")

	cmd := &cobra.Command{}
	cmd.Flags().String("droid", "", "")
	cmd.Flags().Set("droid", "flag-droid")

	droid, err := GetCurrentDroid(cmd, cfg)
	if err != nil {
		t.Fatalf("GetCurrentDroid failed: %v", err)
	}
	if droid != "flag-droid" {
		t.Errorf("droid = %q, want %q (flag should take priority)", droid, "flag-droid")
	}
}

func TestGetCurrentDroid_NoIdentity(t *testing.T) {
	cfg := &Config{}

	os.Unsetenv("QUEEN_DROID")
	os.Unsetenv("FACTORY_DROID")

	_, err := GetCurrentDroid(nil, cfg)
	if err == nil {
		t.Error("Expected error when no identity is set")
	}
}

func TestGetCurrentDroid_Priority(t *testing.T) {
	// Test priority order: flag > QUEEN_DROID > FACTORY_DROID > config

	cfg := &Config{Droid: "config"}

	os.Setenv("FACTORY_DROID", "factory")
	os.Setenv("QUEEN_DROID", "queen")
	defer os.Unsetenv("FACTORY_DROID")
	defer os.Unsetenv("QUEEN_DROID")

	cmd := &cobra.Command{}
	cmd.Flags().String("droid", "", "")
	cmd.Flags().Set("droid", "flag")

	// With flag set, should return flag
	droid, _ := GetCurrentDroid(cmd, cfg)
	if droid != "flag" {
		t.Errorf("With flag: droid = %q, want %q", droid, "flag")
	}

	// Without flag, should return QUEEN_DROID
	cmd2 := &cobra.Command{}
	cmd2.Flags().String("droid", "", "")
	droid, _ = GetCurrentDroid(cmd2, cfg)
	if droid != "queen" {
		t.Errorf("Without flag: droid = %q, want %q", droid, "queen")
	}

	// Without QUEEN_DROID, should return FACTORY_DROID
	os.Unsetenv("QUEEN_DROID")
	droid, _ = GetCurrentDroid(cmd2, cfg)
	if droid != "factory" {
		t.Errorf("Without QUEEN_DROID: droid = %q, want %q", droid, "factory")
	}

	// Without FACTORY_DROID, should return config
	os.Unsetenv("FACTORY_DROID")
	droid, _ = GetCurrentDroid(cmd2, cfg)
	if droid != "config" {
		t.Errorf("Without env vars: droid = %q, want %q", droid, "config")
	}
}
