# Dead Code Detection Skill

## Why Remove Dead Code

- Reduces cognitive load — less code to read and understand
- Shrinks bundle size — faster load times
- Eliminates bugs — dead code often contains broken or outdated logic
- Improves test coverage ratio — removing uncovered code lifts the metric

## Tools by Language

### TypeScript / JavaScript

```bash
# Knip — detects unused files, exports, deps, and more (recommended)
npx knip

# ts-prune — find unused exports in TypeScript
npx ts-prune

# ESLint — catch unused variables and imports
npx eslint . --rule 'no-unused-vars: error, import/no-unused-modules: error'

# webpack/bundle analyzer — find modules that shouldn't be in the bundle
npx webpack-bundle-analyzer stats.json
```

### Python

```bash
# vulture — find dead code
vulture myproject/ --min-confidence 80

# Coverage — find uncovered code (not the same as dead, but a clue)
coverage run -m pytest
coverage report --show-missing
```

### Go

```bash
# go vet — catches some dead code patterns
go vet ./...

# staticcheck — detects unused functions, variables, and constants
staticcheck ./...

# unconvert — find unnecessary type conversions
unconvert ./...
```

## What to Look For

### Unused Exports
- Functions, classes, constants, types that nothing imports
- Public API that's only used internally — consider making private
- Re-exports that nothing uses

### Unreachable Code
- Code after `return`, `throw`, `break`, `continue`
- Dead branches: `if (false)`, condition always true/false based on types
- `switch` cases that are fully covered by previous cases

### Commented-Out Code
- **Policy**: Never commit commented-out code. Delete it. Git history has the original.
- If disabled temporarily, add a ticket reference: `// TODO(#123): re-enable when X is fixed`

### Unused Dependencies

```bash
# npm / pnpm
npx depcheck

# Go
go mod tidy
```

### Dead Conditional Branches
- Type guards that can never match
- `instanceof` checks on types that don't exist in the hierarchy
- Feature flags for permanently enabled/disabled features

## Detection Pattern

```
1. Run automated tool (knip/ts-prune/vulture)
2. For each hit:
   a. Is this truly unused? — grep the codebase to confirm
   b. Is it intentionally public API? — check if it's re-exported from an index
   c. Is it dead by convention? — e.g., migration files, config files
   d. Remove it, or add an exclusion with a comment explaining why
3. Re-run tool to verify no new dead code
4. Commit removal separately from functional changes
```

## Handling False Positives

Some dead code is intentional:

| Scenario | Action |
|----------|--------|
| Public library API | Export from barrel file, document as public |
| Feature flag toggles | Reference the flag source, not hardcoded `false` |
| Entry points (CLI, config) | Add to tool's config file as entry point |
| Tests | Only if tests are co-located — common in Python |
| Type exports | Can appear unused if only used as types at runtime |
