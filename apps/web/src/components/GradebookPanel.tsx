import { useEffect, useState } from "react";

type Gradebook = {
  average: number;
  byTopic: { topic: string; avg: number; count: number }[];
  recent: { examId: string; score: number; total: number }[];
};

export function GradebookPanel({ studentId = "s1" }: { studentId?: string }) {
  const [gb, setGb] = useState<Gradebook | null>(null);
  useEffect(() => {
    void fetch(`/api/hrms/gradebook/${studentId}`)
      .then((r) => r.json())
      .then(setGb);
  }, [studentId]);
  if (!gb) return <p className="text-sm text-muted">Loading gradebook...</p>;
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-semibold text-ink">Gradebook — {studentId}</h3>
      <p className="text-2xl font-bold text-ink">{gb.average}% avg</p>
      <div className="mt-3 grid gap-2">
        {gb.byTopic.map((t) => (
          <div
            key={t.topic}
            className="flex justify-between rounded-xl border border-border bg-canvas px-3 py-2 text-sm"
          >
            <span>{t.topic.replaceAll("_", " ")}</span>
            <span>
              {t.avg}% ({t.count})
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        Recent: {gb.recent.map((r) => `${r.score}/${r.total}`).join(", ")}
      </p>
    </div>
  );
}
