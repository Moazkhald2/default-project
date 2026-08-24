#!/usr/bin/env bash
# fast_build.sh — 20sec pipeline (not 20min)
# Usage: bash scripts/fast_build.sh templates/sheet.typ [output.pdf]
set -euo pipefail

INPUT="${1:-templates/sheet.typ}"
OUTPUT="${2:-templates/sheet.pdf}"
ERROR_LOG="$(dirname "$OUTPUT")/compile_error.log"
SHORT_ERROR="$(dirname "$OUTPUT")/short_error.txt"

echo "Typst compile: $INPUT -> $OUTPUT"
if typst compile --root . "$INPUT" "$OUTPUT" 2> "$ERROR_LOG"; then
  echo "SUCCESS in <0.1s - $OUTPUT"
  rm -f "$SHORT_ERROR"
  exit 0
else
  echo "FAILED - extracting short error"
  # only last 12 lines, not full context bloat
  tail -n 12 "$ERROR_LOG" > "$SHORT_ERROR" 2>/dev/null || cp "$ERROR_LOG" "$SHORT_ERROR"
  cat "$SHORT_ERROR"
  echo ""
  echo "Fix: send ONLY short_error.txt + broken 5 lines to flash model"
  echo "  cat $SHORT_ERROR"
  exit 1
fi
