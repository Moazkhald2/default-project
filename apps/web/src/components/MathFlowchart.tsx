import { useState, useMemo } from "react";
import { Math, BlockMath } from "./Math";
import { GebraEmbed } from "./GebraEmbed";

// Design system: ui-ux-pro-max + taste-skill + archify invariants
// - One obvious main path, side branches leave nearest main node, max 12 primary nodes
// - Type router: workflow for solving process, architecture for concept graph, sequence for API chain
// - 7-layer agent loop baked into node metadata

export type FlowNode = {
  id: string;
  labelTex: string;
  kind: "start" | "step" | "decision" | "figure" | "answer";
  materialId?: string;
  figureSvg?: string;
  next?: string[];
  // for decision nodes
  yesBranch?: string;
  noBranch?: string;
};

export type FlowEdge = {
  from: string;
  to: string;
  label?: string;
  condition?: "yes" | "no";
};

export type MathFlowchartSpec = {
  title: string;
  titleTex?: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
  archifyType?: "workflow" | "architecture" | "sequence" | "dataflow" | "lifecycle";
};

type Props = {
  spec: MathFlowchartSpec;
  onNodeComplete?: (nodeId: string) => void;
  interactive?: boolean;
  className?: string;
};

const kindStyles: Record<FlowNode["kind"], string> = {
  start: "bg-primary text-white border-primary shadow-md",
  step: "bg-surface border-border shadow-sm hover:border-primary/40",
  decision: "bg-amber-50 border-amber-200 shadow-sm rotate-0",
  figure: "bg-canvas border-border shadow-sm",
  answer: "bg-emerald-50 border-emerald-200 shadow-sm",
};

export function MathFlowchart({ spec, onNodeComplete, interactive = true, className }: Props) {
  const [activeId, setActiveId] = useState<string>(spec.nodes[0]?.id ?? "");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [revealed, setRevealed] = useState<Set<string>>(new Set([spec.nodes[0]?.id ?? ""]));

  const nodeMap = useMemo(() => new Map(spec.nodes.map((n) => [n.id, n])), [spec.nodes]);

  const activeNode = activeId ? nodeMap.get(activeId) : undefined;

  const handleAdvance = (nextId?: string) => {
    if (!activeId) return;
    const next = nextId ?? spec.edges.find((e) => e.from === activeId)?.to;
    if (!next) {
      setCompleted((prev) => new Set(prev).add(activeId));
      onNodeComplete?.(activeId);
      return;
    }
    setCompleted((prev) => new Set(prev).add(activeId));
    setRevealed((prev) => new Set(prev).add(next));
    setActiveId(next);
    onNodeComplete?.(activeId);
  };

  const handleDecision = (branch: "yes" | "no") => {
    if (!activeNode || activeNode.kind !== "decision") return;
    const target = branch === "yes" ? activeNode.yesBranch : activeNode.noBranch;
    handleAdvance(target);
  };

  if (!spec.nodes.length) return null;

  return (
    <section className={className ?? "rounded-2xl border border-border bg-surface p-5"}>
      <header className="mb-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
          {spec.title}
        </h3>
        {spec.titleTex ? (
          <div className="mt-1 text-sm text-muted">
            <Math tex={spec.titleTex} />
          </div>
        ) : null}
        {/* archify export hint */}
        <p className="mt-2 text-xs text-muted">
          Workflow {spec.archifyType ? `· ${spec.archifyType}` : ""} · {spec.nodes.length} nodes ·{" "}
          <span className="rounded-full border border-border bg-canvas px-2 py-0.5">
            {completed.size}/{spec.nodes.length} completed
          </span>
        </p>
      </header>

      {/* Vertical flowchart - one obvious main path, Tailwind bento-friendly */}
      <ol className="relative grid gap-3">
        {/* spine line */}
        <div className="pointer-events-none absolute left-5 top-2 bottom-2 w-px bg-border" aria-hidden />
        {spec.nodes.map((node, idx) => {
          const isActive = node.id === activeId;
          const isDone = completed.has(node.id);
          const isRevealed = revealed.has(node.id);
          const isDecision = node.kind === "decision";

          if (!isRevealed && interactive) {
            return (
              <li
                key={node.id}
                className="relative ml-10 rounded-xl border border-dashed border-border bg-canvas p-3 opacity-60"
              >
                <span className="text-xs font-medium text-muted">Step {idx + 1} locked</span>
              </li>
            );
          }

          return (
            <li
              key={node.id}
              className={`relative ml-10 rounded-xl border p-4 transition-all ${
                isDecision ? "rotate-0" : ""
              } ${kindStyles[node.kind]} ${isActive ? "ring-2 ring-primary/30" : ""} ${isDone ? "opacity-70" : ""}`}
            >
              {/* step dot on spine */}
              <span
                className={`absolute -left-10 top-4 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                  isDone
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-surface border-border text-muted"
                }`}
              >
                {isDone ? "✓" : idx + 1}
              </span>

              {/* connector arrow to next if not last */}
              {idx < spec.nodes.length - 1 ? (
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[10px] leading-none text-muted">
                  ↓
                </span>
              ) : null}

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 font-medium capitalize ${
                    node.kind === "start"
                      ? "bg-white/20 text-white"
                      : node.kind === "decision"
                        ? "bg-amber-100 text-amber-800"
                        : node.kind === "answer"
                          ? "bg-emerald-100 text-emerald-800"
                          : "border border-border bg-canvas text-muted"
                  }`}
                >
                  {node.kind}
                </span>
                <span className="font-mono text-[10px] text-muted">{node.id}</span>
              </div>

              <div className="mt-2 text-sm leading-relaxed text-ink">
                {/* KaTeX safe via Math.tsx:10 dangerouslySetInnerHTML with strict:false */}
                <Math tex={node.labelTex} />
              </div>

              {/* figure branch: GeoGebra or static SVG */}
              {node.kind === "figure" && (node.materialId || node.figureSvg) ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-border bg-canvas">
                  {node.materialId ? (
                    <GebraEmbed
                      materialId={node.materialId}
                      title={`${spec.title} – ${node.id}`}
                      width={480}
                      height={280}
                    />
                  ) : (
                    <img
                      src={node.figureSvg}
                      alt={`${node.labelTex} figure`}
                      width={480}
                      height={280}
                      loading="lazy"
                      decoding="async"
                      className="h-auto w-full"
                    />
                  )}
                </div>
              ) : null}

              {/* decision branching */}
              {isDecision && isActive && interactive ? (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDecision("yes")}
                    className="flex-1 rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Yes → {node.yesBranch}
                  </button>
                  <button
                    onClick={() => handleDecision("no")}
                    className="flex-1 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-canvas"
                  >
                    No → {node.noBranch}
                  </button>
                </div>
              ) : null}

              {/* step advance */}
              {isActive && node.kind !== "decision" && node.kind !== "answer" && interactive ? (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleAdvance()}
                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
                  >
                    Next →
                  </button>
                  <span className="self-center text-xs text-muted">
                    {spec.edges.find((e) => e.from === node.id)?.label ?? "continue"}
                  </span>
                </div>
              ) : null}

              {isActive && node.kind === "answer" ? (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                  <BlockMath tex={node.labelTex} />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      {/* controls */}
      {interactive ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => {
              const first = spec.nodes[0]?.id ?? "";
              setActiveId(first);
              setCompleted(new Set());
              setRevealed(new Set([first]));
            }}
            className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-canvas"
          >
            Reset flow
          </button>
          <button
            onClick={() => setRevealed(new Set(spec.nodes.map((n) => n.id)))}
            className="rounded-full border border-border bg-canvas px-3 py-1.5 text-xs font-medium text-muted hover:bg-surface"
          >
            Reveal all (teacher)
          </button>
        </div>
      ) : null}
    </section>
  );
}

// Example factory - right triangle trig (matches App.tsx:14 DEMO_QS)
export const rightTriangleSpec: MathFlowchartSpec = {
  title: "Right Triangle — Find angle A",
  titleTex: String.raw`AB = 4\text{ cm}, BC = 3\text{ cm}, \angle B = 90^\circ`,
  archifyType: "workflow",
  nodes: [
    {
      id: "start",
      kind: "start",
      labelTex: String.raw`Start: Right $\triangle ABC$, $\angle B=90^\circ$`,
    },
    {
      id: "identify",
      kind: "step",
      labelTex: String.raw`Identify: $\tan A = \frac{\text{opposite}}{\text{adjacent}} = \frac{BC}{AB} = \frac34$`,
    },
    {
      id: "figure",
      kind: "figure",
      labelTex: String.raw`Visual: drag points — same SVG for print`,
      materialId: "jybewqhg",
      figureSvg: "/assets/geometry_templates/right-triangle.svg",
    },
    {
      id: "decision",
      kind: "decision",
      labelTex: String.raw`Do you know $\tan^{-1}$?`,
      yesBranch: "compute",
      noBranch: "hint",
    },
    {
      id: "hint",
      kind: "step",
      labelTex: String.raw`Hint: $\tan^{-1}$ is inverse tan. Use calculator: $\tan^{-1}(0.75)$`,
    },
    {
      id: "compute",
      kind: "step",
      labelTex: String.raw`Compute: $A = \tan^{-1}(3/4) \approx 36.87^\circ$`,
    },
    {
      id: "answer",
      kind: "answer",
      labelTex: String.raw`x = \tan^{-1}(3/4) \approx 36.87^\circ \quad \blacksquare`,
    },
  ],
  edges: [
    { from: "start", to: "identify" },
    { from: "identify", to: "figure", label: "visualize" },
    { from: "figure", to: "decision" },
    { from: "decision", to: "compute", condition: "yes", label: "yes" },
    { from: "decision", to: "hint", condition: "no", label: "no" },
    { from: "hint", to: "compute" },
    { from: "compute", to: "answer" },
  ],
};

export const circleTheoremSpec: MathFlowchartSpec = {
  title: "Circle — Inscribed angle",
  titleTex: String.raw`\angle AOB = 80^\circ, O \text{ center}`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: Central $\angle AOB = 80^\circ$` },
    {
      id: "recall",
      kind: "step",
      labelTex: String.raw`Recall: Inscribed angle = $\frac12$ central angle`,
    },
    {
      id: "figure",
      kind: "figure",
      labelTex: String.raw`See: arc AB`,
      materialId: "R4kXz7Mv",
      figureSvg: "/assets/geometry_templates/circle-inscribed-angle.svg",
    },
    { id: "compute", kind: "step", labelTex: String.raw`$\angle ACB = 80^\circ / 2 = 40^\circ$` },
    { id: "answer", kind: "answer", labelTex: String.raw`$40^\circ \blacksquare$` },
  ],
  edges: [
    { from: "start", to: "recall" },
    { from: "recall", to: "figure" },
    { from: "figure", to: "compute" },
    { from: "compute", to: "answer" },
  ],
};

export const quadraticSpec: MathFlowchartSpec = {
  title: "Quadratic — Formula path",
  titleTex: String.raw`ax^2+bx+c=0, \; a\neq 0`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: $ax^2+bx+c=0$` },
    { id: "disc", kind: "step", labelTex: String.raw`Compute discriminant $D=b^2-4ac$` },
    { id: "decision", kind: "decision", labelTex: String.raw`$D \ge 0$ ?`, yesBranch: "real", noBranch: "complex" },
    { id: "real", kind: "step", labelTex: String.raw`Real roots: $x=\frac{-b\pm\sqrt{D}}{2a}$` },
    { id: "complex", kind: "step", labelTex: String.raw`Complex: $x=\frac{-b\pm i\sqrt{-D}}{2a}$` },
    { id: "check", kind: "step", labelTex: String.raw`Check by substitution` },
    { id: "answer", kind: "answer", labelTex: String.raw`$\blacksquare$ Roots verified` },
  ],
  edges: [
    { from: "start", to: "disc" },
    { from: "disc", to: "decision" },
    { from: "decision", to: "real", condition: "yes", label: "yes" },
    { from: "decision", to: "complex", condition: "no", label: "no" },
    { from: "real", to: "check" },
    { from: "complex", to: "check" },
    { from: "check", to: "answer" },
  ],
};

export const similaritySpec: MathFlowchartSpec = {
  title: "Similarity — Prove triangles similar",
  titleTex: String.raw`\triangle ABC \sim \triangle DEF ?`,
  archifyType: "workflow",
  nodes: [
    { id: "start", kind: "start", labelTex: String.raw`Start: Two triangles given` },
    { id: "aa", kind: "decision", labelTex: String.raw`AA: $\angle A=\angle D$ and $\angle B=\angle E$?`, yesBranch: "similar", noBranch: "sas" },
    { id: "sas", kind: "decision", labelTex: String.raw`SAS: $AB/DE = AC/DF$ and included $\angle$ equal?`, yesBranch: "similar", noBranch: "sss" },
    { id: "sss", kind: "decision", labelTex: String.raw`SSS: All sides proportional?`, yesBranch: "similar", noBranch: "not-sim" },
    { id: "similar", kind: "answer", labelTex: String.raw`Similar $\blacksquare$ $\Rightarrow$ scale factor $k$` },
    { id: "not-sim", kind: "answer", labelTex: String.raw`Not similar` },
  ],
  edges: [
    { from: "start", to: "aa" },
    { from: "aa", to: "similar", condition: "yes" },
    { from: "aa", to: "sas", condition: "no" },
    { from: "sas", to: "similar", condition: "yes" },
    { from: "sas", to: "sss", condition: "no" },
    { from: "sss", to: "similar", condition: "yes" },
    { from: "sss", to: "not-sim", condition: "no" },
  ],
};
