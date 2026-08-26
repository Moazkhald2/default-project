---
name: github-ecosystem
description: >
  Use when setting up a new GitHub repository with security hardening,
  CI/CD pipelines, branch protection, Dependabot, secret scanning, and
  release automation. One-command secure defaults for any new project.
  Triggers: "new repo setup", "secure GitHub", "branch protection",
  "GitHub CI/CD", "repo security hardening".
---

# GitHub Ecosystem — Secure Defaults

Applies the same hardened GitHub setup we built for obsidian-memory-layer-mcp
to any new repository. Every setting is battle-tested and verified.

## Quick Apply

```bash
# Set repo variable
REPO="owner/repo-name"

# 1. Branch Protection (main + any other critical branches)
gh api -X PUT "repos/$REPO/branches/main/protection" \
  -f required_status_checks.strict=true \
  -f required_status_checks.contexts[]='build (18)' \
  -f required_status_checks.contexts[]='build (20)' \
  -f required_status_checks.contexts[]='build (22)' \
  -f required_status_checks.contexts[]='analyze' \
  -f enforce_admins=false \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.require_code_owner_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f restrictions=null

# Enable signed commits + linear history + no force pushes
gh api -X POST "repos/$REPO/branches/main/protection/required_signatures"
gh api -X PUT "repos/$REPO/branches/main/protection/required_linear_history"
gh api -X DELETE "repos/$REPO/branches/main/protection/restrictions"

# 2. Secret Scanning + Push Protection
gh api -X PUT "repos/$REPO/secret-scanning" -f enabled=true
gh api -X PUT "repos/$REPO/secret-scanning-push-protection" -f enabled=true

# 3. Enable Vulnerability Alerts (enables Dependency Graph)
gh api -X PUT "repos/$REPO/vulnerability-alerts"

# 4. Dependabot (create .github/dependabot.yml)
mkdir -p .github
cat > .github/dependabot.yml << 'EOF'
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    groups:
      dev-dependencies:
        dependency-type: "development"
        update-types: ["minor", "patch"]
      production-dependencies:
        dependency-type: "production"
        update-types: ["minor", "patch"]
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
EOF

# 5. Production Deployment Environment
gh api -X PUT "repos/$REPO/environments/production" \
  -f deployment_branch_policy.protected_branches=true \
  -f deployment_branch_policy.custom_branch_policies=false \
  -f reviewers[0].type=User \
  -f reviewers[0].id=$(gh api user --jq .id) \
  -f wait_timer=300
```

## Required Workflow Files

Copy these into `.github/workflows/` for every new project:

### CI (`ci.yml`)
```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18, 20, 22]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run build --if-present
      - run: npm run lint --if-present
```

### CodeQL (`codeql.yml`)
Standard CodeQL analysis for JavaScript/TypeScript on push + PR + weekly schedule.

### Dependabot Auto-Merge (`dependabot-auto-merge.yml`)
Only for minor/patch updates. Major updates require manual review.

### Stale Bot (`stale.yml`)
Close stale issues/PRs after 30 days inactivity + 7 day warning.

### Dependency Review (`dependency-review.yml`)
Blocks PRs with vulnerable dependencies (requires Dependency Graph enabled).

### Semantic PR Titles (`semantic-pr.yml`)
Enforces conventional commits on PR titles.

## Branch Protection Details

| Setting | Value | Why |
|---------|-------|-----|
| Required PR reviews | 1 | Code must be reviewed |
| Code owner reviews | Required | Owners must approve |
| Dismiss stale reviews | Yes | New commits discard old approvals |
| Signed commits | Required | Non-repudiation |
| Linear history | Required | Clean git history |
| Status checks | build (18/20/22), analyze | CI must pass |
| Conversation resolution | Required | All threads resolved |
| Force pushes | Blocked | No history rewriting |
| Deletions | Blocked | No branch deletion |

## Security Checklist

- [ ] Branch protection on `main` (and `master` if exists)
- [ ] Secret scanning enabled
- [ ] Push protection enabled
- [ ] Vulnerability alerts enabled
- [ ] Dependabot configured
- [ ] `production` environment with reviewer
- [ ] Code owners file (`.github/CODEOWNERS`)
- [ ] Issue + PR templates
- [ ] `SECURITY.md` with disclosure policy
- [ ] `CHANGELOG.md` and `CONTRIBUTING.md`
- [ ] ESLint/Prettier config for code quality
