//go:build !windows

package registry

import (
	"os"
	"os/exec"
	"syscall"
)

// setProcGroup sets up the command to create its own process group (Unix).
func setProcGroup(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}
}

// killProcessGroup kills the process group for the given process (Unix).
func killProcessGroup(cmd *exec.Cmd) {
	if cmd == nil || cmd.Process == nil {
		return
	}
	pgid, err := syscall.Getpgid(cmd.Process.Pid)
	if err == nil {
		_ = syscall.Kill(-pgid, syscall.SIGTERM) //nolint:errcheck
	} else {
		_ = cmd.Process.Kill() //nolint:errcheck
	}
}

// isProcessRunning checks if a process is still running by sending signal 0.
func isProcessRunning(process *os.Process) bool {
	return process.Signal(syscall.Signal(0)) == nil
}
