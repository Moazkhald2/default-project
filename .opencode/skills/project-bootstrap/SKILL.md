---
name: project-bootstrap
description: Bootstrap a new workspace package or monorepo slice with correct configs and verify
---

# project-bootstrap

Scaffold a new workspace package or full slice so `npm install` + `npm run verify` pass on first try.

## When to use

- Adding `apps/*` or `packages/*` workspace
- Bootstrapping the monorepo from scratch (Task 1 baseline)

## Steps

1. **Create package**

   ```json
   // apps/<name>/package.json or packages/<name>/package.json
   { "name": "@app/<name>", "private": true, "version": "0.1.0", "type": "module" }
   ```

   - Keep `workspaces: ["apps/*","packages/*"]` in root — no pnpm-only syntax so `npm install` and `pnpm install` both work.
   - `packageManager: "npm@11.17.0"`, `engines: { "node": ">=24.0.0", "npm": ">=11.0.0" }` at root.

2. **Wire TypeScript**

   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": { "outDir": "dist", "rootDir": "src", "module": "ESNext" },
     "include": ["src"]
   }
   ```

   - For React web: add `"jsx":"react-jsx"` and `"paths":{"@/*":["./src/*"]}` (note leading `./` — required by tsgo/tgolint, no `baseUrl`).
   - Root `tsconfig.base.json` is strict (`strict:true`, `noUnusedLocals:true`, `moduleResolution:"Bundler"`, `target:"ES2022"`). All packages extend it.
   - If side-effect CSS import (`import "./index.css"`), add `src/css.d.ts` with `declare module "*.css";` so `oxlint --type-aware --type-check` passes.

3. **Add scripts (per workspace)**

   - API: `{ "dev":"tsx watch src/index.ts", "build":"tsc -p tsconfig.json", "test":"vitest run", "deploy":"wrangler deploy" }`
   - Web: Vite 8 + vitest (`vite.config.ts` with `@vitejs/plugin-react`, `@tailwindcss/vite`, `test:{environment:"jsdom",globals:true}`, proxy `/api` to `http://localhost:3000`)
   - Shared: `{ "build":"tsc -p tsconfig.json", "test":"vitest run" }` if needed

4. **Install and verify**

   ```bash
   npm install
   npm run typecheck   # tsc --noEmit -p tsconfig.base.json — must PASS
   npm run lint        # oxlint --type-aware --type-check — 0 errors
   npm run format:check # oxfmt --check . — must PASS (run oxfmt . if fails)
   npm run test -ws --if-present
   npm run build -ws --if-present
   npm run verify      # typecheck && lint && build && test — must exit 0
   ```

5. **Commit**

   ```bash
   git add <new-package> package.json package-lock.json tsconfig.base.json
   git commit -m "feat(<scope>): bootstrap <name> workspace"
   ```

## Checklist

- [ ] `npm install` succeeds, `package-lock.json` updated, no workspace errors
- [ ] `npm run verify` exits 0 (or `lint-not-configured-yet` only before Task 4)
- [ ] Types strict — no `any`, `noUnusedLocals` clean
- [ ] Hooks <40s (`npx lint-staged` via `scripts/setup-hooks.mjs`) if tooling installed
- [ ] No pnpm-only syntax, no secrets, `.gitignore` covers `node_modules/ dist/ coverage/ .env`
