# Wrapper for Windows Task Scheduler — R&D autofeed hourly heartbeat
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot\..
node scripts/rd-autofeed.mjs >> backups/rd-autofeed.log 2>&1
if ($?) { Write-Host "rd-autofeed OK" } else { Write-Host "rd-autofeed FAIL check backups/rd-autofeed.log" }
