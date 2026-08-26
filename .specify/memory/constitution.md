# Default Project Constitution

## Core Principles

### I. Monorepo-First Architecture
Every feature is developed within the npm workspaces monorepo structure. Shared code lives in `packages/shared`, web UI in `apps/web`, and API in `apps/api`. Cross-workspace dependencies are explicit via workspace protocol.

### II. Type-Safe Contracts
All API boundaries use Zod schemas for validation. Shared types in `packages/shared` are the single source of truth. Hono RPC client (`hono/client`) enforces end-to-end type safety between web and API.

### III. Test-First (NON-NEGOTIABLE)
TDD mandatory: Tests written → User approved → Tests fail → Then implement. Red-Green-Refactor cycle strictly enforced. Vitest for unit/integration, Playwright for E2E. Minimum 80% coverage on critical paths.

### IV. Verification Gates
Every change must pass `npm run verify` — ordered, fail-fast pipeline: typecheck → lint → test → build. No exceptions. Pre-commit hooks enforce `oxlint --fix` and `oxfmt` on staged files.

### V. Performance by Default
Web Vitals budgets enforced: LCP < 2.5s, CLS < 0.1, JS bundle < 220kB. `PerfImage` component mandatory for all images. Code-splitting via lazy hydration. Lighthouse CI in pipeline.

### VI. Observability Built-In
Web vitals beaconed to `/api/vitals`. Structured logging in API. Error boundaries with user-facing fallbacks. No silent failures.

## Technology Stack Constraints

- **Runtime**: Node.js >= 24.0.0, npm >= 11.0.0 (pnpm-ready)
- **Web**: Vite 8 + React 19 + Tailwind v4, Rolldown bundler
- **API**: Hono 4 + Zod + hono/client RPC, WinterCG compliant
- **TypeScript**: Strict mode, `noUnusedLocals`, no `any`
- **Linting**: Oxlint type-aware via `oxlint-tsgolint`
- **Formatting**: Oxfmt for `*.{ts,tsx,js,jsx,json,md}`
- **Testing**: Vitest (web: jsdom, api: hono request)
- **Deploy**: Cloudflare Workers (API) + CF Pages / Static (Web)

## Development Workflow

1. **Spec-Driven**: `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`
2. **Branching**: Feature branches via `create-new-feature.ps1` (sequential numbering)
3. **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`, etc.)
4. **PRs**: Reference issues, include test plan, request review
5. **Verification**: `npm run verify` must pass before merge

## Governance

Constitution supersedes all other practices. Amendments require documentation, approval, migration plan. All PRs/reviews must verify compliance. Complexity must be justified. Use AGENT.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-08-26 | **Last Amended**: 2026-08-26