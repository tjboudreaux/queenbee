# Git Commit Messages

This skill documents the conventional commit format used in QueenBee.

## Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types

| Type | When to Use |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only changes |
| `style` | Code style (formatting, semicolons, etc.) |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or correcting tests |
| `chore` | Maintenance tasks, dependencies, tooling |
| `build` | Build system or external dependency changes |
| `ci` | CI/CD configuration changes |
| `perf` | Performance improvement |
| `revert` | Reverting a previous commit |

## Scope

The scope is optional but recommended. Use the component or area affected:

- `queen` - Queen CLI changes
- `docs` - Documentation
- `ci` - CI/CD pipeline
- `hooks` - Git hooks configuration

## Description

- Use imperative mood: "add feature" not "added feature"
- No period at the end
- Keep under 72 characters
- Focus on **why** not **what** (the diff shows what)

## Examples

```
feat(queen): add watch command for live monitoring

fix(queen): handle empty inbox gracefully

docs: update installation instructions

chore: update dependencies

refactor(queen): extract message parsing to separate module

test(queen): add coverage for SetVersionInfo

ci: add pre-push doc update hook

feat(queen)!: change config file format

BREAKING CHANGE: Config files must be updated to new YAML schema
```

## Breaking Changes

For breaking changes, either:

1. Add `!` after the type/scope: `feat(queen)!: change API`
2. Add `BREAKING CHANGE:` in the footer

## Multi-line Messages

For complex changes, add a body:

```
fix(queen): resolve race condition in daemon startup

The daemon was starting message processing before the store
was fully initialized, causing intermittent failures.

- Add initialization barrier
- Add startup health check
- Increase timeout for slow systems

Closes #42
```

## Validation

Commit messages are validated by a `commit-msg` hook via lefthook.
The hook rejects messages that don't follow conventional commit format.

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
