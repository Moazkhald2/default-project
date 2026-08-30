#!/usr/bin/env node
// build_graph.mjs — extract->resolve->assemble->query for math concepts
// Analogous to Auto-Company memories/consensus.md but for math DAG
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const bankDir = "content/bank";
const vaultGlob = "Local_Math_Vault";
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

  const graph = {
    meta: {
      generated: new Date().toISOString(),
      stages: "extract->resolve->assemble->query",
      source: "content/bank + Local_Math_Vault",
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
