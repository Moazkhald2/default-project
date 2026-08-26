# Changelog Generation Skill

## Format (Keep a Changelog)

```markdown
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New feature that was added (issue #123)

### Changed
- Existing functionality changed (PR #456)

### Deprecated
- Feature to be removed in a future release

### Removed
- Feature removed in this release

### Fixed
- Bug fix (issue #789)

### Security
- Vulnerability fix (advisory GHSA-xxxx)
```

## Categories (in order)

| Category | When to Use |
|----------|-------------|
| **Added** | New features, endpoints, options, support for new environments |
| **Changed** | Changes to existing functionality, performance improvements, dependency updates |
| **Deprecated** | Features that will be removed in the next major version |
| **Removed** | Features removed in this version |
| **Fixed** | Bug fixes, documentation fixes, test fixes |
| **Security** | Vulnerability patches, security hardening |

## Conventional Commits → Changelog Automation

### Commit Format
```
type(scope): description

[body]

[footer]
```

### Type Mapping

| Commit Type | Changelog Category |
|-------------|-------------------|
| `feat` | Added |
| `fix` | Fixed |
| `perf` | Changed |
| `refactor` | Changed (not user-facing? skip) |
| `test` | _(skip — not user-facing)_ |
| `docs` | Fixed (for doc fixes) or Changed |
| `style` | _(skip)_ |
| `chore` | _(skip — not user-facing)_ |
| `ci` | _(skip)_ |
| `security` | Security |

## Tools

### git-cliff (Rust — recommended)

```bash
# Generate changelog from git history
git-cliff -o CHANGELOG.md

# Bump version and generate
git-cliff --bump --unreleased --tag v1.2.0

# Custom config: cliff.toml
```

### standard-version / release-please (npm)

```bash
# Automatic version bump + changelog
npx standard-version

# Dry run
npx standard-version --dry-run
```

### semantic-release

```bash
# Full automated release pipeline (GitHub/GitLab)
npx semantic-release
```

## Semantic Versioning

| Version Bump | What Changed |
|--------------|--------------|
| **Major** | Breaking API change, removed feature, large refactor |
| **Minor** | New feature, non-breaking addition |
| **Patch** | Bug fix, performance improvement, dependency update |

When determining version: look at the diff and check if any change is breaking.

## Workflow

1. **Collect commits** since last release: `git log v1.0.0..HEAD --oneline`
2. **Categorize** into Added/Changed/Fixed/etc.
3. **Deduplicate** — multiple commits for the same issue become one entry
4. **Write human-readable descriptions** — don't just copy commit messages
5. **Link to issues and PRs**: `(#123)`
6. **Credit contributors** where appropriate

## CHANGELOG.md Tips

- **Keep an Unreleased section** — add entries as PRs merge, not at release time
- **Compare links** at the bottom:
  `[Unreleased]: https://github.com/org/repo/compare/v1.0.0...HEAD`
  `[1.0.0]: https://github.com/org/repo/releases/tag/v1.0.0`
- **Release date each version**: `## [1.0.0] - 2024-01-15`
- **If breaking change**: call it out with `**BREAKING:**` prefix in the entry
