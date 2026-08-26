# Dependency Scanning & Auditing

Use for dependency security scanning. Triggers: "dependency scan", "npm audit", "pip audit", "cargo audit", "dependabot", "snyk", "cve", "cvss".

## Tooling by Language

| Language | Tool | Command |
|---|---|---|
| Node.js | npm audit | `npm audit --audit-level=high` |
| Node.js | yarn audit | `yarn audit` |
| Node.js | pnpm audit | `pnpm audit` |
| Python | pip-audit | `pip-audit` |
| Python | safety | `safety check` |
| Rust | cargo audit | `cargo audit` |
| Go | govulncheck | `govulncheck ./...` |
| Java | OWASP DC | `mvn org.owasp:dependency-check-maven:check` |
| Any | Trivy | `trivy fs --scanners vuln .` |
| Any | Snyk | `snyk test` |

## npm audit

```bash
# Basic scan
npm audit

# Only high/critical
npm audit --audit-level=high

# Fix automatically (may break things — review first)
npm audit fix
npm audit fix --force  # major version bumps

# JSON output for CI
npm audit --json > audit-report.json

# Production dependencies only
npm audit --production
```

### .npmrc for audit

```ini
audit=true
audit-level=high
```

### package.json overrides (force sub-dep versions)

```jsonc
{
  "overrides": {
    "semver": "7.5.4",
    "express": {
      "body-parser": "1.20.2"
    }
  }
}
```

## pip-audit

```bash
# Basic
pip-audit

# Requirements file
pip-audit -r requirements.txt

# Fail CI on high/critical
pip-audit --ignore-vuln PYSEC-2023-123 --desc

# Export SBOM
pip-audit --sbom cyclonedx-json -o sbom.json
```

## cargo audit

```bash
cargo audit
cargo audit --ignore RUSTSEC-2023-0001
cargo audit --json > audit.json

# Advisories file
# .cargo/advisories.toml
[advisories]
ignore = ["RUSTSEC-2023-0001"]
severity-threshold = "high"
```

## govulncheck

```bash
govulncheck ./...
govulncheck -mode=compact ./...  # condensed output

# CI mode: exit 0 even if vulns found (for analysis):
govulncheck -scan=package ./...
```

## Dependabot (GitHub)

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
    assignees:
      - "team-lead"
    reviewers:
      - "security-team"

  - package-ecosystem: "docker"
    directory: "/"

  - package-ecosystem: "github-actions"
    directory: "/"
```

## Snyk

```bash
# Install
npm install -g snyk
snyk auth

# Test
snyk test
snyk test --all-projects
snyk test --severity-threshold=high

# Monitor (continous)
snyk monitor

# Container
snyk container test node:20-alpine --file=Dockerfile

# IaC
snyk iac test terraform/
```

## OWASP Dependency-Check

```bash
# Maven
mvn org.owasp:dependency-check-maven:8.4.0:check \
  -DfailBuildOnCVSS=7

# CLI
dependency-check --scan . --project MyApp --out ./reports

# Suppressions
# dependency-check-suppressions.xml
<?xml version="1.0"?>
<suppressions xmlns="...">
  <suppress>
    <notes>False positive: not applicable</notes>
    <cve>CVE-2023-12345</cve>
  </suppress>
</suppressions>
```

## Interpreting Vulnerability Severity (CVSS v3)

| Score | Severity | Action |
|---|---|---|
| 9.0-10.0 | Critical | Fix within 24h |
| 7.0-8.9 | High | Fix within 7 days |
| 4.0-6.9 | Medium | Fix within 30 days |
| 0.1-3.9 | Low | Fix next cycle |

## CI Integration (failing builds)

```yaml
# .github/workflows/security.yml
name: Dependency Scan
on:
  schedule:
    - cron: "0 6 * * 1"  # Monday 6am
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx audit-ci --critical  # fails on critical only
      - run: |
          npm audit --json | npx --yes jq \
            '.vulnerabilities | to_entries[] | select(.value.severity == "critical") | .key'
```

## Replacing Vulnerable Dependencies

| Vulnerable | Replacement |
|---|---|
| `lodash` | Native JS methods, `es-toolkit` |
| `moment` | `date-fns`, `luxon`, `Temporal` |
| `axios` | `native fetch`, `got` |
| `request` (deprecated) | `undici`, `node-fetch` |
| `faker` (unmaintained) | `@faker-js/faker` |
| `uuid` | `crypto.randomUUID()` (Node 19+) |
