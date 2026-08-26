# Commit Message Skill

## Format (Conventional Commits)

```
<type>(<scope>): <description>

[body]

[footer(s)]
```

### Examples

```
feat(auth): add OAuth2 login with Google provider

Implement Google OAuth2 flow with PKCE. Users can now sign in
with their Google account in addition to email/password.

Closes #123
```

```
fix(api): handle null email in user profile endpoint

The profile endpoint crashed when email was unset. Now returns
a 400 error with a clear message instead of a 500.

Fixes #456
```

```
refactor(payments): extract discount calculation into service

No functional changes. Prepares for dynamic discount rules in
the next sprint.
```

```
feat(api)!: change pagination response format

BREAKING CHANGE: The pagination response now uses `data.items`
instead of `data.results`. Old clients will break.

Migration: Update response parsing to use `response.data.items`.
```

## Allowed Types

| Type | When to Use | Changelog Mapping |
|------|-------------|-------------------|
| `feat` | A new feature | Added |
| `fix` | A bug fix | Fixed |
| `refactor` | Code change that neither fixes a bug nor adds a feature | Changed |
| `test` | Adding or modifying tests | _(skip for changelog)_ |
| `docs` | Documentation only | Fixed / Changed |
| `chore` | Maintenance tasks, tooling, config | _(skip for changelog)_ |
| `perf` | Performance improvement | Changed |
| `security` | Security vulnerability fix | Security |
| `ci` | CI/CD configuration changes | _(skip for changelog)_ |
| `build` | Build system, dependency changes | _(skip for changelog)_ |
| `style` | Formatting, whitespace, semicolons | _(skip for changelog)_ |

## Rules

### Subject Line (first line)

- **Max 72 characters** (50 is ideal)
- **Imperative mood**: "Add" not "Added" or "Adds"
- **No period** at the end
- **Capitalize** the first letter after type(scope)
- **Scope is optional** but recommended for large projects

### Body

- **Separate from subject** with one blank line
- **Wrap at 72 characters**
- Explain **what and why**, not how (the diff shows how)
- Use bullet points for multiple reasons

### Footer

- **Breaking changes**: `BREAKING CHANGE: <description>` or `!` after type
- **Issue references**: `Closes #123`, `Fixes #456`, `Refs #789`
- **Co-authors**: `Co-authored-by: Name <email>`
- **Reviewed-by**: `Reviewed-by: Name <email>`

## Good vs Bad

### Good
```
fix(api): validate email format before sending verification

Email addresses with invalid characters (spaces, unescaped symbols)
were causing SMTP failures downstream. Adding format validation
before the API call prevents these errors.

Fixes #234
```

### Bad
```
fixed bug
```

### Bad
```
WIP
```

### Bad
```
refactor(stuff): Cleaned up some code
```

## One Logical Change Per Commit

| Scenario | Commit Strategy |
|----------|----------------|
| Bug fix + refactoring | Two commits: `refactor: ...` then `fix: ...` |
| Feature + tests | Same commit is fine |
| Formatting + logic change | Two commits: `style: ...` then `feat/fix: ...` |
| Dependency update + new feature | Two commits: `build: ...` then `feat: ...` |

## Tools

```bash
# Commitizen — interactive commit helper
npx cz

# Commitlint — lint commit messages in CI
echo "feat: add search" | npx commitlint

# git-cliff — generate changelog from commits
git cliff -o CHANGELOG.md

# git rebase -i — squash/fixup before pushing
git rebase -i HEAD~3
```
