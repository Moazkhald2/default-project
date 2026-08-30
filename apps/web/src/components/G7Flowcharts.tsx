import { type MathFlowchartSpec } from "./MathFlowchart";

// G7-G9 aligned to Egypt 2026-2027 outcomes (G7-27, G8-08, G9-13 etc) + graph prereq chain grade:7->8->9

export const g7LinearSpec: MathFlowchartSpec = {
  title: "G7 — Linear Equation in One Unknown",
  titleTex: String.raw`G7-27: Solves $a x + b = 0$ over $\mathbb{N}, \mathbb{Z}, \mathbb{Q}$`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: $a x + b = 0$, $a \neq 0$` },
    { id: "isolate", kind: "step", labelTex: String.raw`Isolate: $a x = -b$` },
    { id: "divide", kind: "step", labelTex: String.raw`$x = -b/a$` },
    { id: "decision", kind: "decision", labelTex: String.raw`$x$ in substitution set?`, yesBranch: "ok", noBranch: "reject" },
    { id: "ok", kind: "answer", labelTex: String.raw`$x \in$ solution set $\blacksquare$` },
    { id: "reject", kind: "answer", labelTex: String.raw`No solution in set` },
  ],
  edges: [
    { from: "start", to: "isolate" },
    { from: "isolate", to: "divide" },
    { from: "divide", to: "decision" },
    { from: "decision", to: "ok", condition: "yes", label: "yes" },
    { from: "decision", to: "reject", condition: "no", label: "no" },
  ],
};

export const g8FactorSpec: MathFlowchartSpec = {
  title: "G8 — Factorization by GCF",
  titleTex: String.raw`G8-08: $ax + ay = a(x+y)$`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: Factor $6x^2+9x$` },
    { id: "gcf", kind: "step", labelTex: String.raw`GCF $= 3x$ (G6-02)` },
    { id: "factor", kind: "step", labelTex: String.raw`$3x(2x+3)$` },
    { id: "check", kind: "step", labelTex: String.raw`Expand to verify` },
    { id: "answer", kind: "answer", labelTex: String.raw`$3x(2x+3) \blacksquare$` },
  ],
  edges: [
    { from: "start", to: "gcf" },
    { from: "gcf", to: "factor" },
    { from: "factor", to: "check" },
    { from: "check", to: "answer" },
  ],
};

export const g9QuadraticGraphSpec: MathFlowchartSpec = {
  title: "G9 — Quadratic Graph & Vertex",
  titleTex: String.raw`G9-08–12: $y=ax^2+bx+c$, vertex $V$, axis $x=-b/2a$`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: $y=ax^2+bx+c$` },
    { id: "vertex", kind: "step", labelTex: String.raw`Vertex $x_v=-b/2a$, $y_v=f(x_v)$` },
    { id: "axis", kind: "step", labelTex: String.raw`Axis $x=x_v$` },
    { id: "table", kind: "step", labelTex: String.raw`Table (G9-13 calculator)` },
    { id: "plot", kind: "figure", labelTex: String.raw`Plot parabola`, figureSvg: "/assets/geometry_templates/parabola.svg" },
    { id: "extremum", kind: "decision", labelTex: String.raw`$a>0$ ?`, yesBranch: "min", noBranch: "max" },
    { id: "min", kind: "answer", labelTex: String.raw`Minimum $y_v$` },
    { id: "max", kind: "answer", labelTex: String.raw`Maximum $y_v$` },
  ],
  edges: [
    { from: "start", to: "vertex" },
    { from: "vertex", to: "axis" },
    { from: "axis", to: "table" },
    { from: "table", to: "plot" },
    { from: "plot", to: "extremum" },
    { from: "extremum", to: "min", condition: "yes", label: "yes" },
    { from: "extremum", to: "max", condition: "no", label: "no" },
  ],
};

export const allCurriculumSpecs: Record<string, MathFlowchartSpec> = {
  g7Linear: g7LinearSpec,
  g8Factor: g8FactorSpec,
  g9QuadraticGraph: g9QuadraticGraphSpec,
};
