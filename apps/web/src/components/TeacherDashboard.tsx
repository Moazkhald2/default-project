import { useEffect, useState } from "react";
import { QuestionCard, type Question } from "./QuestionCard";

type Unit = {
  id: string;
  title: string;
  topics: string[];
  weeks: number[];
  vault_path: string;
  figure_ids: string[];
};

type Curriculum = {
  framework: string;
  grade: string;
  units: Unit[];
};

export function TeacherDashboard() {
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [week, setWeek] = useState(1);
  const [qs, setQs] = useState<Question[] | null>(null);
  const [submissions, setSubmissions] = useState<unknown[]>([]);

  useEffect(() => {
    fetch("/api/exams/curriculum/10")
      .then((r) => (r.ok ? r.json() : null))
      .then(setCurriculum)
      .catch(() => {});
    fetch("/api/exams/submissions")
      .then((r) => (r.ok ? r.json() : []))
      .then(setSubmissions)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!curriculum) return;
    const unit = curriculum.units.find((u) => u.weeks.includes(week));
    const topic = unit?.topics[0]?.replaceAll("_", "-") ?? "";
    if (!topic) return;
    void fetch(`/api/exams/bank?topic=${topic}&grade=10`)
      .then((r) => (r.ok ? r.json() : []))
      .then((j) => {
        setQs(
          j.map((q: Record<string, string>) => ({
            id: q.id,
            grade: q.grade,
            topic: q.topic,
            difficulty: q.difficulty as Question["difficulty"],
            promptTex: q.promptTex,
            figure: q.figureSvg
              ? {
                  svg: `/assets/geometry_templates/${q.figureSvg}`,
                  alt: q.topic,
                  materialId: q.materialId,
                }
              : undefined,
            answerTex: q.answerTex,
          })),
        );
      });
  }, [curriculum, week]);

  const unit = curriculum?.units.find((u) => u.weeks.includes(week));

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h2 className="font-display text-lg font-bold text-ink">HRMS — Weekly Progress</h2>
        <p className="text-sm text-muted">
          {curriculum?.framework ?? "Loading curriculum — you're almost there..."}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((w) => (
            <button
              key={w}
              onClick={() => setWeek(w)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${w === week ? "bg-primary text-white" : "border border-border bg-surface hover:bg-canvas text-ink"}`}
            >
              W{w}
            </button>
          ))}
        </div>
        {unit ? (
          <div className="mt-3 rounded-xl border border-border bg-canvas p-3 text-sm text-ink">
            <span className="font-medium">{unit.title}</span> — {unit.topics.join(", ")} • Vault:{" "}
            <code>{unit.vault_path}</code>
          </div>
        ) : null}
        <div className="mt-3 text-xs text-muted">
          Submissions so far: {(submissions as unknown[]).length} • Batch PDFs:{" "}
          <code>dist/week{week}_*/sheet.pdf</code>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="font-display font-semibold text-ink">
          Week {week} — {unit?.title ?? ""} ({qs?.length ?? 0} Qs)
        </h3>
        {qs ? (
          qs.map((q, i) => <QuestionCard key={q.id} q={q} index={i} />)
        ) : (
          <p className="text-sm text-muted">Loading questions...</p>
        )}
      </div>
    </div>
  );
}
