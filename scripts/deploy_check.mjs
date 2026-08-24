#!/usr/bin/env node
// deploy_check.mjs — pre-deploy gate for business
import { spawnSync } from "node:child_process";
console.log("=== DEPLOY CHECK ===\n");
const checks = [
  ["vault", "node scripts/ingest.mjs Local_Math_Vault/Question_Bank"],
  ["typst", "powershell -ExecutionPolicy Bypass -File scripts/fast_build.ps1 -InputFile templates/sheet.typ -OutputFile templates/sheet.pdf"],
  ["web build", "npm run build -w @app/web"],
  ["api build", "npm run build -w @app/api"],
];
let ok = true;
for (const [name, cmd] of checks) {
  const r = spawnSync(cmd, { shell: true, stdio: "pipe", encoding: "utf8" });
  if (r.status === 0) console.log(`✓ ${name}`);
  else { console.log(`✗ ${name}\n${r.stderr?.slice(0, 400)}`); ok = false; }
}
console.log(ok ? "\n✓ Deploy ready — web: Cloudflare Pages (apps/web/dist), api: wrangler deploy" : "\n✗ Fix before deploy");
process.exit(ok ? 0 : 1);
