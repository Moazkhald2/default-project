---
name: code-review
description: Review code for strict TypeScript, Oxlint rules, security, and architecture quality
---

# code-review

Review checklist for this stack (strict TS, Oxlint type-aware, Hono WinterCG, perf patterns). Use before approving PRs.

## Focus (priority order)

1. Correctness — does it do what the spec says? Edge cases, error handling
2. Design — coupling, cohesion, single responsibility, one adapter line for Workers vs Node
3. Readability — one-pass understanding, meaningful names, functions <50 lines
4. Security — injection, auth, input validation (Zod), no secrets in repo
5. Perf — no regressions to LCP/CLS/JS budget
6. Tests — right things tested, edge cases, no flaky tests

## TypeScript / React

- [ ] No `any` — `typescript/no-explicit-any` must pass (`unknown` or proper type)
- [ ] `strict: true`, `noUnusedLocals: true` — no unused vars (`no-unused-vars` error)
- [ ] No `console.log` in prod code (allowed in `*.test.*` via override)
- [ ] `PerfImage` always used for images — enforces `width`/`height`, `fetchPriority`, `loading`, `decoding`, `aspectRatio`
- [ ] Hero image has `priority` (fetchpriority high, eager), non-hero is lazy
- [ ] Heavy chunks via `lazy` + `Suspense` — verify code-split, not imported eagerly
- [ ] Tailwind via `@tailwindcss/vite`, no custom PostCSS unless justified

## Hono API

- [ ] WinterCG compliant — same `src/index.ts` runs on Node (`@hono/node-server`) and Workers (`wrangler`); only one adapter line changes
- [ ] Routes use `zValidator` with Zod — never raw `c.req.json()` without validation
- [ ] `hc<typeof app>` typed client exported from `apps/api/src/client.ts` — web uses it, no `any` fetch wrappers
- [ ] CORS scoped to `/api/*`, `logger` mounted, `/api/health` returns `{status:"ok"}`, `/api/vitals` validates `{name,value}` passthrough

## Tooling

- [ ] `npm run typecheck` PASS (`tsc --noEmit -p tsconfig.base.json`)
- [ ] `npm run lint` PASS (`oxlint --type-aware --type-check`, 0 warnings, no ESLint parallel process)
- [ ] `npm run format:check` PASS (`oxfmt --check .`, idempotent)
- [ ] `lint-staged` covers `*.{ts,tsx,js,jsx}` via `oxlint --fix --type-aware` + `oxfmt`, `*.{json,md}` via `oxfmt`
- [ ] `lighthouserc.json` budgets unchanged unless justified (perf 0.9, LCP 2500, CLS 0.1, script 200000)

## Security

- [ ] No `eval` / dynamic code execution
- [ ] No command injection — parameterized APIs only
- [ ] All user input validated (Zod), sanitized before logging
- [ ] No secrets committed — use `.env` (gitignored), `npm audit` clean

## Tests

- [ ] New code has `*.test.ts(x)` mirroring source tree, `describe/it` with descriptive names
- [ ] API: `app.request("/api/health")` pattern, asserts status + JSON
- [ ] Web: `render(<App/>)` checks `getByAltText("Hero")` attributes (`fetchpriority`, `width`, `height`, not lazy)
- [ ] No skipped tests (`.skip` only with TODO), deterministic, no network in unit tests

## How to give feedback

- Ask questions, not commands — "What happens if `input` is null here?"
- Distinguish blocker vs nit; label `blocking` vs `suggestion`
- Provide alternatives — "Consider extracting to helper so it can be tested"
- Assume good intent; critique code, not author; be timely (<24h)
