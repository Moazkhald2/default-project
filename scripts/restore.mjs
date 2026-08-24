#!/usr/bin/env node
// restore.mjs — list & restore backups from local backups/ or OneDrive/Backups
// Usage:
//   node scripts/restore.mjs --list              # list all snapshots
//   node scripts/restore.mjs --latest            # info about latest
//   node scripts/restore.mjs --restore vault_2026-08-24.zip
//   node scripts/restore.mjs --restore Default-Project_2026-08-24T05-30-00.zip --dry
//   node scripts/restore.mjs --bundle bundle_2026-08-24_abc123.bundle
import { existsSync, readdirSync, statSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import os from "node:os";

const ROOT = resolve(join(import.meta.dirname, ".."));
const ONE_DRIVE = join(os.homedir(), "OneDrive", "Backups", "Default-Project");
const LOCAL = join(ROOT, "backups");
const args = process.argv.slice(2);
const isList = args.includes("--list") || args.includes("-l");
const isLatest = args.includes("--latest");
const dry = args.includes("--dry");
const restoreIdx = args.indexOf("--restore");
const bundleIdx = args.indexOf("--bundle");
const restoreFile = restoreIdx !== -1 ? args[restoreIdx + 1] : null;
const bundleFile = bundleIdx !== -1 ? args[bundleIdx + 1] : null;

function listDir(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".zip") || f.endsWith(".bundle") || f.startsWith("manifest_"))
    .map((f) => {
      const p = join(dir, f);
      try { const s = statSync(p); return { name: f, path: p, dir, sizeMB: (s.size / 1024 / 1024).toFixed(2), mtime: s.mtime.toISOString().slice(0, 19).replace("T", " ") }; } catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => b.mtime.localeCompare(a.mtime));
}

if (isList || (!restoreFile && !bundleFile && !isLatest)) {
  console.log(`\n📦 LOCAL  → ${LOCAL}`);
  for (const f of listDir(LOCAL)) console.log(`  ${f.mtime}  ${f.sizeMB.padStart(7)} MB  ${f.name}`);
  if (!listDir(LOCAL).length) console.log("  (empty — run npm run backup)");
  console.log(`\n☁️  OneDrive → ${ONE_DRIVE}`);
  for (const f of listDir(ONE_DRIVE)) console.log(`  ${f.mtime}  ${f.sizeMB.padStart(7)} MB  ${f.name}`);
  if (!listDir(ONE_DRIVE).length) console.log("  (empty)");
  if (existsSync(join(ONE_DRIVE, "latest.json"))) {
    console.log("\n📋 latest.json:");
    console.log(readFileSync(join(ONE_DRIVE, "latest.json"), "utf8"));
  }
  console.log(`\nUsage:
  node scripts/restore.mjs --list
  node scripts/restore.mjs --restore <zip> [--dry]   # unzip snapshot over project (excludes node_modules)
  node scripts/restore.mjs --bundle <bundle>         # git clone from bundle
  npm run backup:restore -- --list
`);
  process.exit(0);
}

if (isLatest) {
  const p = existsSync(join(ONE_DRIVE, "latest.json")) ? join(ONE_DRIVE, "latest.json") : join(LOCAL, readdirSync(LOCAL).filter(f=>f.startsWith("manifest_")).sort().pop()||"");
  if (existsSync(p)) console.log(readFileSync(p, "utf8")); else console.log("no manifest found");
  process.exit(0);
}

function findFile(name) {
  for (const d of [LOCAL, ONE_DRIVE]) {
    const p = join(d, name);
    if (existsSync(p)) return p;
  }
  // also allow full path
  if (existsSync(name)) return name;
  return null;
}

if (restoreFile) {
  const src = findFile(restoreFile);
  if (!src) { console.error(`✗ not found: ${restoreFile}\n  checked ${LOCAL} and ${ONE_DRIVE}`); process.exit(1); }
  console.log(`\n→ restoring ${src}`);
  console.log(`  dest: ${ROOT}`);
  if (dry) { console.log("  (dry run — no files written)"); process.exit(0); }
  console.log("  This will OVERWRITE files in the project (node_modules/.git/backups are preserved). Continue? (y/N)");
  // non-interactive: require --force
  if (!args.includes("--force")) {
    console.log("  Add --force to actually restore, or --dry to preview.");
    console.log(`  Example: node scripts/restore.mjs --restore "${restoreFile}" --force`);
    process.exit(0);
  }
  const ps = `Expand-Archive -LiteralPath '${src.replace(/'/g, "''")}' -DestinationPath '${ROOT.replace(/'/g, "''")}' -Force; Write-Host "✓ restored ${restoreFile} → ${ROOT}"`;
  const r = spawnSync("powershell", ["-Command", ps], { stdio: "inherit" });
  process.exit(r.status ?? 0);
}

if (bundleFile) {
  const src = findFile(bundleFile);
  if (!src) { console.error(`✗ bundle not found: ${bundleFile}`); process.exit(1); }
  console.log(`\n→ verifying bundle ${src}`);
  spawnSync("git", ["bundle", "verify", src], { stdio: "inherit", cwd: ROOT });
  console.log(`\nTo restore full git history from bundle:\n  git clone "${src}" restored-project\n  # or\n  git fetch "${src}" --all\n`);
}
