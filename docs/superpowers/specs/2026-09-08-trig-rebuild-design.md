# Grade 10 Trig U4 Rebuild — Design Spec (Option B Concept-Chain)

Date: 2026-09-08
Scope: 12 scanned pages only (pp.11-19 Directed Angle + pp.110-112 Radian). NOT full term.
Output: `sheets/grade10_trig_u4.typ` Typst PDF worksheet (English, Markdown+LaTeX math via Typst `$...$`)
Approach: B Concept-chain rebuild (approved 2026-09-08)

## 1. Source audit

Input: 12 page images pasted in chat. No full-term PDF provided.

- p11 Lesson One Directed angle: definition ordered pair (OA,OB) = ∠AOB, initial/terminal. Complete `(....,....) → (OX,OY)` for ∠XOY blank.
- p12 Positive/negative measures: |P|+|N|=360°. Find positive of -170° (=190°), negative of 320° (=-40°) — no worked steps.
- p13 Equivalent angles: same terminal side. 100° → +460° / -260° worked. -250° → blank (expect +110° / -610°).
- p14 Smallest positive: 530° → 170°, -62° → 298° blank. Quadrant intro + 132° → 2nd blank.
- p15 964° → 244° 3rd, -12° → 348° 4th, -1070° → 10° 1st blank. Complete A-H (standard, equivalent, sign, quadrantal, θ+n·360, smallest 530°, 930° quadrant, smallest -690°) blank.
- p16-17 MCQ bank blank. Keys: 60°→420° (d), 585°→225° (585-360), except 285° (c, -75° not 75°), 1670°→3rd (230°), -135°→3rd (225°), -A/-B equivalent (b), -850°→3rd (230°), quadrantal=90° (c).
- p18 Degree 1°=60', 1'=60". Radian θ=l/r. Ex 5/4π, r=8 → l=10π≈31.4cm worked.
- p19 Radius/arc blanks: π/2 + 5π cm → r=10cm; 7π/12, r=8 → l≈14.66cm; 9π/8, l=24 → r≈6.8cm. Conversion x°/180=θ/π.
- p110 radian→degree 75°32'15"→≈1.318rad, 2.38rad→≈136.37°, quadrants -7.3rad, 5π/4, 2.02rad blank.
- p111 5π/3→4th, -0.3π→3rd, 5.7rad→4th, -6.4rad→1st; arc 152°26'17" r=10.5→≈28cm; inscribed 30° arc 5cm → circumference 60cm; BC arc + m∠A blanks (central=2·inscribed).
- p112 MCQ: 25π/9→1st (80°), -9π/4→3rd, 60° d=12 → 2π (d), 43°12'→0.24π (b), cyclic ABCD A=60°→C=2π/3 (c), unit circle radian=arc length (c).

Gaps to fill: rotation direction rule (CCW +, CW -), standard position 2 conditions, infinite coterminals note, smallest-positive algorithm, quadrant-from-smallest rule, quadrantal multiples, inscribed vs central relation.

## 2. Egypt 2026-2027 alignment

Official T1 Grade 10 (1st Secondary) — 4 units:

- U1 Algebra: complex numbers, Δ type, roots sum/product (-b/a, c/a), forming eq, function sign, quadratic inequalities.
- U2 Similarity: k, polygons/triangles AA/SAS/SSS, area ratio k², circle applications.
- U3 Proportionality: Thales DE∥BC, internal/external bisectors, chords/secants/tangent-secant, centre=2·circumference.
- U4 Trig: directed angle, degree/radian, sin/cos/tan, signs, special 30/45/60, related angles, graphs, inverse/find angle.

This spec covers U4 Lessons 1-2 only. `docs/curriculum/` currently G1-G9 only — no Grade 10 outcomes file. Tag questions to U4-L1/L2 manually.

## 3. Exam structure (2026 نقل + Thanaweya reform)

- 85% MCQ on tablet + 15% short essay on paper (Jan 2026 directive for 1st/2nd Secondary).
- 3 parallel models, equal weight, National Center specs.
- MCQ: 4 alternatives, 1 correct.
- Gradient easy→hard, cover outcomes by relative weight.
- Cognitive: 70% basic-medium (recall/apply), 30% high (analysis/synthesis).
- Math paper: 32 marks, 3h, calculator allowed. Reference: Thanaweya pure 20Q (10×1 + 8×2 + 2×2 essay =30).

Question levels for this sheet: 70% L1-L3 (recall/compute/convert), 30% L4-L5 (quadrant reasoning, mixed Boclet, inscribed application).

## 4. Architecture

- Template: `templates/sheet.typ` — do NOT regenerate preamble. AI outputs only `#question(n, [...], figure: canvas({...}), points: x)` blocks.
- File: `sheets/grade10_trig_u4.typ` with `#header(academy:"Math Academy — Grade 10", unit:"Trig U4 Directed + Radian")`.
- Figures: CeTZ `canvas` with `let P=(x,y)` + `content(P, [$P$], anchor:...)`. Never absolute floating text.
- Fonts: Libertinus Serif 10.5pt, A4, margins 1.8/1.6cm (per template).

## 5. Components / Concept chain (11 steps, each leads to next)

1. Directed definition (ordered pair, initial/terminal)
2. Sign by rotation (CCW + / CW -)
3. ± pair |P|+|N|=360°
4. Standard position (vertex O + initial +x)
5. Equivalent θ+n·360° (infinite)
6. Smallest positive (mod 360)
7. Quadrant / quadrantal (from smallest; multiples of 90°)
8. Radian θ=l/r
9. Conversion θ=x·π/180, x=θ·180/π (+°'"→decimal)
10. Arc l=θ·r, r=l/θ, C=2πr
11. Inscribed application (inscribed=½ central, cyclic A+C=180°)

## 6. Question progression (45Q)

- L1 Recall 1-8: Complete A-H + definitions.
- L2 Compute 9-20: ± pairs, coterminals, smallest + (530°, -62°, 964°, -1070°, etc.).
- L3 Convert 21-30: deg↔rad incl. 75°32'15", 2.38rad, 43°12', 152°26'17".
- L4 Locate 31-38: quadrants degree + radian (132°, -12°, 5π/3, -0.3π, 5.7rad, -6.4rad, -7.3rad, 25π/9, -9π/4).
- L5 Mixed Boclet 39-45: 5 MCQ (4 options) + 2 short essay (arc length, inscribed/cyclic), 70/30 split, easy→hard.
- Each Q: 1 concept, 1 verb, numbers from source where possible, new numbers only to fill gaps.
- Answer key: separate `sheets/grade10_trig_u4_answers.typ` or appendix (to confirm with build plan).

Figures (6): F1 standard pos, F2 coterminal spiral, F3 quadrants, F4 radian circle, F5 arc AB r=8, F6 inscribed 45°.

## 7. Data flow

Scans → OCR/manual transcribe → chain-order → draft #question blocks → CeTZ figs → `typst compile` → fix errors → answer-key verify → 70/30 audit.

## 8. Error handling

- Typst compile fail → read `templates/compile_error.log`, fix brackets/anchors, recompile (max 3 tries per file).
- CeTZ label drift → enforce anchored-label pattern.
- Wrong key (e.g., quadrant) → recompute via smallest-positive check: `((θ % 360)+360)%360`.
- Out-of-scope (U1-U3) → defer to full-term backlog, do not expand.

## 9. Testing / Acceptance

- [ ] Compiles with `typst compile sheets/grade10_trig_u4.typ` no errors.
- [ ] 45Q present, all gaps from §1 filled with steps.
- [ ] 70/30 level split verified.
- [ ] 6 figures render, labels anchored.
- [ ] Keys match §1 recomputation.
- [ ] No U1-U3 content leaked.

## 10. Tokens / Time (B)

- Input ~12k + output 22-28k = 35-40k total, 1 session.
- Time 15-25min gen + 10min compile fix.
- Full term ×6 units: 210-270k, 2.5-3.5h chunked.
- Models: `deepseek-v4-flash-free` draft, `big-pickle` fallback for logic.

## 11. Out of scope

Full-term rebuild, Arabic bilingual, JSON bank ingestion, mock Boclets beyond 2 essay Qs. Log as follow-ups.

---

Spec self-review: no TBD/TODO, chain consistent with gaps, scope single-unit (no decomposition needed), ambiguities resolved (English only, Typst only, 45Q, 70/30, answer appendix pending build plan).
