# Curriculum Frameworks — The Math Mentor

Mirrored from `Local_Math_Vault/Curriculum_Frameworks/` for web/docs consumption.

## Egypt — Basic Education (2026-2027 · First Semester)

- **Source:** `Learning Outcomes Map 2027 M.pdf` (49-page scanned PDF) — Assiut / El-Fateh, Master Teacher Ahmed Mostafa Ahmed
- **Coverage:** Grades 1–9 (G1-G6 Primary + G7-G9 Preparatory)
- **Total outcomes:** 441
- **Files:**
  - `Egypt_Math_2026_2027_LearningOutcomes.md` — faithful English translation, grade → page hierarchy, source-fidelity notes preserved (`Local_Math_Vault/Curriculum_Frameworks/Egypt_Math_2026_2027_LearningOutcomes.md:1`)
  - `Egypt_Math_2026_2027_FirstTerm.json` — machine-readable for OpenCode/agents (`Local_Math_Vault/Curriculum_Frameworks/Egypt_Math_2026_2027_FirstTerm.json:1`) — each numbered item is one outcome with id `G{grade}-{n:02d}`
  - Original path also at `D:/learning_outcomes_map_2026_2027_english.md` (copied for legacy Read calls)

### Usage for agents

```ts
import framework from "@/Local_Math_Vault/Curriculum_Frameworks/Egypt_Math_2026_2027_FirstTerm.json";
// grade label = framework.grades[i].label, sourcePages, outcomes[], teachingStrategies[]
```

- Use `grade heading + sourcePages` as primary hierarchy.
- Do not infer missing numeric ranges where scan was unclear (marked in source).
- `teachingStrategies / activities / assessmentMethods / evidence` are shared per-stage lists attachable to each outcome.

### Grade summary

| Grade | Stage                | Pages | Outcomes |
| ----- | -------------------- | ----- | -------- |
| G1    | Primary              | 3–5   | 42       |
| G2    | Primary              | 7–9   | 43       |
| G3    | Primary              | 11–14 | 49       |
| G4    | Primary              | 16–19 | 58       |
| G5    | Primary              | 21–24 | 43       |
| G6    | Primary              | 26–29 | 46       |
| G7    | Preparatory (First)  | 31–36 | 58       |
| G8    | Preparatory (Second) | 39–43 | 48       |
| G9    | Preparatory (Third)  | 45–49 | 54       |

See also `Local_Math_Vault/Curriculum_Frameworks/index.json` for registry.

## Egypt — Grade 10 (2026, full-year)

- `Egypt_Grade10_Math_2026.json` — week→topic map for secondary
