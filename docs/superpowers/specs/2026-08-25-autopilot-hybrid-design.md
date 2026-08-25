# Hybrid Autopilot — Weekly Tool Discovery & Job Auto-Improvement

**Date:** 2026-08-25
**Status:** Draft — pending user review
**Author:** OpenCode (Muse Spark) + Mr/Moaz Khaled
**Scope:** Full autopilot (tools + jobs), PR-only safety, Weekly Sunday 3am cloud + 4am local apply

---

## 1. Overview

Automate "improving and searching for new tools and what is best for us" so it **just happens** without telling the AI. Hybrid design: cloud does heavy discovery, local auto-applies here.

Current pain: manual checks for MCP/browser tools, `npm audit`, perf budgets, vault health. Goal: Sunday you wake to a PR + local already updated, zero manual trigger.

Brand: `themathmentor.edu` — respects House v2, `verify` gate, protected `main`.

---

## 2. Goals / Non-Goals

**Goals**
- Weekly auto-discover new FREE MCP/browser/AI tools from 7+ legit sources (GitHub, HF, Reddit, X, NPM, ProductHunt, HN)
- Evaluate "best for us" for Math Mentor jobs: vault ingestion, sheet builds (Typst), web perf, API (Hono), browser automation
- Auto-improve jobs: deps patches, `oxlint --fix`, `oxfmt`, lighthouserc budgets, vault checks
- Safety: PR-only, `npm run verify` must pass, never push to `main`
- Local auto-apply on this PC at 4am (git pull + install + verify + memory log)
- Zero API cost: uses existing `playwright`, `duckduckgo`, `brave_search` MCPs + `npx` + local `npm`

**Non-Goals**
- No paid APIs, no direct `main` pushes, no private Facebook group scraping, no vision-model browser (playwright a11y tree is enough)
- No weekly spam if nothing changed — skip PR if no improvement

---

## 3. Architecture

```
[Sunday 03:00 UTC — Cloud: .github/workflows/autopilot.yml]
  └─ runs scripts/autopilot.mjs --mode=cloud
     ├─ 5 parallel brave_search/duckduckgo (site: filters)
     ├─ npm outdated + audit + oxlint + verify dry-run
     ├─ score tools (free? license MIT/Apache? stars>100? updated<30d? no API?)
     ├─ if RECOMMEND → update opencode.jsonc / package.json → verify → branch autopilot/2026-Wxx → PR
     └─ memory_save + backups/autopilot-cloud-*.json

[Sunday 04:00 Africa/Cairo — Local: Windows Task Scheduler]
  └─ powershell -File scripts/autopilot.mjs --mode=local
     ├─ git fetch --all && git pull --ff-only (if cloud PR merged, apply)
     ├─ npm install (if package.json changed) → verify
     ├─ if cloud missed (PC was offline at 3am) → run full discover as backup
     └─ log to backups/autopilot-local-*.json + obsidian-memory progress_update + local .log

Shared: scripts/autopilot.mjs (DRY, ~200 lines, Node >=24, ESM)
```

Cost: GitHub Actions free (2000 min/mo, this uses ~4 min/week), local uses `npx -y` (no install).

---

## 4. Expanded Sources (user request: not just GitHub)

| Source | Query example | Trust filter |
|---|---|---|
| GitHub | `site:github.com "mcp" browser playwright 2026` | stars>100, updated<30d |
| Hugging Face | `site:huggingface.co mcp OR browser-use` | trending, downloads>1k |
| Reddit | `site:reddit.com/r/mcp OR r/LocalLLaMA OR r/ClaudeAI` | upvotes>50, flairs: trusted |
| X.com | `site:x.com @playwright @Anthropic mcp` | verified builders, Brave news |
| NPM | `npm view @playwright/mcp version` + `npm outdated` | audit clean, MIT |
| ProductHunt/HN | `site:producthunt.com OR news.ycombinator.com mcp` | upvotes>30 |
| Brave/DuckDuckGo general | `best free mcp browser tool no api 2026` | cross-check 2 engines |

Facebook: public pages only via web search (private groups out of scope). Facebook often stale for MCP — low priority.

All searches via existing MCPs: `brave_search` (fallback `duckduckgo`). 5 parallel calls = <15s.

---

## 5. Components

### 5.1 `scripts/autopilot.mjs`
- ESM, Node >=24, no new deps (uses built-ins + `execSync`)
- Modes: `--mode=cloud|local|check` (check = manual one-off)
- Functions:
  - `discover()` → 5 searches → dedupe → `tools[]`
  - `score(tool)` → {free, license, stars, lastUpdate, noAPI, fitsMathMentorJobs} → 0-100
  - `improveJobs()` → outdated patch, lint-fix, format, verify dry-run, ingest:vault --check
  - `createPR()` → branch, commit, `gh pr create` (cloud) or `git push origin branch` (local backup)
  - `localApply()` → fetch/pull, install, verify, log
- Output: `backups/autopilot-*.json` + console + memory

### 5.2 `.github/workflows/autopilot.yml`
- `on: schedule: cron: '0 3 * * 0'` (Sunday 3am UTC = 5am Cairo) + `workflow_dispatch` (manual button)
- `permissions: contents:write, pull-requests:write`
- Steps: checkout, node 24, npm ci, `node scripts/autopilot.mjs --mode=cloud`, `gh pr create` (uses `GITHUB_TOKEN`)
- Concurrency: `autopilot` (cancel in progress)

### 5.3 Local Task Scheduler
- Task: `MathMentor-Autopilot-Local` → `Trigger: Weekly Sunday 04:00` → `Action: powershell -ExecutionPolicy Bypass -File scripts/autopilot.ps1`
- `scripts/autopilot.ps1` wrapper: `node scripts/autopilot.mjs --mode=local >> backups/autopilot-local.log 2>&1`
- Setup: `node scripts/setup-autopilot-local.mjs` (idempotent, creates task via `schtasks /create`)
- Requires: PC on/sleep off at 4am (if off, next boot runs backup check)

### 5.4 Memory & Logging
- `obsidian-memory: memory_save type=learning` after each run (what tool evaluated, decision KEEP/RECOMMEND)
- `backups/autopilot-*.json` committed? No — gitignored, synced to OneDrive via existing backup
- PR body contains full report for human review

---

## 6. Data Flow & Decision Logic

```
discover (7 sources) → tools[] (e.g., playwright@latest, chrome-devtools-mcp, browser-use-mcp)
  → score each
     - free? (must be, else 0)
     - no API? (required per user, else -50)
     - fits jobs? (+20 if helps sheet/web/api/browser)
     - health: stars/downloads, license, lastUpdate, audit
  → bestScore vs current (playwright)
  → if best > current +10 → RECOMMEND (update)
  → else KEEP (still best)

improveJobs (always, even if KEEP):
  - npm audit fix (patch only, no major)
  - oxlint --fix, oxfmt
  - verify (typecheck→lint→test→build fail-fast)
  → if verify fails → abort, no PR, log failure

PR: branch autopilot/2026-Wxx, commit "chore(autopilot): weekly tools + jobs — <summary>", open PR
Local: pull branch or main (if merged), verify again, log
```

---

## 7. Safety & Error Handling

- **PR-only:** never commit to `main` (branch protection stays)
- **Verify gate:** `npm run verify` must exit 0 in both cloud and local, else no push + error log
- **No secrets:** uses `GITHUB_TOKEN` only, no `NVIDIA_NIM_API_KEY` needed
- **Rate limits:** brave_search 5 calls/week = well under limits
- **PC off:** cloud still runs; local retries next boot (checks `lastRun` timestamp)
- **Bad tool:** score threshold + audit prevents installing risky deps
- **Rollback:** `git revert` PR or `node scripts/restore.mjs --latest --dry`

---

## 8. Schedule & Triggers

- Cloud: `0 3 * * 0` UTC Sunday (5am Cairo) — free Actions minutes (4 min/week ≈ 16 min/mo < 2000 free)
- Local: 04:00 Africa/Cairo Sunday (1 hour after cloud, so PR exists)
- Manual: `gh workflow run autopilot.yml` or `node scripts/autopilot.mjs --mode=check` locally
- Also manual: GitHub UI → Actions → Autopilot → Run workflow

---

## 9. Testing

- `scripts/autopilot.mjs --mode=check --dry-run` (no PR, just report) — for local testing
- Vitest: `scripts/autopilot.test.mjs` (mock brave_search, mock npm outdated)
- CI: workflow tested on branch first (dry-run mode)
- Local Task Scheduler tested via `schtasks /run /tn MathMentor-Autopilot-Local`

---

## 10. Success Criteria

- Sunday you wake to: PR with report + local `backups/autopilot-local-*.json` shows `status: applied` (if PC was on)
- No manual trigger needed, zero API cost, verify green, PR-only
- Expanded sources checked (GH, HF, Reddit, X, NPM) each week
- Memory vault has weekly learning entries

---

## 11. Alternatives Considered

- A. Cloud only: reliable but not local-apply (rejected per user "here local")
- B. Local only: true local but fails if PC off (rejected)
- C. Hybrid (chosen): cloud reliability + local apply, best of both, fits "weekly Sunday free + here local"

---

## 12. Next Steps (after approval)

- Invoke `writing-plans` skill to create implementation plan
- Implement `scripts/autopilot.mjs` + `.github/workflows/autopilot.yml` + `scripts/setup-autopilot-local.mjs`
- Dry-run locally, then enable schedule
