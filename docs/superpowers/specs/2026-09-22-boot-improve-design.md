# Boot-Improve 15min Daily Design — 2026-09-22

Scope: everything (memory health + code local-fix), trigger once/day on logon, safety local-only no commit/push. Approved option C Hybrid.

## 1. Architecture

- Keep `DefaultProject-RD-Autofeed` hourly log-only (existing `scripts/rd-autofeed.mjs`).
- Add `DefaultProject-BootImprove` schtasks `/sc onlogon /rl LIMITED`, runs `scripts/boot-improve.ps1` → `node scripts/boot-improve.mjs`.
- Guard `backups/last-boot-improve.txt` (YYYY-MM-DD). Skip <5s if already today.
- Budget 15min hard kill. Exit 0 always.

## 2. Components

- `scripts/boot-improve.mjs` — time-boxed worker, no network/MCP deps.
- `scripts/boot-improve.ps1` — cd root, timeout 900s, low priority, append log.
- `scripts/setup-boot-improve.mjs` — create/update logon task, LIMITED, /it.
- Logs `backups/boot-improve-YYYY-MM-DD.log` rotate >1MB.

## 3. Data flow (15min)

- 0-2m memory: count `memories/**/*.md`, list sessions missing _progress, heartbeat line to `rd-autofeed.log`.
- 2-6m online search (think, don't blind-fix): time-boxed 4min, legit-only allowlist (official docs, github.com releases, CVE/NVD, vendor changelogs) + community signal (github issues/discussions, stackoverflow accepted). Fetch ≤5 URLs, summarize NEW fixes/updates relevant to `package.json` deps. No auto-install. Bigger updates → proposal in NEXT with why/risk, needs user approval. Offline → skip gracefully.
- 6-12m code: `git status --porcelain` (report only), `npm run lint` if present (report), quick `vitest run` if present (report), safe autofix only: trailing whitespace + unused-import allowlist in `scripts/`, `docs/` typos. Record diff stat, never commit.
- 12-15m plan+report: convert search hits into ranked plan (do-now safe vs propose-later), write summary + NEXT to daily log, write guard file.

## 4. Error handling

- Offline OK, search phase skips. Fetch timeout 15s/URL, total search cap 4min. Any throw → log + exit 0. Never block logon. Never touch `.env`, never commit/push, never `npm install` blindly.

## 5. Testing

- `node scripts/boot-improve.mjs` manual <15min pass.
- `schtasks /run /tn DefaultProject-BootImprove` e2e.
- Guard test: second run same day skips. Force: delete guard file.
- Timeout test: mock long task, verify kill at 900s.
