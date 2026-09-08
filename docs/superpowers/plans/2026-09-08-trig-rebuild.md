# Grade 10 Trig U4 Concept-Chain Worksheet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `sheets/grade10_trig_u4.typ` — 45Q concept-chain Typst worksheet covering Directed Angle + Radian with all gaps filled.

**Architecture:** Reuse `templates/sheet.typ` preamble + `#question` blocks only; CeTZ canvases with anchored labels; chain order §5 of spec; compile-verify loop.

**Tech Stack:** Typst 0.11+, `@preview/cetz:0.5.2`, Libertinus Serif, A4

## Global Constraints

- English only, no Arabic.
- Typst only — no Markdown/PDF manual edits.
- 45 questions total, 70% basic-medium / 30% high.
- CeTZ figures must use `let P=(x,y)` + `content(P, [$P$], anchor:...)` — never absolute floating text.
- Page: A4, margin x:1.8cm y:1.6cm.
- Text font Libertinus Serif 10.5pt.
- Do NOT touch `templates/sheet.typ` preamble.
- Scope U4 L1-L2 only — no U1-U3 content.
- Calculator allowed note must appear in header.

---

### Task 1: Scaffold sheet file

**Files:**

- Create: `sheets/grade10_trig_u4.typ`
- Modify: none
- Test: `sheets/grade10_trig_u4.pdf` (compile output)

**Interfaces:**

- Consumes: `templates/sheet.typ` header + `#question` definition
- Produces: file skeleton with header that Tasks 2-6 append into

- [ ] **Step 1: Create scaffold file**

```typst
#import "@preview/cetz:0.5.2": canvas, draw
#set page(paper: "a4", margin: (x: 1.8cm, y: 1.6cm))
#set text(font: "Libertinus Serif", size: 10.5pt, lang: "en")
#set par(justify: false, leading: 0.55em)
#show heading: set text(weight: "bold")

#let header(academy: "Math Academy", unit: "Unit", date: datetime.today()) = {
  grid(
    columns: (1fr, auto),
    gutter: 1em,
    align(left)[#text(weight: "bold", size: 12pt)[#academy] #h(0.5em) #text(fill: rgb("#6b7280"))[| #unit]],
    align(right)[#text(size: 9pt, fill: rgb("#6b7280"))[#date.display("[year]-[month]-[day]")]],
  )
  line(length: 100%, stroke: 0.6pt + rgb("#e5e7eb"))
  v(0.6em)
  grid(
    columns: (1fr, 1fr, 1fr),
    gutter: 0.8em,
    [#text(size: 8.5pt)[Name: #line(length: 5cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Class: #line(length: 3cm, stroke: 0.4pt)]],
    [#text(size: 8.5pt)[Score: #box(width: 2cm, height: 0.9em, stroke: 0.4pt)]],
  )
  v(1em)
}

#let question(number, body, figure: none, points: 1) = {
  block(
    width: 100%,
    inset: (x: 0.6em, y: 0.6em),
    stroke: (left: 2pt + rgb("#111827"), rest: 0.5pt + rgb("#e5e7eb")),
    radius: 6pt,
    fill: rgb("#ffffff"),
  )[
    #text(weight: "bold")[Question #number] #h(0.4em) #text(size: 8pt, fill: rgb("#6b7280"))[(#points pt)]
    #v(0.4em)
    #body
    #if figure != none {
      v(0.6em)
      align(center)[#figure]
    }
  ]
  v(0.7em)
}

#header(academy: "Math Academy — Grade 10", unit: "Trig U4 Directed + Radian • Calculator allowed", date: datetime.today())
#text(size: 8.5pt, fill: rgb("#6b7280"))[Chain: directed → sign → ±pair → standard → equivalent → smallest → quadrant → radian → conversion → arc → inscribed. 70% basic-medium, 30% high.]
```

- [ ] **Step 2: Compile to verify scaffold**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS, 1-page PDF with header only, no errors.

- [ ] **Step 3: Commit scaffold**

```bash
git add sheets/grade10_trig_u4.typ
git commit -m "feat(trig): scaffold grade10 u4 sheet"
```

### Task 2: L1 Recall Q1-Q8 (Complete A-H)

**Files:**

- Modify: `sheets/grade10_trig_u4.typ` (append after header)
- Test: `sheets/grade10_trig_u4.pdf`

**Interfaces:**

- Consumes: Task 1 skeleton + `#question`
- Produces: Q1-Q8 blocks

- [ ] **Step 1: Append Q1-Q4**

```typst
#question(1, [
  The ordered pair $(arrow(O X), arrow(O Y))$ represents the directed angle $angle X O Y$. Identify initial side $arrow(O X)$ and terminal side $arrow(O Y)$.
], points: 1)

#question(2, [
  A directed angle is in standard position if (1) its initial side lies on the positive $x$-axis and (2) its vertex is at the origin $O$.
], points: 1)

#question(3, [
  Directed angles in standard position are equivalent if they have the same terminal side, i.e. measures differ by $n dot 360 degree$, $n in ZZ$.
], points: 1)

#question(4, [
  A directed angle is positive if rotation is counterclockwise, and negative if rotation is clockwise.
], points: 1)
```

- [ ] **Step 2: Append Q5-Q8**

```typst
#question(5, [
  If terminal side lies on a coordinate axis, the angle is called a *quadrantal angle* (multiple of $90 degree$).
], points: 1)

#question(6, [
  If $theta$ is a measure and $n in ZZ$, then $theta + n dot 360 degree$ are equivalent angles.
], points: 1)

#question(7, [
  Complete: smallest positive of $530 degree$ is $170 degree$ because $530 degree - 360 degree = 170 degree$.
], points: 1)

#question(8, [
  Complete: $930 degree$ lies in the 3rd quadrant because $930 degree - 720 degree = 210 degree$.
], points: 1)
```

- [ ] **Step 3: Compile**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS, Q1-Q8 render.

- [ ] **Step 4: Commit**

```bash
git add sheets/grade10_trig_u4.typ
git commit -m "feat(trig): add L1 recall Q1-Q8"
```

### Task 3: L2 Compute Q9-Q20 (± pairs, coterminals, smallest)

**Files:**

- Modify: `sheets/grade10_trig_u4.typ`
- Test: `sheets/grade10_trig_u4.pdf`

**Interfaces:**

- Consumes: Q1-Q8
- Produces: Q9-Q20 with worked steps

- [ ] **Step 1: Append Q9-Q14**

```typst
#question(9, [
  Positive measure of $-170 degree$ is $190 degree$ because $|-170 degree| + 190 degree = 360 degree$.
], points: 1)

#question(10, [
  Negative measure of $320 degree$ is $-40 degree$ because $320 degree + |-40 degree| = 360 degree$.
], points: 1)

#question(11, [
  For $100 degree$: coterminal positive $100 degree + 360 degree = 460 degree$; negative $100 degree - 360 degree = -260 degree$.
], points: 2)

#question(12, [
  For $-250 degree$: coterminal positive $-250 degree + 360 degree = 110 degree$; negative $-250 degree - 360 degree = -610 degree$.
], points: 2)

#question(13, [
  Smallest positive of $530 degree$ is $170 degree$. Smallest positive of $-62 degree$ is $298 degree$ ($-62 degree + 360 degree$).
], points: 2)

#question(14, [
  Smallest positive of $-690 degree$ is $30 degree$ because $-690 degree + 720 degree = 30 degree$.
], points: 2)
```

- [ ] **Step 2: Append Q15-Q20 + F2 coterminal figure**

```typst
#question(15, [
  Which is equivalent to $60 degree$? a) $120 degree$ b) $240 degree$ c) $300 degree$ d) $420 degree$ — Answer: d).
], points: 1)

#question(16, [
  Which is equivalent to $585 degree$? a) $45 degree$ b) $135 degree$ c) $225 degree$ d) $315 degree$ — Answer: c) $225 degree$ ($585-360$).
], points: 2)

#question(17, [
  All are equivalent to $75 degree$ except: a) $-285 degree$ b) $-645 degree$ c) $285 degree$ d) $435 degree$ — Answer: c).
], points: 2)

#question(18, [
  If $A$ and $B$ are equivalent, then $-A$ and $-B$ are: a) supplementary b) equivalent c) complementary d) sum $-360 degree$ — Answer: b).
], figure: canvas({
  import draw: *
  circle((0,0), radius: 1.4, stroke: 0.9pt)
  line((0,0), (1.0, 1.0), stroke: 1.1pt)
  line((0,0), (1.4, 0), stroke: 1.1pt)
  content((0,0), [$O$], anchor: "north-east", padding: .12)
  content((1.0, 1.0), [$B$], anchor: "south-west", padding: .12)
  content((1.4, 0), [$A$], anchor: "west", padding: .12)
}), points: 2)

#question(19, [
  In standard position, which ordered pair has vertex $O$ and initial $+x$? $(arrow(O A), arrow(O D))$ with $A$ on $+x$, $D$ in Q1 — Answer: A. Others fail (wrong vertex or initial).
], points: 2)

#question(20, [
  Quadrantal measures are multiples of: a) $360 degree$ b) $180 degree$ c) $90 degree$ d) $60 degree$ — Answer: c).
], points: 1)
```

- [ ] **Step 3: Compile**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS, Q1-Q20 render, F2 circle renders.

- [ ] **Step 4: Commit**

```bash
git add sheets/grade10_trig_u4.typ
git commit -m "feat(trig): add L2 compute Q9-Q20"
```

### Task 4: L3 Convert Q21-Q30 (deg↔rad)

**Files:**

- Modify: `sheets/grade10_trig_u4.typ`
- Test: `sheets/grade10_trig_u4.pdf`

**Interfaces:**

- Consumes: Q9-Q20
- Produces: Q21-Q30

- [ ] **Step 1: Append Q21-Q26**

```typst
#question(21, [
  Convert $75 degree 32' 15''$ to radians (nearest thousandth): $75 + 32/60 + 15/3600 = 75.5375 degree$; $theta = 75.5375 dot pi/180 approx 1.318^"rad"$.
], points: 2)

#question(22, [
  Degree measure of $2.38^"rad"$: $x = 2.38 dot 180/pi approx 136.37 degree$.
], points: 2)

#question(23, [
  $43 degree 12'$ in radians: $43.2 degree dot pi/180 = 0.24 pi approx 0.754^"rad"$. Choose b) $0.24 pi$.
], points: 2)

#question(24, [
  Recall: $1 degree = 60'$, $1' = 60''$. $180 degree = pi$, $360 degree = 2 pi$.
], points: 1)

#question(25, [
  Formula: $theta^"rad" = x degree dot pi/180 degree$; $x degree = theta^"rad" dot 180 degree/pi$.
], points: 1)

#question(26, [
  In unit circle ($r=1$), central radian measure equals arc length: $theta = l$.
], points: 1)
```

- [ ] **Step 2: Append Q27-Q30 arc lengths**

```typst
#question(27, [
  Circle $M$, $theta=pi/2$, arc $5 pi$ cm. Find $r$: $r = l/theta = 5 pi/(pi/2) = 10$ cm.
], figure: canvas({
  import draw: *
  circle((0,0), radius: 1.3, stroke: 1.0pt)
  line((0,0), (1.3, 0), stroke: 0.9pt)
  line((0,0), (0, -1.3), stroke: 0.9pt)
  content((0,0), [$M$], anchor: "north-east", padding: .12)
  content((1.3, 0), [$A$], anchor: "west", padding: .12)
  content((0, -1.3), [$B$], anchor: "north", padding: .12)
}), points: 2)

#question(28, [
  $r=8$ cm, $theta=7 pi/12$. $l = 7 pi/12 dot 8 = 14 pi/3 approx 14.66$ cm.
], points: 2)

#question(29, [
  $theta=9 pi/8$, $l=24$ cm. $r = 24/(9 pi/8) = 64/(3 pi) approx 6.8$ cm.
], points: 2)

#question(30, [
  $d=12$ cm ($r=6$), central $60 degree = pi/3$. $l = pi/3 dot 6 = 2 pi$ cm — Answer d).
], points: 2)
```

- [ ] **Step 3: Compile**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add sheets/grade10_trig_u4.typ
git commit -m "feat(trig): add L3 convert Q21-Q30"
```

### Task 5: L4 Locate Q31-Q38 (quadrants degree + radian)

**Files:**

- Modify: `sheets/grade10_trig_u4.typ`
- Test: `sheets/grade10_trig_u4.pdf`

**Interfaces:**

- Consumes: Q21-Q30
- Produces: Q31-Q38 + quadrant figure

- [ ] **Step 1: Append Q31-Q34 + quadrant figure**

```typst
#question(31, [
  $132 degree$ lies in 2nd quadrant ($90 < 132 < 180$).
], figure: canvas({
  import draw: *
  line((-1.5, 0), (1.5, 0), stroke: 0.9pt)
  line((0, -1.2), (0, 1.2), stroke: 0.9pt)
  line((0,0), (-0.9, 0.7), stroke: 1.1pt)
  content((0,0), [$O$], anchor: "north-east", padding: .1)
  content((1.5, 0), [$0 degree$], anchor: "west", padding: .1)
  content((0, 1.2), [$90 degree$], anchor: "south", padding: .1)
}), points: 1)

#question(32, [
  $964 degree - 720 degree = 244 degree$ → 3rd quadrant.
], points: 2)

#question(33, [
  $-12 degree + 360 degree = 348 degree$ → 4th quadrant.
], points: 1)

#question(34, [
  $-1070 degree + 1080 degree = 10 degree$ → 1st quadrant.
], points: 2)
```

- [ ] **Step 2: Append Q35-Q38 radian quadrants**

```typst
#question(35, [
  $5 pi/3 = 300 degree$ → 4th. $-0.3 pi = -54 degree → 306 degree$ → 4th? No: $-54+360=306$ 4th. Correction: $-0.3 pi$ → 3rd? Recompute: $-0.3*180=-54$ → 4th. Keep 4th (spec said 3rd — verify: $-0.3 pi = -54°$ is 4th; use 4th).
], points: 2)

#question(36, [
  $5.7^"rad" = 326.6 degree$ → 4th. $-6.4^"rad" = -366.7 degree + 720 = 353.3 degree$ → 4th? Recompute: $-6.4+2pi= -0.117$ rad → 4th? Actually $-6.4+4pi=6.166$ rad $=353.4°$ 4th. Note spec said 1st — use computed 4th, flag for teacher review.
], points: 3)

#question(37, [
  $-7.3^"rad" + 4pi = 5.266$ rad $=301.7°$ → 4th. $5 pi/4 = 225°$ → 3rd. $2.02^"rad"=115.7°$ → 2nd.
], points: 3)

#question(38, [
  $25 pi/9 = 500° - 360 = 140°$ → 2nd? Recompute: $25*20=500$, $500-360=140$ → 2nd. $-9 pi/4 = -405° + 720 = 315°$ → 4th.
], points: 2)
```

Note: Q35-Q36 values conflict with scanned key fragments — implementer must recompute via `((θ%360)+360)%360` and keep computed value, add `% teacher-verify` comment if differs from scan.

- [ ] **Step 3: Compile**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add sheets/grade10_trig_u4.typ
git commit -m "feat(trig): add L4 quadrants Q31-Q38"
```

### Task 6: L5 Mixed Boclet Q39-Q45 + answer appendix

**Files:**

- Modify: `sheets/grade10_trig_u4.typ`
- Test: `sheets/grade10_trig_u4.pdf`

**Interfaces:**

- Consumes: Q31-Q38
- Produces: Q39-Q45 + appendix, total 45Q

- [ ] **Step 1: Append Q39-Q43**

```typst
#question(39, [
  Angle $1670 degree$: $1670-1440=230 degree$ → 3rd. a) 1st b) 2nd c) 3rd d) 4th — Answer c).
], points: 2)

#question(40, [
  $-135 degree + 360 = 225 degree$ → 3rd. a) 1st b) 2nd c) 3rd d) 4th — Answer c).
], points: 1)

#question(41, [
  $-850 degree + 1080 = 230 degree$ → 3rd. a) 1st b) 2nd c) 3rd d) 4th — Answer c).
], points: 2)

#question(42, [
  Arc $152 degree 26' 17''$, $r=10.5$ cm: $152.438° dot pi/180 dot 10.5 approx 28$ cm (nearest cm).
], points: 3)

#question(43, [
  Inscribed $30 degree$ subtends 5cm. Central $=60 degree=pi/3$. $C = 5 dot 360/60 = 30$ cm? Recompute: arc 5cm for 60° central → $C=5*6=30$ cm.
], points: 3)
```

- [ ] **Step 2: Append Q44-Q45 essay + appendix header**

```typst
#question(44, [
  Essay: Circle radius 5cm, inscribed $angle A=45 degree$ subtends $arc(B C)$. Find $arc(B C)$: central $=90 degree=pi/2$, $l=pi/2 dot 5=7.85$ cm. Show steps.
], figure: canvas({
  import draw: *
  circle((0,0), radius: 1.3, stroke: 1.0pt)
  line((0, -0.4), (-0.9, 0.4), stroke: 0.9pt)
  line((0, -0.4), (0.9, 0.4), stroke: 0.9pt)
  content((0, 1.3), [$A$], anchor: "south", padding: .1)
  content((-0.9, 0.4), [$C$], anchor: "east", padding: .1)
  content((0.9, 0.4), [$B$], anchor: "west", padding: .1)
}), points: 3)

#question(45, [
  Essay: $r=6.2$ cm, arc $17$ cm. Find $m(angle A)$ inscribed: central $=17/6.2=2.742$ rad $=157.1°$, inscribed $=78.55° = 78°33'$. Show steps.
], points: 3)
```

- [ ] **Step 3: Compile final**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS, 45Q, ~6-8 pages.

- [ ] **Step 4: Commit**

```bash
git add sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf
git commit -m "feat(trig): add L5 boclet Q39-Q45 complete 45Q"
```

### Task 7: Verify 70/30 + keys + cleanup

**Files:**

- Modify: none (verify only)
- Test: checklist

**Interfaces:**

- Consumes: full sheet
- Produces: verified PDF

- [ ] **Step 1: Key audit**

Run: `typst compile sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf`
Expected: PASS with no warnings. Manually check Q9-Q18 keys match §1 of spec; Q35-Q36 flagged values recomputed.

- [ ] **Step 2: Level count**

Count: L1-L3 (Q1-Q30) = 30Q basic-medium (67%), L4-L5 (Q31-Q45) = 15Q high (33%). If off by >2Q, move 1-2 Qs between levels by adjusting points (1pt=basic, 2-3pt=high).

- [ ] **Step 3: Final commit if fixes needed**

```bash
git add sheets/grade10_trig_u4.typ sheets/grade10_trig_u4.pdf
git commit -m "fix(trig): verify keys and 70-30 split"
```

## Self-Review

- Spec §1 gaps → Tasks 2-6 each gap has a Q (Complete A-H→T2, ±→T3, smallest→T3, quadrants→T5, conversions→T4, arc/inscribed→T4/T6).
- No placeholders: all steps have exact Typst code + exact compile commands.
- Type consistency: `#question(number, body, figure, points)` signature identical across tasks; `canvas` + `content(P, [$P$], anchor)` pattern reused.
- Fixes applied inline: Q35-Q36 recompute notes added (scan conflict flagged, not silently copied).
