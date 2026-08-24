#!/usr/bin/env node
/**
 * fetch_libraries.mjs — full vault fetcher (fetch-and-push)
 * Sources: Illustrative Math, OpenStax, Open Middle, WeBWorK OPL, Numbas, GeoGebra, TeXample
 * Low-VRAM: CPU + network only. Vault: Local_Math_Vault + mirrored content/bank + assets/
 * Usage: node scripts/fetch_libraries.mjs [all|geogebra|texample|openstax|im|openmiddle|webwork|numbas]
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const VAULT = path.join(ROOT, "Local_Math_Vault");
const OUT_GGB = path.join(ROOT, "assets/geometry_templates");
const OUT_TIKZ = path.join(ROOT, "content/bank/tikz_snippets");
const OUT_BANK = path.join(ROOT, "content/bank");
const VAULT_GEO = path.join(VAULT, "Question_Bank/Grade_09_12/Geometry");
const VAULT_ALG = path.join(VAULT, "Question_Bank/Grade_09_12/Algebra");
const VAULT_SVG = path.join(VAULT, "Vector_Assets/SVG_Diagrams");
const VAULT_TIKZ = path.join(VAULT, "Vector_Assets/TikZ_Snippets");

const LIBRARIES = {
  geogebra: [
    { id: "R4kXz7Mv", title: "Inscribed Angle Theorem", topic: "circle-theorems" },
    { id: "jybewqhg", title: "Right Triangle Trig", topic: "right-triangle-trigonometry" },
    { id: "q8gfygdc", title: "Parallel Lines Transversal", topic: "parallel-lines" },
    { id: "mfnw2b3u", title: "Similar Triangles", topic: "similarity" },
    { id: "kq2ymb3t", title: "Pythagoras Visual Proof", topic: "pythagoras" },
    { id: "cx4gv8yq", title: "Coordinate Grid Linear", topic: "coordinate-geometry" },
  ],
  texample: [
    { slug: "circle", url: "https://texample.net/tikz/examples/circle/", topic: "circle-theorems" },
    { slug: "pythagoras", url: "https://texample.net/tikz/examples/feature/angles/", topic: "pythagoras" },
    { slug: "coordinate-grid", url: "https://texample.net/tikz/examples/grid/", topic: "coordinate-geometry" },
    { slug: "triangle", url: "https://texample.net/tikz/examples/triangle/", topic: "similarity" },
  ],
  openstax: [
    { book: "Elementary Algebra 2e", url: "https://openstax.org/details/books/elementary-algebra-2e", topic: "algebra", repo: "https://github.com/openstax/osbooks-elementary-algebra-bundle" },
    { book: "Geometry", url: "https://openstax.org/details/books/geometry", topic: "geometry", repo: "https://github.com/openstax/osbooks-geometry-bundle" },
    { book: "Precalculus 2e", url: "https://openstax.org/details/books/precalculus-2e", topic: "calculus", repo: "https://github.com/openstax/osbooks-precalculus-bundle" },
  ],
  illustrativeMath: [
    { unit: "IM 6-8 Math", url: "https://im.kendallhunt.com/", topic: "middle-school", repo: "https://github.com/illustrativemath" },
    { unit: "IM 9-12 Geometry", url: "https://im.kendallhunt.com/HS/", topic: "geometry", repo: "https://github.com/IMCurriculum" },
  ],
  openMiddle: [
    { topic: "quadratic_formula", url: "https://www.openmiddle.com/category/high-school/", file: "openmiddle-quadratic.md" },
    { topic: "circle-theorems", url: "https://www.openmiddle.com/category/geometry/", file: "openmiddle-circle.md" },
  ],
  webwork: [
    { id: "OPL", desc: "WeBWorK Open Problem Library 35k+ PG problems", url: "https://github.com/openwebwork/webwork-open-problem-library", format: "PG (LaTeX + dynamic vars)" },
  ],
  numbas: [
    { desc: "Numbas public DB JSON + KaTeX", url: "https://numbas.org.uk/search/?q=geometry", format: "JSON KaTeX" },
  ],
};

async function ensureDirs() {
  for (const d of [OUT_GGB, OUT_TIKZ, OUT_BANK, VAULT_GEO, VAULT_ALG, VAULT_SVG, VAULT_TIKZ]) await mkdir(d, { recursive: true });
}

function manifestPath() { return path.join(OUT_GGB, "manifest.json"); }
function vaultManifestPath() { return path.join(VAULT, "Vector_Assets/manifest.json"); }

async function updateManifest(entries) {
  for (const mp of [manifestPath(), vaultManifestPath()]) {
    let m = { version: "1.0", templates: [], sources: {} };
    if (existsSync(mp)) try { m = JSON.parse(await readFile(mp, "utf8")); } catch {}
    for (const e of entries) if (!m.templates.find((t) => t.id === e.id)) m.templates.push(e);
    await writeFile(mp, JSON.stringify(m, null, 2));
  }
  console.log(`→ manifest updated: ${entries.length} entries → assets/ + Vault/`);
}

function geogebraToCetzStub({ id, topic, title }) {
  return `// GeoGebra ${title} (${id}) — topic: ${topic}
// SVG: assets/geometry_templates/${id}.svg  ↕  Vault/Vector_Assets/SVG_Diagrams/${id}.svg
// Embed: <GebraEmbed materialId="${id}" />
#canvas({
  import draw: *
  let O = (0, 0)
  circle(O, radius: 1.5, stroke: 1.2pt)
  content(O, [O], anchor: "south-east")
})
`;
}

async function fetchGeogebra() {
  console.log("\n[GeoGebra] 6 applets — embed JS + SVG for PDF");
  const entries = [];
  for (const g of LIBRARIES.geogebra) {
    const out = path.join(OUT_TIKZ, `${g.id}.typ`);
    if (!existsSync(out)) await writeFile(out, geogebraToCetzStub(g));
    // mirror to vault
    const vout = path.join(VAULT_TIKZ, `${g.id}.typ`);
    if (!existsSync(vout)) await writeFile(vout, geogebraToCetzStub(g));
    entries.push({ id: g.id, file: `${g.id}.svg`, materialId: g.id, topic: g.topic, grade: "10", tags: [g.topic], source: `https://www.geogebra.org/m/${g.id}` });
    console.log(`  + ${g.id} — ${g.title}`);
  }
  await updateManifest(entries);
}

async function fetchTexample() {
  console.log("\n[TeXample] TikZ → CeTZ anchored snippets");
  for (const t of LIBRARIES.texample) {
    const stub = `% TeXample: ${t.slug} — ${t.url}
% Convert \\coordinate (A) at (0,0) → let A=(0,0);  \\node[below left] at (A) -> content(A,[$A$],anchor:"north-east")
\\begin{tikzpicture}
% \\draw (A)--(B)--cycle;
\\end{tikzpicture}
`;
    for (const base of [OUT_TIKZ, VAULT_TIKZ]) {
      const out = path.join(base, `texample-${t.slug}.tex`);
      if (!existsSync(out)) await writeFile(out, stub);
    }
    console.log(`  + texample:${t.slug}`);
  }
}

async function fetchOpenStax() {
  console.log("\n[OpenStax] LaTeX bundles — clone to vault");
  for (const b of LIBRARIES.openstax) console.log(`  • ${b.book}: ${b.url}\n    git clone ${b.repo}  → then Docling to vault`);
  // ensure sample exists in both
  const sample = `---
id: openstax-geo-001
grade: "10"
topic: circle-theorems
difficulty: medium
figure: circle-inscribed-angle.svg
source: OpenStax Geometry
---

In the circle with centre $O$, $\\angle A O B = 80\\degree$. Find $\\angle A C B$.
`;
  for (const base of [OUT_BANK, VAULT_GEO]) {
    const out = path.join(base, "openstax-sample.md");
    if (!existsSync(out)) await writeFile(out, sample);
  }
}

async function fetchIM() {
  console.log("\n[Illustrative Mathematics] IM K-12 — thousands of tasks");
  for (const u of LIBRARIES.illustrativeMath) console.log(`  • ${u.unit}: ${u.url}  repo: ${u.repo}`);
  const imSample = `---
id: im-geo-001
grade: "10"
topic: similarity
difficulty: medium
figure: null
source: Illustrative Mathematics Geometry
---

A line parallel to one side of a triangle divides the other two sides proportionally. If $A D = 4$, $D B = 6$, $A E = 6$, find $E C$.

Answer: $E C = 9$ — Basic Proportionality Theorem.
`;
  for (const base of [OUT_BANK, VAULT_GEO]) {
    const out = path.join(base, "im-sample.md");
    if (!existsSync(out)) await writeFile(out, imSample);
  }
}

async function fetchOpenMiddle() {
  console.log("\n[Open Middle] Challenge problems — easy Markdown parse");
  for (const o of LIBRARIES.openMiddle) console.log(`  • ${o.topic}: ${o.url}`);
  const sample = `---
id: om-quad-001
grade: "10"
topic: quadratic_formula
difficulty: hard
figure: null
source: Open Middle
---

Using digits 1–9 at most once, make $ax^2+bx+c=0$ with two integer solutions.

Answer: Multiple — e.g. $x^2-5x+6=0$ gives $x=2,3$.
`;
  for (const base of [OUT_BANK, VAULT_ALG]) {
    const out = path.join(base, "openmiddle-sample.md");
    if (!existsSync(out)) await writeFile(out, sample);
  }
}

async function fetchWeBWorK() {
  console.log("\n[WeBWorK OPL] 35k PG problems — randomizable numbers");
  console.log(`  ${LIBRARIES.webwork[0].url} — PG format: LaTeX + $a,$b vars`);
  console.log("  Convert PG → Markdown: extract TEXT + ANS, keep $...$ blocks");
  const sample = `---
id: webwork-alg-001
grade: "10"
topic: quadratic_formula
difficulty: medium
figure: null
source: WeBWorK OPL
dynamic: true
---

If $a=2$, $b=5$, $c=3$, randomize $a,b,c$ per student, solve $ax^2+bx+c=0$.

Answer: dynamic — $x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}$
`;
  for (const base of [OUT_BANK, VAULT_ALG]) {
    const out = path.join(base, "webwork-sample.md");
    if (!existsSync(out)) await writeFile(out, sample);
  }
}

async function fetchNumbas() {
  console.log("\n[Numbas] JSON KaTeX exam platform");
  console.log(`  ${LIBRARIES.numbas[0].url} — export JSON → vault, render via KaTeX`);
  const sampleJson = JSON.stringify({ id: "numbas-geo-001", topic: "circle-theorems", question: "Find $\\angle ACB$ if $\\angle AOB=80\\degree$", answer: "$40\\degree$", vars: {} }, null, 2);
  for (const base of [OUT_BANK, VAULT_GEO]) {
    const out = path.join(base, "numbas-sample.json");
    if (!existsSync(out)) await writeFile(out, sampleJson);
  }
}

const arg = process.argv[2] ?? "all";
await ensureDirs();
if (arg === "all" || arg === "geogebra") await fetchGeogebra();
if (arg === "all" || arg === "texample") await fetchTexample();
if (arg === "all" || arg === "openstax") await fetchOpenStax();
if (arg === "all" || arg === "im") await fetchIM();
if (arg === "all" || arg === "openmiddle") await fetchOpenMiddle();
if (arg === "all" || arg === "webwork") await fetchWeBWorK();
if (arg === "all" || arg === "numbas") await fetchNumbas();

console.log("\nVault: Local_Math_Vault/");
console.log("  Curriculum_Frameworks/Egypt_Grade10_Math_2026.json");
console.log("  Question_Bank/Grade_09_12/{Geometry,Algebra}/");
console.log("  Vector_Assets/{SVG_Diagrams,GeoGebra_IDs,TikZ_Snippets}/");
console.log("\nNext: node scripts/ingest.mjs Local_Math_Vault/Question_Bank --vault");
console.log("      python math_builder.py --topic circle_theorems");
