#!/usr/bin/env node
// deploy.mjs — wrangler + Pages (dry-run if no token)
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

console.log("=== DEPLOY ===\n1. Web: Cloudflare Pages (apps/web/dist)");
if (existsSync("apps/web/dist/index.html")) console.log("✓ web build exists");
else { console.log("✗ run npm run build first"); process.exit(1); }

console.log("\n2. API: wrangler deploy");
let r = spawnSync("npx", ["wrangler", "deploy", "--dry-run"], { cwd: "apps/api", stdio: "pipe", encoding: "utf8", shell: true });
if (r.stdout?.includes("dry run") || r.status === 0) console.log("✓ wrangler dry-run ok (set TURSO_DATABASE_URL + CLOUDFLARE_API_TOKEN to actually deploy)");
else console.log(`→ ${r.stderr?.slice(0, 400) ?? "wrangler not authenticated — run: wrangler login && wrangler secret put TURSO_DATABASE_URL"}`);

console.log("\nNext:");
console.log("  npx wrangler deploy --cwd apps/api");
console.log("  npx wrangler pages deploy apps/web/dist --project-name math-academy");
console.log("  # or Vercel: vercel --prod");
