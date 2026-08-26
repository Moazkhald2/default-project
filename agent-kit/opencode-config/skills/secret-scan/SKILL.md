# Secret Detection in Code

Use for detecting secrets and credentials. Triggers: "secret scan", "credential detection", "git secrets", "trufflehog", "gitleaks", "hardcoded secrets".

## Tools

| Tool | Best For | Command |
|---|---|---|
| **Gitleaks** | Git history scanning | `gitleaks detect -s . -v` |
| **truffleHog** | Deep content scanning | `trufflehog filesystem .` |
| **git-secrets** | Pre-commit prevention | `git secrets --scan` |
| **detect-secrets** | Baseline management | `detect-secrets scan` |
| **Semgrep** | Custom rule patterns | `semgrep --config=auto` |

## Gitleaks

```bash
# Scan current repo
gitleaks detect -s . -v

# Scan specific commit range
gitleaks detect --log-opts="HEAD~5..HEAD"

# Scan full history
gitleaks detect --no-git .

# Protect (block commit)
gitleaks protect --staged

# Generate config
gitleaks init

# Custom rules (.gitleaks.toml)
[[rules]]
id = "my-api-token"
description = "My App API Token"
regex = '''myapp_[a-zA-Z0-9]{32}'''
tags = ["myapp", "api"]
```

## truffleHog

```bash
# Scan filesystem
trufflehog filesystem . --only-verified

# Scan git repo (all history)
trufflehog git https://github.com/org/repo.git

# Scan with entropythreshold
trufflehog filesystem . --json \
  --entropy=True \
  --exclude-paths=.trufflehogignore

# Exclude patterns (.trufflehogignore)
*.md
tests/
*.min.js
```

## git-secrets

```bash
# Install
git secrets --install

# Add patterns
git secrets --add 'password\s*=\s*["'"'"']([^"'"'"']+)'
git secrets --add --allowed 'password\s*=\s*"CHANGEME"'

# Scan
git secrets --scan
git secrets --scan-history

# Scan all commits
git secrets --scan-history
```

## detect-secrets

```bash
# Scan (creates .secrets.baseline)
detect-secrets scan > .secrets.baseline

# Audit baseline (interactive review)
detect-secrets audit .secrets.baseline

# Exclude from scan
detect-secrets scan --exclude-files 'tests/.*' \
  --exclude-lines 'password\s*=\s*"CHANGEME"'

# Pre-commit hook
detect-secrets-hook --baseline .secrets.baseline
```

## Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.6.0
    hooks:
      - id: detect-private-key
      - id: check-added-large-files

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ["--baseline", ".secrets.baseline"]
        exclude: .*\.min\.(js|css)$

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks
```

## .gitignore Best Practices

```gitignore
# Sensitive files
.env
.env.local
*.key
*.pem
*.p12
*.pfx
*.keystore
**/credentials.json
**/service-account.json
**/secrets.*.yaml
.terraform/
**/.aws/config
vault/
```

## Scanning Git History

```bash
# Gitleaks full history
gitleaks detect --no-git --log-opts="--all"

# truffleHog all branches
trufflehog git file://. --since-commit HEAD~100

# BFG repo cleaner (remove file from history)
java -jar bfg.jar --delete-files .env my-repo.git

# git filter-repo (remove by pattern)
git filter-repo --path .env --invert-paths
```

## Rotating Compromised Credentials

When a secret is exposed:

1. **Assume compromised** — even if access was brief
2. **Rotate immediately** — new secret, revoke old one
3. **Check logs** — look for unauthorized access during exposure window
4. **Audit access** — check who accessed the secret (GitHub, CI secrets, Slack)
5. **Update docs** — note the rotation in runbooks
6. **Prevent recurrence** — add detection rules, .gitignore entries

## Patterns to Detect

| Secret Type | Pattern Hint |
|---|---|
| AWS keys | `AKIA[0-9A-Z]{16}` |
| GitHub tokens | `ghp_[a-zA-Z0-9]{36}` |
| Slack tokens | `xox[baprs]-[0-9a-zA-Z-]+` |
| SSH keys | `-----BEGIN (RSA|OPENSSH|EC) PRIVATE KEY-----` |
| JWT | `eyJ[a-zA-Z0-9_-]+\.eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+` |
| Generic password | `password\s*[=:]["']?\S+["']?` |
| Connection strings | `(postgres|mysql|redis|mongodb)://[^@]+@` |

## CI Integration

```yaml
# .github/workflows/secret-scan.yml
name: Secret Scan
on: [push, pull_request]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
