# Deploy Checklist — Math Academy Launch

Zero-sweat business — nothing breaks when parents pay.

## Pre-Pay Gate (must be ✓ before taking money)

- [ ] `node scripts/ingest.mjs Local_Math_Vault/Question_Bank` → 9 ok
- [ ] `npx tsx apps/api/src/db/seed.ts` → 18 questions → dev.db (+ Turso prod)
- [ ] `node scripts/batch_generate.mjs --weeks=1-4 --grade=10` → 4 PDFs <0.1s each, vector sharp
- [ ] `powershell -File scripts/fast_build.ps1` on `templates/master_sheet.typ` → SUCCESS
- [ ] `node scripts/dry_run.mjs` → ✓ Ready to take payments
- [ ] `npm run verify` → typecheck + lint + test + build PASS
- [ ] Branding: `templates/master_sheet.typ` + `templates/sheet.typ` headers = "Math Academy", footer "Confidential", fonts Libertinus Serif 10.5pt, strokes #111827/#e5e7eb
- [ ] Web: `npm run build -w @app/web` → initial JS <500KB (lazy Teacher 2.3KB, Exam 1.9KB), images eager + fetchpriority high

## Deploy

- Web (static): Cloudflare Pages or Vercel → `apps/web/dist`
- API (edge): `wrangler deploy --cwd apps/api` with secrets:
  ```
  wrangler secret put TURSO_DATABASE_URL
  wrangler secret put TURSO_AUTH_TOKEN
  ```
- Fallback: local stays build studio; even if Ryzen off, edge stays 24/7

## Daily Teacher Flow (2 sec)

```
1. Vault search first: Local_Math_Vault/Question_Bank/Grade_09_12/{Geometry,Algebra}
2. python math_builder.py --topic circle_theorems --grade 10 --out ./dist/week3
   # OR node scripts/generate_sheet.mjs --topic circle_theorems
3. typst compile --root . dist/sheet.typ dist/sheet.pdf
4. Push exam.react.json to web → auto KaTeX + GebraEmbed
```

## When Curriculum Changes (bridge gap)

```
node scripts/ingest_pdf.mjs raw_pdfs/*.pdf --out Local_Math_Vault/Question_Bank/Grade_09_12/Geometry
node scripts/adapt_syllabus.mjs --batch Local_Math_Vault/Question_Bank
# For reword: opencode run "Adapt old Q to new topic X, keep $...$" < old.md > new.md
```

## Week 1-4 PDFs

- `dist/week1_quadratic_formula/sheet.pdf` 23.2KB
- `dist/week2_quadratic_formula/sheet.pdf` 23.2KB
- `dist/week3_circle_theorems/sheet.pdf` 24.3KB
- `dist/week4_circle_theorems/sheet.pdf` 24.3KB
  Preview: `python -m http.server 8000 --directory dist`
