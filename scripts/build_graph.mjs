#!/usr/bin/env node
// build_graph.mjs — extract->resolve->assemble->query for math concepts
// Analogous to Auto-Company memories/consensus.md but for math DAG
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const bankDir = "content/bank";
const curriculumFile = "Local_Math_Vault/Curriculum_Frameworks/Egypt_Math_2026_2027_FirstTerm.json";
const outFile = "data/math_graph.json";

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

// naive normalize — resolves aliases
const aliases = {
  pythagoras: "pythagorean-theorem",
  pythagorean: "pythagorean-theorem",
  "right-triangle": "right-triangle-trigonometry",
  "circle-theorem": "circle-theorems",
};

function normalize(topic) {
  return aliases[topic] ?? topic;
}

async function main() {
  const files = await readdir(bankDir).catch(() => []);
  const nodes = new Map();
  const edges = [];
  let curriculumOutcomes = 0;

  // Stage 1: ingest curriculum frameworks (441 outcomes across G1-G9)
  try {
    const raw = await readFile(curriculumFile, "utf8");
    const j = JSON.parse(raw);
    for (const g of j.grades ?? []) {
      const grade = String(g.grade);
      for (const o of g.outcomes ?? []) {
        // also keep raw outcome node
        const id = `outcome:${o.id}`;
        if (!nodes.has(id)) {
          nodes.set(id, {
            id,
            topic: o.text.slice(0, 80),
            grade,
            prereqs: [],
            count: 1,
            sources: [`curriculum:${o.id}`],
            fullText: o.text,
          });
        }
        curriculumOutcomes++;
      }
      // grade summary node
      const gid = `grade:${grade}`;
      if (!nodes.has(gid)) {
        nodes.set(gid, {
          id: gid,
          topic: `Grade ${grade} ${g.stage}`,
          grade,
          prereqs: Number(grade) > 1 ? [`grade:${Number(grade) - 1}`] : [],
          count: g.totalOutcomes,
          sources: [`curriculum:grade-${grade}`],
        });
        if (Number(grade) > 1) edges.push({ from: `grade:${Number(grade) - 1}`, to: gid, label: "prereq" });
      }
    }
    // cross-grade prerequisite chain: G7 geometry -> G8 radicals -> G9 quadratics
    const chain = [
      ["grade:7", "grade:8"],
      ["grade:8", "grade:9"],
    ];
    for (const [from, to] of chain) if (nodes.has(from) && nodes.has(to) && !edges.find((e) => e.from === from && e.to === to)) edges.push({ from, to, label: "curriculum" });
  } catch (e) {
    console.warn(`curriculum ingest skipped: ${e.message}`);
  }

  for (const f of files.filter((x) => x.endsWith(".md"))) {
    const src = await readFile(path.join(bankDir, f), "utf8");
    const { fm } = parseFrontmatter(src);
    const topic = normalize(fm.topic ?? "unknown");
    const grade = fm.grade ?? "10";
    const id = `${topic}:${grade}`;
    if (!nodes.has(id)) {
      nodes.set(id, { id, topic, grade, prereqs: [], count: 0, sources: [] });
    }
    nodes.get(id).count++;
    nodes.get(id).sources.push(f);
    // infer prereqs heuristic
    if (topic === "right-triangle-trigonometry") {
      nodes.get(id).prereqs = ["pythagorean-theorem:10"];
      edges.push({ from: "pythagorean-theorem:10", to: id, label: "requires" });
    }
    if (topic === "circle-theorems") {
      nodes.get(id).prereqs = ["angle-basics:9"];
      edges.push({ from: "angle-basics:9", to: id, label: "requires" });
    }
  }

  // ensure prereq nodes exist
  for (const e of edges) {
    if (!nodes.has(e.from)) {
      const [topic, grade] = e.from.split(":");
      nodes.set(e.from, { id: e.from, topic, grade, prereqs: [], count: 0, sources: [] });
    }
  }

  // Link bank topics to curriculum grade nodes
  for (const n of nodes.values()) {
    if (n.id.startsWith("grade:")) continue;
    if (n.id.startsWith("outcome:")) continue;
    // n is bank topic like circle_theorems:10 -> link to grade:10 if exists, else grade:9 chain
    const g = n.grade;
    const gid = `grade:${g}`;
    if (nodes.has(gid) && !edges.find((e) => e.from === gid && e.to === n.id)) {
      edges.push({ from: gid, to: n.id, label: "curriculum" });
    }
  }

  const graph = {
    meta: {
      generated: new Date().toISOString(),
      stages: "extract->resolve->assemble->query",
      source: "content/bank + Local_Math_Vault (Egypt 2026-2027 441 outcomes + bank)",
      curriculumOutcomes,
      bankTopics: [...nodes.values()].filter((n) => !n.id.startsWith("grade:") && !n.id.startsWith("outcome:")).length,
    },
    nodes: [...nodes.values()],
    edges,
  };

  await mkdir(path.dirname(outFile), { recursive: true });
  await writeFile(outFile, JSON.stringify(graph, null, 2), "utf8");
  console.log(`✓ graph ${graph.nodes.length} nodes, ${edges.length} edges -> ${outFile}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
