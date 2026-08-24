#!/usr/bin/env node
// backup-all.mjs — backup EVERY project to OneDrive/Backups/<project>/
// Discovers: Default Project, math-mentor-lms, ~/projects/*, ~/OneDrive/Documents/* with .git
import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { spawnSync, execSync } from "node:child_process";
import os from "node:os";

const HOME = os.homedir();
const ONE_DRIVE_ROOT = join(HOME, "OneDrive", "Backups");
const CANDIDATES = [
  join(HOME, "OneDrive", "Documents", "Default Project"),
  join(HOME, "OneDrive", "Documents", "math-mentor-lms"),
];

// discover ~/projects/*
const projectsDir = join(HOME, "projects");
if (existsSync(projectsDir)) {
  for (const d of readdirSync(projectsDir)) {
    const p = join(projectsDir, d);
    try { if (statSync(p).isDirectory()) CANDIDATES.push(p); } catch {}
  }
}
// discover OneDrive/Documents/* that look like projects (has .git or package.json)
const docs = join(HOME, "OneDrive", "Documents");
if (existsSync(docs)) {
  for (const d of readdirSync(docs)) {
    const p = join(docs, d);
    if (CANDIDATES.includes(p)) continue;
    try {
      if (!statSync(p).isDirectory()) continue;
      if (existsSync(join(p, ".git")) || existsSync(join(p, "package.json"))) CANDIDATES.push(p);
    } catch {}
  }
}

console.log("🔍 Discovered projects:");
for (const c of CANDIDATES) console.log(`  - ${c} ${existsSync(c) ? "" : "(missing)"}`);

mkdirSync(ONE_DRIVE_ROOT, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);

for (const proj of CANDIDATES) {
  if (!existsSync(proj)) continue;
  const name = proj.split(/[\\/]/).pop().replace(/\s+/g, "-");
  const dest = join(ONE_DRIVE_ROOT, name);
  mkdirSync(dest, { recursive: true });
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📦 ${name}  →  ${dest}`);

  // 1) git bundle if it's a git repo
  if (existsSync(join(proj, ".git"))) {
    try {
      const short = execSync("git rev-parse --short HEAD", { cwd: proj, encoding: "utf8" }).trim();
      const bundle = join(dest, `bundle_${stamp}_${short}.bundle`);
      execSync(`git bundle create "${bundle}" --all`, { cwd: proj, stdio: "inherit" });
      console.log(`  ✓ bundle → ${bundle}`);
    } catch (e) { console.log(`  ⚠ bundle skip: ${e.message}`); }
  }

  // 2) zip snapshot (exclude node_modules/dist/.git/backups)
  const zip = join(dest, `${name}_${stamp}.zip`);
  // Use the project's own backup.mjs if it exists and is Default Project, else generic zip
  if (proj.includes("Default Project") && existsSync(join(proj, "scripts", "backup.mjs"))) {
    console.log(`  → running npm run backup in ${proj}`);
    spawnSync("node", [join(proj, "scripts", "backup.mjs")], { stdio: "inherit", cwd: proj });
  } else {
    const ps = `
$ErrorActionPreference='SilentlyContinue'
$root='${proj.replace(/'/g, "''")}'
$zip='${zip.replace(/'/g, "''")}'
$exclude=@('node_modules','dist','out','.turbo','.next','.wrangler','.vercel','coverage','.git','backups')
$tmp=Join-Path $env:TEMP "bk_${name}_${stamp}"
if (Test-Path $tmp) { Remove-Item -LiteralPath $tmp -Recurse -Force }
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Get-ChildItem -LiteralPath $root -Force | ForEach-Object {
  if ($exclude -contains $_.Name) { return }
  if ($_.PSIsContainer) { Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $tmp $_.Name) -Recurse -Force }
  else { if ($_.Name -like '*.log' -or $_.Name -eq '.env' -or $_.Name -eq '.env.local') { return }; Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $tmp $_.Name) -Force }
}
Compress-Archive -Path "$tmp\\*" -DestinationPath $zip -Force
Remove-Item -LiteralPath $tmp -Recurse -Force
Write-Host "  ✓ zip → $zip ($([math]::Round((Get-Item $zip).Length/1MB,2)) MB)"
`;
    spawnSync("powershell", ["-Command", ps], { stdio: "inherit" });
  }
}

console.log(`\n✅ ALL PROJECTS BACKED UP → ${ONE_DRIVE_ROOT}`);
console.log(`   Revert: open OneDrive\\Backups\\<project>\\ and unzip, or git clone bundle`);
