# Session Record — Grade 9 Session Sheets (2026-09-06)

## Standing preference (apply every time we build sheets/PDFs)
- After generating deliverable PDFs, ALWAYS open the output folder (`dist/`) in Explorer
  IN ADDITION to opening the PDF itself. User request 2026-09-06. Tags: #pdf #preference #workflow

## Delivered
- `dist/Grade9_Session1_Powers_Exponents.typ` → `.pdf` (20 pp) — Unit 1: Powers + Exponential Equations
- `dist/Grade9_Session2_Quadratic_Function.typ` → `.pdf` (16 pp) — Algebra: Quadratic Function
- Built with Typst 0.15.1 (fastest verified toolchain here), exact SYSTEM_SPEC §6 components,
  Century Gothic display + Palatino Linotype body (both installed), G9 accent #6C3483.
- Structure per skill: Figure → Key Rule → Mistakes → two-column I-Do → watermarked You-Do
  (L1/L2/L3 + L4 spec colors) → Group A in-sheet → Extension Bank aside → Exit → HW appendix
  (Groups B/C) → AK blocks → self-check → navy closing. 791pt budget check: pass (covers exempt).

## Verified answer-key corrections (worksheet traps — reteach as one family)
- Q18 / B9 / C9 (fractional-base quadratic exponent) are ALL empty set: B9 ∅ (was ±2),
  C9 ∅, C8 = -1/2 (was -3/2), C10: n = 2 (was 4), M3 mirror changed to 9^(x+1)=27^(x-1) → x = 5.
- Tags: #math #grade9 #answer-keys

## Typst gotchas hit this session (reusable)
- `@handle` in markup parses as ref label even inside "..." → use `#["@" + "themathmentor"]`.
- `#num.` after identifier parses as method access → use `#str(num).` in helpers like mcq().
- `#image` paths resolve relative to the .typ file (dist/… → use `../assets/…`), not --root.
- Unquoted multi-letter words in `$…$` fail → quote them (`"ok"`, `"Check: "`).
- Tags: #typst #debug

## Open items for next session
- User may request 3-file split (Powers / Exponentials / Quadratics separately) — cheap to do.
- Possible teacher full-solutions companion (declined for now: compact AK only).
- Print setting unknown (single vs double-sided) — ask when printing matters.
