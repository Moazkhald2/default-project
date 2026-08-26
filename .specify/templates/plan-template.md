# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]

**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node.js >= 24.0.0

**Primary Dependencies**: 
- Web: React 19, Vite 8, Tailwind v4, @phosphor-icons/react
- API: Hono 4, Zod, hono/client
- Shared: TypeScript types only
- Testing: Vitest, @testing-library/react, Playwright

**Storage**: [if applicable, e.g., PostgreSQL via Hyperdrive, D1, R2, or N/A]

**Testing**: Vitest (web: jsdom, api: hono request), Playwright for E2E

**Target Platform**: Web (browsers), Cloudflare Workers (API edge)

**Project Type**: Monorepo web application (frontend + backend)

**Performance Goals**: LCP < 2500ms, CLS < 0.1, JS < 220kB, Lighthouse performance >= 0.9

**Constraints**: 
- WinterCG compliance for API (Node ↔ Workers compatibility)
- No `any` in TypeScript, `noUnusedLocals` enforced
- Oxlint type-aware, Oxfmt formatting
- Shared types in `packages/shared` only

**Scale/Scope**: [domain-specific, e.g., 10k users, 50 screens]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file:
- Monorepo-First Architecture
- Type-Safe Contracts
- Test-First (NON-NEGOTIABLE)
- Verification Gates
- Performance by Default
- Observability Built-In]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Web Application (DEFAULT for this monorepo)
apps/
├── web/                 # Vite + React + Tailwind
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-level components
│   │   ├── lib/         # Utilities, hooks, configs
│   │   └── App.tsx      # Root component
│   ├── tests/           # Component/unit tests
│   └── e2e/             # Playwright E2E tests
│
├── api/                 # Hono + Zod + RPC
│   ├── src/
│   │   ├── routes/      # API route handlers
│   │   ├── models/      # Domain models, Zod schemas
│   │   ├── services/    # Business logic
│   │   └── index.ts     # Hono app entry
│   └── tests/           # API unit/integration tests
│
packages/
└── shared/              # Shared TypeScript types, Zod schemas
    └── src/
        ├── types/       # Shared type definitions
        └── schemas/     # Shared Zod validation schemas
```

**Structure Decision**: This project uses the monorepo web application structure (Option 2). Features typically span `apps/web` (UI), `apps/api` (backend), and `packages/shared` (contracts).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., New package] | [current need] | [why existing packages insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct service access insufficient] |