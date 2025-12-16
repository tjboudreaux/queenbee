package cli

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strings"
	"syscall"
	"time"

	"github.com/mattn/go-runewidth"
	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/daemon"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

// ANSI color codes
const (
	colorReset   = "\033[0m"
	colorBold    = "\033[1m"
	colorDim     = "\033[2m"
	colorRed     = "\033[31m"
	colorGreen   = "\033[32m"
	colorYellow  = "\033[33m"
	colorBlue    = "\033[34m"
	colorMagenta = "\033[35m"
	colorCyan    = "\033[36m"
	colorWhite   = "\033[37m"
	colorGray    = "\033[90m"

	// Cursor control
	cursorHide  = "\033[?25l"
	cursorShow  = "\033[?25h"
	clearScreen = "\033[2J"
	clearToEnd  = "\033[J"
	moveHome    = "\033[H"
)

// watchMetrics holds current and previous values for delta tracking
type watchMetrics struct {
	// Issues (matches bd status)
	issuesTotal      int
	issuesOpen       int
	issuesInProgress int
	issuesBlocked    int
	issuesClosed     int
	issuesReady      int

	// Git Activity (24h) - matches bd status
	gitCommits        int
	gitChanges        int
	issuesCreated24h  int
	issuesClosed24h   int
	issuesReopened24h int
	issuesUpdated24h  int

	// Agents
	agentsRunning int
	agentsMax     int
	agentsIdle    int

	// Queue
	queuePending int
	queueP0      int
	queueP1      int
	queueP2      int
	queueP3      int

	// Messages (last 5 min)
	msgsReceived int
	msgsSent     int
	msgsUrgent   int

	// Running agent details
	runningAgents []runningAgentInfo

	// Queue next item
	queueNext string
}

type runningAgentInfo struct {
	agent   string
	issueID string
	title   string
}

var watchCmd = &cobra.Command{
	Use:   "watch",
	Short: "Live status dashboard",
	Long:  "Display a live-updating status dashboard with issues, agents, queue, and messages.",
	RunE:  runWatch,
}

var (
	watchInterval time.Duration
)

func init() {
	rootCmd.AddCommand(watchCmd)
	watchCmd.Flags().DurationVarP(&watchInterval, "interval", "i", 5*time.Second, "Refresh interval (e.g., 5s, 10s)")
}

func runWatch(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return fmt.Errorf("finding .beads directory: %w", err)
	}

	// Set up signal handling
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	// Hide cursor and clear screen
	fmt.Print(cursorHide)
	fmt.Print(clearScreen)
	defer fmt.Print(cursorShow)

	// Track previous metrics for delta calculation
	var prev *watchMetrics

	ticker := time.NewTicker(watchInterval)
	defer ticker.Stop()

	// Initial render
	current := collectMetrics(beadsDir)
	renderDashboard(current, prev, beadsDir)
	prev = current

	for {
		select {
		case <-ctx.Done():
			return nil
		case <-sigChan:
			return nil
		case <-ticker.C:
			current = collectMetrics(beadsDir)
			renderDashboard(current, prev, beadsDir)
			prev = current
		}
	}
}

func collectMetrics(beadsDir string) *watchMetrics {
	m := &watchMetrics{}
	workDir := filepath.Dir(beadsDir)

	// Collect issue stats from bd
	collectIssueStats(m, workDir)

	// Collect git activity stats
	collectGitActivity(m, workDir)

	// Collect agent stats from runner state
	collectAgentStats(m, beadsDir, workDir)

	// Collect queue stats
	collectQueueStats(m, beadsDir)

	// Collect message stats
	collectMessageStats(m, beadsDir)

	return m
}

func collectIssueStats(m *watchMetrics, workDir string) {
	// Get ready issues
	readyCmd := exec.Command("bd", "ready", "--json")
	readyCmd.Dir = workDir
	if out, err := readyCmd.Output(); err == nil {
		var issues []interface{}
		if json.Unmarshal(out, &issues) == nil {
			m.issuesReady = len(issues)
		}
	}

	// Get all issues for counts (including closed)
	listCmd := exec.Command("bd", "list", "--all", "--json")
	listCmd.Dir = workDir
	if out, err := listCmd.Output(); err == nil {
		var issues []map[string]interface{}
		if json.Unmarshal(out, &issues) == nil {
			m.issuesTotal = len(issues)
			for _, issue := range issues {
				if status, ok := issue["status"].(string); ok {
					switch strings.ToLower(status) {
					case "open":
						m.issuesOpen++
					case "in_progress", "in-progress", "active":
						m.issuesInProgress++
					case "blocked":
						m.issuesBlocked++
					case "closed", "done", "resolved":
						m.issuesClosed++
					}
				}
			}
		}
	}
}

func collectGitActivity(m *watchMetrics, workDir string) {
	// Get commits in last 24 hours
	since := time.Now().Add(-24 * time.Hour).Format("2006-01-02T15:04:05")

	// Count commits
	commitCmd := exec.Command("git", "rev-list", "--count", "--since="+since, "HEAD")
	commitCmd.Dir = workDir
	if out, err := commitCmd.Output(); err == nil {
		fmt.Sscanf(strings.TrimSpace(string(out)), "%d", &m.gitCommits)
	}

	// Count changed files (insertions + deletions)
	statCmd := exec.Command("git", "diff", "--shortstat", "--since="+since, "HEAD~"+fmt.Sprintf("%d", max(m.gitCommits, 1)))
	statCmd.Dir = workDir
	if out, err := statCmd.Output(); err == nil {
		// Parse "X files changed, Y insertions(+), Z deletions(-)"
		parts := strings.Split(string(out), ",")
		for _, part := range parts {
			part = strings.TrimSpace(part)
			var n int
			if strings.Contains(part, "insertion") || strings.Contains(part, "deletion") {
				fmt.Sscanf(part, "%d", &n)
				m.gitChanges += n
			}
		}
	}

	// Get issue activity from bd status output (parse JSONL file directly)
	issuesFile := filepath.Join(workDir, ".beads", "issues.jsonl")
	if data, err := os.ReadFile(issuesFile); err == nil {
		cutoff := time.Now().Add(-24 * time.Hour)
		lines := strings.Split(string(data), "\n")
		for _, line := range lines {
			if line == "" {
				continue
			}
			var issue map[string]interface{}
			if json.Unmarshal([]byte(line), &issue) != nil {
				continue
			}
			// Check created_at
			if created, ok := issue["created_at"].(string); ok {
				if t, err := time.Parse(time.RFC3339, created); err == nil && t.After(cutoff) {
					m.issuesCreated24h++
				}
			}
			// Check closed_at
			if closed, ok := issue["closed_at"].(string); ok && closed != "" {
				if t, err := time.Parse(time.RFC3339, closed); err == nil && t.After(cutoff) {
					m.issuesClosed24h++
				}
			}
			// Check reopened_at
			if reopened, ok := issue["reopened_at"].(string); ok && reopened != "" {
				if t, err := time.Parse(time.RFC3339, reopened); err == nil && t.After(cutoff) {
					m.issuesReopened24h++
				}
			}
			// Check updated_at
			if updated, ok := issue["updated_at"].(string); ok {
				if t, err := time.Parse(time.RFC3339, updated); err == nil && t.After(cutoff) {
					m.issuesUpdated24h++
				}
			}
		}
	}
}

func collectAgentStats(m *watchMetrics, beadsDir, workDir string) {
	// Load registry for max_agents
	if reg, err := registry.Load(workDir); err == nil {
		m.agentsMax = reg.Daemon.MaxAgents
	}

	// Load runner state
	stateFile := filepath.Join(beadsDir, "queen_runner.json")
	if data, err := os.ReadFile(stateFile); err == nil {
		var running map[string]struct {
			Agent   string `json:"agent"`
			IssueID string `json:"issue_id"`
		}
		if json.Unmarshal(data, &running) == nil {
			m.agentsRunning = len(running)
			for _, rc := range running {
				info := runningAgentInfo{
					agent:   rc.Agent,
					issueID: rc.IssueID,
				}
				// Try to get issue title
				if title := getIssueTitle(workDir, rc.IssueID); title != "" {
					info.title = truncate(title, 30)
				}
				m.runningAgents = append(m.runningAgents, info)
			}
		}
	}

	// Calculate idle agents
	m.agentsIdle = m.agentsMax - m.agentsRunning
	if m.agentsIdle < 0 {
		m.agentsIdle = 0
	}
}

func collectQueueStats(m *watchMetrics, beadsDir string) {
	queue := registry.NewWorkQueue(beadsDir)
	items := queue.List()
	m.queuePending = len(items)

	for _, item := range items {
		switch item.Priority {
		case 0:
			m.queueP0++
		case 1:
			m.queueP1++
		case 2:
			m.queueP2++
		default:
			m.queueP3++
		}
	}

	if len(items) > 0 {
		next := items[0]
		m.queueNext = fmt.Sprintf("%s (%s.%s)", next.IssueID, next.Agent, next.Command)
	}
}

func collectMessageStats(m *watchMetrics, beadsDir string) {
	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return
	}

	since := time.Now().Add(-5 * time.Minute)

	// Count messages in last 5 minutes
	// This is a simplification - we'd need more store methods for accurate counts
	// For now, check queen's inbox and sent
	inbox, _ := store.GetInbox("queen", messages.InboxOptions{Since: since})
	m.msgsReceived = len(inbox)

	sent, _ := store.GetSent("queen", 100)
	for _, msg := range sent {
		if msg.CreatedAt.After(since) {
			m.msgsSent++
		}
		if msg.Importance == "urgent" || msg.Importance == "high" {
			if msg.CreatedAt.After(since) {
				m.msgsUrgent++
			}
		}
	}
}

func getIssueTitle(workDir, issueID string) string {
	cmd := exec.Command("bd", "show", issueID, "--json")
	cmd.Dir = workDir
	if out, err := cmd.Output(); err == nil {
		var issue map[string]interface{}
		if json.Unmarshal(out, &issue) == nil {
			if title, ok := issue["title"].(string); ok {
				return title
			}
		}
	}
	return ""
}

func renderDashboard(current, prev *watchMetrics, beadsDir string) {
	fmt.Print(moveHome)

	// Get daemon status
	d := daemon.New(daemon.Config{BeadsDir: beadsDir})
	status := d.GetStatus()

	// Powerline-style separators
	const sep = " │ "

	// Header bar
	timestamp := time.Now().Format("15:04:05")
	if status.Running {
		fmt.Printf("%s👑 QUEEN%s %s%s%s%s ⏱ %s%s\n",
			colorBold+colorMagenta, colorReset,
			colorGreen, "●", colorReset, sep,
			colorCyan, status.Uptime+colorReset)
	} else {
		fmt.Printf("%s👑 QUEEN%s %s%s STOPPED%s%s%s\n",
			colorBold+colorMagenta, colorReset,
			colorYellow, "○", colorReset, sep, timestamp)
	}
	fmt.Println(colorGray + strings.Repeat("─", 72) + colorReset)

	// ISSUES - compact powerline row
	fmt.Printf("%s📋 ISSUES%s %s%d%s%s", colorBold, colorReset, colorWhite, current.issuesTotal, colorReset, sep)
	fmt.Printf("%s%d%s open%s", colorGreen, current.issuesOpen, colorReset, sep)
	fmt.Printf("%s%d%s prog%s", colorBlue, current.issuesInProgress, colorReset, sep)
	fmt.Printf("%s%d%s block%s", colorRed, current.issuesBlocked, colorReset, sep)
	fmt.Printf("%s%d%s closed%s", colorGray, current.issuesClosed, colorReset, sep)
	fmt.Printf("▶ %s%d%s ready %s\n", colorGreen+colorBold, current.issuesReady, colorReset,
		getDelta(current.issuesReady, prev, func(p *watchMetrics) int { return p.issuesReady }))

	// ACTIVITY (24h) - compact powerline row
	fmt.Printf("%s📈 24H%s    %s%d%s commits%s", colorBold, colorReset, colorCyan, current.gitCommits, colorReset, sep)
	fmt.Printf("%s%d%s Δlines%s", colorYellow, current.gitChanges, colorReset, sep)
	fmt.Printf("+%s%d%s -%s%d%s ↺%s%d%s ~%s%d%s issues\n",
		colorGreen, current.issuesCreated24h, colorReset,
		colorRed, current.issuesClosed24h, colorReset,
		colorMagenta, current.issuesReopened24h, colorReset,
		colorBlue, current.issuesUpdated24h, colorReset)

	// AGENTS - compact powerline row
	fmt.Printf("%s🤖 AGENTS%s %s%d%s/%d%s", colorBold, colorReset, colorGreen, current.agentsRunning, colorReset, current.agentsMax, sep)
	fmt.Printf("%s%d%s idle%s", colorYellow, current.agentsIdle, colorReset, sep)
	// Show running agents inline
	if len(current.runningAgents) > 0 {
		agents := make([]string, 0, len(current.runningAgents))
		for _, a := range current.runningAgents {
			agents = append(agents, fmt.Sprintf("%s%s%s→%s", colorCyan, a.agent, colorReset, a.issueID))
		}
		fmt.Printf("%s\n", strings.Join(agents, " "))
	} else {
		fmt.Printf("%s(none active)%s\n", colorGray, colorReset)
	}

	// QUEUE - compact powerline row
	fmt.Printf("%s📦 QUEUE%s  %s%d%s pending%s", colorBold, colorReset, colorWhite, current.queuePending, colorReset, sep)
	fmt.Printf("P0:%s%d%s P1:%s%d%s P2:%s%d%s P3:%s%d%s%s",
		colorRed, current.queueP0, colorReset,
		colorYellow, current.queueP1, colorReset,
		colorBlue, current.queueP2, colorReset,
		colorGray, current.queueP3, colorReset, sep)
	if current.queueNext != "" {
		fmt.Printf("▶ %s%s%s\n", colorCyan, truncate(current.queueNext, 25), colorReset)
	} else {
		fmt.Printf("%s(empty)%s\n", colorGray, colorReset)
	}

	// MESSAGES - compact powerline row
	fmt.Printf("%s💬 MSGS%s   ↓%s%d%s ↑%s%d%s%s",
		colorBold, colorReset,
		colorGreen, current.msgsReceived, colorReset,
		colorBlue, current.msgsSent, colorReset, sep)
	if current.msgsUrgent > 0 {
		fmt.Printf("🚨 %s%d%s urgent\n", colorRed+colorBold, current.msgsUrgent, colorReset)
	} else {
		fmt.Printf("%s0 urgent%s\n", colorGray, colorReset)
	}

	// Footer
	fmt.Println(colorGray + strings.Repeat("─", 72) + colorReset)
	fmt.Printf("%s%s%s │ refresh: %s%s%s │ %sCtrl+C%s quit\n",
		colorGray, timestamp, colorReset,
		colorCyan, watchInterval.String(), colorReset,
		colorYellow, colorReset)
	fmt.Print(clearToEnd)
}

func printLine(width int, format string, args ...interface{}) {
	content := fmt.Sprintf(format, args...)
	visibleLen := countVisible(content)
	padding := width - visibleLen
	if padding < 0 {
		padding = 0
	}
	fmt.Printf("│%s%s│\n", content, strings.Repeat(" ", padding))
}

func printMetric(width int, label string, value int, delta string) {
	content := fmt.Sprintf("  %s %s%d%s", label, colorWhite, value, colorReset)
	if delta != "" {
		content += " " + delta
	}
	visibleLen := countVisible(content)
	padding := width - visibleLen
	if padding < 0 {
		padding = 0
	}
	fmt.Printf("│%s%s│\n", content, strings.Repeat(" ", padding))
}

func printMetricStr(width int, label, value, delta string) {
	content := fmt.Sprintf("  %s %s%s%s", label, colorWhite, value, colorReset)
	if delta != "" {
		content += " " + delta
	}
	visibleLen := countVisible(content)
	padding := width - visibleLen
	if padding < 0 {
		padding = 0
	}
	fmt.Printf("│%s%s│\n", content, strings.Repeat(" ", padding))
}

func countVisible(s string) int {
	// Strip ANSI escape codes first
	var stripped strings.Builder
	inEscape := false
	for _, r := range s {
		if r == '\033' {
			inEscape = true
			continue
		}
		if inEscape {
			if r == 'm' {
				inEscape = false
			}
			continue
		}
		stripped.WriteRune(r)
	}
	// Use runewidth for proper emoji/wide char handling
	return runewidth.StringWidth(stripped.String())
}

func box(pos string, width int) string {
	switch pos {
	case "top":
		return "┌" + strings.Repeat("─", width) + "┐"
	case "bottom":
		return "└" + strings.Repeat("─", width) + "┘"
	default:
		return ""
	}
}

func getDelta(current int, prev *watchMetrics, getter func(*watchMetrics) int) string {
	if prev == nil {
		return ""
	}
	prevVal := getter(prev)
	diff := current - prevVal

	if diff > 0 {
		return fmt.Sprintf("%s(+%d)%s", colorGreen, diff, colorReset)
	} else if diff < 0 {
		return fmt.Sprintf("%s(%d)%s", colorRed, diff, colorReset)
	}
	return fmt.Sprintf("%s(=)%s", colorGray, colorReset)
}

func truncate(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-3] + "..."
}
