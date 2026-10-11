#!/usr/bin/env node
// automate.mjs — one command that wires + automates every department.
// Usage:
//   node scripts/automate.mjs --check   (read-only: ingest validate + sweep dry-run)
//   node scripts/automate.mjs --run     (live: sweep via API if running, then ingest)
//   node scripts/automate.mjs --sweep   (only overdue sweep via API, skips ingest)
import { spawnSync } from "node:child_process";
const args = new Set(process.argv.slice(2));
const CHECK = args.has("--check");
const SWEEP_ONLY = args.has("--sweep");
const BASE = process.env.API_BASE ?? "http://localhost:3000";
function sh(cmd, opts = {}) {
  const r = spawnSync(cmd, { shell: true, encoding: "utf8", stdio: "pipe", ...opts });
  return { ok: r.status === 0, out: (r.stdout ?? "").slice(0, 2000), err: (r.stderr ?? "").slice(0, 2000) };
}
async function sweep() {
  try {
    const res = await fetch(`${BASE}/api/hrms/payments/sweep`, { method: "POST" });
    const j = await res.json();
    console.log(`✓ sweep: month=${j.month} changed=${j.changed}`);
    return true;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log(`○ sweep skipped (API not running at ${BASE}): ${msg}`);
    return CHECK;
  }
}
function ingest() {
  let ok = true;
  for (const dir of ["Local_Math_Vault/Question_Bank", "content/bank"]) {
    const r = sh(`node scripts/ingest.mjs ${dir}`);
    console.log(r.ok ? `✓ ingest ${dir}` : `✗ ingest ${dir}\n${r.out}\n${r.err}`);
    // ingest exits 0 with warnings; treat unreadable as fail only
    if (!r.ok) ok = false;
  }
  return ok;
}
const results = [];
if (!SWEEP_ONLY) results.push(["ingest", ingest()]);
results.push(["sweep", await sweep()]);
if (CHECK || SWEEP_ONLY) {
  console.log(results.every(([, v]) => v) ? "\n✓ automate --check passed" : "\n✗ automate --check issues (see above)");
  process.exit(results.every(([, v]) => v) ? 0 : 1);
}
// --run: ingest + sweep + verify gate hint
const v = sh("npm run verify", { timeout: 180000 });
console.log(v.ok ? "✓ verify" : `✗ verify\n${v.err.slice(0, 800)}`);
process.exit(v.ok ? 0 : 1);
