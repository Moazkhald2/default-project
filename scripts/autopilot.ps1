# Wrapper for Windows Task Scheduler — run with: powershell -ExecutionPolicy Bypass -File scripts/autopilot.ps1
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot\..
node scripts/autopilot.mjs --mode=local >> backups/autopilot-local.log 2>&1
if ($?) { Write-Host "autopilot local OK" } else { Write-Host "autopilot local FAIL check backups/autopilot-local.log" }
