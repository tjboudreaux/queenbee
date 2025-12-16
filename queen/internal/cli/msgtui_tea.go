package cli

import (
	"fmt"
	"io"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/charmbracelet/bubbles/key"
	"github.com/charmbracelet/bubbles/list"
	"github.com/charmbracelet/bubbles/viewport"
	tea "github.com/charmbracelet/bubbletea"
	"github.com/charmbracelet/lipgloss"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

// ============================================================================
// STYLES - Professional shared inbox appearance
// ============================================================================

var (
	// Layout dimensions
	sidebarWidth = 24

	// Brand colors
	brandPrimary   = lipgloss.Color("#7C3AED") // Purple
	brandSecondary = lipgloss.Color("#6366F1") // Indigo
	accentColor    = lipgloss.Color("#10B981") // Emerald

	// Sidebar styles
	sidebarStyle = lipgloss.NewStyle().
			Width(sidebarWidth).
			BorderStyle(lipgloss.NormalBorder()).
			BorderRight(true).
			BorderForeground(lipgloss.Color("#333"))

	sidebarHeaderStyle = lipgloss.NewStyle().
				Padding(1, 2).
				Bold(true).
				Foreground(brandPrimary)

	sidebarItemStyle = lipgloss.NewStyle().
				Padding(0, 2).
				Foreground(lipgloss.Color("#888"))

	sidebarActiveStyle = lipgloss.NewStyle().
				Padding(0, 2).
				Bold(true).
				Foreground(lipgloss.Color("#fff")).
				Background(brandPrimary)

	sidebarBadgeStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#fff")).
				Background(lipgloss.Color("#EF4444")).
				Padding(0, 1).
				Bold(true)

	// Header styles
	headerStyle = lipgloss.NewStyle().
			Padding(0, 2).
			BorderStyle(lipgloss.NormalBorder()).
			BorderBottom(true).
			BorderForeground(lipgloss.Color("#333"))

	logoStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(brandPrimary)

	headerTitleStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#fff")).
				Bold(true)

	headerSubtitleStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#666"))

	// Message list styles
	listContainerStyle = lipgloss.NewStyle().
				Padding(0, 1)

	// Status bar
	statusBarStyle = lipgloss.NewStyle().
			Padding(0, 2).
			Background(lipgloss.Color("#1a1a1a")).
			Foreground(lipgloss.Color("#666"))

	statusKeyStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#888")).
			Background(lipgloss.Color("#333")).
			Padding(0, 1)

	statusDescStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666")).
			Padding(0, 1)

	// Detail view styles
	detailHeaderStyle = lipgloss.NewStyle().
				Padding(1, 2).
				BorderStyle(lipgloss.NormalBorder()).
				BorderBottom(true).
				BorderForeground(lipgloss.Color("#333"))

	detailSubjectStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(lipgloss.Color("#fff")).
				MarginBottom(1)

	detailMetaStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#888"))

	detailBodyStyle = lipgloss.NewStyle().
			Padding(1, 2)

	// Avatar style
	avatarStyle = lipgloss.NewStyle().
			Width(2).
			Height(1).
			Align(lipgloss.Center).
			Bold(true)

	// Priority badges
	urgentBadgeStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#fff")).
				Background(lipgloss.Color("#DC2626")).
				Padding(0, 1).
				Bold(true)

	highBadgeStyle = lipgloss.NewStyle().
			Foreground(lipgloss.Color("#000")).
			Background(lipgloss.Color("#F59E0B")).
			Padding(0, 1)

	normalBadgeStyle = lipgloss.NewStyle().
				Foreground(lipgloss.Color("#fff")).
				Background(lipgloss.Color("#6B7280")).
				Padding(0, 1)
)

// ============================================================================
// MESSAGE ITEM - Custom list item with rich formatting
// ============================================================================

type messageItem struct {
	msg messages.Message
}

func (i messageItem) Title() string       { return i.msg.Subject }
func (i messageItem) Description() string { return i.msg.From }
func (i messageItem) FilterValue() string {
	return i.msg.Subject + " " + i.msg.From + " " + i.msg.To + " " + i.msg.Body
}

// Custom delegate for rich message rendering
type messageDelegate struct {
	width int
}

func newMessageDelegate() messageDelegate {
	return messageDelegate{}
}

func (d messageDelegate) Height() int                         { return 4 }
func (d messageDelegate) Spacing() int                        { return 0 }
func (d messageDelegate) Update(msg tea.Msg, m *list.Model) tea.Cmd { return nil }

func (d messageDelegate) Render(w io.Writer, m list.Model, index int, item list.Item) {
	mi, ok := item.(messageItem)
	if !ok {
		return
	}

	msg := mi.msg
	selected := index == m.Index()
	width := d.width - 4

	// Build the message row
	var lines []string

	// Line 1: Unread indicator + From + Time
	unreadDot := "  "
	if !msg.Read {
		unreadDot = lipgloss.NewStyle().Foreground(accentColor).Bold(true).Render("● ")
	}

	fromStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#fff"))
	if !msg.Read {
		fromStyle = fromStyle.Bold(true)
	}
	if selected {
		fromStyle = fromStyle.Foreground(brandPrimary)
	}

	timeStr := formatRelativeTime(msg.CreatedAt)
	timeStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#666"))

	fromName := truncateStr2(msg.From, 20)
	line1 := fmt.Sprintf("%s%s", unreadDot, fromStyle.Render(fromName))
	
	// Add arrow and recipient
	toName := truncateStr2(msg.To, 15)
	arrow := lipgloss.NewStyle().Foreground(lipgloss.Color("#444")).Render(" → ")
	toStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#888"))
	line1 += arrow + toStyle.Render(toName)
	
	// Pad and add time
	padding := width - lipgloss.Width(line1) - len(timeStr)
	if padding > 0 {
		line1 += strings.Repeat(" ", padding) + timeStyle.Render(timeStr)
	}
	lines = append(lines, line1)

	// Line 2: Subject with priority badge
	subjectStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#ccc"))
	if !msg.Read {
		subjectStyle = subjectStyle.Foreground(lipgloss.Color("#fff"))
	}
	if selected {
		subjectStyle = subjectStyle.Bold(true)
	}

	priorityBadge := ""
	switch msg.Importance {
	case messages.ImportanceUrgent:
		priorityBadge = urgentBadgeStyle.Render("URGENT") + " "
	case messages.ImportanceHigh:
		priorityBadge = highBadgeStyle.Render("HIGH") + " "
	}

	subject := truncateStr2(msg.Subject, width-lipgloss.Width(priorityBadge)-4)
	line2 := "   " + priorityBadge + subjectStyle.Render(subject)
	lines = append(lines, line2)

	// Line 3: Preview of body
	preview := strings.ReplaceAll(msg.Body, "\n", " ")
	preview = strings.TrimSpace(preview)
	if preview == "" {
		preview = "(no content)"
	}
	preview = truncateStr2(preview, width-4)
	previewStyle := lipgloss.NewStyle().Foreground(lipgloss.Color("#555"))
	line3 := "   " + previewStyle.Render(preview)
	lines = append(lines, line3)

	// Line 4: Separator or thread info
	threadInfo := ""
	if msg.ThreadID != "" && msg.ThreadID != msg.ID {
		threadInfo = lipgloss.NewStyle().Foreground(lipgloss.Color("#444")).Render("   ↳ in thread")
	}
	lines = append(lines, threadInfo)

	// Apply selection background
	content := strings.Join(lines, "\n")
	if selected {
		content = lipgloss.NewStyle().
			Background(lipgloss.Color("#1a1a2e")).
			Width(width).
			Render(content)
	}

	fmt.Fprint(w, content)
}

// ============================================================================
// VIEW MODES
// ============================================================================

type msgViewMode int

const (
	msgViewList msgViewMode = iota
	msgViewDetail
)

// ============================================================================
// KEY BINDINGS
// ============================================================================

type msgKeyMap struct {
	Quit     key.Binding
	Back     key.Binding
	Enter    key.Binding
	NextTab  key.Binding
	PrevTab  key.Binding
	Refresh  key.Binding
	MarkRead key.Binding
	Reply    key.Binding
}

var msgKeys = msgKeyMap{
	Quit:     key.NewBinding(key.WithKeys("q", "ctrl+c"), key.WithHelp("q", "quit")),
	Back:     key.NewBinding(key.WithKeys("esc", "backspace"), key.WithHelp("esc", "back")),
	Enter:    key.NewBinding(key.WithKeys("enter", "o"), key.WithHelp("enter", "open")),
	NextTab:  key.NewBinding(key.WithKeys("tab", "l"), key.WithHelp("tab", "next")),
	PrevTab:  key.NewBinding(key.WithKeys("shift+tab", "h"), key.WithHelp("S-tab", "prev")),
	Refresh:  key.NewBinding(key.WithKeys("r", "ctrl+r"), key.WithHelp("r", "refresh")),
	MarkRead: key.NewBinding(key.WithKeys("m"), key.WithHelp("m", "mark read")),
	Reply:    key.NewBinding(key.WithKeys("R"), key.WithHelp("R", "reply")),
}

// ============================================================================
// ASYNC MESSAGES
// ============================================================================

type messagesLoadedMsg struct {
	messages []messages.Message
	stats    *messages.Stats
	err      error
}

type messageMarkedReadMsg struct {
	id  string
	err error
}

// ============================================================================
// AGENT INFO - For sidebar
// ============================================================================

type agentInfo struct {
	name   string
	unread int
	total  int
}

// ============================================================================
// MODEL
// ============================================================================

type msgTuiModel struct {
	beadsDir     string
	store        *messages.Store
	agents       []agentInfo
	currentAgent int // -1 = all
	viewMode     msgViewMode

	list       list.Model
	viewport   viewport.Model
	delegate   messageDelegate

	allMessages []messages.Message
	selectedMsg *messages.Message
	stats       *messages.Stats

	width  int
	height int
	ready  bool
	err    error
}

func newMsgTuiModel(beadsDir string) (msgTuiModel, error) {
	workDir := filepath.Dir(beadsDir)

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return msgTuiModel{}, err
	}

	reg, err := registry.Load(workDir)
	if err != nil {
		return msgTuiModel{}, err
	}

	// Build agent list
	agentNames := reg.ListAgents()
	agents := make([]agentInfo, len(agentNames))
	for i, name := range agentNames {
		agents[i] = agentInfo{name: name}
	}

	// Sort agents alphabetically
	sort.Slice(agents, func(i, j int) bool {
		return agents[i].name < agents[j].name
	})

	// Create list with custom delegate
	delegate := newMessageDelegate()
	l := list.New([]list.Item{}, delegate, 0, 0)
	l.SetShowTitle(false)
	l.SetShowStatusBar(false)
	l.SetFilteringEnabled(true)
	l.SetShowHelp(false)
	l.Styles.NoItems = lipgloss.NewStyle().Foreground(lipgloss.Color("#666")).Padding(2)

	return msgTuiModel{
		beadsDir:     beadsDir,
		store:        store,
		agents:       agents,
		currentAgent: -1,
		viewMode:     msgViewList,
		list:         l,
		delegate:     delegate,
	}, nil
}

func (m msgTuiModel) Init() tea.Cmd {
	return m.loadMessagesCmd()
}

func (m msgTuiModel) loadMessagesCmd() tea.Cmd {
	return func() tea.Msg {
		// Get all messages
		msgs, err := m.store.GetAllMessages(time.Time{}, 200)
		if err != nil {
			return messagesLoadedMsg{err: err}
		}

		// Get stats
		stats, _ := m.store.GetStats(time.Time{})

		return messagesLoadedMsg{messages: msgs, stats: stats}
	}
}

func (m msgTuiModel) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	var cmds []tea.Cmd

	switch msg := msg.(type) {
	case tea.KeyMsg:
		// Don't process keys while filtering
		if m.list.SettingFilter() {
			var cmd tea.Cmd
			m.list, cmd = m.list.Update(msg)
			return m, cmd
		}

		switch {
		case key.Matches(msg, msgKeys.Quit):
			if m.viewMode == msgViewDetail {
				m.viewMode = msgViewList
				m.selectedMsg = nil
				return m, nil
			}
			return m, tea.Quit

		case key.Matches(msg, msgKeys.Back):
			if m.viewMode == msgViewDetail {
				m.viewMode = msgViewList
				m.selectedMsg = nil
				return m, nil
			}

		case key.Matches(msg, msgKeys.NextTab):
			if m.viewMode == msgViewList {
				m.currentAgent++
				if m.currentAgent >= len(m.agents) {
					m.currentAgent = -1
				}
				m.filterMessages()
				return m, nil
			}

		case key.Matches(msg, msgKeys.PrevTab):
			if m.viewMode == msgViewList {
				m.currentAgent--
				if m.currentAgent < -1 {
					m.currentAgent = len(m.agents) - 1
				}
				m.filterMessages()
				return m, nil
			}

		case key.Matches(msg, msgKeys.Refresh):
			return m, m.loadMessagesCmd()

		case key.Matches(msg, msgKeys.Enter):
			if m.viewMode == msgViewList {
				if item, ok := m.list.SelectedItem().(messageItem); ok {
					m.selectedMsg = &item.msg
					m.viewMode = msgViewDetail
					m.viewport.SetContent(m.renderMessageBody())
					m.viewport.GotoTop()

					if !item.msg.Read {
						cmds = append(cmds, m.markReadCmd(item.msg.ID))
					}
					return m, tea.Batch(cmds...)
				}
			}
		}

	case tea.WindowSizeMsg:
		m.width = msg.Width
		m.height = msg.Height

		// Update delegate width
		m.delegate.width = msg.Width - sidebarWidth - 4
		m.list.SetDelegate(m.delegate)

		listWidth := msg.Width - sidebarWidth - 2
		listHeight := msg.Height - 4 // header + status bar

		if !m.ready {
			m.viewport = viewport.New(listWidth, listHeight-2)
			m.ready = true
		} else {
			m.viewport.Width = listWidth
			m.viewport.Height = listHeight - 2
		}

		m.list.SetSize(listWidth, listHeight)

	case messagesLoadedMsg:
		if msg.err != nil {
			m.err = msg.err
			return m, nil
		}
		m.allMessages = msg.messages
		m.stats = msg.stats
		m.updateAgentCounts()
		m.filterMessages()

	case messageMarkedReadMsg:
		if msg.err == nil {
			return m, m.loadMessagesCmd()
		}
	}

	// Update sub-models
	switch m.viewMode {
	case msgViewList:
		var cmd tea.Cmd
		m.list, cmd = m.list.Update(msg)
		cmds = append(cmds, cmd)
	case msgViewDetail:
		var cmd tea.Cmd
		m.viewport, cmd = m.viewport.Update(msg)
		cmds = append(cmds, cmd)
	}

	return m, tea.Batch(cmds...)
}

func (m *msgTuiModel) updateAgentCounts() {
	// Reset counts
	for i := range m.agents {
		m.agents[i].unread = 0
		m.agents[i].total = 0
	}

	// Count messages per agent
	agentMap := make(map[string]int)
	for i, a := range m.agents {
		agentMap[a.name] = i
	}

	for _, msg := range m.allMessages {
		if idx, ok := agentMap[msg.To]; ok {
			m.agents[idx].total++
			if !msg.Read {
				m.agents[idx].unread++
			}
		}
	}
}

func (m *msgTuiModel) filterMessages() {
	var filtered []messages.Message

	if m.currentAgent == -1 {
		filtered = m.allMessages
	} else {
		agentName := m.agents[m.currentAgent].name
		for _, msg := range m.allMessages {
			if msg.To == agentName {
				filtered = append(filtered, msg)
			}
		}
	}

	items := make([]list.Item, len(filtered))
	for i, msg := range filtered {
		items[i] = messageItem{msg: msg}
	}
	m.list.SetItems(items)
}

func (m msgTuiModel) markReadCmd(id string) tea.Cmd {
	return func() tea.Msg {
		err := m.store.MarkRead(id)
		return messageMarkedReadMsg{id: id, err: err}
	}
}

// ============================================================================
// VIEW RENDERING
// ============================================================================

func (m msgTuiModel) View() string {
	if m.err != nil {
		return lipgloss.NewStyle().
			Padding(2).
			Foreground(lipgloss.Color("#EF4444")).
			Render(fmt.Sprintf("Error: %v", m.err))
	}

	if !m.ready {
		return lipgloss.NewStyle().
			Padding(2).
			Foreground(lipgloss.Color("#888")).
			Render("Loading...")
	}

	// Build layout
	sidebar := m.renderSidebar()
	main := m.renderMain()

	// Join horizontally
	content := lipgloss.JoinHorizontal(lipgloss.Top, sidebar, main)

	// Add status bar
	statusBar := m.renderStatusBar()

	return lipgloss.JoinVertical(lipgloss.Left, content, statusBar)
}

func (m msgTuiModel) renderSidebar() string {
	h := m.height - 1 // Account for status bar

	var b strings.Builder

	// Logo/header
	header := sidebarHeaderStyle.Render("👑 QUEEN INBOX")
	b.WriteString(header)
	b.WriteString("\n\n")

	// All messages item
	allLabel := "All Messages"
	allCount := len(m.allMessages)
	allUnread := 0
	for _, msg := range m.allMessages {
		if !msg.Read {
			allUnread++
		}
	}

	if m.currentAgent == -1 {
		line := sidebarActiveStyle.Width(sidebarWidth - 2).Render(
			fmt.Sprintf("%-14s %3d", allLabel, allCount))
		b.WriteString(line)
	} else {
		badge := ""
		if allUnread > 0 {
			badge = sidebarBadgeStyle.Render(fmt.Sprintf("%d", allUnread))
		}
		line := sidebarItemStyle.Render(
			fmt.Sprintf("%-14s %s", allLabel, badge))
		b.WriteString(line)
	}
	b.WriteString("\n\n")

	// Section header
	b.WriteString(lipgloss.NewStyle().
		Padding(0, 2).
		Foreground(lipgloss.Color("#555")).
		Render("AGENTS"))
	b.WriteString("\n")

	// Agent list (scrollable area)
	maxAgents := h - 10
	startIdx := 0
	if m.currentAgent > maxAgents-3 {
		startIdx = m.currentAgent - maxAgents + 3
	}

	for i := startIdx; i < len(m.agents) && i < startIdx+maxAgents; i++ {
		agent := m.agents[i]
		name := truncateStr2(agent.name, 14)

		if i == m.currentAgent {
			line := sidebarActiveStyle.Width(sidebarWidth - 2).Render(
				fmt.Sprintf("%-14s %3d", name, agent.total))
			b.WriteString(line)
		} else {
			badge := ""
			if agent.unread > 0 {
				badge = sidebarBadgeStyle.Render(fmt.Sprintf("%d", agent.unread))
			} else {
				badge = lipgloss.NewStyle().Foreground(lipgloss.Color("#444")).
					Render(fmt.Sprintf("%d", agent.total))
			}
			line := sidebarItemStyle.Render(
				fmt.Sprintf("%-14s %s", name, badge))
			b.WriteString(line)
		}
		b.WriteString("\n")
	}

	// Scroll indicator
	if len(m.agents) > maxAgents {
		remaining := len(m.agents) - startIdx - maxAgents
		if remaining > 0 {
			b.WriteString(lipgloss.NewStyle().
				Padding(0, 2).
				Foreground(lipgloss.Color("#444")).
				Render(fmt.Sprintf("↓ %d more", remaining)))
		}
	}

	return sidebarStyle.Height(h).Render(b.String())
}

func (m msgTuiModel) renderMain() string {
	h := m.height - 1

	switch m.viewMode {
	case msgViewList:
		return m.renderListMain(h)
	case msgViewDetail:
		return m.renderDetailMain(h)
	}
	return ""
}

func (m msgTuiModel) renderListMain(h int) string {
	var b strings.Builder

	// Header
	title := "All Messages"
	if m.currentAgent >= 0 {
		title = m.agents[m.currentAgent].name
	}

	count := len(m.list.Items())
	header := headerStyle.Width(m.width - sidebarWidth - 2).Render(
		lipgloss.JoinHorizontal(lipgloss.Center,
			headerTitleStyle.Render(title),
			"  ",
			headerSubtitleStyle.Render(fmt.Sprintf("%d messages", count)),
		),
	)
	b.WriteString(header)
	b.WriteString("\n")

	// List
	listContent := listContainerStyle.Render(m.list.View())
	b.WriteString(listContent)

	return lipgloss.NewStyle().Height(h).Render(b.String())
}

func (m msgTuiModel) renderDetailMain(h int) string {
	if m.selectedMsg == nil {
		return ""
	}
	msg := m.selectedMsg

	var b strings.Builder

	// Header with message meta
	fromInitial := string([]rune(msg.From)[0])
	avatar := avatarStyle.
		Background(brandSecondary).
		Foreground(lipgloss.Color("#fff")).
		Render(strings.ToUpper(fromInitial))

	subject := detailSubjectStyle.Render(msg.Subject)

	meta := detailMetaStyle.Render(fmt.Sprintf(
		"%s → %s  •  %s",
		msg.From,
		msg.To,
		msg.CreatedAt.Format("Jan 2, 2006 3:04 PM"),
	))

	// Priority badge
	badge := ""
	switch msg.Importance {
	case messages.ImportanceUrgent:
		badge = urgentBadgeStyle.Render("URGENT")
	case messages.ImportanceHigh:
		badge = highBadgeStyle.Render("HIGH")
	}

	headerContent := lipgloss.JoinVertical(lipgloss.Left,
		lipgloss.JoinHorizontal(lipgloss.Top, avatar, " ", subject, "  ", badge),
		meta,
	)

	header := detailHeaderStyle.Width(m.width - sidebarWidth - 2).Render(headerContent)
	b.WriteString(header)
	b.WriteString("\n")

	// Body viewport
	b.WriteString(m.viewport.View())

	return lipgloss.NewStyle().Height(h).Render(b.String())
}

func (m msgTuiModel) renderMessageBody() string {
	if m.selectedMsg == nil {
		return ""
	}

	body := m.selectedMsg.Body
	if body == "" {
		return lipgloss.NewStyle().
			Foreground(lipgloss.Color("#666")).
			Italic(true).
			Render("(no message body)")
	}

	return detailBodyStyle.Render(body)
}

func (m msgTuiModel) renderStatusBar() string {
	w := m.width

	// Left side - context
	left := ""
	if m.list.SettingFilter() {
		left = lipgloss.NewStyle().Foreground(accentColor).Render("Filter: ") +
			m.list.FilterInput.Value()
	} else if m.viewMode == msgViewDetail && m.selectedMsg != nil {
		left = lipgloss.NewStyle().Foreground(lipgloss.Color("#666")).
			Render(fmt.Sprintf("ID: %s", m.selectedMsg.ID))
	}

	// Right side - keybindings
	var keys []string
	if m.viewMode == msgViewList {
		if m.list.SettingFilter() {
			keys = append(keys, statusKeyStyle.Render("enter")+" "+statusDescStyle.Render("apply"))
			keys = append(keys, statusKeyStyle.Render("esc")+" "+statusDescStyle.Render("cancel"))
		} else {
			keys = append(keys, statusKeyStyle.Render("j/k")+" "+statusDescStyle.Render("nav"))
			keys = append(keys, statusKeyStyle.Render("enter")+" "+statusDescStyle.Render("open"))
			keys = append(keys, statusKeyStyle.Render("tab")+" "+statusDescStyle.Render("switch"))
			keys = append(keys, statusKeyStyle.Render("/")+" "+statusDescStyle.Render("filter"))
			keys = append(keys, statusKeyStyle.Render("r")+" "+statusDescStyle.Render("refresh"))
			keys = append(keys, statusKeyStyle.Render("q")+" "+statusDescStyle.Render("quit"))
		}
	} else {
		keys = append(keys, statusKeyStyle.Render("j/k")+" "+statusDescStyle.Render("scroll"))
		keys = append(keys, statusKeyStyle.Render("esc")+" "+statusDescStyle.Render("back"))
		keys = append(keys, statusKeyStyle.Render("q")+" "+statusDescStyle.Render("quit"))
	}
	right := strings.Join(keys, "  ")

	// Calculate padding
	padding := w - lipgloss.Width(left) - lipgloss.Width(right) - 4
	if padding < 0 {
		padding = 0
	}

	return statusBarStyle.Width(w).Render(
		left + strings.Repeat(" ", padding) + right,
	)
}

// ============================================================================
// HELPERS
// ============================================================================

func truncateStr2(s string, max int) string {
	if len(s) <= max {
		return s
	}
	return s[:max-1] + "…"
}

func formatRelativeTime(t time.Time) string {
	d := time.Since(t)
	switch {
	case d < time.Minute:
		return "now"
	case d < time.Hour:
		mins := int(d.Minutes())
		return fmt.Sprintf("%dm", mins)
	case d < 24*time.Hour:
		hours := int(d.Hours())
		return fmt.Sprintf("%dh", hours)
	case d < 7*24*time.Hour:
		days := int(d.Hours() / 24)
		return fmt.Sprintf("%dd", days)
	default:
		return t.Format("Jan 2")
	}
}

// ============================================================================
// ENTRY POINT
// ============================================================================

func RunMsgTui() error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	model, err := newMsgTuiModel(beadsDir)
	if err != nil {
		return err
	}

	p := tea.NewProgram(
		model,
		tea.WithAltScreen(),
		tea.WithMouseCellMotion(),
	)

	_, err = p.Run()
	return err
}
