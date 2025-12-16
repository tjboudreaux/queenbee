package registry

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"
)

// Workflow defines plan and work phases for an issue type.
type Workflow struct {
	Plan *WorkflowPhase `yaml:"plan,omitempty"`
	Work *WorkflowPhase `yaml:"work,omitempty"`
}

// WorkflowPhase contains startup, steps, and shutdown phases.
type WorkflowPhase struct {
	Startup  []Step `yaml:"startup,omitempty"`  // Run before main steps
	Steps    []Step `yaml:"steps"`              // Main workflow steps
	Shutdown []Step `yaml:"shutdown,omitempty"` // Run after main steps complete
}

// Step represents a single step in a workflow.
// Only one of Command, Exec, or Parallel should be set.
type Step struct {
	Command  string `yaml:"command,omitempty"`  // Agent command name (e.g., "work_issue")
	Exec     string `yaml:"exec,omitempty"`     // Shell command to execute
	Parallel []Step `yaml:"parallel,omitempty"` // Steps to run in parallel
	Cwd      string `yaml:"cwd,omitempty"`      // Working directory for this step
}

// WorkflowExecutor runs workflow steps.
type WorkflowExecutor struct {
	registry *Registry
	runner   *Runner
	workDir  string
	issueID  string
	agent    string
}

// StepResult holds the result of executing a step.
type StepResult struct {
	StepIndex int
	StepType  string
	Command   string
	Success   bool
	Error     error
	Output    string
	Duration  time.Duration
}

// WorkflowResult holds the result of executing a workflow phase.
type WorkflowResult struct {
	Phase    string
	IssueID  string
	Agent    string
	Success  bool
	Steps    []StepResult
	Duration time.Duration
}

// NewWorkflowExecutor creates a new workflow executor.
func NewWorkflowExecutor(reg *Registry, runner *Runner, workDir, issueID, agent string) *WorkflowExecutor {
	return &WorkflowExecutor{
		registry: reg,
		runner:   runner,
		workDir:  workDir,
		issueID:  issueID,
		agent:    agent,
	}
}

// ExecutePhase runs all steps in a workflow phase (startup, steps, shutdown).
func (e *WorkflowExecutor) ExecutePhase(ctx context.Context, phase *WorkflowPhase, phaseName string) (*WorkflowResult, error) {
	if phase == nil {
		return nil, fmt.Errorf("no phase %s defined", phaseName)
	}

	start := time.Now()
	result := &WorkflowResult{
		Phase:   phaseName,
		IssueID: e.issueID,
		Agent:   e.agent,
		Success: true,
		Steps:   make([]StepResult, 0),
	}

	// Run startup steps
	if len(phase.Startup) > 0 {
		for i, step := range phase.Startup {
			stepResults, err := e.executeStep(ctx, step, i)
			if err != nil {
				result.Success = false
				result.Steps = append(result.Steps, StepResult{
					StepIndex: i,
					StepType:  "startup:" + e.getStepType(step),
					Success:   false,
					Error:     err,
				})
				result.Duration = time.Since(start)
				return result, nil // Don't run main steps if startup fails
			}
			result.Steps = append(result.Steps, stepResults...)
			if !e.checkStepsSuccess(stepResults) {
				result.Success = false
				result.Duration = time.Since(start)
				return result, nil
			}
		}
	}

	// Run main steps
	for i, step := range phase.Steps {
		stepResults, err := e.executeStep(ctx, step, i+len(phase.Startup))
		if err != nil {
			result.Success = false
			result.Steps = append(result.Steps, StepResult{
				StepIndex: i + len(phase.Startup),
				StepType:  e.getStepType(step),
				Success:   false,
				Error:     err,
			})
			break
		}
		result.Steps = append(result.Steps, stepResults...)

		if !e.checkStepsSuccess(stepResults) {
			result.Success = false
			break
		}
	}

	// Run shutdown steps (always run, even if main steps failed)
	if len(phase.Shutdown) > 0 {
		for i, step := range phase.Shutdown {
			stepResults, err := e.executeStep(ctx, step, i+len(phase.Startup)+len(phase.Steps))
			if err != nil {
				// Log but don't fail the whole workflow on shutdown errors
				result.Steps = append(result.Steps, StepResult{
					StepIndex: i + len(phase.Startup) + len(phase.Steps),
					StepType:  "shutdown:" + e.getStepType(step),
					Success:   false,
					Error:     err,
				})
				continue
			}
			result.Steps = append(result.Steps, stepResults...)
		}
	}

	result.Duration = time.Since(start)
	return result, nil
}

// checkStepsSuccess returns true if all steps succeeded.
func (e *WorkflowExecutor) checkStepsSuccess(results []StepResult) bool {
	for _, sr := range results {
		if !sr.Success {
			return false
		}
	}
	return true
}

// executeStep runs a single step (which may be parallel).
func (e *WorkflowExecutor) executeStep(ctx context.Context, step Step, index int) ([]StepResult, error) {
	switch {
	case step.Command != "":
		return e.executeCommand(ctx, step.Command, index)
	case step.Exec != "":
		return e.executeExec(ctx, step.Exec, index)
	case len(step.Parallel) > 0:
		return e.executeParallel(ctx, step.Parallel, index)
	default:
		return nil, fmt.Errorf("step %d has no command, exec, or parallel defined", index)
	}
}

// executeCommand runs an agent command.
func (e *WorkflowExecutor) executeCommand(ctx context.Context, commandName string, index int) ([]StepResult, error) {
	start := time.Now()
	result := StepResult{
		StepIndex: index,
		StepType:  "command",
		Command:   commandName,
	}

	// Get the command from the agent
	cmd, ok := e.registry.GetCommand(e.agent, commandName)
	if !ok {
		result.Error = fmt.Errorf("command %s not found for agent %s", commandName, e.agent)
		return []StepResult{result}, result.Error
	}

	// Build the command string with placeholders replaced
	cmdStr := strings.ReplaceAll(cmd.Run, "T_ISSUE_ID", e.issueID)
	cmdStr = strings.ReplaceAll(cmdStr, "T_AGENT", e.agent)

	// Check if we can run (respects max_concurrent and max_agents)
	canRun, reason := e.runner.CanRun(e.agent, commandName, e.issueID)
	if !canRun {
		result.Error = fmt.Errorf("cannot run: %s", reason)
		return []StepResult{result}, result.Error
	}

	// Run the command through the runner
	rc, err := e.runner.Run(ctx, e.agent, commandName, e.issueID)
	if err != nil {
		result.Error = err
		return []StepResult{result}, err
	}

	result.Success = true
	result.Output = fmt.Sprintf("Started pid=%d, hash=%s, cmd=%s", rc.PID, rc.HashID, cmdStr)
	result.Duration = time.Since(start)

	return []StepResult{result}, nil
}

// executeExec runs a shell command.
func (e *WorkflowExecutor) executeExec(ctx context.Context, shellCmd string, index int) ([]StepResult, error) {
	start := time.Now()
	result := StepResult{
		StepIndex: index,
		StepType:  "exec",
		Command:   shellCmd,
	}

	// Replace placeholders in the command
	cmdStr := strings.ReplaceAll(shellCmd, "T_ISSUE_ID", e.issueID)
	cmdStr = strings.ReplaceAll(cmdStr, "T_AGENT", e.agent)

	// Execute the shell command
	cmd := exec.CommandContext(ctx, "sh", "-c", cmdStr)
	cmd.Dir = e.workDir
	cmd.Env = append(os.Environ(),
		fmt.Sprintf("QUEEN_ISSUE=%s", e.issueID),
		fmt.Sprintf("QUEEN_AGENT=%s", e.agent),
	)

	output, err := cmd.CombinedOutput()
	result.Output = string(output)
	result.Duration = time.Since(start)

	if err != nil {
		result.Error = fmt.Errorf("exec failed: %w", err)
		return []StepResult{result}, nil // Don't return error, let workflow continue checking
	}

	result.Success = true
	return []StepResult{result}, nil
}

// executeParallel runs multiple steps concurrently.
func (e *WorkflowExecutor) executeParallel(ctx context.Context, steps []Step, index int) ([]StepResult, error) {
	if len(steps) == 0 {
		return nil, fmt.Errorf("parallel step %d has no child steps", index)
	}

	var wg sync.WaitGroup
	resultsChan := make(chan []StepResult, len(steps))
	errorsChan := make(chan error, len(steps))

	for i, step := range steps {
		wg.Add(1)
		go func(s Step, idx int) {
			defer wg.Done()
			results, err := e.executeStep(ctx, s, idx)
			if err != nil {
				errorsChan <- err
			}
			resultsChan <- results
		}(step, i)
	}

	// Wait for all to complete
	wg.Wait()
	close(resultsChan)
	close(errorsChan)

	// Collect results
	var allResults []StepResult
	for results := range resultsChan {
		allResults = append(allResults, results...)
	}

	// Check for errors (but don't fail the whole workflow)
	var firstErr error
	for err := range errorsChan {
		if firstErr == nil {
			firstErr = err
		}
	}

	return allResults, firstErr
}

// getStepType returns the type of step.
func (e *WorkflowExecutor) getStepType(step Step) string {
	switch {
	case step.Command != "":
		return "command"
	case step.Exec != "":
		return "exec"
	case len(step.Parallel) > 0:
		return "parallel"
	default:
		return "unknown"
	}
}

// GetWorkflow returns the workflow for an issue type.
func (r *Registry) GetWorkflow(issueType string) (*Workflow, bool) {
	if r.Workflows == nil {
		return nil, false
	}
	wf, ok := r.Workflows[issueType]
	return &wf, ok
}

// GetDefaultWorkflow returns a default workflow if none is defined.
func (r *Registry) GetDefaultWorkflow(issueType string) *Workflow {
	// Default workflows based on issue type
	switch strings.ToLower(issueType) {
	case "epic":
		return &Workflow{
			Plan: &WorkflowPhase{
				Steps: []Step{{Command: "plan_issue"}},
			},
		}
	default:
		return &Workflow{
			Work: &WorkflowPhase{
				Steps: []Step{{Command: "work_issue"}},
			},
		}
	}
}
