# Security Audit

Use for security audit and review tasks. Triggers: "security audit", "threat model", "attack surface", "security review", "pentest", "vulnerability assessment".

## Threat Modeling (STRIDE)

| Category | What | Example |
|---|---|---|
| **S**poofing | Pretending to be someone else | JWT forged, session hijack |
| **T**ampering | Modifying data in transit | Man-in-the-middle, SQLi |
| **R**epudiation | Denying an action | Missing audit logs |
| **I**nformation Disclosure | Leaking sensitive data | Stack traces, exposed env |
| **D**enial of Service | Making system unusable | Rate limit bypass, regex bomb |
| **E**levation of Privilege | Getting unauthorized access | IDOR, path traversal |

### Process

1. Draw data flow diagram (users, services, data stores, trust boundaries)
2. Enumerate STRIDE threats per flow arrow
3. Rate each: Likelihood (1-5) × Impact (1-5) = Risk Score
4. Mitigate top risks

## Attack Surface Analysis

Check these exposure points:

- **Open ports** — only expose necessary ports (80, 443, not DB ports)
- **API endpoints** — all authenticated? Proper rate limiting?
- **File uploads** — extension whitelist, size limit, virus scan, stored outside webroot
- **Error pages** — no stack traces, no internal paths, no DB errors
- **Admin interfaces** — not exposed to internet, IP-restricted
- **Third-party scripts** — SRI hashes, CSP restricts inline

## Dependency Scanning

```bash
# npm
npm audit
npm audit --audit-level=high

# pip
pip-audit

# cargo
cargo audit

# go
govulncheck ./...

# general (trivy)
trivy fs --scanners vuln .
```

## Static Analysis

```bash
# Python
bandit -r src/
ruff check --select S  # flake8-bandit rules

# JavaScript/TypeScript
eslint --rule '{ "no-eval": "error", "no-implied-eval": "error" }'
npx ts-prune  # unused exports

# Go
go vet ./...

# All
semgrep --config=auto .
semgrep --config=p/r2c-security-audit .
```

## Authentication & Authorization Review

- [ ] Passwords hashed with bcrypt/argon2 (never MD5/SHA1)
- [ ] MFA available for admin accounts
- [ ] Session tokens random, httpOnly, secure, SameSite
- [ ] JWTs short-lived (15-60 min), with refresh rotation
- [ ] Rate limiting on login endpoints
- [ ] Account lockout after N failures
- [ ] Role-based access controls enforced server-side
- [ ] IDOR check: user A cannot access user B's data

## Session Management

- [ ] Sessions invalidated on logout
- [ ] Old password required to change password
- [ ] Session timeout after inactivity
- [ ] Concurrent session limits
- [ ] Remember-me tokens rotated on use

## Input Validation & Output Encoding

- [ ] All user input validated (type, length, pattern, range)
- [ ] SQL queries use parameterized statements (no string concat)
- [ ] HTML output encoded (React auto-does this, but `dangerouslySetInnerHTML`?)
- [ ] JSON responses don't contain sensitive fields
- [ ] File uploads scanned, renamed
- [ ] Redirect validation — no open redirects

## Security Headers Checklist

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Tools

| Tool | Use |
|---|---|
| `nmap` | Port scanning |
| `zap` | OWASP ZAP — automated web scanner |
| `semgrep` | Multi-language SAST |
| `trivy` | Container + dependency scanning |
| `checkov` | IaC security (Terraform, K8s, Docker) |
| `gitleaks` | Secret scanning in git |
