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
	// Issues
	issuesReady      int
	issuesInProgress int
	issuesBlocked    int
	issuesTotal      int

	// Agents
	agentsRunning int
	agentsMax     int
	agentsErrored int

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

	// Get all issues for counts
	listCmd := exec.Command("bd", "list", "--json")
	listCmd.Dir = workDir
	if out, err := listCmd.Output(); err == nil {
		var issues []map[string]interface{}
		if json.Unmarshal(out, &issues) == nil {
			m.issuesTotal = len(issues)
			for _, issue := range issues {
				if status, ok := issue["status"].(string); ok {
					switch strings.ToLower(status) {
					case "in_progress", "in-progress", "active":
						m.issuesInProgress++
					case "blocked":
						m.issuesBlocked++
					}
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

	w := 65 // box inner width

	// Header
	fmt.Println(box("top", w))
	if status.Running {
		printLine(w, "  👑 %sQUEEN DAEMON STATUS%s                    ⏱️  Uptime: %s%s%s", colorBold, colorReset, colorCyan, status.Uptime, colorReset)
	} else {
		printLine(w, "  👑 %sQUEEN DAEMON STATUS%s                    %s⚠️  NOT RUNNING%s", colorBold, colorReset, colorYellow, colorReset)
	}
	fmt.Printf("│  %s  │\n", strings.Repeat("━", w-4))
	printLine(w, "")

	// Issues section
	printLine(w, "  📋 %sISSUES%s", colorBold, colorReset)
	printMetric(w, "├─ 🟢 Ready:", current.issuesReady, getDelta(current.issuesReady, prev, func(p *watchMetrics) int { return p.issuesReady }))
	printMetric(w, "├─ 🔵 In Progress:", current.issuesInProgress, getDelta(current.issuesInProgress, prev, func(p *watchMetrics) int { return p.issuesInProgress }))
	printMetric(w, "├─ 🔴 Blocked:", current.issuesBlocked, getDelta(current.issuesBlocked, prev, func(p *watchMetrics) int { return p.issuesBlocked }))
	printMetric(w, "└─ ⚪ Total:", current.issuesTotal, getDelta(current.issuesTotal, prev, func(p *watchMetrics) int { return p.issuesTotal }))
	printLine(w, "")

	// Agents section
	printLine(w, "  🤖 %sAGENTS%s", colorBold, colorReset)
	printMetricStr(w, "├─ 🟢 Running:", fmt.Sprintf("%d/%d", current.agentsRunning, current.agentsMax), "")

	// Show running agents
	for i, agent := range current.runningAgents {
		prefix := "│   ├─"
		if i == len(current.runningAgents)-1 && current.agentsMax-current.agentsRunning == 0 {
			prefix = "│   └─"
		}
		printLine(w, "  %s %s%-14s%s → %s (%s)", prefix, colorCyan, agent.agent, colorReset, agent.issueID, agent.title)
	}

	idle := current.agentsMax - current.agentsRunning
	if idle < 0 {
		idle = 0
	}
	printMetric(w, "├─ 🟡 Idle:", idle, "")
	printMetric(w, "└─ 🔴 Errored:", current.agentsErrored, getDelta(current.agentsErrored, prev, func(p *watchMetrics) int { return p.agentsErrored }))
	printLine(w, "")

	// Queue section
	printLine(w, "  📦 %sQUEUE%s", colorBold, colorReset)
	printMetric(w, "├─ Pending:", current.queuePending, getDelta(current.queuePending, prev, func(p *watchMetrics) int { return p.queuePending }))

	// Priority breakdown
	printLine(w, "  │   ├─ P0: %s%d%s  ├─ P1: %s%d%s  ├─ P2: %s%d%s  ├─ P3: %s%d%s",
		colorRed, current.queueP0, colorReset,
		colorYellow, current.queueP1, colorReset,
		colorBlue, current.queueP2, colorReset,
		colorGray, current.queueP3, colorReset)

	if current.queueNext != "" {
		printLine(w, "  └─ Next: %s%s%s", colorCyan, current.queueNext, colorReset)
	} else {
		printLine(w, "  └─ Next: %s(empty)%s", colorGray, colorReset)
	}
	printLine(w, "")

	// Messages section
	printLine(w, "  💬 %sMESSAGES%s (last 5m)", colorBold, colorReset)
	printMetric(w, "├─ 📨 Received:", current.msgsReceived, getDelta(current.msgsReceived, prev, func(p *watchMetrics) int { return p.msgsReceived }))
	printMetric(w, "├─ 📤 Sent:", current.msgsSent, getDelta(current.msgsSent, prev, func(p *watchMetrics) int { return p.msgsSent }))
	printMetric(w, "└─ 🚨 Urgent:", current.msgsUrgent, getDelta(current.msgsUrgent, prev, func(p *watchMetrics) int { return p.msgsUrgent }))
	printLine(w, "")

	// Footer
	fmt.Printf("│  %s  │\n", strings.Repeat("━", w-4))
	timestamp := time.Now().Format("15:04:05")
	printLine(w, "  Last refresh: %s%s%s   Press %sCtrl+C%s to quit   Refresh: %s%s%s",
		colorCyan, timestamp, colorReset,
		colorYellow, colorReset,
		colorGreen, watchInterval.String(), colorReset)
	fmt.Println(box("bottom", w))
	fmt.Print(clearToEnd) // Clear any leftover content from previous renders
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
