#!/usr/bin/env node
// backup.mjs — full project snapshot + git bundle → local backups/ + OneDrive/Backups
// Usage: npm run backup  |  node scripts/backup.mjs [--one-drive-only] [--keep 14]
import { spawnSync, execSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import os from "node:os";

const ROOT = resolve(join(import.meta.dirname, ".."));
const STAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19); // 2026-08-24T05-30-00
const DATE = new Date().toISOString().slice(0, 10);
let KEEP = 14;
{
  const kEq = process.argv.find((a) => a.startsWith("--keep="))?.split("=")[1];
  const kIdx = process.argv.indexOf("--keep");
  const kVal = kEq ?? (kIdx !== -1 ? process.argv[kIdx + 1] : undefined);
  const n = Number(kVal);
  if (Number.isFinite(n) && n > 0) KEEP = n;
}
const ONE_DRIVE = join(os.homedir(), "OneDrive", "Backups", "Default-Project");
const LOCAL_BACKUPS = join(ROOT, "backups");
const PROJECT_NAME = "Default-Project";

function sh(cmd, opts = {}) {
  const r = spawnSync("powershell", ["-Command", cmd], { stdio: "inherit", cwd: ROOT, ...opts });
  return r.status === 0;
}
function git(cmd) {
  try { return execSync(cmd, { cwd: ROOT, encoding: "utf8" }).trim(); } catch { return ""; }
}

mkdirSync(LOCAL_BACKUPS, { recursive: true });
mkdirSync(ONE_DRIVE, { recursive: true });

// 1) git bundle — full history, restores even if .git is deleted
const bundleName = `bundle_${DATE}_${git("git rev-parse --short HEAD") || "no-git"}.bundle`;
const bundleLocal = join(LOCAL_BACKUPS, bundleName);
const bundleOD = join(ONE_DRIVE, bundleName);
try {
  execSync(`git bundle create "${bundleLocal}" --all`, { cwd: ROOT, stdio: "inherit" });
  console.log(`✓ bundle → ${bundleLocal}`);
  spawnSync("powershell", ["-Command", `Copy-Item -LiteralPath "${bundleLocal}" -Destination "${bundleOD}" -Force; Write-Host "✓ bundle → ${bundleOD}"`], { stdio: "inherit" });
} catch (e) {
  console.warn("⚠ git bundle failed (no commits?):", e.message);
}

// 2) full snapshot zip — excludes heavy/regeneratable dirs
// We stage a temp list via robocopy-style copy to avoid node_modules/dist
const zipName = `${PROJECT_NAME}_${STAMP}.zip`;
const zipLocal = join(LOCAL_BACKUPS, zipName);
const zipOD = join(ONE_DRIVE, zipName);
const excludeDirs = ["node_modules", "dist", "out", ".turbo", ".next", ".wrangler", ".vercel", "coverage", ".git", "backups"];

console.log(`\n→ creating snapshot ${zipName} ...`);
// Build exclude args for Compress-Archive by copying to temp then zipping
const tmpDir = join(LOCAL_BACKUPS, `.tmp_${STAMP}`);
mkdirSync(tmpDir, { recursive: true });

// Use PowerShell to copy with excludes, then compress
const excludeDirPs = excludeDirs.map((d) => `'${d}'`).join(",");
const psCopy = `
$ErrorActionPreference='SilentlyContinue'
$root='${ROOT.replace(/'/g, "''")}'
$tmp='${tmpDir.replace(/'/g, "''")}'
$excludeDirs=@(${excludeDirPs})
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
Get-ChildItem -LiteralPath $root -Force | ForEach-Object {
  if ($excludeDirs -contains $_.Name) { Write-Host "  skip $($_.Name)/"; return }
  if ($_.PSIsContainer) { Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $tmp $_.Name) -Recurse -Force }
  else {
    if ($_.Name -like '*.log' -or $_.Name -like '*.err' -or $_.Name -eq '.env' -or $_.Name -eq '.env.local') { Write-Host "  skip $($_.Name)"; return }
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $tmp $_.Name) -Force
  }
}
# also copy nested node_modules excludes inside apps/packages if present (already skipped top-level, but nested copy already excluded via recursion skip? ensure)
Get-ChildItem -LiteralPath $tmp -Recurse -Directory -Force | Where-Object { $excludeDirs -contains $_.Name } | ForEach-Object { Remove-Item -LiteralPath $_.FullName -Recurse -Force; Write-Host "  pruned $($_.FullName)" }

# include Local_Math_Vault, content/bank, dev.db if they exist (they were copied above, but ensure dev.db included)
if (Test-Path '${join(ROOT, "apps/api/dev.db").replace(/'/g, "''")}') { Copy-Item -LiteralPath '${join(ROOT, "apps/api/dev.db").replace(/'/g, "''")}' -Destination (Join-Path $tmp 'dev.db') -Force -ErrorAction SilentlyContinue }
`;
if (!sh(psCopy)) {
  console.error("✗ copy to temp failed");
  process.exit(1);
}

const psZip = `Compress-Archive -Path '${tmpDir.replace(/'/g, "''")}\\*' -DestinationPath '${zipLocal.replace(/'/g, "''")}' -Force; Write-Host "✓ zip → ${zipLocal} ($([math]::Round((Get-Item '${zipLocal.replace(/'/g, "''")}').Length/1MB,2)) MB)"`;
if (!sh(psZip)) {
  console.error("✗ zip failed");
  rmSync(tmpDir, { recursive: true, force: true });
  process.exit(1);
}
rmSync(tmpDir, { recursive: true, force: true });

// 3) vault-only zip (legacy compat + extra safety for huge vault)
const vaultZip = join(LOCAL_BACKUPS, `vault_${DATE}.zip`);
const vaultZipOD = join(ONE_DRIVE, `vault_${DATE}.zip`);
const psVault = `
$paths=@()
foreach ($p in @('Local_Math_Vault','content/bank','assets/geometry_templates','apps/api/dev.db')) { if (Test-Path $p) { $paths+=$p } }
if ($paths.Count -gt 0) { Compress-Archive -Path $paths -DestinationPath '${vaultZip.replace(/'/g, "''")}' -Force; Write-Host "✓ vault → ${vaultZip}" ; Copy-Item -LiteralPath '${vaultZip.replace(/'/g, "''")}' -Destination '${vaultZipOD.replace(/'/g, "''")}' -Force; Write-Host "✓ vault → ${vaultZipOD}" }
`;
sh(psVault);

// 4) copy main zip to OneDrive
sh(`Copy-Item -LiteralPath '${zipLocal.replace(/'/g, "''")}' -Destination '${zipOD.replace(/'/g, "''")}' -Force; Write-Host "✓ snapshot → ${zipOD}"`);

// 5) manifest
const manifest = {
  project: PROJECT_NAME,
  stamp: STAMP,
  date: DATE,
  commit: git("git rev-parse HEAD") || null,
  branch: git("git branch --show-current") || null,
  status: git("git status --porcelain") || "clean",
  files: {
    zip: zipName,
    bundle: bundleName,
    vault: `vault_${DATE}.zip`,
  },
  sizes: {},
  oneDrive: ONE_DRIVE,
  local: LOCAL_BACKUPS,
};
try { manifest.sizes.zip = statSync(zipLocal).size; } catch {}
try { manifest.sizes.bundle = statSync(bundleLocal).size; } catch {}
try { manifest.sizes.vault = statSync(vaultZip).size; } catch {}
writeFileSync(join(LOCAL_BACKUPS, `manifest_${STAMP}.json`), JSON.stringify(manifest, null, 2));
writeFileSync(join(ONE_DRIVE, `manifest_${STAMP}.json`), JSON.stringify(manifest, null, 2));
writeFileSync(join(ONE_DRIVE, "latest.json"), JSON.stringify(manifest, null, 2));
console.log(`\n✓ manifest → latest.json`);

// 6) rotation — keep last KEEP zips/bundles/manifests in both locations
function prune(dir) {
  const keep = KEEP;
  const files = readdirSync(dir).filter((f) => f.endsWith(".zip") || f.endsWith(".bundle")).map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t);
  for (const { f } of files.slice(keep)) { rmSync(join(dir, f), { force: true }); console.log(`  pruned ${f} in ${dir}`); }
  const mans = readdirSync(dir).filter((f) => f.startsWith("manifest_")).map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t);
  for (const { f } of mans.slice(keep)) { rmSync(join(dir, f), { force: true }); console.log(`  pruned ${f} in ${dir}`); }
}
prune(LOCAL_BACKUPS);
prune(ONE_DRIVE);

console.log(`\n✅ BACKUP DONE
  local:    ${zipLocal}
  OneDrive: ${zipOD}
  bundle:   ${bundleOD}
  keep:     last ${KEEP} snapshots (pruned older)
  restore:  npm run backup:restore   or   node scripts/restore.mjs --list
  revert:   git log --oneline  +  git checkout <commit>  (or unzip snapshot)
`);
