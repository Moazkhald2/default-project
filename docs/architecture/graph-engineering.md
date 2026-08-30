# Graph Engineering — Math Knowledge Map

> Source: Annatar `x.com/AnnatarXBT/status/2093372823863509097` + Anthropic Claude Cookbook `extract->resolve->assemble->query`

**Real:** Karpathy leading Claude-pretraining acceleration at Anthropic. Unverified: "1000x loop via graph" — treat as method, not quote.

## 5 Stages: 300 agents + 1 map

1. **Extract** — from `content/bank/*.md` + `Local_Math_Vault/Curriculum_Frameworks/*.json` parse entities (concept, theorem, grade, topic, prerequisite)
2. **Resolve** — dedupe `pythagorean` vs `pythagoras`, `right-triangle-trigonometry` vs `right-triangle`
3. **Assemble** — build DAG edges `prereq -> concept -> application` stored as `memories/graph.json` (analogous to `memories/consensus.md` in Auto-Company)
4. **Query** — flowchart generator traverses graph for valid path, checks prerequisites before showing node
5. **Persist** — lightweight `content/bank/graph.json` committed, not vector DB. Read at start of `generate_sheet.mjs`, written at end of cycle.

## Minimal implementation for this repo

- `scripts/build_graph.mjs` reads bank frontmatter `parseFrontmatter` `scripts/generate_sheet.mjs:17` -> emits `data/math_graph.json` with nodes `{id, grade, topic, prereqs[]}` and edges.
- `apps/web/src/lib/graph.ts` loads graph, provides `getPrereqs(topic)`, `topologicalSort()`.
- `PROMPT.md` per-cycle rule: "Read `data/math_graph.json` before planning flowchart, update after."

Add when flowchart MVP ships. Do not block Phase 0.
