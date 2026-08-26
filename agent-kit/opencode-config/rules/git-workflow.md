# Git Workflow Rules

## Commits
- Conventional commits: `type(scope): description`
  Types: feat, fix, refactor, test, docs, chore, perf, security
- Imperative mood: "Add login endpoint" not "Added login endpoint"
- One logical change per commit (use `git add -p`)

## Branches
- Main branch is protected — no direct pushes
- Feature branches: `feat/<short-description>`
- Fix branches: `fix/<issue-description>`
- Keep branch names under 50 chars

## PRs
- Reference issues: "Closes #123"
- Include test plan in description
- Request review before merging
