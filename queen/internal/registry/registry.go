// Package registry provides the queen agent registry loaded from .queen.yaml.
package registry

import (
	"crypto/sha256"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"gopkg.in/yaml.v3"
)

// DefaultMaxConcurrent is the default max_concurrent value if not specified.
const DefaultMaxConcurrent = 1

// Registry represents the .queen.yaml configuration.
type Registry struct {
	Version      int                 `yaml:"version"`
	Daemon       DaemonConfig        `yaml:"daemon"`
	Agents       map[string]Agent    `yaml:"agents"`
	Rules        []Rule              `yaml:"rules"`
	DefaultAgent string              `yaml:"default_agent"`
	Workflows    map[string]Workflow `yaml:"workflows,omitempty"`
}

// DaemonConfig holds global daemon settings.
type DaemonConfig struct {
	MaxAgents    int           `yaml:"max_agents"`
	PollInterval time.Duration `yaml:"poll_interval"`
	StaleHours   int           `yaml:"stale_hours"`
}

// Agent represents an agent in the registry.
type Agent struct {
	Skills   []string           `yaml:"skills"`
	Commands map[string]Command `yaml:"commands"`
}

// Command represents a command an agent can execute.
type Command struct {
	Run           string `yaml:"run"`
	MaxConcurrent int    `yaml:"max_concurrent"`
}

// Rule represents an assignment rule.
type Rule struct {
	Match RuleMatch `yaml:"match"`
	Agent string    `yaml:"agent"`
}

// RuleMatch defines matching criteria for a rule.
type RuleMatch struct {
	Labels   []string `yaml:"labels"`
	Type     string   `yaml:"type,omitempty"`     // task, epic, bug
	Priority string   `yaml:"priority,omitempty"` // P0, P1, P2, P3
}

// Load loads the registry from a .queen.yaml file.
// It searches in the given directory and parent directories.
func Load(startDir string) (*Registry, error) {
	path, err := FindRegistryFile(startDir)
	if err != nil {
		return nil, err
	}
	return LoadFromFile(path)
}

// FindRegistryFile searches for .queen.yaml starting from dir and going up.
func FindRegistryFile(dir string) (string, error) {
	current := dir
	for {
		candidate := filepath.Join(current, ".queen.yaml")
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}

		// Also check queen.yaml (without dot)
		candidate = filepath.Join(current, "queen.yaml")
		if _, err := os.Stat(candidate); err == nil {
			return candidate, nil
		}

		parent := filepath.Dir(current)
		if parent == current {
			return "", fmt.Errorf("no .queen.yaml found in %s or parent directories", dir)
		}
		current = parent
	}
}

// LoadFromFile loads a registry from a specific file path.
func LoadFromFile(path string) (*Registry, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("reading registry file: %w", err)
	}

	var reg Registry
	if err := yaml.Unmarshal(data, &reg); err != nil {
		return nil, fmt.Errorf("parsing registry file: %w", err)
	}

	// Apply defaults
	reg.applyDefaults()

	// Validate
	if err := reg.Validate(); err != nil {
		return nil, fmt.Errorf("invalid registry: %w", err)
	}

	return &reg, nil
}

// applyDefaults sets default values for missing fields.
func (r *Registry) applyDefaults() {
	// Daemon defaults
	if r.Daemon.MaxAgents == 0 {
		r.Daemon.MaxAgents = 4
	}
	if r.Daemon.PollInterval == 0 {
		r.Daemon.PollInterval = 30 * time.Second
	}
	if r.Daemon.StaleHours == 0 {
		r.Daemon.StaleHours = 24
	}

	// Command defaults
	for name, agent := range r.Agents {
		for cmdName, cmd := range agent.Commands {
			if cmd.MaxConcurrent == 0 {
				cmd.MaxConcurrent = DefaultMaxConcurrent
			}
			agent.Commands[cmdName] = cmd
		}
		r.Agents[name] = agent
	}
}

// Validate checks the registry for errors.
func (r *Registry) Validate() error {
	if r.Version == 0 {
		return fmt.Errorf("version is required")
	}
	if r.Version != 1 {
		return fmt.Errorf("unsupported version: %d", r.Version)
	}

	if len(r.Agents) == 0 {
		return fmt.Errorf("at least one agent is required")
	}

	// Validate agents
	for name, agent := range r.Agents {
		if len(agent.Commands) == 0 {
			return fmt.Errorf("agent %q has no commands defined", name)
		}
		for cmdName, cmd := range agent.Commands {
			if cmd.Run == "" {
				return fmt.Errorf("agent %q command %q has no run defined", name, cmdName)
			}
		}
	}

	// Validate rules reference valid agents
	for i, rule := range r.Rules {
		if rule.Agent == "" {
			return fmt.Errorf("rule %d has no agent", i)
		}
		if _, ok := r.Agents[rule.Agent]; !ok {
			return fmt.Errorf("rule %d references unknown agent %q", i, rule.Agent)
		}
	}

	// Validate default_agent if set
	if r.DefaultAgent != "" {
		if _, ok := r.Agents[r.DefaultAgent]; !ok {
			return fmt.Errorf("default_agent references unknown agent %q", r.DefaultAgent)
		}
	}

	return nil
}

// GetAgent returns an agent by name.
func (r *Registry) GetAgent(name string) (Agent, bool) {
	agent, ok := r.Agents[name]
	return agent, ok
}

// GetCommand returns a command for an agent.
func (r *Registry) GetCommand(agentName, commandName string) (Command, bool) {
	agent, ok := r.Agents[agentName]
	if !ok {
		return Command{}, false
	}
	cmd, ok := agent.Commands[commandName]
	return cmd, ok
}

// MatchAgent finds the best agent for an issue based on rules.
func (r *Registry) MatchAgent(labels []string, issueType, priority string) string {
	for _, rule := range r.Rules {
		if r.ruleMatches(rule, labels, issueType, priority) {
			return rule.Agent
		}
	}
	return r.DefaultAgent
}

// ruleMatches checks if a rule matches the given criteria.
func (r *Registry) ruleMatches(rule Rule, labels []string, issueType, priority string) bool {
	// Check labels (any match)
	if len(rule.Match.Labels) > 0 {
		matched := false
		for _, ruleLabel := range rule.Match.Labels {
			for _, label := range labels {
				if strings.EqualFold(ruleLabel, label) {
					matched = true
					break
				}
			}
			if matched {
				break
			}
		}
		if !matched {
			return false
		}
	}

	// Check type
	if rule.Match.Type != "" && !strings.EqualFold(rule.Match.Type, issueType) {
		return false
	}

	// Check priority
	if rule.Match.Priority != "" && !strings.EqualFold(rule.Match.Priority, priority) {
		return false
	}

	return true
}

// BuildCommand builds a command string with T_ISSUE_ID and T_AGENT replaced.
func (r *Registry) BuildCommand(agentName, commandName, issueID string) (string, error) {
	cmd, ok := r.GetCommand(agentName, commandName)
	if !ok {
		return "", fmt.Errorf("command %q not found for agent %q", commandName, agentName)
	}
	result := strings.ReplaceAll(cmd.Run, "T_ISSUE_ID", issueID)
	result = strings.ReplaceAll(result, "T_AGENT", agentName)
	return result, nil
}

// CommandHash generates a unique hash for a command instance.
// This prevents running duplicate commands.
func CommandHash(agentName, commandName, issueID string) string {
	data := fmt.Sprintf("%s:%s:%s", agentName, commandName, issueID)
	hash := sha256.Sum256([]byte(data))
	return fmt.Sprintf("%x", hash[:8]) // First 16 hex chars
}

// ListAgents returns all agent names.
func (r *Registry) ListAgents() []string {
	names := make([]string, 0, len(r.Agents))
	for name := range r.Agents {
		names = append(names, name)
	}
	return names
}

// AgentHasSkill checks if an agent has a specific skill.
func (r *Registry) AgentHasSkill(agentName, skill string) bool {
	agent, ok := r.Agents[agentName]
	if !ok {
		return false
	}
	for _, s := range agent.Skills {
		if strings.EqualFold(s, skill) {
			return true
		}
	}
	return false
}

// FindAgentsWithSkill returns all agents that have a given skill.
func (r *Registry) FindAgentsWithSkill(skill string) []string {
	var agents []string
	for name, agent := range r.Agents {
		for _, s := range agent.Skills {
			if strings.EqualFold(s, skill) {
				agents = append(agents, name)
				break
			}
		}
	}
	return agents
}
