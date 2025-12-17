# Skills Registry

This document defines when agents MUST, SHOULD, or MAY use specific skills.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD",
"SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be
interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## Skills Index

| Skill | Location | Primary Use |
|-------|----------|-------------|
| [Git Commit Messages](#git-commit-messages) | `skills/git-commit-messages.md` | Commit formatting |

---

## Git Commit Messages

**Location:** `.factory/skills/git-commit-messages.md`

### Requirements

| Level | Requirement |
|-------|-------------|
| **MUST** | Use conventional commit format for all commits |
| **MUST** | Include a type (feat, fix, docs, etc.) |
| **MUST** | Use imperative mood in description |
| **SHOULD** | Include scope when change is localized to a component |
| **SHOULD** | Keep description under 72 characters |
| **SHOULD** | Add body for complex changes explaining **why** |
| **MAY** | Reference issue numbers in footer |
| **MUST NOT** | Include sensitive information (secrets, keys, passwords) |

### When to Reference

Agents MUST reference this skill when:
- Creating any git commit
- Reviewing commit messages
- Providing commit message suggestions

### Validation

Commits are automatically validated by the `commit-msg` hook. Non-conforming
messages will be rejected with guidance on the correct format.

---

## Adding New Skills

When adding a new skill:

1. Create the skill file in `.factory/skills/<skill-name>.md`
2. Add an entry to this registry with:
   - Skill name and location
   - MUST/SHOULD/MAY requirements
   - When agents should reference the skill
3. Update AGENTS.md if the skill affects agent coordination protocol

### Skill File Template

```markdown
# <Skill Name>

Brief description of what this skill covers.

## Overview

When and why to use this skill.

## Rules

Detailed rules and guidelines.

## Examples

Concrete examples demonstrating correct usage.

## References

Links to external documentation or standards.
```
