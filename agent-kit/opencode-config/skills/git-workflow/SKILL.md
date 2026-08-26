# Advanced Git Workflows

Use for Git workflow guidance. Triggers: "git workflow", "git rebase", "conventional commits", "git bisect", "git hooks", "gitflow", "trunk-based".

## Conventional Commits

```
<type>(<scope>): <description>

[optional body]
[optional footer: BREAKING CHANGE, closes #123]
```

| Type | Release | When |
|---|---|---|
| `feat` | Minor | New feature |
| `fix` | Patch | Bug fix |
| `chore` | None | Maintenance |
| `docs` | None | Documentation |
| `refactor` | None | Code change without fix/feat |
| `perf` | Patch | Performance improvement |
| `test` | None | Adding/updating tests |
| `style` | None | Formatting, whitespace |
| `ci` | None | CI configuration |
| `build` | None | Build system changes |

```bash
feat(auth): add MFA via TOTP

Implement time-based one-time password authentication
using the TOTP RFC 6238 standard.

Closes #142
BREAKING CHANGE: MFA is now required for admin accounts
```

## Gitflow vs Trunk-Based

| Aspect | Gitflow | Trunk-Based |
|---|---|---|
| Main branch | `develop` | `main` / `master` |
| Feature branches | Long-lived | Short-lived (hours-days) |
| Releases | `release/*` branches | Tags from main |
| Hotfixes | `hotfix/*` to master + develop | Feature toggle off |
| Complexity | High (5+ branch types) | Low (feature branches + main) |
| Best for | Released software, versioning | CI/CD, continuous deployment |

**Recommendation:** Start with trunk-based. Only adopt Gitflow if you need formal release cycles.

### Trunk-Based Workflow

```bash
# Create feature branch
git checkout -b feat/user-profile

# Commit frequently
git commit -m "feat: add user profile schema"
git commit -m "feat: add profile API endpoint"

# Sync with main
git fetch origin
git rebase origin/main

# Squash merge (clean history)
git checkout main
git merge --squash feat/user-profile
git commit -m "feat: add user profile page"

# Delete branch
git branch -d feat/user-profile
```

## Interactive Rebase

```bash
# Squash last 3 commits
git rebase -i HEAD~3

# Rebase feature branch onto main
git checkout feat/feature
git rebase -i main

# Commands:
# pick    — use commit
# squash  — combine with previous, keep message
# fixup   — combine with previous, discard message
# reword  — change commit message
# edit    — stop to amend
# drop    — remove commit
```

### Rebase Workflow

```bash
# Before merging, clean up history
git fetch origin
git rebase -i origin/main

# After rebase (force push if branch is yours only)
git push --force-with-lease

# If someone else also commits to the branch — DON'T rebase
```

## Bisect (Find the Bug)

```bash
# Start bisect
git bisect start
git bisect bad          # current commit is bad
git bisect good v1.0    # v1.0 was good

# Git checks out middle commit. Test it:
git bisect good         # if good
git bisect bad          # if bad

# After ~log2(commits) steps, git shows first bad commit
git bisect reset

# Automatic bisect
git bisect start HEAD v1.0
git bisect run npm test  # runs test, exits 0 = good, non-0 = bad
git bisect reset
```

## Subtree vs Submodule

| Aspect | Submodule | Subtree |
|---|---|---|
| Ease of use | Complex (init, update, detach) | Simple (just a directory) |
| Version pinned | Yes, per commit | Yes, merged into repo |
| Changes upstream | Need PR to original repo | Can push directly if permissions |
| Clone experience | `--recurse-submodules` required | Everything included automatically |
| History | Separate | Merged (larger history) |

**Prefer subtree** for most cases:

```bash
# Add subtree
git subtree add --prefix lib/shared https://github.com/org/shared.git main --squash

# Pull updates
git subtree pull --prefix lib/shared https://github.com/org/shared.git main --squash

# Push changes back
git subtree push --prefix lib/shared origin main
```

## Git Hooks

### pre-commit (lint + test)

```bash
#!/bin/sh
# .git/hooks/pre-commit
npm run lint-staged
if [ $? -ne 0 ]; then
    echo "Lint failed. Aborting commit."
    exit 1
fi
```

### commit-msg (conventional commit check)

```bash
#!/bin/sh
# .git/hooks/commit-msg
commit_msg=$(cat "$1")
if ! echo "$commit_msg" | grep -qE '^(feat|fix|chore|docs|refactor|perf|test|style|ci|build)(\(.+\))?: .+'; then
    echo "ERROR: Commit message must follow conventional commits"
    exit 1
fi
```

### Set up hooks with Husky (JS)

```bash
npx husky init
echo "npm run lint-staged" > .husky/pre-commit
echo "npx commitlint --edit $1" > .husky/commit-msg
```

### Shared hooks with pre-commit (any language)

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-added-large-files
      - id: check-json
      - id: check-yaml
```

## Worktrees (Parallel Tasks)

```bash
# Current work stays, create worktree for new feature
git worktree add ../project-feature-x feat/x

# List worktrees
git worktree list

# Remove worktree
git worktree remove ../project-feature-x

# Great for: review PR, hotfix while in middle of feature, parallel experiments
```

## Useful Commands

```bash
# Fix last commit message
git commit --amend -m "correct message"

# Add forgotten file to last commit
git add forgotten-file.js
git commit --amend --no-edit

# Undo last commit (keep changes staged)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Search commits by message
git log --grep="fix(auth)"

# Search commits by file
git log --all --oneline -- src/file.ts

# See who changed a line
git blame src/file.ts

# Show commit with changes
git show abc123

# Stash with message
git stash push -m "WIP: auth flow"
git stash list
git stash pop  # or: git stash apply stash@{0}

# Cherry-pick
git cherry-pick abc123

# Show branch topology
git log --graph --oneline --all --decorate
```
