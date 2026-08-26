# Pull Request Description Skill

## Template

```markdown
## What

[Concise description of what changed — 1-2 sentences. What does this PR do?]

## Why

[Why this change is needed. Link to issue, ticket, or user feedback.]

## How

[Technical summary of the implementation. Key architectural decisions, interesting
design choices, anything reviewers should pay attention to.]

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed (describe scenario)
- [ ] Tested in staging

## Screenshots

[For UI changes — before/after screenshots or screen recordings.
Delete this section if not applicable.]

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the diff
- [ ] No new warnings or errors in console/logs
- [ ] Documentation updated (README, API docs, ADRs)
- [ ] Database migrations have rollback
- [ ] Changes are backward-compatible (or documented as breaking)

## Breaking Changes

[If any: describe what breaks and migration steps. Delete if not applicable.]

## Deployment Notes

[Any special steps for deployment: env vars to add, feature flags to toggle,
database migrations to run, order of deployment, rollback steps.]
```

## Key Principles

### Write for Reviewers

- Assume the reviewer knows the codebase but not your specific change
- Explain **the context** (why this exists) and **the approach** (how it works)
- Point out tricky parts, non-obvious choices, or areas where you want extra scrutiny

### What/Why/How Format

| Section | Answers | Length |
|---------|---------|--------|
| **What** | What does this PR do? | 1-2 sentences |
| **Why** | Why is this needed? Link to issue/bug | 1-3 sentences |
| **How** | Technical implementation details | As long as needed |

### Link Everything

- Issues: `Closes #123`, `Fixes #456`, `Refs #789`
- Previous PRs: `Follow-up to #456`
- Related discussions: `See [discussion](link) for context`

## Self-Review Before Opening

1. Read the full diff (don't rely on memory of what you wrote)
2. Remove debugging code (`console.log`, `print`, `p dbg`, `TODO`)
3. Check for dead code, commented-out code, unnecessary changes
4. Verify error handling is in place (not just happy path)
5. Verify tests pass: `npm test` / `pytest` / `go test ./...`
6. Check for secrets: no API keys, passwords, tokens in code

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| No description | Always explain what/why/how — even for small changes |
| Title too vague | "Fix bug" → "Fix null pointer in user profile when email is unset" |
| Multiple features in one PR | Split into separate PRs — each PR should do one thing |
| No testing section | Tell reviewers what you tested and how |
| Ignoring breaking changes | Call them out explicitly with migration steps |
| No screenshots for UI | Always include before/after for visual changes |
