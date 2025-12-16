package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/spinner"
	"github.com/charmbracelet/bubbles/table"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/daemon"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

// tickMsg triggers periodic updates
type tickMsg time.Time

// metricsMsg carries refreshed metrics
type metricsMsg struct {
	metrics *watchMetricsTea
}

// watchMetricsTea holds dashboard metrics
type watchMetricsTea struct {
	// Daemon
	daemonRunning bool
	daemonUptime  string

	// Issues
	issuesTotal      int
	issuesOpen       int
	issuesInProgress int
	issuesBlocked    int
	issuesClosed     int
	issuesReady      int

	// Git Activity (24h)
	gitCommits       int
	gitChanges       int
	issuesCreated24h int
	issuesClosed24h  int
	issuesUpdated24h int

	// Agents
	agentsRunning int
	agentsMax     int
	agentsIdle    int
	runningAgents []agentInfoTea

	// Queue
	queuePending int
	queueP0      int
	queueP1      int
	queueP2      int
	queueP3      int
	queueNext    string

	// Messages
	msgsTotal  int
	msgsUnread int
	msgsSince  int
	msgsUrgent int
	msgsHigh   int
}

type agentInfoTea struct {
	name    string
	issueID string
	title   string
}

// watchModel is the Bubble Tea model
type watchModel struct {
	beadsDir string
	workDir  string
	interval time.Duration
	metrics  *watchMetricsTea
	prev     *watchMetricsTea
	spinner  spinner.Model
	width    int
	height   int
	ready    bool
}

func newWatchModel(beadsDir string, interval time.Duration) watchModel {
	s := spinner.New()
	s.Spinner = spinner.Dot
	s.Style = lipgloss.NewStyle().Foreground(ColorCyan)

	return watchModel{
		beadsDir: beadsDir,
		workDir:  filepath.Dir(beadsDir),
		interval: interval,
		spinner:  s,
	}
}

func (m watchModel) Init() tea.Cmd {
	return tea.Batch(
		m.spinner.Tick,
		m.collectMetricsCmd(),
		tickCmd(m.interval),
	)
}

func tickCmd(d time.Duration) tea.Cmd {
	return tea.Tick(d, func(t time.Time) tea.Msg {
		return tickMsg(t)
	})
}

func (m watchModel) collectMetricsCmd() tea.Cmd {
	return func() tea.Msg {
		metrics := collectMetricsTea(m.beadsDir, m.workDir)
		return metricsMsg{metrics: metrics}
	}
}

func (m watchModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.KeyMsg:
		switch msg.String() {
		case "q", "ctrl+c":
			return m, tea.Quit
		case "r":
			return m, m.collectMetricsCmd()
		case "m":
			// Open message TUI
			return m, tea.Sequence(
				tea.ExitAltScreen,
				func() tea.Msg {
					RunMsgTui()
					return nil
				},
				tea.EnterAltScreen,
				m.collectMetricsCmd(),
			)
		}

	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height
		m.ready = true

	case tickMsg:
		return m, tea.Batch(
			m.collectMetricsCmd(),
			tickCmd(m.interval),
		)

	case metricsMsg:
		m.prev = m.metrics
		m.metrics = msg.metrics

	case spinner.TickMsg:
		var cmd tea.Cmd
		m.spinner, cmd = m.spinner.Update(msg)
		return m, cmd
	}

	return m, nil
}

func (m watchModel) View() string {
	if !m.ready || m.metrics == nil {
		return m.spinner.View() + " Loading..."
	}

	var b strings.Builder
	w := minInt(m.width, 80)

	// Header
	b.WriteString(m.renderHeader())
	b.WriteString("\n")
	b.WriteString(DimStyle.Render(strings.Repeat("─", w)))
	b.WriteString("\n")

	// Issues row
	b.WriteString(m.renderIssuesRow())
	b.WriteString("\n")

	// Activity row
	b.WriteString(m.renderActivityRow())
	b.WriteString("\n")

	// Agents row
	b.WriteString(m.renderAgentsRow())
	b.WriteString("\n")

	// Queue row
	b.WriteString(m.renderQueueRow())
	b.WriteString("\n")

	// Messages row
	b.WriteString(m.renderMessagesRow())
	b.WriteString("\n")

	// Divider
	b.WriteString(DimStyle.Render(strings.Repeat("─", w)))
	b.WriteString("\n")

	// Active agents detail
	b.WriteString(m.renderAgentDetail())

	// Footer
	b.WriteString("\n")
	b.WriteString(DimStyle.Render(strings.Repeat("─", w)))
	b.WriteString("\n")
	b.WriteString(m.renderFooter())

	return b.String()
}

func (m watchModel) renderHeader() string {
	timestamp := time.Now().Format("15:04:05")

	status := StatusStoppedStyle.Render(IconCircle + " STOPPED")
	uptime := ""
	if m.metrics.daemonRunning {
		status = StatusRunningStyle.Render(IconDot + " RUNNING")
		uptime = DimStyle.Render(" " + m.metrics.daemonUptime)
	}

	return lipgloss.JoinHorizontal(lipgloss.Top,
		TitleStyle.Render(IconCrown+" QUEEN"),
		" ",
		status,
		uptime,
		"  ",
		DimStyle.Render(timestamp),
	)
}

func (m watchModel) renderIssuesRow() string {
	label := SectionTitleStyle.Render("📋 ISSUES")
	sep := SectionDividerStyle.String()

	total := MetricValueStyle.Render(fmt.Sprintf("%d", m.metrics.issuesTotal))
	open := lipgloss.NewStyle().Foreground(ColorGreen).Render(fmt.Sprintf("%d", m.metrics.issuesOpen))
	prog := lipgloss.NewStyle().Foreground(ColorBlue).Render(fmt.Sprintf("%d", m.metrics.issuesInProgress))
	block := lipgloss.NewStyle().Foreground(ColorRed).Render(fmt.Sprintf("%d", m.metrics.issuesBlocked))
	closed := DimStyle.Render(fmt.Sprintf("%d", m.metrics.issuesClosed))
	ready := lipgloss.NewStyle().Foreground(ColorGreen).Bold(true).Render(fmt.Sprintf("%d", m.metrics.issuesReady))

	delta := m.getDelta(m.metrics.issuesReady, m.prev, func(p *watchMetricsTea) int { return p.issuesReady })

	return fmt.Sprintf("%s %s%s%s open%s%s prog%s%s block%s%s closed%s%s %s ready %s",
		label, total, sep, open, sep, prog, sep, block, sep, closed, sep, IconPlay, ready, delta)
}

func (m watchModel) renderActivityRow() string {
	label := SectionTitleStyle.Render("📈 24H   ")
	sep := SectionDividerStyle.String()

	commits := lipgloss.NewStyle().Foreground(ColorCyan).Render(fmt.Sprintf("%d", m.metrics.gitCommits))
	changes := lipgloss.NewStyle().Foreground(ColorYellow).Render(fmt.Sprintf("%d", m.metrics.gitChanges))
	created := lipgloss.NewStyle().Foreground(ColorGreen).Render(fmt.Sprintf("+%d", m.metrics.issuesCreated24h))
	closedIss := lipgloss.NewStyle().Foreground(ColorRed).Render(fmt.Sprintf("-%d", m.metrics.issuesClosed24h))
	updated := lipgloss.NewStyle().Foreground(ColorBlue).Render(fmt.Sprintf("~%d", m.metrics.issuesUpdated24h))

	return fmt.Sprintf("%s %s commits%s%s Δlines%s%s %s %s issues",
		label, commits, sep, changes, sep, created, closedIss, updated)
}

func (m watchModel) renderAgentsRow() string {
	label := SectionTitleStyle.Render("🤖 AGENTS")
	sep := SectionDividerStyle.String()

	running := lipgloss.NewStyle().Foreground(ColorGreen).Render(fmt.Sprintf("%d", m.metrics.agentsRunning))
	maxA := fmt.Sprintf("/%d", m.metrics.agentsMax)
	idle := lipgloss.NewStyle().Foreground(ColorYellow).Render(fmt.Sprintf("%d", m.metrics.agentsIdle))

	return fmt.Sprintf("%s %s%s running%s%s idle",
		label, running, maxA, sep, idle)
}

func (m watchModel) renderQueueRow() string {
	label := SectionTitleStyle.Render("📦 QUEUE ")
	sep := SectionDividerStyle.String()

	pending := MetricValueStyle.Render(fmt.Sprintf("%d", m.metrics.queuePending))
	p0 := lipgloss.NewStyle().Foreground(ColorRed).Render(fmt.Sprintf("%d", m.metrics.queueP0))
	p1 := lipgloss.NewStyle().Foreground(ColorYellow).Render(fmt.Sprintf("%d", m.metrics.queueP1))
	p2 := lipgloss.NewStyle().Foreground(ColorBlue).Render(fmt.Sprintf("%d", m.metrics.queueP2))
	p3 := DimStyle.Render(fmt.Sprintf("%d", m.metrics.queueP3))

	next := DimStyle.Render("(empty)")
	if m.metrics.queueNext != "" {
		next = lipgloss.NewStyle().Foreground(ColorCyan).Render(truncateDash(m.metrics.queueNext, 25))
	}

	return fmt.Sprintf("%s %s pending%sP0:%s P1:%s P2:%s P3:%s%s%s %s",
		label, pending, sep, p0, p1, p2, p3, sep, IconPlay, next)
}

func (m watchModel) renderMessagesRow() string {
	label := SectionTitleStyle.Render("💬 MSGS  ")
	sep := SectionDividerStyle.String()

	total := MetricValueStyle.Render(fmt.Sprintf("%d", m.metrics.msgsTotal))
	unread := lipgloss.NewStyle().Foreground(ColorYellow).Render(fmt.Sprintf("%d", m.metrics.msgsUnread))
	since := lipgloss.NewStyle().Foreground(ColorGreen).Render(fmt.Sprintf("+%d", m.metrics.msgsSince))

	urgentPart := SuccessStyle.Render(IconCheck)
	if m.metrics.msgsUrgent > 0 || m.metrics.msgsHigh > 0 {
		var parts []string
		if m.metrics.msgsUrgent > 0 {
			parts = append(parts, UrgentStyle.Render(fmt.Sprintf("%s%d", IconUrgent, m.metrics.msgsUrgent)))
		}
		if m.metrics.msgsHigh > 0 {
			parts = append(parts, HighStyle.Render(fmt.Sprintf("%s%d", IconHigh, m.metrics.msgsHigh)))
		}
		urgentPart = strings.Join(parts, " ")
	}

	return fmt.Sprintf("%s %s total%s%s unread%s%s (5m)%s%s",
		label, total, sep, unread, sep, since, sep, urgentPart)
}

func (m watchModel) renderAgentDetail() string {
	var b strings.Builder

	b.WriteString(lipgloss.NewStyle().Bold(true).Render("🤖 ACTIVE AGENTS"))
	b.WriteString("\n")

	if len(m.metrics.runningAgents) > 0 {
		for _, a := range m.metrics.runningAgents {
			b.WriteString(fmt.Sprintf("   %s %-18s %s %-8s %s\n",
				StatusRunningStyle.Render(IconDot),
				lipgloss.NewStyle().Foreground(ColorCyan).Render(a.name),
				DimStyle.Render(IconArrow),
				MetricValueStyle.Render(a.issueID),
				DimStyle.Render(a.title),
			))
		}
	} else {
		b.WriteString(DimStyle.Render("   (no agents currently working)"))
		b.WriteString("\n")
	}

	if m.metrics.agentsIdle > 0 {
		b.WriteString(fmt.Sprintf("   %s %s\n",
			StatusStoppedStyle.Render(IconCircle),
			lipgloss.NewStyle().Foreground(ColorYellow).Render(
				fmt.Sprintf("%d idle slot%s available", m.metrics.agentsIdle, pluralizeTea(m.metrics.agentsIdle))),
		))
	}

	return b.String()
}

func (m watchModel) renderFooter() string {
	return HelpStyle.Render(fmt.Sprintf(
		"%s │ refresh: %s │ r force refresh │ m messages │ q quit",
		time.Now().Format("15:04:05"),
		m.interval.String(),
	))
}

func (m watchModel) getDelta(current int, prev *watchMetricsTea, getter func(*watchMetricsTea) int) string {
	if prev == nil {
		return ""
	}
	prevVal := getter(prev)
	diff := current - prevVal

	if diff > 0 {
		return MetricDeltaUpStyle.Render(fmt.Sprintf("(+%d)", diff))
	} else if diff < 0 {
		return MetricDeltaDownStyle.Render(fmt.Sprintf("(%d)", diff))
	}
	return MetricDeltaNeutralStyle.Render("(=)")
}

func collectMetricsTea(beadsDir, workDir string) *watchMetricsTea {
	m := &watchMetricsTea{}

	// Daemon status
	d := daemon.New(daemon.Config{BeadsDir: beadsDir})
	status := d.GetStatus()
	m.daemonRunning = status.Running
	m.daemonUptime = status.Uptime

	// Issues
	collectIssueStatsTea(m, workDir)

	// Git activity
	collectGitActivityTea(m, workDir)

	// Agents
	collectAgentStatsTea(m, beadsDir, workDir)

	// Queue
	collectQueueStatsTea(m, beadsDir)

	// Messages
	collectMessageStatsTea(m, beadsDir)

	return m
}

func collectIssueStatsTea(m *watchMetricsTea, workDir string) {
	// Get ready issues
	readyCmd := exec.Command("bd", "ready", "--json")
	readyCmd.Dir = workDir
	if out, err := readyCmd.Output(); err == nil {
		var issues []interface{}
		if json.Unmarshal(out, &issues) == nil {
			m.issuesReady = len(issues)
		}
	}

	// Get all issues
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

func collectGitActivityTea(m *watchMetricsTea, workDir string) {
	since := time.Now().Add(-24 * time.Hour).Format("2006-01-02T15:04:05")

	commitCmd := exec.Command("git", "rev-list", "--count", "--since="+since, "HEAD")
	commitCmd.Dir = workDir
	if out, err := commitCmd.Output(); err == nil {
		fmt.Sscanf(strings.TrimSpace(string(out)), "%d", &m.gitCommits)
	}

	// Issue activity from JSONL
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
			if created, ok := issue["created_at"].(string); ok {
				if t, err := time.Parse(time.RFC3339, created); err == nil && t.After(cutoff) {
					m.issuesCreated24h++
				}
			}
			if closed, ok := issue["closed_at"].(string); ok && closed != "" {
				if t, err := time.Parse(time.RFC3339, closed); err == nil && t.After(cutoff) {
					m.issuesClosed24h++
				}
			}
			if updated, ok := issue["updated_at"].(string); ok {
				if t, err := time.Parse(time.RFC3339, updated); err == nil && t.After(cutoff) {
					m.issuesUpdated24h++
				}
			}
		}
	}
}

func collectAgentStatsTea(m *watchMetricsTea, beadsDir, workDir string) {
	if reg, err := registry.Load(workDir); err == nil {
		m.agentsMax = reg.Daemon.MaxAgents
	}

	stateFile := filepath.Join(beadsDir, "queen_runner.json")
	if data, err := os.ReadFile(stateFile); err == nil {
		var running map[string]struct {
			Agent   string `json:"agent"`
			IssueID string `json:"issue_id"`
		}
		if json.Unmarshal(data, &running) == nil {
			m.agentsRunning = len(running)
			for _, rc := range running {
				info := agentInfoTea{
					name:    rc.Agent,
					issueID: rc.IssueID,
				}
				if title := getIssueTitleTea(workDir, rc.IssueID); title != "" {
					info.title = truncateDash(title, 30)
				}
				m.runningAgents = append(m.runningAgents, info)
			}
		}
	}

	m.agentsIdle = m.agentsMax - m.agentsRunning
	if m.agentsIdle < 0 {
		m.agentsIdle = 0
	}
}

func collectQueueStatsTea(m *watchMetricsTea, beadsDir string) {
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

func collectMessageStatsTea(m *watchMetricsTea, beadsDir string) {
	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return
	}

	since := time.Now().Add(-5 * time.Minute)
	stats, err := store.GetStats(since)
	if err != nil {
		return
	}

	m.msgsTotal = stats.Total
	m.msgsUnread = stats.Unread
	m.msgsSince = stats.SinceTotal
	m.msgsUrgent = stats.ByImportance[messages.ImportanceUrgent]
	m.msgsHigh = stats.ByImportance[messages.ImportanceHigh]
}

func getIssueTitleTea(workDir, issueID string) string {
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

func truncateDash(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-3] + "..."
}

func pluralizeTea(n int) string {
	if n == 1 {
		return ""
	}
	return "s"
}

func minInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// Placeholder table for future use
var _ = table.New

// RunWatch starts the watch dashboard
func RunWatch(interval time.Duration) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	m := newWatchModel(beadsDir, interval)

	p := tea.NewProgram(
		m,
		tea.WithAltScreen(),
	)

	_, err = p.Run()
	return err
}
