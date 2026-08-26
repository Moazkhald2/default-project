# Code Review Skill

## Focus Areas (in priority order)

1. **Correctness** — Does the code do what it's supposed to? Edge cases? Error handling?
2. **Design** — Is the design appropriate for the system? Cohesion, coupling, abstraction level?
3. **Readability** — Can another developer understand the code in one pass?
4. **Security** — Injection, auth, data exposure, dependency risks?
5. **Testing** — Are the right things tested? Edge cases? Test readability?

## Review Checklist by Language

### TypeScript/JavaScript
- [ ] `any` used anywhere? Should be `unknown` or a proper type
- [ ] Nullish handling: `??` over `||` for non-boolean defaults
- [ ] Async error handling — promise rejections handled?
- [ ] No `console.log` in production code
- [ ] Exports limited to what's needed

### Python
- [ ] Type hints present on function signatures
- [ ] No mutable default arguments
- [ ] Context managers for resources (files, connections)
- [ ] Exception handling not too broad (`except Exception`)

### Go
- [ ] Errors checked everywhere
- [ ] No bare goroutines — lifecycle managed via WaitGroup/sync
- [ ] Context passed as first param in API boundaries
- [ ] `defer` for cleanup

### SQL
- [ ] `EXPLAIN ANALYZE` run on new/changed queries
- [ ] No N+1 queries
- [ ] Appropriate indexing
- [ ] Parameterized queries (no string interpolation)

## How to Write Review Feedback

- **Ask questions**: "What happens if `input` is null here?" not "Fix null handling"
- **Use "I"**: "I found this conditional hard to follow" not "This is confusing"
- **Focus on problems, not preferences**: Style debates waste time — linters enforce style
- **Distinguish blockers from nits**: Label blocking issues vs minor suggestions
- **Provide alternatives**: "Consider extracting this to a helper so it can be tested independently"

## Reviewing Tests

- Does the test actually test the behavior described in its name?
- Are there tests for error paths and edge cases, not just happy paths?
- Is the test itself readable? Avoid excessive setup that buries the assertion.
- Are mocks too tight? Mocking implementation details makes tests brittle.

## Reviewing Config Changes

- Is the new config documented?
- Are there defaults for every new config value?
- Is the change backward-compatible? Old configs should still work.
- Are secrets handled properly (env vars / secret store, not in files)?

## Reviewing Migrations

- Can the migration be rolled back? Is the down migration correct?
- Will the migration lock the table? Estimated time for large tables?
- Data integrity: what happens if the migration fails midway?

## Tone Rules

- **No tone policing** — don't nitpick phrasing or style that isn't in the project guide
- **Assume good intent** — the author made reasonable choices; critique the code, not the person
- **Be timely** — review within agreed SLAs; blocking PRs for days hurts the team
