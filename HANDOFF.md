# HANDOFF — The Math Mentor System (Agent Handoff Document)

**Read this file first. It makes you productive on this machine in minutes.**

This is the single entry point for any AI agent (OpenCode or other) starting work on this project — especially on a fresh device. Everything below is factual: commands were verified on the source machine (Node v24.18.0, Typst 0.15.1).

---

## 1. What This System Is

The Math Mentor (`themathmentor.edu`) — a math tutoring platform built by Mr/Moaz Khaled. Four connected parts:

1. **Question Vault** — curated Markdown+LaTeX questions, curriculum maps, SVG diagrams (`Local_Math_Vault/`)
2. **Sheet Builder** — turns vault questions into branded A4 PDF worksheets (Typst) AND interactive web exams (React/KaTeX)
3. **Web App** — student exams, teacher dashboard, payments (React 19 + Vite 8 + Tailwind v4)
4. **API** — auth, students, exams, HRMS, Stripe endpoints (Hono 4, runs on Node AND Cloudflare Workers)

Brand attribution required on all outputs: `Created by Mr/Moaz Khaled · Designed by Joe for Designs · All rights reserved · www.themathmentor.edu`

---

## 2. Read Order (when you need depth)

| Order | File | When |
|---|---|---|
| 1 | `HANDOFF.md` (this) | Always, first |
| 2 | `AGENT.md` | Before touching content, templates, or UI — golden rules |
| 3 | `SYSTEM_SPEC.md` | Before ANY worksheet/workbook/print/UI work — canonical brand v2.0 spec |
| 4 | `DESIGN.md` | Before frontend work — SYSTEM_SPEC tokens mapped to Tailwind `@theme` |
| 5 | `README.md` | Stack details, verify pipeline, deploy details |

---

## 3. Architecture Map

```
Local_Math_Vault/          CONTENT SOURCE OF TRUTH (do not regenerate from scratch)
├── Curriculum_Frameworks/Egypt_Grade10_Math_2026.json   week → topic map
├── Question_Bank/Grade_09_12/{Geometry,Algebra}/        questions: MD + YAML frontmatter
└── Vector_Assets/{SVG_Diagrams,TikZ_Snippets}           figures (anchored coordinates)

content/bank/              mirror of vault questions (+ tikz_snippets/) — legacy compat path
assets/                    brand logos + geometry_templates SVGs (web + print share these)
templates/                 master_sheet.typ (branded header/footer + CeTZ), sheet.typ, question-block.typ
math_builder.py            CORE ENGINE: vault → Typst PDF + React/Astro exam files

apps/
├── web/                   Vite 8 + React 19 + Tailwind v4 (port 5173)
│   └── src/components/    MathExam, TeacherDashboard, Math(KaTeX), GebraEmbed, PaymentsPanel...
├── api/                   Hono 4 + Zod + Drizzle + libsql (port 3000)
│   ├── src/routes/        auth, students, exams, hrms, stripe, health
│   ├── src/db/            schema.ts (drizzle), seed
│   ├── dev.db             local SQLite (dev only)
│   └── wrangler.toml      Workers config (prod = Turso)
└── packages/shared/       shared types (future)

scripts/                   ingest.mjs, fetch_libraries.mjs, generate_sheet.mjs, batch_generate.mjs,
                           backup-system.mjs, restore.mjs, verify.mjs, deploy_check.mjs, fast_build.ps1
dist/<week>_<topic>/       OUTPUT: sheet.typ/.pdf, exam.tsx, exam.react.json, exam.astro
backups/                   zip + git-bundle snapshots (also synced to ~/OneDrive/Backups/Default-Project)
.github/workflows/         CI: verify, CodeQL, secret-scan, dependency-review, branch protection
.opencode/skills/          perf-check, code-review, project-bootstrap, free-claude-code
                           (mirrored to .agents/skills/)
```

---

## 4. Tech Stack & Why

| Layer | Choice | Why |
|---|---|---|
| Runtime | Node >=24, npm >=11 workspaces | one repo, pnpm-ready |
| Web | Vite 8 + React 19 + Tailwind v4 | Rolldown bundler, `@theme` brand tokens, lazy hydration |
| API | Hono 4 + Zod + hono/client RPC | WinterCG — same code on Node & CF Workers |
| DB | Drizzle ORM + libsql | local SQLite file in dev; Turso in prod (zero cold start) |
| Print | Typst + CeTZ | sub-second PDF compile, no LaTeX install needed |
| Web math | KaTeX 0.16.9 auto-render + GeoGebra embed | fast, offline-capable |
| Lint/format | Oxlint type-aware + Oxfmt | one unified toolchain, pre-commit hooks <40s |
| Tests | Vitest (jsdom web, hono request api) | workspace-scoped |

Performance budgets (CI-enforced): LCP < 2500ms, CLS < 0.1, JS bundle < 220kB, performance score >= 0.9 (`lighthouserc.json`).

---

## 5. How Data Flows

```
Egypt_Grade10_Math_2026.json          (curriculum: week N → topic T)
        │ scripts/batch_generate.mjs / math_builder.py
        ▼
Local_Math_Vault/Question_Bank/**.md  (questions matched by topic+grade frontmatter)
        │ parse frontmatter (id, topic, grade, figure, points)
        ├─► normalize_for_typst() → templates → dist/<topic>/sheet.typ
        │        → typst compile --root . → sheet.pdf
        └─► JSON → dist/<topic>/exam.react.json + exam.tsx + exam.astro
                     │
                     ▼
        apps/web MathExam component (KaTeX renders promptTex, GebraEmbed for interactive figs)
                     │ POST /api/*
                     ▼
        Hono API (auth → students → exams results → stripe payments) → Drizzle → SQLite/Turso
```

Question file format (frontmatter is mandatory — `ingest.mjs` validates it):

```markdown
---
id: circle-theorem-001
topic: circle_theorems
grade: "10"
figure: circle-inscribed-angle.svg   # must exist in assets/geometry_templates OR Vector_Assets/SVG_Diagrams
points: 2
---
Question text with $math$ ...
```

---

## 6. Workflows (exact commands)

### Fresh device setup
```bash
# Prereqs: Node >=24, npm >=11, Typst (github.com/typst/typst/releases), Python 3
npm install                 # root + all workspaces
node scripts/setup-hooks.mjs  # pre-commit oxlint+oxfmt hooks
cp .env.example .env        # then fill keys (see §8)
npm run verify              # MUST exit 0 before you claim anything works
```

### Daily development
```bash
npm run dev                 # api :3000 + web :5173 concurrently (web proxies /api)
curl http://localhost:3000/api/health   # sanity check API
npm run verify              # typecheck → lint → test → build, fail-fast — run before finishing anything
```

### Generate a worksheet + web exam
```bash
python math_builder.py --topic circle_theorems --grade 10 --out ./dist
# or via npm:
npm run sheet:generate      # node scripts/generate_sheet.mjs
npm run sheet:week          # batch: weeks 1-4, grade 10
npm run sheet:build         # powershell fast_build wrapper
# PDF failed? read dist/<topic>/compile_error.log ONLY — fix that error, recompile:
typst compile --root . dist/<topic>/sheet.typ dist/<topic>/sheet.pdf
```

### Ingest / sync question vault
```bash
npm run ingest              # validates content/bank (frontmatter + KaTeX + figure refs)
npm run ingest:vault        # validates Local_Math_Vault/Question_Bank
npm run fetch:libs          # pulls IM/OpenStax/OpenMiddle/WeBWorK/Numbas/GeoGebra/TeXample samples
npm run vault:sync          # fetch + ingest together
```

### Deploy
```bash
npm run deploy -w @app/api  # wrangler deploy (Workers). Secrets once:
wrangler secret put TURSO_DATABASE_URL -c apps/api/wrangler.toml
wrangler secret put TURSO_AUTH_TOKEN   -c apps/api/wrangler.toml
npm run build -w @app/web   # static → apps/web/dist/ → Cloudflare Pages / any static host
npm run deploy:check        # pre-deploy verification
```

### Backup & restore (before big changes!)
```bash
npm run backup:system       # full snapshot: zip + git bundle → backups/ + ~/OneDrive/Backups
npm run backup:list         # list snapshots (restore.mjs --list)
npm run backup:memories     # memories-only snapshot
node scripts/restore.mjs --latest                       # inspect newest
node scripts/restore.mjs --restore <file>.zip --dry     # ALWAYS dry-run first
node scripts/restore.mjs --bundle <file>.bundle         # restore git bundle
```

---

## 7. Non-Negotiable Rules

1. **Search the vault first.** Never generate a question/diagram from scratch if a template exists.
2. **Brand tokens only** (House v2): Teal `#0A9396` · Navy `#1A1A2E` · Cyan `#01CBFC` · Gold `#D4A373` · Terra `#E76F51` · Sage `#84A98C` · Ink `#2D3436` · Paper `#FAF9F6`. Web: use ONLY `@theme` classes in `apps/web/src/index.css`. Never invent hex values.
3. **Grade accents**: G4 `#E76F51` G5 `#CF7B1D` G6 `#B33A63` G7 `#2980B9` G8 `#8E44AD` G9 `#6C3483` G10 `#0A9396` G11 `#1A1A2E`.
4. **Figure-first pedagogy**: geometry/trig/graphing → diagram FIRST at 65–85% width, one-line caption, THEN text.
5. **Pedagogy loop**: Key Rule → Common Mistakes ([WRONG]→why→[RIGHT]) → I Do (Math Steps + italic What We Think columns) → You Do (workspace + compact Answers).
6. **791pt A4 budget**: bottom-most element NEVER exceeds 791pt (page 841.89 − 51 margin). Validate with PyMuPDF script in `SYSTEM_SPEC.md §8.4`.
7. **Anchored geometry only**: `let A=(0,0); content(A, [$A$], anchor:"south-east")`.
8. **Output only `#question(...)` blocks** from builders — page header lives in `templates/master_sheet.typ`.
9. **Assets from `/assets` top-level only** (logo-main, logo-symbol, logo-white × png/svg). No duplicates elsewhere.
10. **Never commit secrets.** `.env` is gitignored. API secrets go through `wrangler secret put`.

---

## 8. Env Vars

`.env` (gitignored — copy from `.env.example`). Two separate concerns:

**A. Free model proxy for coding agents (free-claude-code)** — NOT used by the app itself:
- `NVIDIA_NIM_API_KEY=nvapi-...` (recommended free tier, 40 req/min)
- Alternatives: OPENROUTER/GROQ/DEEPSEEK/GITHUB_MODELS keys, or local LM Studio/Ollama base URLs
- Proxy runs at `http://localhost:8082`; launch with `fcc-opencode`

**B. Production API secrets** (via wrangler, never in `.env` committed anywhere):
- `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`

---

## 9. Key Files Index

| Path | Purpose |
|---|---|
| `SYSTEM_SPEC.md` | Canonical spec: brand colors/typography/pedagogy/layout archetypes + ALL Typst & LaTeX component code (v2.0) |
| `AGENT.md` | Agent golden rules + stack + operational rules |
| `DESIGN.md` | Token bridge → Tailwind `@theme` + strict UI rules |
| `.cursor/rules/design.mdc` | Cursor-side enforcement of the above |
| `math_builder.py` | Vault fetcher/adapter/publisher → Typst + Astro + React outputs |
| `templates/master_sheet.typ` | Branded master template (header/footer/CeTZ) — edit here, not in generated sheets |
| `apps/api/src/db/schema.ts` | Drizzle schema (migrations in `apps/api/drizzle/`) |
| `apps/api/src/routes/*.ts` | Endpoint groups: auth, students, exams, hrms, stripe, health |
| `apps/web/src/components/MathExam.tsx` | Interactive exam engine (KaTeX + GebraEmbed) |
| `apps/web/src/components/TeacherDashboard.tsx` | Teacher side |
| `apps/web/src/index.css` | `@theme` brand token definitions — single styling truth |
| `scripts/verify.mjs` | The gate: typecheck → lint → test → build |
| `docs/DEPLOY_CHECKLIST.md` | Go-live checklist |
| `docs/superpowers/plans/2026-08-22-full-stack-baseline.md` | Original build plan |
| `.superpowers/sdd/task-*-report.md` | Reports from baseline implementation tasks 1–6 |

---

## 10. Known Gotchas (learned the hard way)

1. **Typst strings bug**: table cells / rows / selfcheck items MUST be content blocks `[...]`, never `"..."` — quoted strings render `$...$` literally.
2. **Typst semicolon drop**: a `;` right after `]` gets dropped by the parser. Put punctuation inside the block.
3. **PowerShell multi-line replace silently fails** with CRLF (`.Replace("\n",...)`) — use real file-edit tools or Python instead.
4. **LaTeX `\newenvironment`**: `#1` args are invisible in the END block — store into helper macros in the BEGIN block.
5. **LaTeX ampersands**: always escape as `\&`.
6. **Missing figure = compile error**: builder skips figure if the SVG doesn't exist in either asset dir; check frontmatter `figure:` paths first when PDFs fail.
7. **Root tsconfig has no `jsx`** — never run bare `tsc` on the repo; use `npm run typecheck -w @app/web` / `-w @app/api`.
8. **Verify is the gate**: lint-staged hooks are fast (<40s) but CI is source of truth — `npm run verify` green before claiming done.
9. Stray logs `api.err`, `web.log`, `api.log`, `compile_error.log` are debugging leftovers, safe to ignore/clean; `dist/` holds generated artifacts, don't hand-edit them.
10. Windows environment: PowerShell 5.1 shell — chain with `if ($?)`, not `&&`.

---

## 11. Replicate This OpenCode Agent on Another Device

The project docs above make any agent *know* the system. This section makes an OpenCode instance on another machine behave like THIS one — same rules, skills, memory, tools.

### Automated (recommended)

```powershell
cd "$env:USERPROFILE\OneDrive\Documents\Default Project"   # after OneDrive sync completes
npm run kit:bootstrap        # = agent-kit\bootstrap.ps1  (-DryRun to preview)
```

The kit bundles your entire agent config in `agent-kit/opencode-config/` and handles steps 1-5 below automatically: prereq checks, project deps + hooks + `.env`, config copy with path remapping, memory MCP clone/build, vault check, verify gate. Details + troubleshooting: `agent-kit/README-KIT.md`. The only manual leftovers are API keys (never scripted) — printed as a checklist at the end.

### Manual layers (fallback / reference)

### Layer 1 — Project-level (already travels with the repo — nothing extra to copy)

| Item | Path |
|---|---|
| Skill allowlist / permissions | `opencode.json` (root) |
| Project skills | `.opencode/skills/` (mirror: `.agents/skills/`) |
| Agent instructions | `AGENT.md`, `HANDOFF.md` (this file) |

### Layer 2 — User config (`~/.config/opencode/` on Windows: `C:\Users\<user>\.config\opencode\`)

Copy the WHOLE folder **except `node_modules/`**, then run `npm install` inside it:

| Item | What it contains |
|---|---|
| `opencode.jsonc` | Main config: models + all MCP server definitions (see Layer 4) |
| `rules/*.md` | 9 behavior rules: coding-style, git-workflow, mcp-servers, memory-layer, performance, security, taste-skill, testing, tokenrouter |
| `token-optimization.md` | Free-first model routing table |
| `agents/*.md` | 9 custom subagents: cloudflare-dev, db-dev, docs-writer, freelance-manager, math-tutor, planner, reviewer, security-auditor, tdd-guide |
| `commands/*.md` | Slash commands: `/fix`, `/plan`, `/review`, `/tdd` |
| `skills/` | ~80 skills incl. math-* suite (lesson-planner, problem-generator, worksheet-designer, visualization...), taste-skill variants, tdd/security/docker suites |
| `tui.json`, `oh-my-openagent.json` | UI + workflow prefs |

### Layer 3 — Skill packs & caches

- **Superpowers** (brainstorming/debugging/planning process skills): auto-installed to `~/.cache/opencode/packages/superpowers@...` — reinstall via its package if missing.
- MCP servers using `npx -y` fetch themselves on first use.

### Layer 4 — MCP servers (defined in `~/.config/opencode/opencode.jsonc`)

| Server | Setup needed on new device |
|---|---|
| obsidian-memory | Clone `obsidian-memory-layer-mcp` repo locally (`~/obsidian-memory-layer-mcp/dist/index.js`) + vault folder at `~/ObsidianVault` |
| sequential-thinking, duckduckgo, filesystem, github, playwright, sqlite, pdf, winget | Auto via npx; GitHub server needs a `GITHUB_PERSONAL_ACCESS_TOKEN` env var; Playwright installs a browser |

### Layer 5 — Memory vault & model keys

```bash
# On THIS machine — export memories:
npm run backup:memories        # writes backups/vault_*.zip (also to OneDrive Backups)
# On the NEW device — restore, then point obsidian-memory MCP at the restored vault folder.
```

Env vars the agent stack expects (set via system env or `.env`, never commit):
- `NVIDIA_NIM_API_KEY` (+ optional OPENROUTER/GROQ/DEEPSEEK keys) — free model proxy (Layer: free-claude-code, see README)
- `TOKENROUTER_API_KEY` — qwen free-tier gateway fallback
- Proxy itself: install once per machine via the free-claude-code `install.ps1` one-liner in `README.md`, launch with `fcc-opencode`

### First message to give the new OpenCode

> Read HANDOFF.md first. Then follow it — start with §2 read order.

---

*Handoff doc generated 2026-08-24 from live repo state (git HEAD `acacabc`). If reality diverges from this file, trust the repo and update this doc.*
