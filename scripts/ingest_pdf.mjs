#!/usr/bin/env node
/**
 * ingest_pdf.mjs — PDF → Markdown/LaTeX vault (low-VRAM pipeline)
 * Tries: Docling (IBM CPU) → Marker --use_llm fallback → PyMuPDF4LLM → Pandoc
 * Falls back to stub conversion that preserves file for manual Mathpix.
 * Usage: node scripts/ingest_pdf.mjs ./raw_pdfs/*.pdf --out Local_Math_Vault/Question_Bank/Grade_09_12/Geometry
 */
import { spawnSync } from "node:child_process";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const args = process.argv.slice(2);
const outIdx = args.indexOf("--out");
const outDir = outIdx !== -1 ? args[outIdx + 1] : "Local_Math_Vault/Question_Bank/Grade_09_12/Geometry";
const pdfs = args.filter((a) => a.endsWith(".pdf") && !a.startsWith("--"));

if (pdfs.length === 0) {
  console.log("Usage: node scripts/ingest_pdf.mjs <pdfs...> --out <vault_dir>");
  console.log("Example: node scripts/ingest_pdf.mjs ./raw_pdfs/*.pdf --out Local_Math_Vault/Question_Bank/Grade_09_12/Geometry");
  console.log("\nLow-VRAM order: docling → marker → pymupdf4llm → pandoc → stub");
  console.log("For heavy math pages, use Mathpix API: https://mathpix.com/docs");
  process.exit(0);
}

await mkdir(outDir, { recursive: true });
await mkdir("raw_pdfs", { recursive: true });

function tryCmd(cmd, a) {
  const r = spawnSync(cmd, a, { stdio: "pipe", timeout: 30000 });
  return r.status === 0;
}

for (const pdf of pdfs) {
  if (!existsSync(pdf)) {
    console.log(`skip missing: ${pdf}`);
    continue;
  }
  const base = path.basename(pdf, ".pdf").replaceAll(" ", "_").toLowerCase();
  const outMd = path.join(outDir, `${base}.md`);
  console.log(`\n→ ${pdf} → ${outMd}`);

  let done = false;

  // 1. Docling (IBM, CPU-light, best for 32GB RAM)
  // lgtm[js/useless-conditional] — done is false on first iteration, but kept for symmetry with later checks
  if (!done && tryCmd("docling", ["--help"])) {
    console.log("  trying docling (CPU)...");
    if (tryCmd("docling", [pdf, "--to", "md", "--output", outMd])) {
      console.log("  ✓ docling");
      done = true;
    }
  }
  // 2. Marker CPU/hybrid
  if (!done && tryCmd("marker", ["--help"])) {
    console.log("  trying marker...");
    if (tryCmd("marker", [pdf, outMd, "--use_llm", "false"])) done = true;
  }
  // 3. Python pymupdf4llm
  if (!done) {
    const py = spawnSync("python", ["-c", "import pymupdf4llm; print('ok')"], { stdio: "pipe" });
    if (py.status === 0) {
      console.log("  trying pymupdf4llm...");
      const conv = spawnSync("python", ["-c", `import pymupdf4llm, pathlib; md=pymupdf4llm.to_markdown('${pdf.replaceAll("\\", "/")}'); pathlib.Path('${outMd.replaceAll("\\", "/")}').write_text(md, encoding='utf-8')`], { stdio: "inherit" });
      if (conv.status === 0 && existsSync(outMd)) {
        console.log("  ✓ pymupdf4llm");
        done = true;
      }
    }
  }
  // 4. Pandoc
  if (!done && tryCmd("pandoc", ["--version"])) {
    console.log("  trying pandoc...");
    if (tryCmd("pandoc", [pdf, "-t", "markdown", "-o", outMd])) {
      console.log("  ✓ pandoc");
      done = true;
    }
  }

  if (!done) {
    // Stub: create frontmatter template for Mathpix/manual fill
    const stub = `---
id: ${base}
grade: "10"
topic: TODO_TOPIC
difficulty: medium
figure: null
source: ${path.basename(pdf)}
---

<!-- TODO: Paste Mathpix/Marker output here. Convert math to $...$ blocks, clean broken lines -->
<!-- Example: Find $x$ if $x^2 + 5x + 6 = 0$. -->

Raw PDF: ${pdf} — run Mathpix Snipping Tool or https://mathpix.com for LaTeX, then paste below.
`;
    await writeFile(outMd, stub, "utf8");
    console.log(`  ⚠ no converter found — stub created → edit ${outMd}`);
    console.log("  Install one: pip install docling pymupdf4llm  OR  pip install marker-pdf  OR  sudo apt install pandoc");
  } else {
    // Post-process: wrap file with frontmatter if missing
    const txt = await readFile(outMd, "utf8");
    if (!txt.startsWith("---")) {
      const wrapped = `---
id: ${base}
grade: "10"
topic: TODO_TOPIC
difficulty: medium
figure: null
source: ${path.basename(pdf)}
---

${txt}
`;
      await writeFile(outMd, wrapped, "utf8");
      console.log("  → added frontmatter (set topic!)");
    }
    // Validate dir (not file)
    spawnSync("node", ["scripts/ingest.mjs", outDir], { stdio: "inherit" });
  }
}

console.log(`\nDone. Next: edit frontmatter topic: → then node scripts/ingest.mjs ${outDir}`);
console.log("Curriculum PDF? Map old topics to new via: node scripts/adapt_syllabus.mjs --from old.pdf --to Egypt_Grade10_Math_2026.json");
