# Session Record — Grade 9 50-question ladders (2026-09-07, continued)

## What changed this round
- 50-question ladders per lesson (File 1 = 50 Powers + 50 Exponentials; File 2 = 50 Quadratics),
  sub-levels L1A→L4 with just-in-time ♣ bites (no front-loaded rule dump), each question
  leading into the next in micro-steps.
- Stems 16pt, MCQ options 14pt. Zero inline solutions (AK blocks at end only; HW key final-answers only).
- HW consolidated: end-of-lesson stacked appendix (mirrors + Groups B/C fully printed with boxes);
  in-flow ★HW chips mark ladder items that go home.
- Keep-together rule: every qbox/mcq/graph-question is block(breakable:false) — nothing splits across pages.
  Only You-Do card borders flow across pages now. 791pt budget: pass (35 + 24 pp).
- 6 NEW gap-fillers kept in aside Extension Banks. Trap family Q18/B9/C9 (all ∅) flagged for reteach.

## Answer corrections applied (all verified)
- Q44 = 11664; C8 = -1/2; C10: n = 2; B9/C9 = ∅; M3 mirror = 9^(x+1)=27^(x-1) → x = 5;
  new Q105 (Skill 2 L3B): 3^(x^2-5x+6) = 9 → {1,4}.

## Typst gotchas (cumulative)
- `@handle` in markup → `#["@" + "themathmentor"]`; `#num.` → `#str(num).`;
  quote multi-letter words in `$…$`; `#image` paths relative to the .typ file;
  big cards need breakable:true (spec default false overflows instead of breaking);
  PDFgear locks open PDFs → close viewer (Stop-Process -Name pdfeditor) before recompile.

## Standing rules (do automatically)
- Open `dist/` folder + PDFs on every sheet delivery. Done again this session.
