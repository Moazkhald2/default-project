# Boot-improve logon wrapper — 15min cap, never blocks boot
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot\..
$today = Get-Date -Format "yyyy-MM-dd"
$log = "backups/boot-improve-$today.log"
$job = Start-Job -ScriptBlock { Set-Location $using:PWD; node scripts/boot-improve.mjs >> $using:log 2>&1 }
$done = Wait-Job $job -Timeout 900
if (-not $done) { Stop-Job $job | Out-Null; Add-Content $log "[$(Get-Date -Format o)] TIMEOUT 900s kill" }
Receive-Job $job >> $log 2>&1
Remove-Job $job -Force -ErrorAction SilentlyContinue
exit 0
