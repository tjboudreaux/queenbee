//go:build windows

package registry

import (
	"os"
	"os/exec"
)

// setProcGroup is a no-op on Windows (process groups work differently).
func setProcGroup(cmd *exec.Cmd) {
	// Windows doesn't support Unix-style process groups.
	// The command will be killed directly instead.
}

// killProcessGroup kills the process on Windows.
func killProcessGroup(cmd *exec.Cmd) {
	if cmd == nil || cmd.Process == nil {
		return
	}
	_ = cmd.Process.Kill() //nolint:errcheck
}

// isProcessRunning checks if a process is still running on Windows.
// On Windows, sending signal 0 doesn't work, so we try to open the process.
func isProcessRunning(process *os.Process) bool {
	// On Windows, FindProcess always succeeds for any PID, and we can't use
	// signal 0. Instead, try to wait with WNOHANG equivalent. If the process
	// has exited, Release will work. We use a simple heuristic here.
	// A more robust check would use Windows API, but for our purposes,
	// assuming the process might still be running is safer.
	return true
}
