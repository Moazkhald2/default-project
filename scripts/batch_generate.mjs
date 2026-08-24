#!/usr/bin/env node
/**
 * batch_generate.mjs — Weeks 1-4 emergency batch (7-Day Sprint)
 * Reads Local_Math_Vault/Curriculum_Frameworks/Egypt_Grade10_Math_2026.json
 * Generates Typst PDFs + web JSON per week via math_builder.py / generate_sheet.mjs
 * Usage: node scripts/batch_generate.mjs [--weeks 1-4] [--grade 10]
 */
import { readFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const GRADE = process.argv.find((a) => a.startsWith("--grade="))?.split("=")[1] ?? "10";
const WEEKS_ARG = process.argv.find((a) => a.startsWith("--weeks="))?.split("=")[1] ?? "1-4";

function parseWeeks(s) {
  const [a, b] = s.split("-").map(Number);
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

const weeks = parseWeeks(WEEKS_ARG);
const cfPath = path.resolve(`Local_Math_Vault/Curriculum_Frameworks/Egypt_Grade${GRADE}_Math_2026.json`);
if (!existsSync(cfPath)) {
  console.error(`Missing ${cfPath}`);
  process.exit(1);
}
const cf = JSON.parse(await readFile(cfPath, "utf8"));

console.log(`Batch: Grade ${GRADE} Weeks ${WEEKS_ARG} — ${cf.framework}`);

for (const w of weeks) {
  const unit = cf.units.find((u) => u.weeks.includes(w));
  if (!unit) {
    console.log(`  Week ${w}: no unit, skip`);
    continue;
  }
  let topic = unit.topics[0]; // primary topic per week
  // alias: curriculum uses inscribed_angles but bank uses circle_theorems
  const alias = { inscribed_angles: "circle_theorems", central_angles: "circle_theorems", chord_theorems: "circle_theorems" };
  if (alias[topic]) topic = alias[topic];
  const outDir = path.resolve(`dist/week${w}_${topic}`);
  await mkdir(outDir, { recursive: true });
  console.log(`\nWeek ${w}: ${unit.title} → topic=${topic} → ${path.relative(process.cwd(), outDir)}`);

  // Python builder (preferred) — handles Typst normalization + --root
  const py = spawnSync("python", ["math_builder.py", "--topic", topic, "--grade", GRADE, "--out", outDir], { stdio: "inherit" });
  if (py.status !== 0) {
    console.log(`  python failed, fallback to JS builder for ${topic}`);
    spawnSync("node", ["scripts/generate_sheet.mjs", "--topic", topic, "--grade", GRADE, "--out", path.join(outDir, "sheet.typ")], { stdio: "inherit" });
    spawnSync("powershell", ["-ExecutionPolicy", "Bypass", "-File", "scripts/fast_build.ps1", "-InputFile", path.join(outDir, "sheet.typ"), "-OutputFile", path.join(outDir, "sheet.pdf")], { stdio: "inherit" });
  }

  // also copy weekly manifest
  const bankFiles = await readdir(outDir).catch(() => []);
  console.log(`  → ${bankFiles.join(", ") || "check outDir"}`);
}

console.log(`\n✓ Batch done. PDFs in dist/week*/sheet.pdf`);
console.log(`  Preview: python -m http.server 8000 --directory dist`);
console.log(`  Web API: /api/exams/bank?topic=circle_theorems&grade=10`);
