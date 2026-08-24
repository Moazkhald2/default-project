#!/usr/bin/env node
/**
 * generate_sheet.mjs — assemble content/bank/*.md into templates/sheet.typ
 * Usage: node scripts/generate_sheet.mjs --topic circle-theorems --grade 10 --out templates/sheet.generated.typ
 * Then: typst compile templates/sheet.generated.typ
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, c, i, arr) => {
    if (c.startsWith("--")) a.push([c.slice(2), arr[i + 1]]);
    return a;
  }, []),
);

const topic = args.topic ?? null;
const grade = args.grade ?? null;
const out = args.out ?? "templates/sheet.generated.typ";
const bankDir = "content/bank";
const master = "templates/sheet.typ";

function parseFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: src };
  const fm = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    fm[k] = v;
  }
  return { fm, body: m[2].trim() };
}

function escapeTypst(s) {
  let out = s
    .replaceAll(String.raw`\degree`, " degree")
    .replaceAll(String.raw`\angle`, "angle")
    .replaceAll(String.raw`\tan`, "tan")
    .replaceAll(String.raw`\approx`, "approx")
    .replaceAll(String.raw`\text{ cm}`, '"cm"')
    .replaceAll(String.raw`\text`, '"');
  // Inside each $...$ math block, split any 2+ uppercase letters: AOB -> A O B, ABC -> A B C
  out = out.replace(/\$[^$]*\$/g, (block) =>
    block.replace(/([A-Z]{2,})/g, (m) => m.split("").join(" ")),
  );
  return out;
}

async function main() {
  const files = (await readdir(bankDir)).filter((f) => f.endsWith(".md") && !f.startsWith("openstax"));
  const picked = [];
  for (const f of files) {
    const src = await readFile(path.join(bankDir, f), "utf8");
    const { fm, body } = parseFrontmatter(src);
    if (topic && fm.topic !== topic) continue;
    if (grade && fm.grade !== grade) continue;
    picked.push({ fm, body, file: f });
  }

  if (picked.length === 0) {
    console.log(`No questions matched topic=${topic} grade=${grade}`);
    process.exit(0);
  }

  const masterSrc = await readFile(master, "utf8");
  // Keep header part up to INJECTED marker
  const headerEnd = masterSrc.indexOf("// ===== INJECTED CONTENT STARTS HERE =====");
  const header = headerEnd !== -1 ? masterSrc.slice(0, headerEnd) : masterSrc.split("#question(")[0];

  let outSrc = header;
  outSrc += "// ===== INJECTED CONTENT STARTS HERE =====\n";
  outSrc += `#header(academy: "Math Academy — Geometry", unit: "${topic ?? "Mixed"} • Grade ${grade ?? "10"}", date: datetime.today())\n\n`;

  picked.forEach(({ fm, body }, i) => {
    const figureBlock = fm.figure
      ? `figure: image("/assets/geometry_templates/${fm.figure}", width: 60%),`
      : "";
    // Extract prompt (first paragraph before Choices/Answer)
    const prompt = body.split("\n\n")[0].replace(/\n/g, " ");
    outSrc += `#question(${i + 1}, [\n  ${escapeTypst(prompt)}\n], ${figureBlock} points: ${fm.points ?? 2})\n\n`;
  });

  await writeFile(out, outSrc, "utf8");
  console.log(`✓ Generated ${picked.length} Qs → ${out}`);
  console.log(`  Next: typst compile ${out} ${out.replace(".typ", ".pdf")}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
