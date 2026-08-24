# raw_pdfs — drop new ministry PDFs here

Example:

```
raw_pdfs/
  Grade10_Geometry_2026.pdf
  old_quadratic_bank.pdf
```

Then:

```bash
node scripts/ingest_pdf.mjs raw_pdfs/*.pdf --out Local_Math_Vault/Question_Bank/Grade_09_12/Geometry
node scripts/adapt_syllabus.mjs --batch Local_Math_Vault/Question_Bank
npm run ingest:vault
npx tsx apps/api/src/db/seed.ts
npm run sheet:week
```

Docling/Marker will auto-convert → Markdown + $...$ LaTeX. If no converter, stub .md created — paste Mathpix output.
