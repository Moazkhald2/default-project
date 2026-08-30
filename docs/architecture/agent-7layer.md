# 7-Layer Agent Architecture — Math Flowcharts

> Source: Amir Ansari `x.com/AamirAnsar94694/status/2092817884640895458` applied to `default-project`

```
Perception -> Reasoning -> Planning -> Memory -> Tool Execution -> Observability -> Guardrails
Loop: Perceive -> Think -> Plan -> Act -> Observe -> Remember -> Think again
```

| Layer | Implementation in this repo | Files |
|---|---|---|
| **1 Perception** | Text input (KaTeX parse), API trigger `/api/exams/*`, GeoGebra SVG | `apps/web/src/components/Math.tsx:10`, `GebraEmbed.tsx` |
| **2 Reasoning** | LLM decides next step (solver agent) | `apps/api/src/index.ts` (Hono) |
| **3 Planning** | Break problem into flowchart nodes (DAG) | `apps/web/src/components/MathFlowchart.tsx` (new) |
| **4 Memory** | Short: React state `App.tsx:29`; Long: D1 `math-academy` + `content/bank/*.md` + `Local_Math_Vault` | `scripts/ingest.mjs` |
| **5 Tool Execution** | `GebraEmbed` render, `katex`, `Typst/CeTZ` via `scripts/generate_sheet.mjs`, `archify` validate | `archify/bin/archify.mjs` |
| **6 Observability** | `web-vitals.ts` -> `POST /api/vitals`, `scripts/verify.mjs`, `dashboard/` | `apps/web/src/lib/web-vitals.ts` |
| **7 Guardrails** | Zod `zValidator`, CSP/HSTS, no `any` (`oxlint --type-aware`), RBAC | `apps/api/src/index.ts`, `opencode.json` |

**Non-linear loop** enables: student submits -> think -> plan hints -> act (render node) -> observe (grade) -> remember (long-term) -> think again.

Reference for all future math agents. Add to `CLAUDE.md` Charter.
