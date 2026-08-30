import { useEffect, useState } from "react";
import { type MathGraph } from "../lib/graph";

type Props = {
  onSelectGrade?: (grade: string) => void;
  className?: string;
};

export function CurriculumGraph({ onSelectGrade, className }: Props) {
  const [graph, setGraph] = useState<MathGraph | null>(null);
  const [selected, setSelected] = useState<string>("10");

  useEffect(() => {
    fetch("/data/math_graph.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.nodes) setGraph(j);
      })
      .catch(() => {});
    // fallback: try relative — only once
    fetch("/../data/math_graph.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.nodes) setGraph((prev) => prev ?? j);
      })
      .catch(() => {});
  }, []);

  if (!graph) {
    return (
      <section className={className ?? "rounded-xl border border-border bg-surface p-4"}>
        <h3 className="font-semibold text-ink">Curriculum Graph</h3>
        <p className="mt-2 text-xs text-muted">
          455 nodes (441 outcomes + grades). Run <code>npm run graph:build</code> to generate{" "}
          <code>data/math_graph.json</code>. Serves from <code>/data</code> in production.
        </p>
        <p className="mt-2 text-xs text-muted">Fallback demo: grades 1–9 chain + G10 bank topics.</p>
      </section>
    );
  }

  const grades = graph.nodes.filter((n) => n.id.startsWith("grade:")).sort((a, b) => Number(a.grade) - Number(b.grade));
  const outcomesForSelected = graph.nodes.filter((n) => n.id.startsWith("outcome:") && n.grade === selected).slice(0, 8);
  const edgesFromSelected = graph.edges.filter((e) => e.from === `grade:${selected}`);

  return (
    <section className={className ?? "rounded-2xl border border-border bg-surface p-5"}>
      <header className="mb-4">
        <h3 className="font-display text-lg font-semibold text-ink">Curriculum Graph — Egypt 2026–2027</h3>
        <p className="text-xs text-muted">
          {graph.meta.curriculumOutcomes ?? graph.nodes.length} outcomes · {graph.nodes.filter((n) => n.id.startsWith("grade:")).length} grades ·{" "}
          {graph.edges.length} prereq edges · {graph.meta.stages}
        </p>
      </header>

      {/* Grade chain — archify-like lanes */}
      <div className="flex flex-wrap gap-1.5">
        {grades.map((g) => (
          <button
            key={g.id}
            onClick={() => {
              setSelected(g.grade);
              onSelectGrade?.(g.grade);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              selected === g.grade ? "bg-primary text-white" : "border border-border bg-canvas text-ink hover:bg-surface"
            }`}
          >
            G{g.grade} · {g.count}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-canvas p-3">
          <h4 className="text-sm font-medium text-ink">Outcomes for G{selected}</h4>
          <ol className="mt-2 grid gap-1.5">
            {outcomesForSelected.map((o) => (
              <li key={o.id} className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs leading-relaxed text-ink">
                <span className="font-mono text-[10px] text-muted">{o.id.replace("outcome:", "")}</span> {o.fullText ?? o.topic}
              </li>
            ))}
          </ol>
          <p className="mt-2 text-[10px] text-muted">Showing 8/{grades.find((g) => g.grade === selected)?.count} — see `Local_Math_Vault/Curriculum_Frameworks/Egypt_Math_2026_2027_LearningOutcomes.md` full.</p>
        </div>

        <div className="rounded-xl border border-border bg-canvas p-3">
          <h4 className="text-sm font-medium text-ink">Prereq chain</h4>
          <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
            <span className="rounded-full bg-primary px-2 py-1 text-white">G{selected}</span>
            {edgesFromSelected.length ? (
              <>
                <span className="text-muted">→</span>
                <span className="rounded-full border border-border bg-surface px-2 py-1">{edgesFromSelected[0].to}</span>
                <span className="text-[10px] text-muted">({edgesFromSelected[0].label})</span>
              </>
            ) : (
              <span className="text-muted">terminal</span>
            )}
          </div>
          <p className="mt-3 text-xs text-muted">
            Use <code>canAttempt(graph, topic, completed)</code> `apps/web/src/lib/graph.ts:22` to gate flowcharts by prerequisites.
          </p>
          <details className="mt-3 rounded-lg border border-border bg-surface p-2">
            <summary className="cursor-pointer text-xs font-medium">Raw graph JSON</summary>
            <pre className="mt-2 max-h-48 overflow-auto rounded bg-ink p-2 text-[10px] text-white">{JSON.stringify(graph.meta, null, 2)}</pre>
          </details>
        </div>
      </div>
    </section>
  );
}
