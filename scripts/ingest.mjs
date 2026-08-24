#!/usr/bin/env node
/**
 * ingest.mjs — validate content/bank/*.md frontmatter + KaTeX + figure refs
 * Low-RAM, CPU only. No GPU.
 * Usage: node scripts/ingest.mjs [dir]
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";

const dir = process.argv[2] ?? "content/bank";
const REQUIRED = ["id", "grade", "topic", "difficulty"];

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    fm[k] = v;
  }
  return { fm, body: m[2] };
}

function checkKatex(body) {
  // naive bracket check — real check is katex render in app
  const opens = (body.match(/\$/g) || []).length;
  return opens % 2 === 0 ? [] : ["Unmatched $ — odd number of $ delimiters"];
}

async function collect(dir, out=[]) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await collect(full, out);
    else if (e.name.endsWith(".md") || e.name.endsWith(".json")) out.push(full);
  }
  return out;
}
async function main() {
  const files = (await collect(dir)).filter((f) => f.endsWith(".md"));
  if (files.length === 0) {
    console.log(`No .md files in ${dir}`);
    return;
  }
  let ok = 0, fail = 0;
  for (const full of files) {
    const f = path.relative(dir, full);
    const src = await readFile(full, "utf8");
    const parsed = parseFrontmatter(src);
    const errs = [];
    if (!parsed) errs.push("Missing YAML frontmatter ---");
    else {
      for (const k of REQUIRED) if (!parsed.fm[k]) errs.push(`Missing frontmatter: ${k}`);
      if (parsed.fm.figure && parsed.fm.figure !== "null" && parsed.fm.figure !== "" && !existsSync(path.join("assets/geometry_templates", parsed.fm.figure))) {
        // not fatal — may be fetched later
        errs.push(`Figure not found locally: assets/geometry_templates/${parsed.fm.figure} (run fetch_libraries)`);
      }
      errs.push(...checkKatex(parsed.body));
    }
    if (errs.length === 0) {
      console.log(`✓ ${f} — ${parsed.fm.id} [${parsed.fm.topic}]`);
      ok++;
    } else {
      console.log(`✗ ${f}`);
      for (const e of errs) console.log(`  - ${e}`);
      fail++;
    }
  }
  console.log(`\n${ok} ok, ${fail} with warnings`);
  if (fail > 0) console.log("Hint: typst anchor check → ensure content(P,[label],anchor:...) not absolute coords");
}

main().catch((e) => { console.error(e); process.exit(1); });
