# Default Project — Full Stack Baseline

Integrated monorepo: Vite 8 + React 19 + Tailwind v4 (web) + Hono 4 edge-ready API, unified Oxlint/Oxfmt/tooling, web-vitals budgets, and agent skills. One `npm run verify` proves the stack.

## Architecture

```
npm workspaces (pnpm-ready)
├── apps/web      Vite 8 + React 19 + Tailwind v4, Rolldown, web-vitals RUM
│                 code-split lazy hydration, PerfImage (fetchPriority high)
├── apps/api      Hono 4 + Zod + hono/client RPC, WinterCG (Node ↔ Workers)
├── packages/shared  shared types (future)
├── scripts/verify.mjs  typecheck → lint → test → build (fail-fast)
└── .opencode/skills  perf-check, code-review, project-bootstrap
```

- **Node** >=24.0.0, **npm** >=11.0.0 — `npm install` today, `pnpm install` tomorrow.
- **Vite 8** single Rolldown bundler for dev+prod, proxy `/api` → `http://localhost:3000`.
- **TypeScript** strict, `noUnusedLocals`, no `any`.
- **Hono** WinterCG compliant — one adapter line swaps Node ↔ Cloudflare Workers.

## Quick Start

```bash
npm install          # install all workspaces
npm run dev          # concurrently api (3000) + web (5173)
npm run verify       # typecheck + lint + test + build — must exit 0
```

Open http://localhost:5173 — web proxies `/api` to the Hono server. Check `curl http://localhost:3000/api/health`.

## Scripts

| Command                         | What it does                                                       |
| ------------------------------- | ------------------------------------------------------------------ |
| `npm install`                   | install root + `apps/*` + `packages/*`                             |
| `npm run dev`                   | `concurrently "npm run dev -w apps/api" "npm run dev -w apps/web"` |
| `npm run typecheck -w @app/web` | `tsc --noEmit -p apps/web/tsconfig.json` (jsx react-jsx)           |
| `npm run typecheck -w @app/api` | `tsc --noEmit -p apps/api/tsconfig.json`                           |
| `npm run lint`                  | `oxlint --type-aware --type-check` (tsgo)                          |
| `npm run format`                | `oxfmt .`                                                          |
| `npm run test -ws`              | vitest per workspace (web: jsdom, api: hono request)               |
| `npm run build -ws`             | `vite build` (web → `dist/`) + `tsc -p` (api → `dist/`)            |
| `npm run verify`                | `node scripts/verify.mjs` — ordered, fail-fast                     |
| `npm run build -w @app/web`     | static build only                                                  |
| `npm run deploy -w @app/api`    | `wrangler deploy` (CF Workers)                                     |

## Dev Integration

`apps/web/vite.config.ts`:

```ts
server: { port: 5173, proxy: { "/api": "http://localhost:3000" } }
```

- Web dev server 5173 proxies `/api` → Hono on 3000, no CORS in dev.
- `apps/web/src/lib/web-vitals.ts` beacons CLS/LCP/INP to `POST /api/vitals`.
- `PerfImage` enforces `width`/`height`, `fetchPriority=high` on LCP, `loading=eager` vs `lazy`, `decoding=async`.

## Verify — One Command

`scripts/verify.mjs` runs in order, fails fast:

```
npm run typecheck -w @app/web
npm run typecheck -w @app/api
npm run lint
npm run test -ws --if-present
npm run build -ws --if-present
✓ verify passed — all layers integrated
```

Why workspace typechecks? Root `tsconfig.base.json` is base only (no `jsx`), so `tsc -p tsconfig.base.json` would error on `*.tsx`. Verify runs each workspace's `tsconfig.json` instead.

Performance budgets (`lighthouserc.json`) enforce `LCP < 2500ms`, `CLS < 0.1`, `JS < 220kB`, `performance >= 0.9` in CI. Verify checks that `vite build` succeeds; Lighthouse assert runs in CI against built `dist/`.

```bash
npm run verify
# expect: typecheck PASS, lint 0 errors, tests 2 suites PASS, builds PASS
```

## Deploy

```bash
# API — Cloudflare Workers (Wrangler)
npm run deploy -w @app/api        # wrangler deploy — main = src/index.ts
# or: npx wrangler deploy -c apps/api/wrangler.toml

# Web — static (Vite)
npm run build -w @app/web         # emits apps/web/dist/
# deploy dist/ to CF Pages / any static host
```

Hono `apps/api/src/index.ts` exports `default app` for Workers; Node adapter (`@hono/node-server`) runs only when `import.meta.env.MODE !== "worker"`.

## Tooling

- **Oxlint** type-aware via `oxlint-tsgolint` (no parallel ESLint).
- **Oxfmt** formats `*.{ts,tsx,js,jsx,json,md}`.
- **lint-staged** + `scripts/setup-hooks.mjs` installs `pre-commit` (<40s) — `oxlint --fix`, `oxfmt` on staged files only. `pre-push` <90s, CI is source of truth.
- `node scripts/setup-hooks.mjs` to reinstall hooks.

## Agent Skills

Allowlisted in `opencode.json`:

- `perf-check` — LCP `fetchPriority`, image dimensions, JS budget, lighthouse budgets
- `code-review` — strict review checklist
- `project-bootstrap` — scaffold conventions

Skills live in `.opencode/skills/` and are mirrored to `.agents/skills/` for portability.
