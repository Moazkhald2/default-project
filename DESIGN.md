# Brand & UI System — AI Bridge to SYSTEM_SPEC.md

**The Math Mentor (`themathmentor.edu`) · House v2**

> **SYSTEM_SPEC.md is canonical.** This file is the **AI-consumable bridge** that re-exports `SYSTEM_SPEC.md §2` tokens to Tailwind v4 + enforces component rules for Cursor/OpenCode/Copilot. If tokens conflict, `SYSTEM_SPEC.md` wins — update here + `apps/web/src/index.css` `@theme` together.

## 0. How to Stay Consistent (for AI)

1. **Read `SYSTEM_SPEC.md` first** (§2 Tokens, §4 Pedagogy Loop, §6 Components, §8 Budget) — every UI/ Typst/ LaTeX task.
2. Then read this file for Tailwind mapping.
3. Use ONLY variables below. No invented hex, no `bg-[#...]`, no arbitrary `p-[13px]`.

---

## 1. Brand Voice & Vibe — Humanized, Warm, Minimalist

- **Humanized & Warm:** Soft `rounded-xl` (12px), generous `p-5`/`p-6`, warm `bg-paper #FAF9F6`, conversational micro-copy. Not sterile enterprise.
- **Minimalist & Focused:** LMS content (lessons, vectors ≥65% width, KaTeX) is hero; chrome recedes. See **Figure-First Law** `SYSTEM_SPEC.md §4.1`.
- **60-30-10 Rule**: 60% white/paper, 30% teal/navy/ink structural, 10% gold/terra/sage accents.

Copy tone:

- `Course Completion: 40%` → `You're nearly halfway — 40% done, keep going!`
- `No data` → `Nothing here yet — your first submission will appear here.`
- `Error` → `Hmm, that didn't save. Try again?`

---

## 2. Design Tokens — House v2 → Tailwind v4 `@theme`

### 2.1 Core Palette (WCAG AA ≥4.5:1) — from `SYSTEM_SPEC.md §2.2`

```yaml
# canonical — do not invent
tmm-teal: "#0A9396" # primary, section titles, primary buttons
tmm-teal-light: "#E6F5F5" # I Do bg
tmm-teal-dark: "#0A6F72" # card titles on teal
tmm-navy: "#1A1A2E" # cover gradient, closing, dark callouts
tmm-cyan: "#01CBFC" # secondary accent, links, sub-bullets
tmm-cyan-light: "#E0FAFF"
tmm-gold: "#D4A373" # key rule, achievements, borders
tmm-gold-light: "#FAF3E7"
tmm-gold-dark: "#8A5A1E"
tmm-terra: "#E76F51" # common mistakes, danger
tmm-terra-light: "#FDF0ED"
tmm-terra-dark: "#9C3B22"
tmm-sage: "#84A98C" # You Do workspace, success
tmm-sage-light: "#EEF3EF"
tmm-sage-dark: "#3E5F4A"
tmm-ink: "#2D3436" # primary text, vector strokes
tmm-muted: "#636E72" # subtitles, footer, meta
tmm-paper: "#FAF9F6" # card bg, answer key fill (also --color-canvas)
tmm-white: "#FFFFFF" # surface
```

**Tailwind mapping** (`apps/web/src/index.css` `@theme`):

```
--color-primary: #0A9396        --color-primary-light: #E6F5F5  --color-primary-dark: #0A6F72
--color-navy: #1A1A2E
--color-secondary: #01CBFC      --color-secondary-light: #E0FAFF
--color-accent: #D4A373         --color-gold: #D4A373  --color-gold-light: #FAF3E7 --color-gold-dark: #8A5A1E
--color-terra: #E76F51          --color-terra-light: #FDF0ED --color-terra-dark: #9C3B22
--color-sage: #84A98C           --color-sage-light: #EEF3EF --color-sage-dark: #3E5F4A
--color-ink: #2D3436             --color-muted: #636E72
--color-paper: #FAF9F6           --color-canvas: #FAF9F6 (alias)
--color-surface: #FFFFFF         --color-border: #E7E5E4 (#E7E5E4 warm)  --color-border-strong: #D6D3D1
--color-success: #84A98C         --color-warning: #D4A373 --color-error: #E76F51
```

Usage: `bg-primary text-white`, `bg-paper`/`bg-canvas`, `bg-surface`, `text-ink`, `text-muted`, `border-border`, `bg-gold-light`, `bg-terra-light`, `bg-sage-light`, `bg-navy text-white`.

### 2.2 Grade Accents — `SYSTEM_SPEC.md §2.4`

```
G4 #E76F51 | G5 #CF7B1D | G6 #B33A63 | G7 #2980B9 | G8 #8E44AD | G9 #6C3483 | G10 #0A9396 | G11 #1A1A2E
```

Use as cover gradient start + progress/badge accent per grade. Expose as `--color-grade-10: #0A9396` etc. if needed.

### 2.3 Typography — from `SYSTEM_SPEC.md §3.1`

```yaml
typography:
  # Web (KaTeX + LMS): Playfair Display / Lexend per spec; fallback to Inter/Plus Jakarta Sans already in @theme
  display: '"Playfair Display", "Plus Jakarta Sans", system-ui, sans-serif' # headings, brand
  body: '"Lexend", "Inter", system-ui, sans-serif' # UI + prose
  mono: "ui-monospace, SFMono-Regular, Menlo, monospace"
  scale: { xs: 12, sm: 14, base: 16, lg: 18, xl: 24, 2xl: 30, 3xl: 36 }
  line-height: { body: 1.6, heading: 1.25, tight: 1.0 }
  min-body: 10.5pt # never below — §3.2
```

### 2.4 Spacing, Radius, Shadows — aligns §2.3 & §6

```yaml
spacing: 2 4 8 16 24 32 48 64 # 8px grid
radius:
  card: 12px # --radius-card -> rounded-xl (QuestionCard, panels)
  control: 8px # --radius-control -> rounded-lg (buttons, inputs)
  pill: 9999px # rounded-full (week tabs, badges)
  sheet: 20px # rounded-[20px] hero/empty
shadow: sm only on cards (`shadow-sm`), none elsewhere. No glows.
stroke:
  card-left: 2.5pt solid accent (teal/gold/terra/sage per card type)
  card-frame: 0.5pt + 70% white
  header-rule: 0.6pt #A9D9DA
```

Breakpoints: `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` mobile-first.

---

## 3. Component Strict Rules — AI MUST FOLLOW (maps to `SYSTEM_SPEC.md §6`)

### Buttons

```tsx
// Primary (teal) — default LMS action
className =
  "bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark focus-visible:ring-2 focus-visible:ring-primary";
// Secondary
className = "border border-border bg-surface text-ink rounded-lg hover:bg-paper";
// Navy (closing / dark callout)
className = "bg-navy text-white rounded-xl hover:opacity-90";
// Pill filters (week tabs, grade badges)
className =
  "rounded-full px-3 py-1.5 text-sm font-medium bg-primary text-white | border border-border bg-surface hover:bg-paper";
```

Never `bg-blue-500`, `bg-zinc-900`, `bg-violet-600`, neon gradients.

### Cards

```
通用: rounded-xl border border-border bg-surface shadow-sm p-5  (paper tint if needed: bg-paper)
I Do (teal):   bg-[#E6F5F5] border-l-2 border-primary  (or bg-primary-light)
Key Rule (gold): bg-gold-light border-l-2 border-gold  (title text-gold-dark #8A5A1E)
Common Mistakes (terra): bg-terra-light border-l-2 border-terra
You Do (sage): bg-sage-light border-l-2 border-sage + inner box border-sage/45 + watermark "work it out here"
Header badges: rounded-full border border-border px-2 py-1 text-xs
```

Left stroke 2.5pt + outer 0.5pt @70% white per `SYSTEM_SPEC.md §2.3`.

### Inputs / Forms

```
rounded-lg border border-border bg-surface focus:ring-2 focus:ring-primary focus:border-primary
```

### Empty / Zero States — Warm

```
rounded-[20px] border border-dashed border-border bg-paper p-8 text-center
icon: lucide-react 24px text-muted, title: font-display text-ink, copy: conversational
```

### LMS-Specific

- **Figure-first**: `SYSTEM_SPEC.md §4.1` — GeoGebra/SVG block ≥65–85% width, one-line caption, BEFORE text. Wrapper: `rounded-xl overflow-hidden border border-border bg-surface`.
- **Progress**: track `h-2 rounded-full bg-primary-light` fill `bg-accent`/`bg-gold`. Use grade accent for grade-specific track.
- **Question choice**: `rounded-xl border border-border bg-surface px-3 py-2 hover:bg-paper has-[input:checked]:border-primary has-[input:checked]:bg-primary-light`
- **Cover**: gradient `-35deg` grade_color → `navy`, logo `assets/logo-white.png` 8cm, gold rule 1.5pt, chips white@88% — per §6.2.1.

### Motion

- `motion/react` 150–200ms `easeOut` for check/complete. No infinite bounce, no scale >1.02.

### Print ↔ Web Parity

- Typst `templates/master_sheet.typ` must use `teal #0A9396`, `navy #1A1A2E`, `gold #D4A373`, `paper #FAF9F6` — same as web `@theme`. Keep `stroke: 1pt + rgb("#0A9396")` aligned.

---

## 4. Anti-Drift Rules for AI Assistants

1. **Read SYSTEM_SPEC.md + this file** — every UI/ Typst task.
2. **Use ONLY tokens §2.1.** No new hex, no arbitrary values.
3. **Prefer `bg-paper`/`bg-canvas` over `bg-zinc-50`.** Replace legacy zinc/gray with House v2.
4. **Icons:** `lucide-react` or `@phosphor-icons/react` only.
5. **A11y:** 4.5:1 text, 44×44 touch target, visible focus ring `focus-visible:ring-primary`.
6. **Humanize:** generous `p-5`/`p-6`, `gap-4`, `rounded-xl` — avoid cramped `p-2`.
7. **One warm theme per page.** No purple/blue glow, no 3 equal cards.
8. **791pt budget:** Never exceed 791pt bottom on content pages (verify via PyMuPDF §8.4).
9. **Syntax traps:** `[...]` not `"..."` for Typst math cells; no `];`; save `#1` to macro in LaTeX envs; escape `\&`.

---

## 5. Free Resources (still valid) + House v2 Pipeline

- **shadcn/ui** (MIT) — `npx shadcn@latest add button card input` then tokenize to House v2.
- **Lucide / Phosphor** (MIT) — stroke-consistent.
- **KaTeX + GeoGebra Materials + TeXample** — already in repo, keep SVGs anchored `content(A, [$A$], anchor: ...)`.
- **Build validation:** `scripts/verify.mjs` + `build.ps1` PyMuPDF 791pt check + leak scan (`degree`, `sym.angle`, etc.)

## 6. File Map for AI

- Canonical: `SYSTEM_SPEC.md` (brand, pedagogy, components, budgets)
- Bridge: `DESIGN.md` (this file — House v2 → Tailwind)
- Tokens: `apps/web/src/index.css` `@theme`
- Governance: `AGENT.md` + `CLAUDE.md` + `.cursor/rules/design.mdc` + `.cursorrules` → all point to SYSTEM_SPEC
- Print: `templates/master_sheet.typ` + `templates/sheet.typ`
- Web: `apps/web/src/components/*` (must consume tokens)
- Assets: `/assets/logo-*.png/svg` (never invent paths)

---

_Change palette? Edit `SYSTEM_SPEC.md §2.2` → then this file §2.1 + `index.css` `@theme` together. Never one without the others._
