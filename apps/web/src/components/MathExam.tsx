import { useState } from "react";
import { BlockMath, Math } from "./Math";
import { GebraEmbed } from "./GebraEmbed";

export type ExamQuestion = {
  id: string;
  prompt: string;
  mathTeX?: string;
  options?: string[];
  materialId?: string;
  figureSvg?: string;
};

export function MathExam({
  title,
  questions,
  onSubmit,
}: {
  title: string;
  questions: ExamQuestion[];
  onSubmit?: (answers: Record<string, string>) => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="exam-wrapper mx-auto max-w-3xl rounded-xl border border-border bg-surface p-6 shadow-sm">
      <header className="mb-6 border-b border-border pb-4">
        <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
        <p className="text-sm text-muted">
          Select the correct answer. Math renders via KaTeX — fast and beautiful.
        </p>
      </header>

      <form
        id="exam-form"
        className="space-y-8"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.(answers);
        }}
      >
        {questions.map((q, idx) => (
          <div key={q.id} className="question-card rounded-xl border border-border bg-canvas p-4">
            <p className="mb-2 font-semibold text-ink">
              Question {idx + 1}: {q.prompt}
            </p>
            {q.mathTeX ? (
              <div className="my-3 text-lg">
                <BlockMath tex={q.mathTeX} />
              </div>
            ) : (
              <div className="my-3">
                <Math tex={q.prompt} />
              </div>
            )}

            {q.materialId ? (
              <div className="my-3">
                <GebraEmbed materialId={q.materialId} title={q.id} width={520} height={320} />
              </div>
            ) : q.figureSvg ? (
              <img
                src={`/assets/geometry_templates/${q.figureSvg}`}
                alt={q.id}
                className="mx-auto my-3 rounded border"
                width={400}
                height={300}
                loading="lazy"
              />
            ) : null}

            {q.options ? (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {q.options.map((opt) => (
                  <label
                    key={opt}
                    className="flex cursor-pointer items-center rounded-xl border border-border bg-surface p-2 hover:bg-canvas has-[input:checked]:border-primary has-[input:checked]:bg-primary-soft"
                  >
                    <input
                      type="radio"
                      name={`q_${q.id}`}
                      value={opt}
                      className="mr-2"
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                    />
                    <Math tex={opt} />
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-3 font-bold text-white hover:bg-primary-hover focus-visible:ring-2 focus-visible:ring-primary"
        >
          Submit Exam
        </button>
      </form>
    </div>
  );
}
