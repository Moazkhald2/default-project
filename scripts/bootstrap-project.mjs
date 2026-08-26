#!/usr/bin/env node
// Bootstrap a new monorepo project with spec-kit integrated
// Usage: node scripts/bootstrap-project.mjs <project-name> [--template]

import { existsSync, mkdirSync, writeFileSync, cpSync } from 'fs';
import { join, resolve } from 'path';
import { execSync } from 'child_process';

const PROJECT_NAME = process.argv[2];
const IS_TEMPLATE = process.argv.includes('--template');
const SCOPE = PROJECT_NAME.replace(/[^a-z0-9-]/g, '-').toLowerCase();

if (!PROJECT_NAME) {
  console.error('Usage: node scripts/bootstrap-project.mjs <project-name> [--template]');
  process.exit(1);
}

const ROOT = resolve(PROJECT_NAME);
const TEMPLATE_ROOT = resolve('.'); // this repo as template

console.log(`🚀 Bootstrapping project: ${PROJECT_NAME}`);
console.log(`📁 Target: ${ROOT}`);

if (existsSync(ROOT) && !IS_TEMPLATE) {
  console.error(`❌ Directory ${ROOT} already exists`);
  process.exit(1);
}

function run(cmd, cwd = ROOT) {
  console.log(`  $ ${cmd}`);
  execSync(cmd, { cwd, stdio: 'inherit', shell: true });
}

function write(file, content) {
  const path = join(ROOT, file);
  mkdirSync(resolve(path, '..'), { recursive: true });
  writeFileSync(path, content);
  console.log(`  ✓ Created ${file}`);
}

function copy(src, dest) {
  const srcPath = join(TEMPLATE_ROOT, src);
  const destPath = join(ROOT, dest);
  if (existsSync(srcPath)) {
    mkdirSync(resolve(destPath, '..'), { recursive: true });
    cpSync(srcPath, destPath, { recursive: true });
    console.log(`  ✓ Copied ${src} → ${dest}`);
  }
}

// 1. Create directory structure
console.log('\n📂 Creating directory structure...');
mkdirSync(ROOT, { recursive: true });
['apps/web/src', 'apps/api/src', 'packages/shared/src', 'scripts', '.opencode/skills'].forEach(dir => {
  mkdirSync(join(ROOT, dir), { recursive: true });
});

// 2. Root package.json
console.log('\n📦 Creating root package.json...');
write('package.json', `{
  "name": "${PROJECT_NAME}",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "type": "module",
  "scripts": {
    "dev": "concurrently \\"npm run dev -w apps/api\\" \\"npm run dev -w apps/web\\"",
    "build": "npm run build -ws --if-present",
    "verify": "node scripts/verify.mjs",
    "spec:init": "uvx --from git+https://github.com/github/spec-kit.git specify init . --here --force --integration opencode --non-interactive",
    "spec:feature": "powershell -ExecutionPolicy Bypass -File .specify/scripts/powershell/create-new-feature.ps1",
    "spec:check": "uvx --from git+https://github.com/github/spec-kit.git specify check",
    "spec:upgrade": "uvx --from git+https://github.com/github/spec-kit.git specify self upgrade",
    "typecheck": "npm run typecheck -ws --if-present",
    "lint": "oxlint --type-aware --type-check",
    "lint:fix": "oxlint --fix --type-aware",
    "format": "oxfmt .",
    "format:check": "oxfmt --check .",
    "test": "vitest run",
    "autopilot:check": "node scripts/autopilot.mjs --mode=check",
    "autopilot:setup-local": "node scripts/setup-autopilot-local.mjs"
  },
  "devDependencies": {
    "@types/node": "^26.2.0",
    "concurrently": "^9.1.2",
    "lint-staged": "^17.3.0",
    "oxfmt": "^0.64.0",
    "oxlint": "^1.79.0",
    "oxlint-tsgolint": "^7.0.2001",
    "typescript": "^5.7.3"
  },
  "overrides": {
    "esbuild": "^0.25.0"
  },
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": [
      "oxlint --fix --type-aware",
      "oxfmt"
    ],
    "{apps,packages,scripts,.github,docs}/**/*.{json,md}": [
      "oxfmt"
    ],
    "!(package-lock).json": [
      "oxfmt"
    ]
  },
  "engines": {
    "node": ">=24.0.0",
    "npm": ">=11.0.0"
  },
  "packageManager": "npm@11.17.0"
}`);

// 3. tsconfig.base.json
write('tsconfig.base.json', `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "exclude": ["node_modules", "dist", "out", "coverage"]
}`);

// 4. Root .gitignore
write('.gitignore', `node_modules/
dist/
out/
.turbo/
.nx/
coverage/
playwright-report/
.env
.env.local
wrangler/.dev/
# backups — kept locally + OneDrive, not in git
backups/
*.bundle
dev.db
dev.db-journal
*.log
*.err
# autopilot (local logs, gitignored but synced via OneDrive)
backups/autopilot-*.json
backups/autopilot-*.log
# Spec Kit machine-local state
.specify/feature.json
.specify/extensions/*/local-config.yml
`);

// 5. Copy shared tooling scripts
console.log('\n📋 Copying tooling scripts...');
copy('scripts/setup-hooks.mjs', 'scripts/setup-hooks.mjs');
copy('scripts/autopilot.mjs', 'scripts/autopilot.mjs');
copy('scripts/autopilot.test.mjs', 'scripts/autopilot.test.mjs');
copy('scripts/setup-autopilot-local.mjs', 'scripts/setup-autopilot-local.mjs');

// Create dynamic verify.mjs
write('scripts/verify.mjs', `import { execSync } from "child_process";
import { readFileSync, readdirSync } from "fs";
import { join, resolve } from "path";

const rootPkg = JSON.parse(readFileSync(join(resolve(), "package.json"), "utf8"));
const workspaces = rootPkg.workspaces || ["apps/*", "packages/*"];

function getWorkspaceNames() {
  const names = [];
  for (const pattern of workspaces) {
    const base = pattern.replace("/*", "");
    try {
      const entries = readdirSync(base, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
      for (const entry of entries) {
        const pkgPath = join(resolve(), base, entry, "package.json");
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
          names.push(pkg.name);
        } catch {}
      }
    } catch {}
  }
  return names;
}

const workspaceNames = getWorkspaceNames();
const webPkg = workspaceNames.find(n => n.endsWith("/web"));
const apiPkg = workspaceNames.find(n => n.endsWith("/api"));

const cmds = [
  ...(webPkg ? [\`npm run typecheck -w \${webPkg}\`] : []),
  ...(apiPkg ? [\`npm run typecheck -w \${apiPkg}\`] : []),
  "npm run lint",
  "npm run test -ws --if-present",
  "npm run build -ws --if-present",
];

for (const c of cmds) {
  console.log(\`\\n> \${c}\`);
  execSync(c, { stdio: "inherit" });
}

console.log("\\n\\u2713 verify passed \u2014 all layers integrated");
`);

// 6. Copy opencode skills
console.log('\n🛠️  Copying opencode skills...');
copy('.opencode/skills/perf-check', '.opencode/skills/perf-check');
copy('.opencode/skills/code-review', '.opencode/skills/code-review');
copy('.opencode/skills/project-bootstrap', '.opencode/skills/project-bootstrap');
copy('.opencode/skills/free-claude-code', '.opencode/skills/free-claude-code');

// 7. Create apps/web
console.log('\n🌐 Creating apps/web...');
write('apps/web/package.json', `{
  "name": "@${SCOPE}/web",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "vitest run",
    "lint": "oxlint --type-aware --type-check"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "@phosphor-icons/react": "^2.1.7"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "vite": "^8.0.0",
    "vitest": "^4.1.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.6.0",
    "jsdom": "^26.0.0",
    "typescript": "^5.7.3"
  }
}`);

write('apps/web/tsconfig.json', `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": ".",
    "jsx": "react-jsx",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src", "vite.config.ts"],
  "references": [{ "path": "../../packages/shared" }]
}`);

write('apps/web/vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
  test: { environment: 'jsdom', globals: true, include: ['src/**/*.test.{ts,tsx}'] },
  build: { target: 'es2015', modulePreload: { polyfill: false }, cssMinify: 'lightningcss' }
} as import('vite').UserConfig);
`);

write('apps/web/tailwind.config.ts', `import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
} satisfies Config;`);

write('apps/web/index.html', `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${PROJECT_NAME}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`);

write('apps/web/src/main.tsx', `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

write('apps/web/src/index.css', `@import "tailwindcss";

@theme {
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: var(--font-sans);
}`);

write('apps/web/src/css.d.ts', `declare module "*.css" {
  const content: string;
  export default content;
}`);

write('apps/web/src/App.tsx', `export default function App() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">${PROJECT_NAME}</h1>
      <p className="text-gray-600">Web app ready. Run \`npm run dev\` to start.</p>
    </main>
  );
}`);

write('apps/web/src/App.test.tsx', `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  it('renders project name', () => {
    render(<App />);
    expect(screen.getByText('${PROJECT_NAME}')).toBeInTheDocument();
  });
});`);

// 8. Create apps/api
console.log('\n🔌 Creating apps/api...');
write('apps/api/package.json', `{
  "name": "@${SCOPE}/api",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc --noEmit -p tsconfig.json",
    "test": "vitest run",
    "deploy": "wrangler deploy"
  },
  "dependencies": {
    "hono": "^4.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@hono/node-server": "^1.13.0",
    "@types/node": "^26.2.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.3",
    "vitest": "^4.1.0",
    "wrangler": "^3.0.0"
  }
}`);

write('apps/api/tsconfig.json', `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "include": ["src"],
  "references": [{ "path": "../../packages/shared" }]
}`);

write('apps/api/src/index.ts', `import { Hono } from 'hono';
import { health } from './routes/health.js';

const app = new Hono()
  .route('/api', health);

export default app;

declare global {
  interface ImportMeta {
    env: { MODE: string };
  }
}

function isWorkerEnv(): boolean {
  try {
    return import.meta.env.MODE === 'worker';
  } catch {
    return false;
  }
}

if (!isWorkerEnv()) {
  const { serve } = await import('@hono/node-server');
  serve({ fetch: app.fetch, port: 3000 });
  console.log('API running on http://localhost:3000');
}`);

write('apps/api/src/routes/health.ts', `import { Hono } from 'hono';

export const health = new Hono().get(
  '/health',
  (c) => c.json({ status: 'ok' as const, timestamp: new Date().toISOString() })
);`);

write('apps/api/src/index.test.ts', `import { describe, it, expect } from 'vitest';
import app from './index.js';

describe('API', () => {
  it('GET /api/health returns ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
  });
});`);

// 9. Create packages/shared
console.log('\n📚 Creating packages/shared...');
write('packages/shared/package.json', `{
  "name": "@${PROJECT_NAME.replace(/[^a-z0-9-]/g, '-')}/shared",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./types": { "import": "./dist/types/index.js", "types": "./dist/types/index.d.ts" },
    "./schemas": { "import": "./dist/schemas/index.js", "types": "./dist/schemas/index.d.ts" }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "devDependencies": {
    "typescript": "^5.7.3",
    "vitest": "^4.1.0",
    "zod": "^3.23.0"
  }
}`);

write('packages/shared/tsconfig.json', `{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "composite": true
  },
  "include": ["src"]
}`);

write('packages/shared/src/index.test.ts', `import { describe, it, expect } from 'vitest';
import { userSchema } from './schemas';

describe('shared schemas', () => {
  it('validates user schema', () => {
    const result = userSchema.safeParse({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      name: 'Test User',
      createdAt: new Date().toISOString(),
    });
    expect(result.success).toBe(true);
  });
});`);

write('packages/shared/src/types/index.ts', `export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}`);

write('packages/shared/src/schemas/index.ts', `import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1).max(100),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof userSchema>;

export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema.nullable(),
    error: z.string().nullable(),
  });`);

// 10. README
write('README.md', `# ${PROJECT_NAME}

Integrated monorepo: Vite 8 + React 19 + Tailwind v4 (web) + Hono 4 edge-ready API, unified Oxlint/Oxfmt/tooling, web-vitals budgets, and agent skills. One \`npm run verify\` proves the stack.

## Architecture

\`\`\`
npm workspaces (pnpm-ready)
├── apps/web      Vite 8 + React 19 + Tailwind v4, Rolldown, web-vitals RUM
│                 code-split lazy hydration, PerfImage (fetchPriority high)
├── apps/api      Hono 4 + Zod + hono/client RPC, WinterCG (Node ↔ Workers)
├── packages/shared  shared types (future)
├── scripts/verify.mjs  typecheck → lint → test → build (fail-fast)
└── .opencode/skills  perf-check, code-review, project-bootstrap, free-claude-code
\`\`\`

## Quick Start

\`\`\`bash
npm install          # install all workspaces
npm run dev          # concurrently api (3000) + web (5173)
npm run verify       # typecheck + lint + test + build — must exit 0
\`\`\`

## Spec-Driven Development

\`\`\`bash
npm run spec:feature "Add user authentication" -ShortName "user-auth"
# Then use slash commands in opencode:
# /speckit.specify → /speckit.plan → /speckit.tasks → /speckit.implement
\`\`\`**`);

// 11. Initialize git and install
console.log('\n🔧 Initializing git & installing dependencies...');
run('git init');
run('npm install');

console.log('\n🔧 Initializing spec-kit...');
try {
  run('npm run spec:init');
  run('npm run spec:check');
  run('uvx --from git+https://github.com/github/spec-kit.git specify extension add git');
} catch {
  console.log('  ⚠️  spec-kit init failed (uvx may need auth), run manually: npm run spec:init');
}

console.log('\n✅ Running verify...');
try {
  run('npm run verify');
  console.log('\n🎉 Project bootstrapped successfully!');
  console.log(`\nNext steps:`);
  console.log(`  cd ${PROJECT_NAME}`);
  console.log(`  npm run dev        # start dev servers`);
  console.log(`  npm run spec:feature "Your feature" -ShortName "short-name"`);
} catch {
  console.log('\n⚠️  Verify failed - check output above');
  console.log(`Run \`cd ${PROJECT_NAME} && npm run verify\` to debug`);
}