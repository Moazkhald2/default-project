#!/usr/bin/env node
// math-auto-loop.mjs — lightweight Auto-Company for math flowcharts
// 5-layer MAS simplified: 3-agent squad (Planner/Geometer/QA) vs 14, consensus.md baton
// Usage: node scripts/math-auto-loop.mjs --once   (single cycle, no daemon)
//        node scripts/math-auto-loop.mjs          (daemon every --interval 30s, --interval 30)
// Mirrors MaxMiksa/Auto-Company scripts/core/auto-loop.sh but Node-only, no bypassPermissions

import { readFile, writeFile, mkdir } from "node:fs/promises";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, c, i, arr) => {
    if (c.startsWith("--")) a.push([c.slice(2), arr[i + 1] ?? "true"]);
    return a;
  }, []),
);

const ONCE = args.once !== undefined;
const INTERVAL = Number(args.interval ?? 30) * 1000;
const CONSENSUS = "memories/consensus.md";
const GRAPH = "data/math_graph.json";

// 3-agent squad personas (Auto-Company 14 -> 3)
const squad = {
  planner: "Planner — breaks outcome into DAG steps (Munger inversion, Bezos PR/FAQ)",
  geometer: "Geometer — chooses figure (Norman affordance, Duarte material), KaTeX + GeoGebra",
  qa: "QA — James Bach exploratory, validates with archify 9 checks + vitest",
};

async function readConsensus() {
  try { return await readFile(CONSENSUS, "utf8"); } catch { return ""; }
}

async function readGraph() {
  try { return JSON.parse(await readFile(GRAPH, "utf8")); } catch { return { nodes: [], edges: [], meta: {} }; }
}

function pickNextOutcome(graph) {
  // pick first G7-G9 outcome not yet represented as flowchart spec (heuristic: outcome:G7* without flow)
  const candidates = graph.nodes.filter((n) => n.id.startsWith("outcome:G") && ["7","8","9"].includes(n.grade));
  // naive: pick next not in completed list (we store completed in consensus)
  return candidates[0] ?? null;
}

async function cycle(n) {
  const started = new Date().toISOString();
  console.log(`\n[math-auto-loop] cycle ${n} ${started} — squad: ${Object.keys(squad).join("/")}`);

  const consensusBefore = await readConsensus();
  const graph = await readGraph();
  const next = pickNextOutcome(graph);

  if (!next) {
    console.log("  no candidate — graph empty or all done");
    return;
  }

  console.log(`  Planner: picked ${next.id} — "${next.fullText?.slice(0, 60) ?? next.topic}"`);
  console.log(`  Geometer: would author MathFlowchart spec for ${next.id} (KaTeX + figure)`);
  console.log(`  QA: validate via archify workflow + vitest (9 checks)`);

  // Simulate handoff — update consensus.md Next Action
  const nextAction = `Next: author flowchart for ${next.id} — "${next.fullText?.slice(0, 80) ?? ""}"`;

  // Ensure memories dir
  await mkdir("memories", { recursive: true });

  let updated = consensusBefore;
  if (updated.includes("## Next Action")) {
    updated = updated.replace(/## Next Action[\s\S]*?(?=\n## |\n---|$)/, `## Next Action\n- ${nextAction} (auto-loop cycle ${n} ${started})\n`);
  } else {
    updated += `\n## Next Action\n- ${nextAction}\n`;
  }

  // Append cycle log
  updated += `\n<!-- auto-loop cycle ${n} ${started} squad=${Object.keys(squad).join(",")} picked=${next.id} -->\n`;

  await writeFile(CONSENSUS, updated, "utf8");
  console.log(`  → consensus updated: ${nextAction}`);

  // Also append to data/math-auto-loop.json log for observability (layer 5)
  const logPath = "data/math-auto-loop.json";
  let log = [];
  try { log = JSON.parse(await readFile(logPath, "utf8")); } catch {}
  log.push({ cycle: n, at: started, picked: next.id, text: next.fullText ?? next.topic, squad: Object.keys(squad) });
  if (log.length > 50) log = log.slice(-50);
  await mkdir("data", { recursive: true });
  await writeFile(logPath, JSON.stringify(log, null, 2), "utf8");
  console.log(`  → log ${logPath} (${log.length} entries)`);
}

let n = 1;
if (ONCE) {
  await cycle(n);
  console.log("\n[math-auto-loop] --once done (no daemon, no auto-restart, safe)");
} else {
  console.log(`[math-auto-loop] daemon mode --interval ${INTERVAL/1000}s, --once for single cycle, Ctrl-C to stop`);
  console.log(`  squad: ${Object.entries(squad).map(([k,v]) => `${k}(${v.split("—")[0].trim()})`).join(", ")}`);
  console.log(`  HITL: edit ${CONSENSUS} Next Action to steer next cycle`);
  while (true) {
    try {
      await cycle(n++);
    } catch (e) {
      console.error(`  cycle error: ${e.message}`);
      // circuit breaker: wait longer on consecutive errors (Auto-Company pattern)
      await new Promise((r) => setTimeout(r, Math.min(INTERVAL * 3, 30000)));
    }
    await new Promise((r) => setTimeout(r, INTERVAL));
  }
}
