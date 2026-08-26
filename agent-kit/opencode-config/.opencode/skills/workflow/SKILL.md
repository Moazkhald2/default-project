# Workflow: Plan → Implement → Review

Structured workflow for multi-step tasks. Use when starting any non-trivial work.

## When to Use

- Any task with 2+ steps
- Feature implementation
- Bug fixes that touch multiple files
- Architecture changes
- Anything you'd normally "just do" but should plan first

## Phase 1: PLAN

Before writing any code:

1. **Understand the task** — read requirements, check existing code
2. **Break it down** — create todo list with atomic steps
3. **Identify risks** — what could go wrong? What depends on what?
4. **Choose approach** — which files to touch, which patterns to follow
5. **Estimate scope** — is this quick (< 30 min) or deep (hours)?

### Plan Output

```
## Task: [description]
## Approach: [strategy]
## Files: [list of files to touch]
## Risks: [potential issues]
## Steps:
1. [atomic step] → [expected result]
2. [atomic step] → [expected result]
...
```

## Phase 2: IMPLEMENT

Execute the plan:

1. **Mark todos in_progress** — one at a time
2. **Make small changes** — one file/feature per step
3. **Test as you go** — don't wait until the end
4. **Commit frequently** — small, logical commits
5. **Update todos immediately** — mark completed right after finishing

### Implementation Rules

- Follow existing codebase patterns
- Don't refactor while implementing (separate concern)
- If plan breaks, stop and replan
- If stuck > 15 min, ask for help

## Phase 3: REVIEW

Before claiming done:

1. **Self-review** — read through all changes
2. **Run diagnostics** — lsp_diagnostics on changed files
3. **Test** — run tests if they exist
4. **Verify scope** — did I change only what I planned?
5. **Check edge cases** — what about errors, empty states, race conditions?

### Review Checklist

- [ ] All todos marked completed
- [ ] No type errors or lint warnings
- [ ] Tests pass (or pre-existing failures noted)
- [ ] Code follows existing patterns
- [ ] No unrelated changes sneaked in
- [ ] Commit messages are clear

## Quick Reference

| Phase | Duration | Action |
|-------|----------|--------|
| PLAN | 5-10 min | Think, break down, choose approach |
| IMPLEMENT | Variable | Execute plan step by step |
| REVIEW | 5-10 min | Verify everything works |

## Anti-Patterns

- Skipping planning for "simple" tasks (they rarely are)
- Implementing without a todo list
- Batch-completing todos (mark one at a time)
- Refactoring during bug fixes
- Claiming done without running diagnostics
