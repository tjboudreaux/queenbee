package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"

	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
	"github.com/tjboudreaux/queenbee/queen/internal/registry"
)

func getJSONFlag(cmd *cobra.Command) bool {
	v, _ := cmd.Flags().GetBool("json")
	return v
}

var msgCmd = &cobra.Command{
	Use:   "msg",
	Short: "Manage inter-agent messages",
	Long:  "Send, receive, and manage messages between agents.",
}

var msgSendCmd = &cobra.Command{
	Use:   "send <to> <body>",
	Short: "Send a message to another agent",
	Long: `Send a message to another agent. Body can be inline or read from stdin with -.

Special recipients:
  @all    Broadcast to all registered agents`,
	Args: cobra.MinimumNArgs(1),
	RunE: runMsgSend,
}

var msgInboxCmd = &cobra.Command{
	Use:   "inbox",
	Short: "View your inbox",
	Long:  "View messages sent to you.",
	RunE:  runMsgInbox,
}

var msgReplyCmd = &cobra.Command{
	Use:   "reply <message-id> <body>",
	Short: "Reply to a message",
	Long:  "Reply to an existing message, preserving the thread.",
	Args:  cobra.MinimumNArgs(1),
	RunE:  runMsgReply,
}

var msgReadCmd = &cobra.Command{
	Use:   "read <message-id>",
	Short: "Mark a message as read",
	Long:  "Mark a message as read and display its contents.",
	Args:  cobra.ExactArgs(1),
	RunE:  runMsgRead,
}

var msgThreadCmd = &cobra.Command{
	Use:   "thread <thread-id>",
	Short: "View a message thread",
	Long:  "Display all messages in a thread.",
	Args:  cobra.ExactArgs(1),
	RunE:  runMsgThread,
}

var msgSentCmd = &cobra.Command{
	Use:   "sent",
	Short: "View sent messages",
	Long:  "View messages you have sent.",
	RunE:  runMsgSent,
}

var msgStatsCmd = &cobra.Command{
	Use:   "stats",
	Short: "Show message statistics",
	Long:  "Display global message statistics across all agents.",
	RunE:  runMsgStats,
}

var (
	msgIssue      string
	msgSubject    string
	msgImportance string
	msgUnread     bool
	msgSince      string
	msgLimit      int
)

func init() {
	rootCmd.AddCommand(msgCmd)

	msgCmd.AddCommand(msgSendCmd)
	msgCmd.AddCommand(msgInboxCmd)
	msgCmd.AddCommand(msgReplyCmd)
	msgCmd.AddCommand(msgReadCmd)
	msgCmd.AddCommand(msgThreadCmd)
	msgCmd.AddCommand(msgSentCmd)
	msgCmd.AddCommand(msgStatsCmd)

	// stats flags
	msgStatsCmd.Flags().StringVar(&msgSince, "since", "", "Show stats since time (e.g., '1h', '24h', '2024-01-01')")

	// send flags
	msgSendCmd.Flags().StringVar(&msgIssue, "issue", "", "Related issue ID")
	msgSendCmd.Flags().StringVarP(&msgSubject, "subject", "s", "", "Message subject")
	msgSendCmd.Flags().StringVarP(&msgImportance, "importance", "i", "normal", "Importance: low, normal, high, urgent")

	// inbox flags
	msgInboxCmd.Flags().BoolVarP(&msgUnread, "unread", "u", false, "Show only unread messages")
	msgInboxCmd.Flags().StringVar(&msgSince, "since", "", "Show messages since time (e.g., '1h', '2024-01-01')")
	msgInboxCmd.Flags().IntVarP(&msgLimit, "limit", "n", 20, "Maximum messages to show")

	// sent flags
	msgSentCmd.Flags().IntVarP(&msgLimit, "limit", "n", 20, "Maximum messages to show")
}

func runMsgSend(cmd *cobra.Command, args []string) error {
	to := args[0]

	var body string
	if len(args) > 1 {
		if args[1] == "-" {
			data, err := os.ReadFile("/dev/stdin")
			if err != nil {
				return fmt.Errorf("reading stdin: %w", err)
			}
			body = strings.TrimSpace(string(data))
		} else {
			body = strings.Join(args[1:], " ")
		}
	}

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	from, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	subject := msgSubject
	if subject == "" && msgIssue != "" {
		subject = "[" + msgIssue + "]"
	}
	if subject == "" {
		subject = "Message from " + from
	}

	// Handle @all broadcast
	recipients := []string{to}
	if to == "@all" {
		workDir := filepath.Dir(beadsDir)
		reg, err := registry.Load(workDir)
		if err != nil {
			return fmt.Errorf("loading registry for broadcast: %w", err)
		}
		recipients = reg.ListAgents()
		// Filter out sender from broadcast
		filtered := make([]string, 0, len(recipients))
		for _, r := range recipients {
			if r != from {
				filtered = append(filtered, r)
			}
		}
		recipients = filtered
		if len(recipients) == 0 {
			return fmt.Errorf("no agents to broadcast to")
		}
	}

	var sentMsgs []*messages.Message
	for _, recipient := range recipients {
		msg, err := store.Send(from, recipient, subject, body, messages.SendOptions{
			IssueID:    msgIssue,
			Importance: msgImportance,
		})
		if err != nil {
			return err
		}
		sentMsgs = append(sentMsgs, msg)
	}

	if getJSONFlag(cmd) {
		if len(sentMsgs) == 1 {
			return json.NewEncoder(os.Stdout).Encode(sentMsgs[0])
		}
		return json.NewEncoder(os.Stdout).Encode(sentMsgs)
	}

	green := color.New(color.FgGreen).SprintFunc()
	if len(sentMsgs) == 1 {
		fmt.Printf("%s Message sent: %s\n", green("✓"), sentMsgs[0].ID)
	} else {
		fmt.Printf("%s Broadcast sent to %d agents\n", green("✓"), len(sentMsgs))
	}
	return nil
}

func runMsgInbox(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	agent, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	opts := messages.InboxOptions{
		UnreadOnly: msgUnread,
		Limit:      msgLimit,
	}

	if msgSince != "" {
		var t time.Time
		t, err = parseDuration(msgSince)
		if err != nil {
			return fmt.Errorf("invalid --since: %w", err)
		}
		opts.Since = t
	}

	msgs, err := store.GetInbox(agent, opts)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msgs)
	}

	if len(msgs) == 0 {
		fmt.Println("No messages")
		return nil
	}

	fmt.Printf("📬 Inbox for %s (%d messages)\n\n", agent, len(msgs))
	for _, m := range msgs {
		printMessageSummary(m)
	}

	return nil
}

func runMsgReply(cmd *cobra.Command, args []string) error {
	msgID := args[0]

	var body string
	if len(args) > 1 {
		if args[1] == "-" {
			data, err := os.ReadFile("/dev/stdin")
			if err != nil {
				return fmt.Errorf("reading stdin: %w", err)
			}
			body = strings.TrimSpace(string(data))
		} else {
			body = strings.Join(args[1:], " ")
		}
	}

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	from, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	msg, err := store.Reply(msgID, from, body)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msg)
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Reply sent: %s\n", green("✓"), msg.ID)
	return nil
}

func runMsgRead(cmd *cobra.Command, args []string) error {
	msgID := args[0]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	msg, err := store.GetByID(msgID)
	if err != nil {
		return err
	}

	if !msg.Read {
		if err := store.MarkRead(msgID); err != nil {
			return err
		}
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msg)
	}

	printMessageFull(*msg)
	return nil
}

func runMsgThread(cmd *cobra.Command, args []string) error {
	threadID := args[0]

	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	msgs, err := store.GetThread(threadID)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msgs)
	}

	if len(msgs) == 0 {
		fmt.Println("No messages in thread")
		return nil
	}

	fmt.Printf("📧 Thread %s (%d messages)\n\n", threadID, len(msgs))
	for _, m := range msgs {
		printMessageFull(m)
		fmt.Println()
	}

	return nil
}

func runMsgSent(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	cfg, err := config.LoadConfig(beadsDir)
	if err != nil {
		return fmt.Errorf("loading config: %w", err)
	}

	agent, err := config.GetCurrentAgent(cmd, cfg)
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	msgs, err := store.GetSent(agent, msgLimit)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msgs)
	}

	if len(msgs) == 0 {
		fmt.Println("No sent messages")
		return nil
	}

	fmt.Printf("📤 Sent by %s (%d messages)\n\n", agent, len(msgs))
	for _, m := range msgs {
		printMessageSummary(m)
	}

	return nil
}

func runMsgStats(cmd *cobra.Command, args []string) error {
	beadsDir, err := beads.FindBeadsDir()
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	var since time.Time
	if msgSince != "" {
		since, err = parseDuration(msgSince)
		if err != nil {
			return fmt.Errorf("invalid --since: %w", err)
		}
	}

	stats, err := store.GetStats(since)
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(stats)
	}

	bold := color.New(color.Bold).SprintFunc()
	cyan := color.New(color.FgCyan).SprintFunc()
	green := color.New(color.FgGreen).SprintFunc()
	yellow := color.New(color.FgYellow).SprintFunc()
	red := color.New(color.FgRed).SprintFunc()
	gray := color.New(color.FgHiBlack).SprintFunc()

	fmt.Printf("%s\n\n", bold("📊 Message Statistics"))

	// Overall stats
	fmt.Printf("%s\n", bold("Overview"))
	fmt.Printf("  Total:   %s\n", cyan(fmt.Sprintf("%d", stats.Total)))
	fmt.Printf("  Unread:  %s\n", yellow(fmt.Sprintf("%d", stats.Unread)))
	if !since.IsZero() {
		fmt.Printf("  Since %s:\n", since.Format("2006-01-02 15:04"))
		fmt.Printf("    New:    %s\n", green(fmt.Sprintf("%d", stats.SinceTotal)))
		fmt.Printf("    Unread: %s\n", yellow(fmt.Sprintf("%d", stats.SinceUnread)))
	}
	fmt.Println()

	// By importance
	fmt.Printf("%s\n", bold("By Importance"))
	if v := stats.ByImportance[messages.ImportanceUrgent]; v > 0 {
		fmt.Printf("  🚨 Urgent:  %s\n", red(fmt.Sprintf("%d", v)))
	}
	if v := stats.ByImportance[messages.ImportanceHigh]; v > 0 {
		fmt.Printf("  ⚠️  High:    %s\n", yellow(fmt.Sprintf("%d", v)))
	}
	if v := stats.ByImportance[messages.ImportanceNormal]; v > 0 {
		fmt.Printf("  📬 Normal:  %s\n", cyan(fmt.Sprintf("%d", v)))
	}
	if v := stats.ByImportance[messages.ImportanceLow]; v > 0 {
		fmt.Printf("  📭 Low:     %s\n", gray(fmt.Sprintf("%d", v)))
	}
	fmt.Println()

	// Top receivers
	fmt.Printf("%s\n", bold("Top Receivers (Inbox)"))
	receivers := sortedMapEntries(stats.ByAgent)
	for i, kv := range receivers {
		if i >= 10 {
			break
		}
		fmt.Printf("  %-25s %s\n", kv.key, cyan(fmt.Sprintf("%d", kv.value)))
	}
	fmt.Println()

	// Top senders
	fmt.Printf("%s\n", bold("Top Senders"))
	senders := sortedMapEntries(stats.BySender)
	for i, kv := range senders {
		if i >= 10 {
			break
		}
		fmt.Printf("  %-25s %s\n", kv.key, green(fmt.Sprintf("%d", kv.value)))
	}

	return nil
}

type kvPair struct {
	key   string
	value int
}

func sortedMapEntries(m map[string]int) []kvPair {
	result := make([]kvPair, 0, len(m))
	for k, v := range m {
		result = append(result, kvPair{k, v})
	}
	// Sort descending by value
	for i := 0; i < len(result)-1; i++ {
		for j := i + 1; j < len(result); j++ {
			if result[j].value > result[i].value {
				result[i], result[j] = result[j], result[i]
			}
		}
	}
	return result
}

func printMessageSummary(m messages.Message) {
	read := " "
	if !m.Read {
		read = "●"
	}

	imp := ""
	switch m.Importance {
	case messages.ImportanceUrgent:
		imp = color.New(color.FgRed).Sprint("[URGENT] ")
	case messages.ImportanceHigh:
		imp = color.New(color.FgYellow).Sprint("[HIGH] ")
	}

	age := formatAge(m.CreatedAt)
	gray := color.New(color.FgHiBlack).SprintFunc()

	fmt.Printf("%s %s %s%s\n", read, gray(m.ID), imp, m.Subject)
	fmt.Printf("    From: %s  %s\n", m.From, gray(age))
}

func printMessageFull(m messages.Message) {
	gray := color.New(color.FgHiBlack).SprintFunc()
	bold := color.New(color.Bold).SprintFunc()

	fmt.Printf("%s %s\n", bold("Subject:"), m.Subject)
	fmt.Printf("%s %s\n", gray("ID:"), m.ID)
	fmt.Printf("%s %s → %s\n", gray("From/To:"), m.From, m.To)
	fmt.Printf("%s %s (%s)\n", gray("Date:"), m.CreatedAt.Format(time.RFC1123), formatAge(m.CreatedAt))
	if m.IssueID != "" {
		fmt.Printf("%s %s\n", gray("Issue:"), m.IssueID)
	}
	if m.ThreadID != "" {
		fmt.Printf("%s %s\n", gray("Thread:"), m.ThreadID)
	}
	fmt.Printf("%s %s\n", gray("Importance:"), m.Importance)
	fmt.Println()
	if m.Body != "" {
		fmt.Println(m.Body)
	}
}

func formatAge(t time.Time) string {
	d := time.Since(t)
	switch {
	case d < time.Minute:
		return "just now"
	case d < time.Hour:
		return fmt.Sprintf("%dm ago", int(d.Minutes()))
	case d < 24*time.Hour:
		return fmt.Sprintf("%dh ago", int(d.Hours()))
	default:
		return fmt.Sprintf("%dd ago", int(d.Hours()/24))
	}
}

func parseDuration(s string) (time.Time, error) {
	// Try relative duration (e.g., "1h", "30m")
	if d, err := time.ParseDuration(s); err == nil {
		return time.Now().Add(-d), nil
	}

	// Try absolute date/time formats
	formats := []string{
		time.RFC3339,
		"2006-01-02T15:04:05",
		"2006-01-02 15:04:05",
		"2006-01-02",
	}
	for _, f := range formats {
		if t, err := time.Parse(f, s); err == nil {
			return t, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid time format: %s", s)
}
