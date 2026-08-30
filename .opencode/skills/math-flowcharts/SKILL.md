---
name: math-flowcharts
description: Math Flowcharts engine — interactive stepwise solver using KaTeX + GeoGebra + archify workflow, integrated with 7-layer agent and graph engineering. Use when creating or editing flowchart nodes, solver steps, or exam flows.
---

# math-flowcharts

Interactive DAG for `apps/web/src/components/MathFlowchart.tsx:1`.

## When to use
- New math topic needs flowchart (pythagorean, quadratics, calculus)
- Adding decision branches, figure nodes, or answer states
- Wiring `content/bank/*.md` to flowchart spec
- Exporting via archify `workflow` type for share cards

## Authoring rules (archify + ui-ux-pro-max + taste-skill)

1. One obvious main path, max 12 primary nodes `MathFlowchart.tsx:22`
2. Kinds: `start` | `step` | `decision` | `figure` | `answer` — style via `kindStyles`
3. Every `figure` reuses `GebraEmbed` materialId + static SVG fallback (same for Typst print)
4. Decision nodes require `yesBranch`/`noBranch`, edges carry `condition`
5. KaTeX tex via `Math.tsx:10`, never raw HTML
6. Graph-aware: check `data/math_graph.json` prereqs via `apps/web/src/lib/graph.ts:6` before adding node
7. Validate with `npm run typecheck -w @app/web` + `npm run test -w @app/web` (9 tests must pass)

## Workflow

1. Add spec to `MathFlowchart.tsx` (e.g. `quadraticSpec`)
2. Wire to `App.tsx:82` flowSpec switcher
3. Run `node scripts/build_graph.mjs` if topic new
4. Test with `MathFlowchart.test.tsx` pattern (container.textContent contains)
5. For print: archify `node .agents/skills/archify/bin/archify.mjs validate workflow data/flow.json --quality showcase --json` then `deliver`

## 7-layer mapping

See `docs/architecture/agent-7layer.md` — Planning layer = this file. Observability via `/api/vitals`.
