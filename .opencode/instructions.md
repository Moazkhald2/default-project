# Project Instructions — The Math Mentor

## Project Overview
Math education platform for Mr. Moaz Khaled's students (Grades 10-12). Brand: The Math Mentor.

## Tech Stack
- React 19 + Vite + TypeScript + Tailwind v4
- Supabase (database, auth, storage)
- Cloudflare Workers/Pages (deployment)
- Typst + CeTZ (print-quality PDFs)
- KaTeX (math rendering)
- SQLite/Turso (local dev)
- Hono (edge API)

## Key Files
- `SYSTEM_SPEC.md` — canonical brand + pedagogy + components spec
- `DESIGN.md` — AI bridge: SYSTEM_SPEC tokens → Tailwind v4 @theme
- `templates/master_sheet.typ` — branded master template
- `math_builder.py` — fetcher+adapter+publisher
- `scripts/generate_sheet.mjs` — sheet generation
- `apps/web/src/components/MathExam.tsx` — exam component

## Workflow
1. Search vault first, never generate from scratch if template exists
2. Output ONLY #question blocks; header lives in templates/master_sheet.typ
3. Build: `python math_builder.py --topic <topic> --grade 10 --out ./dist`
4. Design consistency: Use ONLY tokens in `apps/web/src/index.css` @theme
5. Math ALWAYS in standard Typst notation (never plain text like "xA^2")
6. Deliver as PDF (via Edge headless print pipeline) AND auto-open after generation

## Testing
- `npm test` — run all tests
- `npm run lint` — oxlint
- `npm run typecheck` — TypeScript check
- `npm run build` — production build

## Deployment
- Cloudflare Pages via GitHub Actions
- Supabase for database
- All secrets in .env (gitignored)
