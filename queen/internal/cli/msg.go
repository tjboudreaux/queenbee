package cli

import (
	"encoding/json"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/fatih/color"
	"github.com/spf13/cobra"
	"github.com/tjboudreaux/queenbee/queen/internal/beads"
	"github.com/tjboudreaux/queenbee/queen/internal/config"
	"github.com/tjboudreaux/queenbee/queen/internal/messages"
)

func getJSONFlag(cmd *cobra.Command) bool {
	v, _ := cmd.Flags().GetBool("json")
	return v
}

var msgCmd = &cobra.Command{
	Use:   "msg",
	Short: "Manage inter-agent messages",
	Long:  "Send, receive, and manage messages between droids.",
}

var msgSendCmd = &cobra.Command{
	Use:   "send <to> <body>",
	Short: "Send a message to another droid",
	Long:  "Send a message to another droid. Body can be inline or read from stdin with -.",
	Args:  cobra.MinimumNArgs(1),
	RunE:  runMsgSend,
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

	from, err := config.GetCurrentDroid(cmd, cfg)
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

	msg, err := store.Send(from, to, subject, body, messages.SendOptions{
		IssueID:    msgIssue,
		Importance: msgImportance,
	})
	if err != nil {
		return err
	}

	if getJSONFlag(cmd) {
		return json.NewEncoder(os.Stdout).Encode(msg)
	}

	green := color.New(color.FgGreen).SprintFunc()
	fmt.Printf("%s Message sent: %s\n", green("✓"), msg.ID)
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

	droid, err := config.GetCurrentDroid(cmd, cfg)
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
		t, err := parseDuration(msgSince)
		if err != nil {
			return fmt.Errorf("invalid --since: %w", err)
		}
		opts.Since = t
	}

	msgs, err := store.GetInbox(droid, opts)
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

	fmt.Printf("📬 Inbox for %s (%d messages)\n\n", droid, len(msgs))
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

	from, err := config.GetCurrentDroid(cmd, cfg)
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

	droid, err := config.GetCurrentDroid(cmd, cfg)
	if err != nil {
		return err
	}

	store, err := messages.NewStore(beadsDir)
	if err != nil {
		return err
	}

	msgs, err := store.GetSent(droid, msgLimit)
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

	fmt.Printf("📤 Sent by %s (%d messages)\n\n", droid, len(msgs))
	for _, m := range msgs {
		printMessageSummary(m)
	}

	return nil
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
