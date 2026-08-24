#!/usr/bin/env node
/**
 * adapt_syllabus.mjs — old PDFs → new syllabus (bridge gap when curriculum changed)
 * Reads old question bank or PDF stub, maps by topic (not chapter) to new framework,
 * rewrites with new topic tags for vault. No LLM needed for tag remap; optional LLM for reword.
 * Usage: node scripts/adapt_syllabus.mjs --src Local_Math_Vault/Question_Bank/Grade_09_12/Geometry/old.md --new-topic circle_theorems
 *        node scripts/adapt_syllabus.mjs --batch Local_Math_Vault/Question_Bank --map curriculum_map.json
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, c, i, arr) => {
    if (c.startsWith("--")) a.push([c.slice(2), arr[i + 1] ?? "true"]);
    return a;
  }, []),
);

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fm[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2].trim() };
}

function stringify(fm, body) {
  const head = Object.entries(fm).map(([k, v]) => `${k}: "${v}"`).join("\n");
  return `---\n${head}\n---\n\n${body}\n`;
}

// Simple topic alias map — extend as ministry sample appears
const TOPIC_ALIAS = {
  "quadratic equations": "quadratic_formula",
  "quadratics": "quadratic_formula",
  "inscribed angles": "circle_theorems",
  "central angles": "circle_theorems",
  "circle theorems": "circle_theorems",
  "right triangle": "right_triangle_trigonometry",
  "pythagoras": "pythagoras",
  "parallel lines": "parallel_lines",
  "similarity": "similarity",
};

function normalizeTopic(s) {
  const k = s.toLowerCase().replaceAll("-", " ").trim();
  return TOPIC_ALIAS[k] ?? k.replaceAll(" ", "_");
}

if (args.src && args["new-topic"]) {
  const src = await readFile(args.src, "utf8");
  const { fm, body } = parseFrontmatter(src);
  fm.topic = normalizeTopic(args["new-topic"]);
  fm.grade = args.grade ?? fm.grade ?? "10";
  const out = args.out ?? args.src.replace(".md", `.adapted.${fm.topic}.md`);
  await writeFile(out, stringify(fm, body), "utf8");
  console.log(`Adapted ${args.src} → topic=${fm.topic} → ${out}`);
  process.exit(0);
}

if (args.batch) {
  const dir = path.resolve(args.batch);
  // Node <20 doesn't support recursive string list, fallback
  const collect = async (d, out = []) => {
    const entries = await readdir(d, { withFileTypes: true }).catch(() => []);
    for (const e of entries) {
      const full = path.join(d, e.name);
      if (e.isDirectory()) await collect(full, out);
      else if (e.name.endsWith(".md")) out.push(full);
    }
    return out;
  };
  const all = await collect(dir);
  let n = 0;
  for (const f of all) {
    const src = await readFile(f, "utf8");
    const { fm, body } = parseFrontmatter(src);
    const rawTopic = fm.topic ?? "";
    const norm = normalizeTopic(rawTopic);
    if (norm !== rawTopic) {
      fm.topic = norm;
      await writeFile(f, stringify(fm, body), "utf8");
      console.log(`  ${path.relative(dir, f)}: ${rawTopic} → ${norm}`);
      n++;
    }
  }
  console.log(`Batch normalized ${n} files in ${dir}`);
  if (args.map && existsSync(args.map)) {
    const map = JSON.parse(await readFile(args.map, "utf8"));
    console.log(`Map ${args.map}: ${map.units?.length ?? 0} units — ready for batch_generate`);
  }
  process.exit(0);
}

console.log("Usage:");
console.log("  node scripts/adapt_syllabus.mjs --src old.md --new-topic circle_theorems --grade 10");
console.log("  node scripts/adapt_syllabus.mjs --batch Local_Math_Vault/Question_Bank --map Local_Math_Vault/Curriculum_Frameworks/Egypt_Grade10_Math_2026.json");
console.log("\nLLM reword (optional, needs API key):");
console.log('  opencode run "Adapt this old PDF question to new syllabus topic circle_theorems, keep $...$ LaTeX" < old.md > new.md');
