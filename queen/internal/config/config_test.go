package config

import (
	"os"
	"path/filepath"
	"testing"
	"time"
)

func setupTestConfig(t *testing.T) string {
	t.Helper()
	dir := t.TempDir()
	beadsDir := filepath.Join(dir, ".beads")
	if err := os.MkdirAll(beadsDir, 0755); err != nil {
		t.Fatal(err)
	}
	return beadsDir
}

func TestLoadConfig_Empty(t *testing.T) {
	beadsDir := setupTestConfig(t)

	cfg, err := LoadConfig(beadsDir)
	if err != nil {
		t.Fatalf("LoadConfig failed: %v", err)
	}

	if cfg.Droid != "" {
		t.Errorf("Droid = %q, want empty", cfg.Droid)
	}
	if cfg.TTL != 0 {
		t.Errorf("TTL = %v, want 0", cfg.TTL)
	}
}

func TestSaveConfig_Load(t *testing.T) {
	beadsDir := setupTestConfig(t)

	cfg := &Config{
		Droid: "test-droid",
		TTL:   30 * time.Minute,
	}

	if err := SaveConfig(beadsDir, cfg); err != nil {
		t.Fatalf("SaveConfig failed: %v", err)
	}

	loaded, err := LoadConfig(beadsDir)
	if err != nil {
		t.Fatalf("LoadConfig failed: %v", err)
	}

	if loaded.Droid != "test-droid" {
		t.Errorf("Droid = %q, want %q", loaded.Droid, "test-droid")
	}
	if loaded.TTL != 30*time.Minute {
		t.Errorf("TTL = %v, want %v", loaded.TTL, 30*time.Minute)
	}
}

func TestConfig_Set(t *testing.T) {
	cfg := &Config{}

	// Set agent (using new key)
	if err := cfg.Set("agent", "my-agent"); err != nil {
		t.Fatalf("Set agent failed: %v", err)
	}
	if cfg.Agent != "my-agent" {
		t.Errorf("Agent = %q, want %q", cfg.Agent, "my-agent")
	}

	// Set agent via deprecated droid key (backward compat)
	if err := cfg.Set("droid", "my-droid"); err != nil {
		t.Fatalf("Set droid failed: %v", err)
	}
	if cfg.Agent != "my-droid" {
		t.Errorf("Agent = %q, want %q (set via droid key)", cfg.Agent, "my-droid")
	}

	// Set TTL
	if err := cfg.Set("ttl", "1h30m"); err != nil {
		t.Fatalf("Set ttl failed: %v", err)
	}
	if cfg.TTL != 90*time.Minute {
		t.Errorf("TTL = %v, want %v", cfg.TTL, 90*time.Minute)
	}
}

func TestConfig_Set_InvalidKey(t *testing.T) {
	cfg := &Config{}

	err := cfg.Set("invalid", "value")
	if err == nil {
		t.Error("Expected error for invalid key")
	}
}

func TestConfig_Set_InvalidTTL(t *testing.T) {
	cfg := &Config{}

	err := cfg.Set("ttl", "not-a-duration")
	if err == nil {
		t.Error("Expected error for invalid TTL")
	}
}

func TestConfig_Get(t *testing.T) {
	cfg := &Config{
		Droid: "test-droid",
		TTL:   2 * time.Hour,
	}

	droid, err := cfg.Get("droid")
	if err != nil {
		t.Fatalf("Get droid failed: %v", err)
	}
	if droid != "test-droid" {
		t.Errorf("droid = %q, want %q", droid, "test-droid")
	}

	ttl, err := cfg.Get("ttl")
	if err != nil {
		t.Fatalf("Get ttl failed: %v", err)
	}
	if ttl != "2h0m0s" {
		t.Errorf("ttl = %q, want %q", ttl, "2h0m0s")
	}
}

func TestConfig_Get_Empty(t *testing.T) {
	cfg := &Config{}

	droid, _ := cfg.Get("droid")
	if droid != "(not set)" {
		t.Errorf("droid = %q, want %q", droid, "(not set)")
	}

	ttl, _ := cfg.Get("ttl")
	if ttl != "2h (default)" {
		t.Errorf("ttl = %q, want %q", ttl, "2h (default)")
	}
}

func TestConfig_Get_InvalidKey(t *testing.T) {
	cfg := &Config{}

	_, err := cfg.Get("invalid")
	if err == nil {
		t.Error("Expected error for invalid key")
	}
}

func TestConfig_GetTTL(t *testing.T) {
	// Default TTL
	cfg := &Config{}
	if cfg.GetTTL() != 2*time.Hour {
		t.Errorf("GetTTL() = %v, want 2h", cfg.GetTTL())
	}

	// Custom TTL
	cfg.TTL = 30 * time.Minute
	if cfg.GetTTL() != 30*time.Minute {
		t.Errorf("GetTTL() = %v, want 30m", cfg.GetTTL())
	}
}
