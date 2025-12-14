package autoassign

import (
	"sort"
	"strings"
)

// Task represents a task to be assigned.
type Task struct {
	ID          string
	Title       string
	Description string
	Priority    int
	Labels      []string
	Worktree    string
}

// Droid represents an available droid for assignment.
type Droid struct {
	Name           string
	Skills         []string
	CurrentLoad    int // Number of active assignments
	MaxLoad        int // Maximum concurrent assignments
	PreferWorktree string
}

// Assignment represents a proposed task assignment.
type Assignment struct {
	TaskID     string  `json:"task_id"`
	TaskTitle  string  `json:"task_title"`
	DroidName  string  `json:"droid_name"`
	Confidence float64 `json:"confidence"`
	Reason     string  `json:"reason"`
}

// AssignmentPlan contains the full assignment proposal.
type AssignmentPlan struct {
	Assignments []Assignment `json:"assignments"`
	Unassigned  []string     `json:"unassigned"` // Task IDs that couldn't be assigned
	Warnings    []string     `json:"warnings"`
}

// Assigner handles automatic task assignment.
type Assigner struct {
	droids []Droid
	tasks  []Task
}

// NewAssigner creates a new assigner with available droids.
func NewAssigner(droids []Droid) *Assigner {
	return &Assigner{droids: droids}
}

// SetTasks sets the tasks to assign.
func (a *Assigner) SetTasks(tasks []Task) {
	a.tasks = tasks
}

// GeneratePlan creates an assignment plan for all unassigned tasks.
func (a *Assigner) GeneratePlan() AssignmentPlan {
	plan := AssignmentPlan{}

	// Sort tasks by priority (lower number = higher priority)
	sortedTasks := make([]Task, len(a.tasks))
	copy(sortedTasks, a.tasks)
	sort.Slice(sortedTasks, func(i, j int) bool {
		return sortedTasks[i].Priority < sortedTasks[j].Priority
	})

	// Track current load for each droid during planning
	loadMap := make(map[string]int)
	for _, d := range a.droids {
		loadMap[d.Name] = d.CurrentLoad
	}

	for _, task := range sortedTasks {
		assignment := a.findBestDroid(task, loadMap)
		if assignment != nil {
			plan.Assignments = append(plan.Assignments, *assignment)
			loadMap[assignment.DroidName]++
		} else {
			plan.Unassigned = append(plan.Unassigned, task.ID)
		}
	}

	// Add warnings
	if len(plan.Unassigned) > 0 {
		plan.Warnings = append(plan.Warnings, "Some tasks could not be assigned. Consider adding droids with matching skills.")
	}

	for _, d := range a.droids {
		if loadMap[d.Name] >= d.MaxLoad {
			plan.Warnings = append(plan.Warnings, d.Name+" is at capacity.")
		}
	}

	return plan
}

// findBestDroid finds the best droid for a task.
func (a *Assigner) findBestDroid(task Task, loadMap map[string]int) *Assignment {
	type candidate struct {
		droid      Droid
		score      float64
		confidence float64
		reason     string
	}

	var candidates []candidate

	for _, droid := range a.droids {
		// Skip if at capacity
		if loadMap[droid.Name] >= droid.MaxLoad {
			continue
		}

		score, confidence, reason := a.scoreMatch(task, droid, loadMap[droid.Name])
		if score > 0 {
			candidates = append(candidates, candidate{
				droid:      droid,
				score:      score,
				confidence: confidence,
				reason:     reason,
			})
		}
	}

	if len(candidates) == 0 {
		return nil
	}

	// Sort by score descending
	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].score > candidates[j].score
	})

	best := candidates[0]
	return &Assignment{
		TaskID:     task.ID,
		TaskTitle:  task.Title,
		DroidName:  best.droid.Name,
		Confidence: best.confidence,
		Reason:     best.reason,
	}
}

// scoreMatch calculates how well a droid matches a task.
func (a *Assigner) scoreMatch(task Task, droid Droid, currentLoad int) (score float64, confidence float64, reason string) {
	var reasons []string

	// Skill match (most important)
	skillMatch := calculateSkillMatch(task.Labels, droid.Skills)
	score += skillMatch * 50 // Up to 50 points for skill match
	if skillMatch > 0.5 {
		reasons = append(reasons, "strong skill match")
	} else if skillMatch > 0 {
		reasons = append(reasons, "partial skill match")
	}

	// Workload consideration
	loadFactor := 1.0 - (float64(currentLoad) / float64(droid.MaxLoad))
	score += loadFactor * 20 // Up to 20 points for availability
	if loadFactor > 0.7 {
		reasons = append(reasons, "high availability")
	}

	// Worktree alignment bonus
	if task.Worktree != "" && droid.PreferWorktree != "" {
		if task.Worktree == droid.PreferWorktree {
			score += 15 // Worktree match bonus
			reasons = append(reasons, "worktree aligned")
		}
	}

	// Priority bonus (higher priority tasks get extra consideration)
	priorityBonus := float64(4-task.Priority) * 5 // P0=20, P1=15, P2=10, P3=5
	score += priorityBonus

	// Calculate confidence
	if score >= 70 {
		confidence = 0.9
	} else if score >= 50 {
		confidence = 0.7
	} else if score >= 30 {
		confidence = 0.5
	} else {
		confidence = 0.3
	}

	// No skill match = very low confidence
	if skillMatch == 0 && len(task.Labels) > 0 {
		confidence = 0.2
		reasons = []string{"no skill overlap, fallback assignment"}
	}

	if len(reasons) == 0 {
		reason = "general availability"
	} else {
		reason = strings.Join(reasons, ", ")
	}

	return score, confidence, reason
}

// calculateSkillMatch returns 0-1 score for skill overlap.
func calculateSkillMatch(taskLabels, droidSkills []string) float64 {
	if len(taskLabels) == 0 {
		return 0.5 // No labels = assume any droid can do it
	}

	if len(droidSkills) == 0 {
		return 0.3 // Droid with no declared skills gets low score
	}

	taskSet := make(map[string]bool)
	for _, l := range taskLabels {
		taskSet[strings.ToLower(l)] = true
	}

	matches := 0
	for _, skill := range droidSkills {
		if taskSet[strings.ToLower(skill)] {
			matches++
		}
	}

	return float64(matches) / float64(len(taskLabels))
}

// AssignmentResult holds the outcome of applying assignments.
type AssignmentResult struct {
	Assigned   int      `json:"assigned"`
	Failed     int      `json:"failed"`
	Messages   []string `json:"messages"`
}
