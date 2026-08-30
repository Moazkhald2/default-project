---
name: graph-engineering
description: Knowledge graph for math concepts — extract->resolve->assemble->query (Annatar). Use when building or querying the concept DAG.
---

# graph-engineering

Source: `docs/architecture/graph-engineering.md` + Anthropic cookbook.

1. `node scripts/build_graph.mjs` -> `data/math_graph.json`
2. Query via `apps/web/src/lib/graph.ts` (`getPrereqs`, `topologicalSort`, `canAttempt`)
3. Normalized aliases in `scripts/build_graph.mjs:17`
