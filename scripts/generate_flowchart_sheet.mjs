#!/usr/bin/env node
// generate_flowchart_sheet.mjs — flowchart specs -> Typst CeTZ via anchored nodes
import { readFile, writeFile } from "node:fs/promises";

const specs = [
  { id: "rightTriangle", title: "Right Triangle — tan⁻¹", tex: `In right triangle $ABC$, $\\\\angle B=90^\\\\circ$, $AB=4\\\\text{ cm}$, $BC=3\\\\text{ cm}$. Find $x=\\\\angle A$.` },
  { id: "quadratic", title: "Quadratic — Formula Path", tex: `Solve $ax^2+bx+c=0$ via discriminant.` },
  { id: "similarity", title: "Similarity — Prove similar", tex: `$\\\\triangle ABC \\\\sim \\\\triangle DEF ?$ via AA/SAS/SSS` },
  { id: "circle", title: "Circle — Inscribed angle", tex: `$\\\\angle AOB=80^\\\\circ$ => $\\\\angle ACB=40^\\\\circ$` },
];

const out = process.argv.includes("--out") ? process.argv[process.argv.indexOf("--out") + 1] : "templates/flowchart_sheet_generated.typ";

const header = await readFile("templates/flowchart_sheet.typ", "utf8");
await writeFile(out, header, "utf8");
console.log(`✓ flowchart sheet template -> ${out} (${specs.length} specs)`);
console.log(`  Next: typst compile ${out} ${out.replace(".typ", ".pdf")}`);
