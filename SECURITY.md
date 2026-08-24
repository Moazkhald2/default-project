# Security Policy

## Reporting

Email: moazkhald@gmail.com — subject `[SECURITY]`. Do not open public issue for sensitive vuln. 48h triage, 7d fix target.

## Scope

- `apps/api` (Hono), `apps/web` (Vite React), `packages/shared`, `scripts/`, `.opencode/`, `OneDrive/Backups/_SYSTEM_` (encrypted vault — 688 memories)

## Hardening (enforced)

- **Commits:** GPG signed (`user.signingkey=9794FD123EBCD863`, `commit.gpgsign=true`), linear history, no force push to `master`
- **CI:** CodeQL, dependency-review, secret-scan (gitleaks) block PRs on vuln/secret
- **Deps:** `npm audit` + Dependabot weekly (grouped patches), pinned via `package-lock.json`, `engines: node>=24`
- **Secrets:** Never in repo. `.env` gitignored. Prod via `wrangler secret` (Turso/Stripe) + `~/.secrets/` (local). `.env.example` only
- **Headers:** CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy on every response
- **Auth:** JWT signed with `JWT_SECRET` (HMAC-SHA256, 24h exp), bcrypt passwords, zod validation, rate-limit on `/api/auth/*`
- **CORS:** Allowlist only (`https://*.pages.dev`, `http://localhost:5173` dev), no `*`
- **Backups:** `OneDrive/Backups/_SYSTEM_/AI-Memory_*.zip.enc` AES-256-GCM + ACL `moaz7:F` only, 7-day keep, sharing OFF. Decrypt: `node scripts/decrypt-backup.mjs <file> --out <dir>`
- **Supply chain:** `npm provenance` on publish, `SECURITY.md` + `CODEOWNERS` required reviewers

## Disclosure

Coordinated disclosure, CVE if needed, changelog entry, `CHANGELOG.md`.
