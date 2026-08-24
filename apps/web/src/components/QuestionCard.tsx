import { BlockMath, Math } from "./Math";
import { GebraEmbed, GebraStaticFallback } from "./GebraEmbed";

export type Question = {
  id: string;
  grade: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  promptTex: string;
  figure?: { svg: string; alt: string; materialId?: string };
  choices?: string[];
  answerTex?: string;
};

export function QuestionCard({ q, index }: { q: Question; index: number }) {
  return (
    <article className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <header className="mb-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded-full bg-primary px-2.5 py-1 font-medium text-white">
          Q{index + 1}
        </span>
        <span className="rounded-full border border-border bg-surface px-2 py-1">{q.topic}</span>
        <span className="rounded-full border border-border bg-surface px-2 py-1">{q.grade}</span>
        <span className="rounded-full border border-border bg-surface px-2 py-1 capitalize">
          {q.difficulty}
        </span>
      </header>

      <div className="prose max-w-none">
        <Math tex={q.promptTex} />
      </div>

      {q.figure ? (
        <div className="mt-4">
          {q.figure.materialId ? (
            <GebraEmbed
              materialId={q.figure.materialId}
              title={q.figure.alt}
              width={560}
              height={340}
            />
          ) : (
            <GebraStaticFallback svgSrc={q.figure.svg} alt={q.figure.alt} />
          )}
        </div>
      ) : null}

      {q.choices ? (
        <ol className="mt-4 grid gap-2">
          {q.choices.map((c, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-xl border border-border bg-surface px-3 py-2 hover:bg-canvas"
            >
              <span className="font-mono text-sm">{String.fromCharCode(65 + i)}.</span>
              <Math tex={c} />
            </li>
          ))}
        </ol>
      ) : null}

      {q.answerTex ? (
        <details className="mt-4 rounded-xl border border-border bg-canvas p-3">
          <summary className="cursor-pointer text-sm font-medium">Answer</summary>
          <div className="pt-2">
            <BlockMath tex={q.answerTex} />
          </div>
        </details>
      ) : null}
    </article>
  );
}
