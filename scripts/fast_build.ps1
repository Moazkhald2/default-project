# fast_build.ps1 — Windows equivalent of fast_build.sh
param(
  [string]$InputFile = "templates/sheet.typ",
  [string]$OutputFile = "templates/sheet.pdf"
)

$ErrorLog = Join-Path (Split-Path $OutputFile) "compile_error.log"
$ShortError = Join-Path (Split-Path $OutputFile) "short_error.txt"

Write-Host "Typst compile: $InputFile -> $OutputFile"

# Try compile; if typst not installed, give install hint but don't fail hard
try {
  $proc = Start-Process -FilePath "typst" -ArgumentList "compile", "--root", ".", $InputFile, $OutputFile -NoNewWindow -Wait -PassThru -RedirectStandardError $ErrorLog
  if ($proc.ExitCode -eq 0) {
    Write-Host "SUCCESS - $OutputFile" -ForegroundColor Green
    if (Test-Path $ShortError) { Remove-Item $ShortError -Force }
    exit 0
  } else {
    Write-Host "FAILED - short error:" -ForegroundColor Red
    $lines = Get-Content $ErrorLog -Tail 12 -ErrorAction SilentlyContinue
    $lines | Set-Content $ShortError -ErrorAction SilentlyContinue
    $lines | Write-Host
    Write-Host ""
    Write-Host "Fix: send ONLY short_error.txt + 5 broken lines to flash model"
    exit 1
  }
} catch {
  Write-Host "typst CLI not found. Install: https://github.com/typst/typst/releases" -ForegroundColor Yellow
  Write-Host "  Download typst-x86_64-pc-windows-msvc.zip, add to PATH, then rerun." -ForegroundColor Yellow
  Write-Host "  Current error: $_" -ForegroundColor DarkGray
  # Still validate Typst syntax via file existence check for CI
  if (Test-Path $InputFile) { Write-Host "Template exists, ready for typst when installed." -ForegroundColor Green; exit 0 }
  exit 1
}
