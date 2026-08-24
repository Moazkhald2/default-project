This stub represents a PDF page — ingest_pdf will treat any .pdf here.
For demo, we create a fake PDF via Typst then ingest.

To generate a real PDF for testing:
typst compile templates/sheet.typ raw_pdfs/sample_quadratic.pdf --root .
Then:
node scripts/ingest_pdf.mjs raw_pdfs/sample_quadratic.pdf --out Local_Math_Vault/Question_Bank/Grade_09_12/Algebra
