#requires -Version 5.1
<#
.SYNOPSIS
  Bootstrap "The Math Mentor" system + this OpenCode agent config on a fresh Windows device.

.DESCRIPTION
  Idempotent: safe to re-run. Skips anything already present.
  Steps:
    1. Prereq check (git, node>=24, npm>=11, python, typst)
    2. Project setup (npm install, git hooks, .env)
    3. Agent brain install (agent-kit/opencode-config -> %USERPROFILE%\.config\opencode + path patching)
    4. Memory MCP server (clone + build obsidian-memory-layer-mcp) and vault check
    5. Verify gate (npm run verify)
    6. Manual checklist printout (API keys etc. - never automated)

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1
  powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1 -DryRun
  powershell -ExecutionPolicy Bypass -File agent-kit\bootstrap.ps1 -ForceConfig   # re-copy agent config over existing one
#>
param(
  [switch]$DryRun,
  [switch]$ForceConfig
)

$ErrorActionPreference = 'Stop'
$KitDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$Root   = Split-Path -Parent $KitDir
$U      = $env:USERPROFILE
$script:Fatal = @()
$script:Warn  = @()

function Step($n, $msg) { Write-Host "`n=== [$n/6] $msg ===" -ForegroundColor Cyan }
function Info($m)       { Write-Host "  $m" }
function Good($m)       { Write-Host "  [OK] $m" -ForegroundColor Green }
function WarnItem($m)   { Write-Host "  [WARN] $m" -ForegroundColor Yellow; $script:Warn += $m }
function FailItem($m)   { Write-Host "  [FAIL] $m" -ForegroundColor Red;   $script:Fatal += $m }
function RunCmd([string]$exe, [string[]]$args, [string]$desc, [string]$cwd = $Root) {
  if ($DryRun) { Info "[DRY] $desc"; return }
  Push-Location $cwd
  try {
    & $exe @args
    if ($LASTEXITCODE -ne 0) { FailItem "$desc (exit $LASTEXITCODE)"; return }
    Good $desc
  } finally { Pop-Location }
}
function Have([string]$cmd) { return [bool](Get-Command $cmd -ErrorAction SilentlyContinue) }

Write-Host @"
=============================================================
 THE MATH MENTOR - bootstrap kit
 root:   $Root
 dryrun: $DryRun
=============================================================
"@ -ForegroundColor Magenta

# ---------- 1. PREREQS ----------
Step 1 "Prerequisites"
$wingetHints = @()
if (Have 'git')  { Good "git" }  else { FailItem 'git missing';        $wingetHints += 'winget install Git.Git' }
if (Have 'node') {
  $nv = [version]((node --version) -replace '^v','')
  if ($nv -ge [version]'24.0') { Good "node $nv" } else { FailItem "node $nv < 24 required" ; $wingetHints += 'winget install OpenJS.NodeJS' }
} else { FailItem 'node missing (need >=24)'; $wingetHints += 'winget install OpenJS.NodeJS' }
if (Have 'npm') {
  $npmv = [version]((npm --version))
  if ($npmv -ge [version]'11.0') { Good "npm $npmv" } else { FailItem "npm $npmv < 11 required" }
} else { FailItem 'npm missing (ships with node)' }
if (Have 'python') { Good 'python' } elseif (Have 'py') { Good 'python (py launcher)' } else { WarnItem 'python missing (needed by math_builder.py)'; $wingetHints += 'winget install Python.Python.3.12' }
if (Have 'typst')  { Good 'typst' } else { WarnItem 'typst missing (PDF builds fail without it)'; $wingetHints += 'winget install Typst.Typst' }
foreach ($h in $wingetHints) { Info "fix -> $h" }

# ---------- 2. PROJECT ----------
Step 2 "Project setup"
if (-not (Test-Path (Join-Path $Root 'package.json')) -or -not (Test-Path (Join-Path $Root 'math_builder.py'))) {
  FailItem "repo markers missing at $Root - is the project folder fully synced?"
} else {
  Good 'repo markers found'
  RunCmd 'npm' @('install') 'npm install (root)'
  if (Test-Path (Join-Path $Root 'scripts\setup-hooks.mjs')) {
    RunCmd 'node' @('scripts\setup-hooks.mjs') 'git hooks installed'
  }
  $envFile  = Join-Path $Root '.env'
  $envSample= Join-Path $Root '.env.example'
  if (-not (Test-Path $envFile)) {
    if ($DryRun) { Info '[DRY] would create .env from .env.example' }
    else { Copy-Item $envSample $envFile; Good '.env created from .env.example - FILL KEYS LATER (step 6)' }
  } else { Good '.env exists' }
}

# ---------- 3. AGENT CONFIG ----------
Step 3 "OpenCode agent config (~\.config\opencode)"
$CfgDest = Join-Path $U '.config\opencode'
$CfgSrc  = Join-Path $KitDir 'opencode-config'
if ((Test-Path $CfgDest) -and -not $ForceConfig) {
  WarnItem "config already exists at $CfgDest - skipped (use -ForceConfig to overwrite)"
} elseif (-not (Test-Path $CfgSrc)) {
  FailItem "snapshot missing: $CfgSrc"
} else {
  if ($DryRun) { Info "[DRY] robocopy $CfgSrc -> $CfgDest" }
  else {
    New-Item -ItemType Directory -Path $CfgDest -Force | Out-Null
    robocopy $CfgSrc $CfgDest /E /NFL /NDL /NJH /NJS | Out-Null
    if ($LASTEXITCODE -le 7) { Good 'agent config copied' } else { FailItem "robocopy exit $LASTEXITCODE" }
  }
}
if (-not $DryRun -and (Test-Path $CfgDest)) {
  $patched = 0
  Get-ChildItem $CfgDest -Recurse -Include *.jsonc,*.json,*.md -File | ForEach-Object {
    $t = Get-Content $_.FullName -Raw -Encoding UTF8
    $n = $t -replace '(?i)c:[\\/]+users[\\/]+moaz7', $U
    if ($n -ne $t) { Set-Content -Path $_.FullName -Value $n -Encoding UTF8 -NoNewline; $script:patched++ }
  }
  if ($patched -gt 0) { Good "$patched file(s): absolute paths remapped to $U" } else { Good 'no absolute paths needed remapping' }
  if (Test-Path (Join-Path $CfgDest 'package.json')) {
    RunCmd 'npm' @('install') 'npm install (agent config MCP deps)' $CfgDest
  }
}

# ---------- 4. MEMORY MCP ----------
Step 4 "obsidian-memory-layer-mcp server + vault"
$McpDir = Join-Path $U 'obsidian-memory-layer-mcp'
if (Test-Path (Join-Path $McpDir 'dist\index.js')) {
  Good "server built at $McpDir\dist\index.js"
} elseif (Have 'git') {
  RunCmd 'git' @('clone','https://github.com/Moazkhald2/obsidian-memory-layer-mcp.git',$McpDir) 'clone memory MCP repo' $U
  if (Test-Path (Join-Path $McpDir 'package.json')) {
    RunCmd 'npm' @('install') 'memory MCP npm install' $McpDir
    RunCmd 'npm' @('run','build') 'memory MCP build (tsc)' $McpDir
  }
} else {
  FailItem 'cannot clone memory MCP - git unavailable'
}
$Vault = Join-Path $U 'ObsidianVault'
if (Test-Path $Vault) { Good "memory vault found: $Vault" }
else {
  $vaultZip = Get-ChildItem (Join-Path $Root 'backups') -Filter 'vault_*.zip' -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending | Select-Object -First 1
  if ($vaultZip) { WarnItem "vault missing. Restore manually: expand '$($vaultZip.FullName)' into $Vault" }
  else { WarnItem "no vault and no vault_*.zip backup in backups\ - memories start empty" }
}

# ---------- 5. VERIFY ----------
Step 5 "Verify gate (typecheck > lint > test > build)"
if ($DryRun) { Info '[DRY] npm run verify' }
else { RunCmd 'npm' @('run','verify') 'npm run verify' }

# ---------- 6. MANUAL CHECKLIST ----------
Step 6 "Manual steps (never automate secrets)"
$manual = @(
  'Fill .env keys: NVIDIA_NIM_API_KEY (+ optional OPENROUTER/GROQ/DEEPSEEK) - see .env.example',
  'GitHub MCP needs env var GITHUB_PERSONAL_ACCESS_TOKEN (setx GITHUB_PERSONAL_ACCESS_TOKEN "ghp_...")',
  'Optional free-model proxy: install free-claude-code (one-liner in README.md), launch with fcc-opencode',
  'Launch opencode once so declared packages (superpowers, oh-my-openagent...) auto-install',
  'Then tell it: Read HANDOFF.md first.'
)
foreach ($m in $manual) { Info "- $m" }

Write-Host "`n=============================================================" -ForegroundColor Magenta
if ($script:Fatal.Count -gt 0) {
  Write-Host "BOOTSTRAP INCOMPLETE - $($script:Fatal.Count) fatal:" -ForegroundColor Red
  $script:Fatal | ForEach-Object { Write-Host "  x $_" -ForegroundColor Red }
  exit 1
}
$doneMsg = 'BOOTSTRAP DONE'
if ($script:Warn.Count -gt 0) { $doneMsg += " - $($script:Warn.Count) warning(s)" }
Write-Host $doneMsg -ForegroundColor Green
exit 0
