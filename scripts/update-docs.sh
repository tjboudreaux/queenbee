#!/usr/bin/env bash
#
# Update documentation based on code changes
# Usage: ./scripts/update-docs.sh [options]
#
# Options:
#   --check        Only check if docs are outdated (don't modify)
#   --commit       Update docs and commit changes
#   --push         Update docs, commit, and push to remote
#   --can-destroy  Allow deleting documentation files (default: safe mode)
#   (default)      Update docs only (no commit, safe mode)
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODE="update"
CAN_DESTROY=false

for arg in "$@"; do
    case "$arg" in
        --check)       MODE="check" ;;
        --commit)      MODE="commit" ;;
        --push)        MODE="push" ;;
        --can-destroy) CAN_DESTROY=true ;;
    esac
done

# Check if droid command exists
if ! command -v droid &> /dev/null; then
    echo -e "${RED}Error: 'droid' command not found${NC}"
    echo "Install Factory CLI or run manually"
    exit 1
fi

cd "$ROOT_DIR"

# Get recent changes for context
RECENT_CHANGES=$(git log --oneline -10 2>/dev/null || echo "No git history")
CHANGED_FILES=$(git diff --name-only HEAD~5 2>/dev/null | head -20 || echo "")

run_droid() {
    local prompt="$1"
    local auto_flag="$2"
    
    echo -e "${YELLOW}(This may take 30-60 seconds...)${NC}"
    echo "---"
    
    if command -v unbuffer &> /dev/null; then
        unbuffer droid exec $auto_flag "$prompt" 2>&1
    elif command -v stdbuf &> /dev/null; then
        stdbuf -oL -eL droid exec $auto_flag "$prompt" 2>&1
    else
        droid exec $auto_flag "$prompt" 2>&1
    fi
    
    echo "---"
}

if [[ "$MODE" == "check" ]]; then
    echo -e "${YELLOW}Checking if documentation needs updates...${NC}"
    echo ""
    
    PROMPT="Analyze if the README.md and queen/README.md are up to date with the codebase.

Recent commits:
$RECENT_CHANGES

Recently changed files:
$CHANGED_FILES

Check:
1. Are CLI commands in README accurate? Run 'queen --help' to verify.
2. Are features listed actually implemented?
3. Is installation info current?
4. Any outdated sections?

Output a brief summary of what needs updating, or 'Documentation is up to date' if nothing needs changes."

    echo -e "${YELLOW}Running: droid exec${NC}"
    run_droid "$PROMPT" ""
    exit 0
fi

# Update mode (also used by commit and push)
echo -e "${GREEN}Updating documentation...${NC}"
if $CAN_DESTROY; then
    echo -e "${YELLOW}(destroy mode enabled)${NC}"
fi
echo ""

if $CAN_DESTROY; then
    # Permissive mode - can delete files
    PROMPT="Update the documentation to reflect the current state of the codebase.

Recent commits:
$RECENT_CHANGES

Recently changed files:
$CHANGED_FILES

Tasks:
1. Run 'queen --help' and verify README command documentation is accurate
2. Check that features listed are actually implemented
3. Update any outdated information
4. Remove or delete any obsolete documentation files
5. Keep the documentation concise and agent-agnostic (no Factory-specific references)

Only make changes if something is actually outdated. Be conservative."
else
    # Safe mode - no file deletion, create tasks for destructive changes
    PROMPT="Update the documentation to reflect the current state of the codebase.

Recent commits:
$RECENT_CHANGES

Recently changed files:
$CHANGED_FILES

IMPORTANT CONSTRAINTS:
- You may ONLY edit existing documentation files (README.md, queen/README.md, etc.)
- You may ONLY remove stale references, outdated sections, or incorrect information WITHIN files
- You must NOT delete any documentation files
- You must NOT create new documentation files

If you determine that a documentation file should be deleted or a major restructuring is needed:
1. Do NOT delete the file
2. Instead, run: bd create \"docs: <description of what needs to be done>\" -t task -p 2
3. Report to the user that a task was created for manual review

Tasks:
1. Run 'queen --help' and verify README command documentation is accurate
2. Check that features listed are actually implemented
3. Update any outdated information within existing files
4. Remove stale references and outdated sections within files
5. Keep the documentation concise and agent-agnostic (no Factory-specific references)

Only make changes if something is actually outdated. Be conservative."
fi

echo -e "${GREEN}Running: droid exec --auto medium${NC}"
run_droid "$PROMPT" "--auto medium"

# Check if there are changes
if git diff --quiet README.md queen/README.md 2>/dev/null; then
    echo -e "${GREEN}No documentation changes needed.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Documentation updated. Changes:${NC}"
git diff --stat README.md queen/README.md 2>/dev/null || true

if [[ "$MODE" == "update" ]]; then
    echo ""
    echo -e "${GREEN}Done. Review changes with 'git diff' and commit manually.${NC}"
    exit 0
fi

# Commit mode
echo ""
echo -e "${GREEN}Committing documentation changes...${NC}"
git add README.md queen/README.md
git commit -m "docs: update documentation to reflect current state

Auto-generated by scripts/update-docs.sh"

if [[ "$MODE" == "commit" ]]; then
    echo -e "${GREEN}Done. Changes committed. Push with 'git push' when ready.${NC}"
    exit 0
fi

# Push mode
echo ""
echo -e "${GREEN}Pushing to remote...${NC}"
git push

echo -e "${GREEN}Done. Documentation updated, committed, and pushed.${NC}"
