package cli

import "github.com/charmbracelet/lipgloss"

// Adaptive colors that work in both light and dark terminals
var (
	ColorSubtle    = lipgloss.AdaptiveColor{Light: "#D9DCCF", Dark: "#383838"}
	ColorHighlight = lipgloss.AdaptiveColor{Light: "#874BFD", Dark: "#7D56F4"}
	ColorSpecial   = lipgloss.AdaptiveColor{Light: "#43BF6D", Dark: "#73F59F"}

	ColorRed     = lipgloss.Color("196")
	ColorYellow  = lipgloss.Color("220")
	ColorGreen   = lipgloss.Color("42")
	ColorBlue    = lipgloss.Color("39")
	ColorCyan    = lipgloss.Color("51")
	ColorMagenta = lipgloss.Color("205")
	ColorGray    = lipgloss.Color("240")
	ColorWhite   = lipgloss.Color("255")
	ColorDim     = lipgloss.Color("241")
)

// Base styles
var (
	BaseStyle = lipgloss.NewStyle()

	TitleStyle = lipgloss.NewStyle().
			Bold(true).
			Foreground(ColorMagenta).
			MarginBottom(1)

	SubtitleStyle = lipgloss.NewStyle().
			Foreground(ColorGray)

	HelpStyle = lipgloss.NewStyle().
			Foreground(ColorDim)

	ErrorStyle = lipgloss.NewStyle().
			Foreground(ColorRed).
			Bold(true)

	SuccessStyle = lipgloss.NewStyle().
			Foreground(ColorGreen)
)

// Tab styles
var (
	TabStyle = lipgloss.NewStyle().
			Padding(0, 2)

	ActiveTabStyle = lipgloss.NewStyle().
			Padding(0, 2).
			Bold(true).
			Background(lipgloss.Color("62")).
			Foreground(lipgloss.Color("230"))

	InactiveTabStyle = lipgloss.NewStyle().
				Padding(0, 2).
				Foreground(ColorGray)

	TabGapStyle = lipgloss.NewStyle().
			Foreground(ColorDim).
			SetString(" │ ")
)

// List and message styles
var (
	SelectedStyle = lipgloss.NewStyle().
			Foreground(ColorCyan).
			Bold(true)

	UnreadStyle = lipgloss.NewStyle().
			Foreground(ColorYellow).
			Bold(true)

	UrgentStyle = lipgloss.NewStyle().
			Foreground(ColorRed).
			Bold(true)

	HighStyle = lipgloss.NewStyle().
			Foreground(ColorYellow)

	NormalStyle = lipgloss.NewStyle().
			Foreground(ColorWhite)

	DimStyle = lipgloss.NewStyle().
			Foreground(ColorGray)

	CursorStyle = lipgloss.NewStyle().
			Foreground(ColorCyan).
			SetString("▶")
)

// Status and metrics styles
var (
	MetricLabelStyle = lipgloss.NewStyle().
				Width(12).
				Foreground(ColorGray)

	MetricValueStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(ColorWhite)

	MetricDeltaUpStyle = lipgloss.NewStyle().
				Foreground(ColorGreen)

	MetricDeltaDownStyle = lipgloss.NewStyle().
				Foreground(ColorRed)

	MetricDeltaNeutralStyle = lipgloss.NewStyle().
				Foreground(ColorGray)

	StatusRunningStyle = lipgloss.NewStyle().
				Foreground(ColorGreen).
				Bold(true)

	StatusStoppedStyle = lipgloss.NewStyle().
				Foreground(ColorYellow)

	StatusBlockedStyle = lipgloss.NewStyle().
				Foreground(ColorRed)
)

// Box and border styles
var (
	BoxStyle = lipgloss.NewStyle().
			Border(lipgloss.RoundedBorder()).
			BorderForeground(ColorSubtle).
			Padding(1, 2)

	HeaderBoxStyle = lipgloss.NewStyle().
			Border(lipgloss.NormalBorder(), false, false, true, false).
			BorderForeground(ColorSubtle)

	FooterBoxStyle = lipgloss.NewStyle().
			Border(lipgloss.NormalBorder(), true, false, false, false).
			BorderForeground(ColorSubtle).
			Padding(0, 1)
)

// Dashboard section styles
var (
	SectionTitleStyle = lipgloss.NewStyle().
				Bold(true).
				Foreground(ColorWhite).
				MarginRight(2)

	SectionDividerStyle = lipgloss.NewStyle().
				Foreground(ColorSubtle).
				SetString(" │ ")

	DashboardRowStyle = lipgloss.NewStyle().
				MarginBottom(0)
)

// Badge/indicator styles
var (
	BadgeStyle = lipgloss.NewStyle().
			Padding(0, 1)

	UrgentBadge = lipgloss.NewStyle().
			Padding(0, 1).
			Background(ColorRed).
			Foreground(lipgloss.Color("230"))

	HighBadge = lipgloss.NewStyle().
			Padding(0, 1).
			Background(ColorYellow).
			Foreground(lipgloss.Color("0"))

	SuccessBadge = lipgloss.NewStyle().
			Padding(0, 1).
			Background(ColorGreen).
			Foreground(lipgloss.Color("0"))

	InfoBadge = lipgloss.NewStyle().
			Padding(0, 1).
			Background(ColorBlue).
			Foreground(lipgloss.Color("230"))
)

// Spinner characters for animations
var SpinnerFrames = []string{"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"}

// Icons
const (
	IconInbox   = "📬"
	IconSent    = "📤"
	IconMessage = "📧"
	IconUrgent  = "🚨"
	IconHigh    = "⚠️"
	IconAgent   = "🤖"
	IconQueue   = "📦"
	IconStats   = "📊"
	IconCrown   = "👑"
	IconCheck   = "✓"
	IconCross   = "✗"
	IconDot     = "●"
	IconCircle  = "○"
	IconArrow   = "→"
	IconPlay    = "▶"
	IconPause   = "⏸"
	IconRefresh = "↻"
	IconUp      = "↑"
	IconDown    = "↓"
	IconUnread  = "●"
	IconRead    = " "
)
