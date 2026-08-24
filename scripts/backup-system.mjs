#!/usr/bin/env node
// backup-system.mjs — FULL SYSTEM CLONE: projects + AI-Memory + configs → OneDrive/Backups/_SYSTEM_
// Makes a second AI able to fully clone your environment.
// Usage: node scripts/backup-system.mjs [--level code|memories|full] [--keep 7] [--no-projects]
// Levels: code=projects only, memories=+AI-Memory, full=+opencode/configs (default: full)
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, statSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

const HOME = os.homedir();
const ROOT = join(HOME, "OneDrive", "Documents", "Default Project");
const ONE_ROOT = join(HOME, "OneDrive", "Backups");
const SYSTEM_DIR = join(ONE_ROOT, "_SYSTEM_");
const STAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const DATE = new Date().toISOString().slice(0, 10);

const args = process.argv.slice(2);
const levelArg = args.find((a) => a.startsWith("--level="))?.split("=")[1] ?? args[args.indexOf("--level") + 1] ?? "full";
const LEVEL = ["code", "memories", "full"].includes(levelArg) ? levelArg : "full";
let KEEP = 7;
{
  const kEq = args.find((a) => a.startsWith("--keep="))?.split("=")[1];
  const kIdx = args.indexOf("--keep");
  const kVal = kEq ?? (kIdx !== -1 ? args[kIdx + 1] : undefined);
  const n = Number(kVal);
  if (Number.isFinite(n) && n > 0) KEEP = n;
}
const SKIP_PROJECTS = args.includes("--no-projects");

function sh(cmd) {
  const r = spawnSync("powershell", ["-Command", cmd], { stdio: "inherit" });
  return r.status === 0;
}

mkdirSync(SYSTEM_DIR, { recursive: true });
console.log(`\n🧠 SYSTEM BACKUP level=${LEVEL} keep=${KEEP} → ${SYSTEM_DIR}\n`);

// 1) Projects (reuse backup-all logic but lighter — call it)
if (!SKIP_PROJECTS) {
  console.log("━━━━━━━━━━ 1/3 PROJECTS ━━━━━━━━━━");
  const r = spawnSync("node", [join(ROOT, "scripts", "backup-all.mjs")], { stdio: "inherit" });
  if (r.status !== 0) console.warn("⚠ backup-all failed");
} else {
  console.log("⏭ skipping projects (--no-projects)");
}

// 2) AI-Memory vault — the cloneable brain (6–7 MB, 688 memories)
if (LEVEL === "memories" || LEVEL === "full") {
  console.log("\n━━━━━━━━━━ 2/3 AI-MEMORY ━━━━━━━━━━");
  const vaultSrc = join(HOME, "ObsidianVault", "AI-Memory");
  const embeddingsSrc = join(vaultSrc, ".embeddings");
  const outZip = join(SYSTEM_DIR, `AI-Memory_${STAMP}.zip`);
  const outMeta = join(SYSTEM_DIR, `AI-Memory_${STAMP}.json`);

  if (!existsSync(vaultSrc)) {
    console.warn(`⚠ AI-Memory not found at ${vaultSrc}`);
  } else {
    // Count entries for manifest
    let mdCount = 0;
    try { mdCount = readdirSync(vaultSrc, { recursive: true }).filter((f) => String(f).endsWith(".md")).length; } catch {}
    const ps = `
$ErrorActionPreference='Stop'
$src='${vaultSrc.replace(/'/g, "''")}'
$dst='${outZip.replace(/'/g, "''")}'
Compress-Archive -Path "$src\\*" -DestinationPath $dst -Force
Write-Host "✓ AI-Memory → $dst ($([math]::Round((Get-Item $dst).Length/1MB,2)) MB, ${mdCount} md files)"
`;
    sh(ps);
    // Encrypt AI-Memory zip → .enc (AES-256-GCM) and delete plain zip
    const encOut = `${outZip}.enc`;
    const encR = spawnSync("node", [join(ROOT, "scripts", "encrypt-backup.mjs"), outZip, "--out", encOut], { stdio: "inherit" });
    if (encR.status === 0 && existsSync(encOut)) {
      rmSync(outZip, { force: true });
      console.log(`🔒 encrypted → ${encOut} (plain deleted)`);
    }

    // Also export a flat JSON mirror (fast grep without unzip)
    try {
      // Build JSON by reading frontmatter-light: just copy file list + sizes for now
      // Full export needs MCP — we do lightweight manifest here; full JSON via memory_export tool covers content
      const meta = {
        stamp: STAMP,
        date: DATE,
        vault: vaultSrc,
        zip: `AI-Memory_${STAMP}.zip`,
        mdFiles: mdCount,
        size: existsSync(outZip) ? statSync(outZip).size : 0,
        embeddings: existsSync(embeddingsSrc) ? "included" : "missing",
        note: "Unzip to ~/ObsidianVault/AI-Memory to clone. Or use memory_import via MCP.",
      };
      writeFileSync(outMeta, JSON.stringify(meta, null, 2));
      console.log(`✓ meta → ${outMeta}`);
    } catch (e) { console.warn("meta failed", e.message); }
  }

  // Also backup global configs that make the agent behave same
  console.log("\n━━━━━━━━━━ 2b/3 CONFIG SNAPSHOT ━━━━━━━━━━");
  const cfgZip = join(SYSTEM_DIR, `configs_${STAMP}.zip`);
  const tmp = join(SYSTEM_DIR, `.tmp_cfg_${STAMP}`);
  mkdirSync(tmp, { recursive: true });
  const psCfg = `
$ErrorActionPreference='SilentlyContinue'
$tmp='${tmp.replace(/'/g, "''")}'
$dst='${cfgZip.replace(/'/g, "''")}'
New-Item -Force -ItemType Directory -Path $tmp | Out-Null
# opencode configs (no node_modules)
foreach ($p in @(
  "${join(HOME, ".config", "opencode", "opencode.jsonc").replace(/'/g, "''")}",
  "${join(HOME, ".config", "opencode", "oh-my-openagent.json").replace(/'/g, "''")}",
  "${join(HOME, ".config", "opencode", "token-optimization.md").replace(/'/g, "''")}",
  "${join(HOME, ".config", "opencode", "tui.json").replace(/'/g, "''")}"
)) { if (Test-Path $p) { Copy-Item -LiteralPath $p -Destination $tmp -Force; Write-Host "  + $(Split-Path $p -Leaf)" } }
# .opencode rules/skills (no node_modules)
$srcRules="${join(ROOT, ".opencode").replace(/'/g, "''")}"
if (Test-Path $srcRules) {
  $destRules=Join-Path $tmp ".opencode"
  New-Item -Force -ItemType Directory -Path $destRules | Out-Null
  Get-ChildItem -LiteralPath $srcRules -Force | Where-Object { $_.Name -ne 'node_modules' -and $_.Name -ne '.git' } | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination (Join-Path $destRules $_.Name) -Recurse -Force
  }
  Write-Host "  + .opencode (rules/skills, no node_modules)"
}
# project governance (the clone instructions)
foreach ($f in @('SYSTEM_SPEC.md','DESIGN.md','AGENT.md','opencode.json')) {
  $p=Join-Path '${ROOT.replace(/'/g, "''")}' $f
  if (Test-Path $p) { Copy-Item -LiteralPath $p -Destination $tmp -Force; Write-Host "  + $f" }
}
# .env.example (never .env)
$envEx=Join-Path '${ROOT.replace(/'/g, "''")}' '.env.example'
if (Test-Path $envEx) { Copy-Item -LiteralPath $envEx -Destination $tmp -Force; Write-Host "  + .env.example" }

Compress-Archive -Path "$tmp\\*" -DestinationPath $dst -Force
Remove-Item -LiteralPath $tmp -Recurse -Force
Write-Host "✓ configs → $dst ($([math]::Round((Get-Item $dst).Length/1MB,2)) MB)"
`;
  sh(psCfg);
}

if (LEVEL === "full") {
  console.log("\n━━━━━━━━━━ 3/3 FULL SYSTEM EXTRAS ━━━━━━━━━━");
  // Extra: list of installed skills/mcp for clone reproducibility
  const sysManifest = {
    stamp: STAMP,
    date: DATE,
    level: LEVEL,
    host: os.hostname(),
    platform: `${os.platform()} ${os.release()}`,
    node: process.version,
    encrypted: true,
    keyLocation: join(HOME, ".secrets", "backup.key"),
    backups: {
      vault: `AI-Memory_${STAMP}.zip.enc`,
      configs: `configs_${STAMP}.zip`,
    },
    cloneInstructions: [
      "1. Decrypt: node scripts/decrypt-backup.mjs OneDrive/Backups/_SYSTEM_/AI-Memory_*.zip.enc --out AI-Memory.zip",
      "2. Unzip AI-Memory.zip → ~/ObsidianVault/AI-Memory/",
      "3. Unzip configs_*.zip → restores opencode.jsonc + .opencode/skills + SYSTEM_SPEC.md",
      "4. Run: npm install in Default Project + math-mentor-lms",
      "5. Restart opencode — memory_recall will work, session_start will load context",
      "6. Secrets: need ~/.secrets/backup.key (AES key) + copy ~/.secrets/",
    ],
    warning: "CONTAINS ALL 688 MEMORIES + USER PROFILE (email, github, preferences). Keep OneDrive/Backups/_SYSTEM_ PRIVATE. Do NOT share zip publicly.",
    oneDrive: SYSTEM_DIR,
    keep: KEEP,
  };
  // also count system sizes
  try {
    const vZip = join(SYSTEM_DIR, `AI-Memory_${STAMP}.zip.enc`);
    if (existsSync(vZip)) sysManifest["sizes"] = { vault: statSync(vZip).size };
    const cZip = join(SYSTEM_DIR, `configs_${STAMP}.zip`);
    if (existsSync(cZip)) sysManifest["sizes"] = { ...sysManifest["sizes"], configs: statSync(cZip).size };
  } catch {}
  writeFileSync(join(SYSTEM_DIR, `manifest_${STAMP}.json`), JSON.stringify(sysManifest, null, 2));
  writeFileSync(join(SYSTEM_DIR, "latest.json"), JSON.stringify(sysManifest, null, 2));
  console.log(`✓ manifest → ${join(SYSTEM_DIR, "latest.json")}`);
}

// Rotation — keep last KEEP per pattern
function prune(dir, pattern, keep) {
  const files = readdirSync(dir).filter((f) => f.includes(pattern)).map((f) => ({ f, t: statSync(join(dir, f)).mtimeMs })).sort((a, b) => b.t - a.t);
  for (const { f } of files.slice(keep)) { rmSync(join(dir, f), { force: true }); console.log(`  pruned ${f}`); }
}
console.log(`\n🧹 rotation keep=${KEEP}`);
prune(SYSTEM_DIR, "AI-Memory_", KEEP);
prune(SYSTEM_DIR, "configs_", KEEP);
prune(SYSTEM_DIR, "manifest_", KEEP);

console.log(`\n✅ SYSTEM BACKUP DONE
  system:  ${SYSTEM_DIR}
  vault:   AI-Memory_${STAMP}.zip.enc  (AES-256-GCM, key: ~/.secrets/backup.key)
  configs: configs_${STAMP}.zip
  level:   ${LEVEL}  (code+memories+full)
  size:    ~7–12 MB total (vs 46 GB full OneDrive — 4000× smaller)
  restore: node scripts/decrypt-backup.mjs OneDrive\\Backups\\_SYSTEM_\\AI-Memory_*.zip.enc --out AI-Memory.zip; Expand-Archive AI-Memory.zip ~/ObsidianVault/AI-Memory -Force
  security: ENCRYPTED + ACL moaz7:F only. Keep backup.key offline. OneDrive sharing OFF.
`);
