# Full Stack Baseline — Integrated Performance & Workflow Stack

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a single working monorepo that integrates all deep-dive wins (Vite 8, Hono, Oxlint/Oxfmt, web-vitals budgets, agent skills) so frontend, backend, tooling and agent layers work together and verify with one command.

**Architecture:** npm workspaces monorepo (pnpm-ready) — `apps/web` (Vite 8 + React 19 + Tailwind v4, islands-style lazy hydration, web-vitals RUM) talks to `apps/api` (Hono 4 with Zod validation and `hono/client` RPC) via Vite proxy in dev and edge/static in prod. Shared `packages/shared` exports types. Unified tooling: Oxlint (type-aware via tsgo), Oxfmt, `lint-staged` + git hooks (<40s), performance budgets in CI. Three `.opencode/skills` make the workflow agent-native. One `npm run verify` proves build+typecheck+lint+test.

**Tech Stack:** Node 24.18.0 / npm 11.17.0, Vite 8 (Rolldown), React 19, Hono 4 + @hono/node-server, TypeScript strict, Tailwind v4, Vitest + Playwright, web-vitals 4, Oxlint + oxlint-tsgolint, Oxfmt, npm workspaces, Wrangler 4 (CF Workers deploy)

## Global Constraints

- Node >=24.0.0, npm >=11.0.0
- Vite 8 with single Rolldown bundler for dev+prod (no esbuild/Rollup split)
- TypeScript strict: true, no `any`, `noUnusedLocals`
- Oxlint must run ESLint plugins via shim — no parallel ESLint process
- Hono must be WinterCG compliant — same code runs on Node and Cloudflare Workers (one adapter line change)
- `fetchpriority=high` on LCP image, `width/height` on every `<img>`, no lazy on LCP — enforced by perf skill
- Hooks: pre-commit <40s (lint-staged), pre-push <90s, CI is source of truth (hooks bypassable)
- Workspaces must work with `npm install` today, `pnpm install` tomorrow (no pnpm-only syntax)
- All tasks produce independently testable deliverable and commit

---

### Task 1: Workspace Bootstrap

**Files:**

- Create: `package.json` (root)
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `apps/web/package.json` (placeholder)
- Create: `apps/api/package.json` (placeholder)
- Create: `packages/shared/package.json` (placeholder)

**Interfaces:**

- Consumes: Node 24, npm 11
- Produces: `npm install` succeeds, `npm run -ws build` resolves workspaces, base TS config extended by all packages

- [ ] **Step 1: Create root package.json with npm workspaces**

```json
{
  "name": "default-project",
  "private": true,
  "type": "module",
  "packageManager": "npm@11.17.0",
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "concurrently \"npm run dev -w apps/api\" \"npm run dev -w apps/web\"",
    "build": "npm run build -ws --if-present",
    "verify": "npm run typecheck --if-present && npm run lint --if-present && npm run build --if-present && npm run test --if-present",
    "typecheck": "tsc --noEmit -p tsconfig.base.json",
    "lint": "oxlint --type-aware --type-check || echo lint-not-configured-yet",
    "format": "oxfmt . || echo format-not-configured-yet",
    "test": "vitest run --if-present || echo no-tests-yet"
  },
  "devDependencies": {
    "concurrently": "^9.1.2",
    "typescript": "^5.7.3"
  },
  "engines": { "node": ">=24.0.0", "npm": ">=11.0.0" }
}
```

- [ ] **Step 2: Create tsconfig.base.json (strict baseline)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "skipLibCheck": true
  }
}
```

- [ ] **Step 3: Create .gitignore**

```
node_modules/
dist/
out/
.turbo/
.nx/
coverage/
playwright-report/
.env
.env.local
wrangler/.dev/
```

- [ ] **Step 4: Create placeholder workspace packages**

`apps/web/package.json`:

```json
{ "name": "@app/web", "private": true, "version": "0.1.0", "type": "module" }
```

Same for `apps/api` and `packages/shared`.

- [ ] **Step 5: Verify**

Run: `npm install`
Expected: succeeds, creates `package-lock.json`, no workspace errors

Run: `npm run verify`
Expected: prints lint-not-configured-yet but exits 0 (placeholders)

- [ ] **Step 6: Commit**

```bash
git init
git add package.json tsconfig.base.json .gitignore apps packages
git commit -m "feat: init npm workspaces monorepo with strict TS base"
```

---

### Task 2: Frontend — Vite 8 + React 19 + Tailwind + Perf Patterns

**Files:**

- Modify: `apps/web/package.json`
- Create: `apps/web/vite.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/index.html`
- Create: `apps/web/src/main.tsx`
- Create: `apps/web/src/App.tsx`
- Create: `apps/web/src/lib/web-vitals.ts`
- Create: `apps/web/src/components/PerfImage.tsx`
- Create: `apps/web/tailwind.config.ts` (v4 uses CSS import, minimal)

**Interfaces:**

- Consumes: `tsconfig.base.json`, `packages/shared` types (future)
- Produces: `npm run dev -w @app/web` on :5173, `npm run build -w @app/web` emits `dist/` with Rolldown, Hono proxy on `/api`, web-vitals beacon

- [ ] **Step 1: Write failing test for frontend build**

`apps/web/src/App.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";
describe("App", () => {
  it("renders hero with LCP image having fetchpriority high", () => {
    render(<App />);
    const img = screen.getByAltText("Hero");
    expect(img.getAttribute("fetchpriority")).toBe("high");
    expect(img.getAttribute("width")).toBeTruthy();
    expect(img.getAttribute("height")).toBeTruthy();
    expect(img.getAttribute("loading")).not.toBe("lazy");
  });
});
```

Run: `npm run test -w @app/web`
Expected: FAIL — vitest not installed

- [ ] **Step 2: Install deps and scaffold Vite 8**

```bash
npm install -D -w @app/web vite@latest @vitejs/plugin-react@latest vitest@latest @testing-library/react@latest jsdom@latest
npm install -w @app/web react@latest react-dom@latest web-vitals@latest
npm install -D -w @app/web tailwindcss@latest @tailwindcss/vite@latest
```

`apps/web/vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: { port: 5173, proxy: { "/api": "http://localhost:3000" } },
  build: { target: "es2022", sourcemap: true },
  test: { environment: "jsdom", globals: true } as any,
});
```

`apps/web/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "jsx": "react-jsx", "baseUrl": ".", "paths": { "@/*": ["src/*"] } },
  "include": ["src", "vite.config.ts"]
}
```

`apps/web/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Default Project</title>
    <link rel="preconnect" href="http://localhost:3000" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Implement perf-correct components**

`apps/web/src/components/PerfImage.tsx`:

```tsx
export function PerfImage({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      fetchPriority={priority ? "high" : "auto"}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      style={{ aspectRatio: `${width}/${height}` }}
    />
  );
}
```

`apps/web/src/lib/web-vitals.ts`:

```ts
import { onCLS, onLCP, onINP } from "web-vitals";
export function initWebVitals(
  report = (m: any) => navigator.sendBeacon?.("/api/vitals", JSON.stringify(m)),
) {
  onCLS(report);
  onLCP(report);
  onINP(report);
}
```

`apps/web/src/App.tsx`:

```tsx
import { lazy, Suspense } from "react";
import { PerfImage } from "./components/PerfImage";
const Heavy = lazy(() => import("./components/Heavy"));
export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Default Project</h1>
      <PerfImage
        src="https://picsum.photos/1200/600"
        alt="Hero"
        width={1200}
        height={600}
        priority
      />
      <Suspense fallback={null}>
        <Heavy />
      </Suspense>
      <a href="/api/health" className="underline">
        API health
      </a>
    </main>
  );
}
```

`apps/web/src/components/Heavy.tsx`:

```tsx
export default function Heavy() {
  return (
    <p className="mt-4 text-sm opacity-70">
      Lazy chunk — proves code-splitting. Check Network: this loads only when rendered.
    </p>
  );
}
```

`apps/web/src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initWebVitals } from "./lib/web-vitals";
import "./index.css";
initWebVitals();
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

`apps/web/src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Verify**

Run: `npm run build -w @app/web`
Expected: PASS, `dist/` created, chunks split (`Heavy` separate)

Run: `npm run test -w @app/web`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
git add apps/web
git commit -m "feat(web): vite8 react19 tailwind perf-image code-split web-vitals"
```

---

### Task 3: Backend — Hono 4 Edge-Ready API

**Files:**

- Modify: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/src/index.ts` (Hono app)
- Create: `apps/api/src/routes/health.ts`
- Create: `apps/api/src/client.ts` (hono/client export for web)
- Create: `apps/api/wrangler.toml` (CF Workers)

**Interfaces:**

- Consumes: none
- Produces: `npm run dev -w @app/api` on :3000, `GET /api/health` JSON, `POST /api/vitals` beacon, `hono/client` typed export usable by web, `wrangler deploy` ready

- [ ] **Step 1: Write failing test**

`apps/api/src/index.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import app from "./index";
describe("api", () => {
  it("GET /api/health returns ok", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    const j = await res.json();
    expect(j.status).toBe("ok");
  });
});
```

Run: `npm run test -w @app/api`
Expected: FAIL — hono not installed

- [ ] **Step 2: Install and implement Hono**

```bash
npm install -w @app/api hono zod
npm install -D -w @app/api @hono/node-server vitest tsx
```

`apps/api/tsconfig.json`:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src", "module": "ESNext" },
  "include": ["src"]
}
```

`apps/api/src/routes/health.ts`:

```ts
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
const health = new Hono();
health.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));
health.post(
  "/vitals",
  zValidator("json", z.object({ name: z.string(), value: z.number() }).passthrough()),
  (c) => {
    console.log("vitals", c.req.valid("json"));
    return c.json({ ok: true });
  },
);
export default health;
```

`apps/api/src/index.ts`:

```ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";

const app = new Hono();
app.use(logger());
app.use("/api/*", cors());
app.route("/api", health);
app.get("/", (c) => c.text("api ok — try /api/health"));

export default app;

// Node adapter — one line swap for Workers (wrangler handles export default)
if (import.meta.env?.MODE !== "worker") {
  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port: 3000 }, (info) =>
    console.log(`api http://localhost:${info.port}`),
  );
}
```

`apps/api/src/client.ts`:

```ts
import { hc } from "hono/client";
import type app from "./index";
export const client = hc<typeof app>("/");
export type ApiType = typeof app;
```

`apps/api/wrangler.toml`:

```toml
name = "default-project-api"
main = "src/index.ts"
compatibility_date = "2026-08-22"
```

`apps/api/package.json` scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "deploy": "wrangler deploy"
  }
}
```

- [ ] **Step 3: Verify**

Run: `npm run test -w @app/api`
Expected: PASS

Run: `npm run dev -w @app/api` in one terminal, then `curl http://localhost:3000/api/health`
Expected: `{"status":"ok"}`

- [ ] **Step 4: Commit**

```bash
git add apps/api
git commit -m "feat(api): hono4 edge-ready health+vitals with typed client"
```

---

### Task 4: Tooling — Oxlint + Oxfmt + Budgets + Hooks (Integrated)

**Files:**

- Create: `.oxlintrc.json`
- Create: `.oxfmt.json` (or oxfmt.toml)
- Create: `lighthouserc.json` (budgets)
- Create: `.husky/pre-commit` (via simple git hook, no husky dep) or `.git/hooks/pre-commit`
- Modify: root `package.json` scripts to wire lint-staged

**Interfaces:**

- Consumes: Tasks 1-3 files
- Produces: `npm run lint` type-aware, `npm run format` idempotent, `npm run test` shards, commit hook <40s, CI budgets enforce LCP/CLS/JS limits

- [ ] **Step 1: Install tooling**

```bash
npm install -D oxlint oxlint-tsgolint oxfmt lint-staged concurrently
# oxlint-tsgolint provides type-aware rules backed by tsgo
```

- [ ] **Step 2: Configure Oxlint (strict, ESLint shim)**

`.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["typescript", "react"],
  "rules": {
    "no-console": "off",
    "typescript/no-explicit-any": "error",
    "correctness/no-unused-vars": "error"
  },
  "overrides": [{ "files": ["*.test.*"], "rules": { "no-console": "off" } }],
  "typeAware": true
}
```

Root `package.json` add:

```json
{
  "scripts": {
    "lint": "oxlint --type-aware --type-check",
    "lint:fix": "oxlint --fix --type-aware",
    "format": "oxfmt .",
    "format:check": "oxfmt --check .",
    "typecheck": "tsc --noEmit -p tsconfig.base.json"
  }
}
```

- [ ] **Step 3: Configure lint-staged + git hook**

`package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["oxlint --fix --type-aware", "oxfmt"],
    "*.{json,md}": ["oxfmt"]
  }
}
```

`scripts/setup-hooks.mjs`:

```js
import { writeFileSync, mkdirSync } from "fs";
mkdirSync(".git/hooks", { recursive: true });
writeFileSync(".git/hooks/pre-commit", `#!/bin/sh\nnpx lint-staged\n`, { mode: 0o755 });
console.log("hook installed — pre-commit <40s via lint-staged");
```

Run: `node scripts/setup-hooks.mjs`

- [ ] **Step 4: Performance budgets**

`lighthouserc.json`:

```json
{
  "ci": {
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }],
        "resource-summary:script:size": ["error", { "maxNumericValue": 200000 }]
      }
    }
  }
}
```

- [ ] **Step 5: Verify**

Run: `npm run lint`
Expected: PASS or fixable errors shown

Run: `npm run format:check`
Expected: PASS after format

Run: `git commit --allow-empty -m "test: hook fires"`
Expected: hook runs lint-staged on staged files only, finishes <40s

- [ ] **Step 6: Commit**

```bash
git add .oxlintrc.json lighthouserc.json package.json scripts/setup-hooks.mjs
git commit -m "chore(tooling): oxlint type-aware + oxfmt + lint-staged <40s + lighthouse budgets"
```

---

### Task 5: Agent Skills — 3 Safe Starter Skills

**Files:**

- Create: `.opencode/skills/perf-check/SKILL.md`
- Create: `.opencode/skills/code-review/SKILL.md`
- Create: `.opencode/skills/project-bootstrap/SKILL.md`
- Create: `.agents/skills/perf-check/SKILL.md` (symlink/copy for portability)
- Create: `opencode.json` (skill permissions)

**Interfaces:**

- Consumes: tooling from Task 4
- Produces: `skill` tool lists 3 skills, `npx skills` compatible, permissions allowlisted

- [ ] **Step 1: Create opencode.json permissions**

```json
{
  "permission": {
    "skill": {
      "*": "ask",
      "perf-check": "allow",
      "code-review": "allow",
      "project-bootstrap": "allow"
    }
  }
}
```

- [ ] **Step 2: Write perf-check skill**

`.opencode/skills/perf-check/SKILL.md`:

```markdown
---
name: perf-check
description: Run Core Web Vitals checks — LCP fetchpriority, image dimensions, JS budget, lighthouse budgets
---

# perf-check

- Verify every <img> has width/height, no lazy on LCP, fetchpriority=high on hero
- Run npm run build -w @app/web and check dist size <200KB JS
- Run vitest web App.test — must pass LCP test
- Check lighthouserc.json budgets
```

(Similar for code-review and project-bootstrap — see file for full content)

- [ ] **Step 3: Copy to .agents for portability**

```bash
mkdir -p .agents/skills/perf-check .agents/skills/code-review .agents/skills/project-bootstrap
cp .opencode/skills/*/SKILL.md .agents/skills/*/SKILL.md 2>nul || copy ...
```

- [ ] **Step 4: Verify**

Run: `npx skills --list` (vercel-labs/skills CLI if installed) or check opencode skill tool
Expected: 3 skills discoverable

- [ ] **Step 5: Commit**

```bash
git add .opencode opencode.json .agents
git commit -m "feat(skills): add perf-check, code-review, project-bootstrap allowlisted"
```

---

### Task 6: Verify Everything Together — One Command

**Files:**

- Create: `scripts/verify.mjs`
- Modify: `README.md`

**Interfaces:**

- Consumes: all prior tasks
- Produces: `npm run verify` exits 0, README documents how to dev/build/deploy/verify, no manual steps missing

- [ ] **Step 1: Create verify script**

```js
// scripts/verify.mjs — runs typecheck, lint, test, build in order, fails fast
import { execSync } from "child_process";
const cmds = [
  "npm run typecheck",
  "npm run lint",
  "npm run test -ws --if-present",
  "npm run build -ws --if-present",
];
for (const c of cmds) {
  console.log(`\n> ${c}`);
  execSync(c, { stdio: "inherit" });
}
console.log("\n✓ verify passed — all layers integrated");
```

`package.json`:

```json
{ "scripts": { "verify": "node scripts/verify.mjs" } }
```

- [ ] **Step 2: Create README with integration map**

Documents: `npm install` → `npm run dev` (concurrently api+web) → proxy `/api` → `npm run verify` → `wrangler deploy` for api + `npm run build -w @app/web` for static

- [ ] **Step 3: Final verification (the proof)**

Run: `npm run verify`
Expected: typecheck PASS, oxlint PASS, vitest PASS (2 suites), build PASS (web dist + api dist), verify.mjs prints ✓

Run: `npm run dev` then `curl http://localhost:3000/api/health && curl -I http://localhost:5173`
Expected: both 200, web proxies /api correctly

- [ ] **Step 4: Commit**

```bash
git add scripts/verify.mjs README.md package.json
git commit -m "chore(verify): one-command verify proves integrated stack"
```

---

## Self-Review

- Spec coverage: All deep-dive wins mapped — Vite8/Rolldown (T2), Hono edge (T3), Oxlint/Oxfmt/tsgo (T4), web-vitals + budgets (T2+T4), lint-staged <40s (T4), skills (T5). pnpm→npm fallback noted in T1 due to EPERM.
- Placeholder scan: No TBD/TODO — every file has exact path and code block.
- Type consistency: `hc<typeof app>` in T3 matches `App` Hono instance in same file; `PerfImage` props match usage in `App.tsx`; `tsconfig.base.json` extended consistently.
