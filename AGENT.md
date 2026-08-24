# AGENT — The Math Mentor (`themathmentor.edu`) · Project Root Agent Instructions

Every AI coding assistant, autonomous agent, and LLM toolchain operating in this workspace (Antigravity, OpenCode, Claude Code, Cursor, Copilot, etc.) **MUST STRICTLY COMPLY** with the unified brand standards defined in [`SYSTEM_SPEC.md`](./SYSTEM_SPEC.md) + the AI bridge [`DESIGN.md`](./DESIGN.md).

---

## 0. Governance — Golden Rules (Non-Negotiable) — from SYSTEM_SPEC §1

1. **Read `SYSTEM_SPEC.md` First**: Before creating or modifying any worksheets, workbooks, exams, LaTeX styles, Typst templates, or frontend components, consult `SYSTEM_SPEC.md` for tokens, macros, and layout archetypes. `DESIGN.md` is the AI-consumable bridge — it re-exports those tokens to Tailwind.
2. **Single Source of Truth for Assets**: Always reference brand assets strictly from top-level `/assets`:
   - `assets/logo-main.png` / `assets/logo-main.svg` (Horizontal primary color logo)
   - `assets/logo-symbol.png` / `assets/logo-symbol.svg` (Brand symbol icon)
   - `assets/logo-white.png` / `assets/logo-white.svg` (Knockout white logo for dark covers)
3. **Unified Brand Tokens (House v2)**: Primary Teal `#0A9396` (Light `#E6F5F5`, Dark `#0A6F72`), Navy `#1A1A2E`, Cyan `#01CBFC`, Gold `#D4A373`, Terra `#E76F51`, Sage `#84A98C`, Ink `#2D3436`, Paper `#FAF9F6` — full table in `SYSTEM_SPEC.md §2.2`. Web maps to `apps/web/src/index.css` `@theme`.
4. **Curriculum Grade Accent Mapping**: G4 `#E76F51` | G5 `#CF7B1D` | G6 `#B33A63` | G7 `#2980B9` | G8 `#8E44AD` | G9 `#6C3483` | G10 `#0A9396` | G11 `#1A1A2E`
5. **Figure-First Pedagogical Law**: Geometry/visual topics → diagram FIRST (≥65–85% width) with one-line caption before English text.
6. **Pedagogical Structure**: I Do two-column (`Math Steps` + italic `What We Think`), You Do workspace with `"work it out here"` watermark + compact Answers, Common Mistakes `[WRONG]→Why→[RIGHT]`.
7. **791pt A4 Budget Rule**: Bottom-most element on any content page must NEVER exceed 791pt (footer 810–822pt). Verify via PyMuPDF script in `SYSTEM_SPEC.md §8.4`.
8. **Mandatory Syntax Traps**: Typst cells/rows must be `[...]` not `"..."`; never `];` semicolon after `]`; LaTeX `#1` saved to macro for end-code; escape `\&`.

- **Attribution**: `Created by Mr/Moaz Khaled · Designed by Joe for Designs · All rights reserved · www.themathmentor.edu · @themathmentor`
- **Mottos**: _"The Lesson Counts."_ / _"Learn It. Do It. Own It."_

---

## 1. Stack (2GB VRAM, 32GB RAM — CPU-first)

- Typst + CeTZ, KaTeX, Docling/Marker CPU, Mathpix API
- GeoGebra SVG (print) / GGBApplet (web), TeXample TikZ
- SQLite/Turso + Hono edge API, Vault: Local_Math_Vault/

## 2. Vault Layout

- `Local_Math_Vault/Curriculum_Frameworks/Egypt_Grade10_Math_2026.json` — week→topic map
- `Local_Math_Vault/Question_Bank/Grade_09_12/{Geometry,Algebra}/` — Markdown + YAML
- `Local_Math_Vault/Vector_Assets/{SVG_Diagrams,TikZ_Snippets}` — vectors, anchored
- Mirrored: `content/bank/` + `assets/geometry_templates/` (compat)

## 3. Operational Rules — see .cursorrules + SYSTEM_SPEC §8

1. Search vault first, never generate from scratch if template exists.
2. Anchored geometry only: `let A=(0,0); content(A,[$A$],anchor:"south-east")`
3. Output ONLY #question blocks; header lives in templates/master_sheet.typ
4. Build: `python math_builder.py --topic <topic> --grade 10 --out ./dist` OR `node scripts/generate_sheet.mjs ...` → `typst compile --root .` → fix via short_error.txt only.
5. **Design consistency (House v2):** Before any UI work, read `SYSTEM_SPEC.md` + `DESIGN.md` + `.cursor/rules/design.mdc`. Use ONLY tokens in `apps/web/src/index.css` `@theme` (`bg-primary` `#0A9396`, `bg-navy`, `bg-gold`, `bg-terra`, `bg-sage`, `bg-paper` `#FAF9F6`, `text-ink` `#2D3436`, etc.). No invented hex/arbitrary values. Print `templates/master_sheet.typ` and web share `#0A9396` / `#FAF9F6` / `#2D3436`.

## 4. Key Files

- `SYSTEM_SPEC.md` — canonical brand + pedagogy + components spec (v2.0)
- `DESIGN.md` — AI bridge: SYSTEM_SPEC tokens → Tailwind v4 `@theme` + component strict rules
- `.cursor/rules/design.mdc` — Cursor enforcement (reads SYSTEM_SPEC + DESIGN)
- `templates/master_sheet.typ` — branded master (header/footer + CeTZ) — House v2 colors
- `templates/sheet.typ` — minimal master
- `math_builder.py` — fetcher+adapter+publisher (Typst + Astro + React)
- `scripts/fetch_libraries.mjs` — pulls IM/OpenStax/OpenMiddle/WeBWorK/Numbas/GeoGebra/TeXample
- `scripts/ingest.mjs` — validates frontmatter + KaTeX + figure refs
- `apps/web/src/components/MathExam.tsx` — Vite React exam (KaTeX + GebraEmbed)
- `apps/web/src/index.css` — Tailwind v4 `@theme` (House v2 mapping)
