import { lazy, Suspense, useEffect, useState } from "react";
import { PerfImage } from "./components/PerfImage";
import { Math, BlockMath } from "./components/Math";
import { GebraEmbed } from "./components/GebraEmbed";
import { QuestionCard, type Question } from "./components/QuestionCard";
import {
  MathFlowchart,
  rightTriangleSpec,
  circleTheoremSpec,
  quadraticSpec,
  similaritySpec,
  type MathFlowchartSpec,
} from "./components/MathFlowchart";
import { g7LinearSpec, g8FactorSpec, g9QuadraticGraphSpec, g7ProportionalSpec } from "./components/G7Flowcharts";
import { CurriculumGraph } from "./components/CurriculumGraph";
const TeacherDashboard = lazy(() =>
  import("./components/TeacherDashboard").then((m) => ({ default: m.TeacherDashboard })),
);
const MathExam = lazy(() => import("./components/MathExam").then((m) => ({ default: m.MathExam })));
const Heavy = lazy(() => import("./components/Heavy"));
import { AuthBar } from "./components/AuthBar";
import { PaymentsPanel } from "./components/PaymentsPanel";
import { GradebookPanel } from "./components/GradebookPanel";
import { StripeButton } from "./components/StripeButton";
import { CsvImport } from "./components/CsvImport";

const DEMO_QS: Question[] = [
  {
    id: "q-rt-001",
    grade: "10",
    topic: "right-triangle-trigonometry",
    difficulty: "easy",
    promptTex: String.raw`In right triangle $ABC$, $\angle B = 90^\circ$, $AB = 4\text{ cm}$, $BC = 3\text{ cm}$. Find $x = \angle A$.`,
    figure: {
      svg: "/assets/geometry_templates/right-triangle.svg",
      alt: "Right triangle ABC",
      materialId: "jybewqhg",
    },
    choices: [String.raw`\tan^{-1}(3/4)`, String.raw`\tan^{-1}(4/3)`, String.raw`36.87^\circ`],
    answerTex: String.raw`x = \tan^{-1}(3/4) \approx 36.87^\circ`,
  },
  {
    id: "q-circle-001",
    grade: "10",
    topic: "circle-theorems",
    difficulty: "medium",
    promptTex: String.raw`Circle centre $O$, $\angle AOB = 80^\circ$. Find inscribed $\angle ACB$.`,
    figure: {
      svg: "/assets/geometry_templates/circle-inscribed-angle.svg",
      alt: "Circle inscribed angle",
      materialId: "R4kXz7Mv",
    },
    answerTex: String.raw`40^\circ\text{ (half central angle)}`,
  },
];

export default function App() {
  const [bank, setBank] = useState<Question[] | null>(null);

  useEffect(() => {
    fetch("/api/exams/bank?grade=10")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (Array.isArray(j) && j.length) {
          // map API shape -> Question
          setBank(
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
        }
      })
      .catch(() => {});
  }, []);

  const qs = bank ?? DEMO_QS;
  const [view, setView] = useState<"student" | "teacher" | "exam" | "flowcharts">("student");
  const [flowSpec, setFlowSpec] = useState<MathFlowchartSpec>(rightTriangleSpec);

  return (
    <main className="mx-auto max-w-3xl p-6 bg-canvas min-h-screen">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
          Math Academy — Interactive Sheets
        </h1>
        <p className="mt-2 text-sm text-muted">
          KaTeX + GeoGebra (free libs) + Typst/CeTZ for print.{" "}
          <Math tex={String.raw`a^2+b^2=c^2`} /> renders instantly.
        </p>
        <div className="mt-3 rounded-xl border border-border bg-surface p-3">
          <BlockMath tex={String.raw`\displaystyle \int_0^1 x^2\,dx = \frac13`} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setView("student")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === "student" ? "bg-primary text-white" : "border border-border bg-surface text-ink hover:bg-canvas"}`}
          >
            Student View
          </button>
          <button
            onClick={() => setView("flowcharts")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === "flowcharts" ? "bg-primary text-white" : "border border-border bg-surface text-ink hover:bg-canvas"}`}
          >
            Flowcharts
          </button>
          <button
            onClick={() => setView("teacher")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === "teacher" ? "bg-primary text-white" : "border border-border bg-surface text-ink hover:bg-canvas"}`}
          >
            Teacher HRMS
          </button>
          <button
            onClick={() => setView("exam")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${view === "exam" ? "bg-primary text-white" : "border border-border bg-surface text-ink hover:bg-canvas"}`}
          >
            Exam Engine
          </button>
        </div>
      </header>

      <div className="mt-4">
        <AuthBar />
      </div>
      <PerfImage
        src="https://picsum.photos/1200/600"
        alt="Hero"
        width={1200}
        height={600}
        priority
      />

      {view === "flowcharts" ? (
        <section className="mt-8 grid gap-4">
          <CurriculumGraph />
          <h2 className="font-display text-xl font-semibold text-ink">Math Flowcharts — Stepwise Solver</h2>
          <p className="text-sm text-muted">
            Interactive DAG · archify workflow · KaTeX nodes · GeoGebra figures · 7-layer agent loop.
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFlowSpec(rightTriangleSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === rightTriangleSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              Right Triangle
            </button>
            <button
              onClick={() => setFlowSpec(circleTheoremSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === circleTheoremSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              Circle
            </button>
            <button
              onClick={() => setFlowSpec(quadraticSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === quadraticSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              Quadratic
            </button>
            <button
              onClick={() => setFlowSpec(similaritySpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === similaritySpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              Similarity
            </button>
            <button
              onClick={() => setFlowSpec(g7ProportionalSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === g7ProportionalSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              G7-01 Prop.
            </button>
            <button
              onClick={() => setFlowSpec(g7LinearSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === g7LinearSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              G7 Linear
            </button>
            <button
              onClick={() => setFlowSpec(g8FactorSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === g8FactorSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              G8 Factor
            </button>
            <button
              onClick={() => setFlowSpec(g9QuadraticGraphSpec)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium ${flowSpec.title === g9QuadraticGraphSpec.title ? "bg-primary text-white" : "border border-border bg-surface text-ink"}`}
            >
              G9 Parabola
            </button>
          </div>
          <MathFlowchart spec={flowSpec} />
          <details className="rounded-xl border border-border bg-canvas p-3">
            <summary className="cursor-pointer text-sm font-medium">Archify export — workflow / architecture JSON</summary>
            <pre className="mt-2 overflow-auto rounded bg-ink p-3 text-xs text-white">
              {JSON.stringify(flowSpec, null, 2)}
            </pre>
            <p className="mt-2 text-xs text-muted">
              Validate: <code>node .agents/skills/archify/bin/archify.mjs validate workflow data/flow.json --quality showcase --json</code>
            </p>
          </details>
        </section>
      ) : view === "teacher" ? (
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading your dashboard...</p>}>
          <section className="mt-8 grid gap-4">
            <TeacherDashboard />
            <PaymentsPanel />
            <StripeButton />
            <CsvImport />
            <GradebookPanel />
          </section>
        </Suspense>
      ) : view === "exam" ? (
        <Suspense fallback={<p className="mt-8 text-sm text-muted">Loading exam...</p>}>
          <section className="mt-8">
            <MathExam
              title="Weekly Exam — Grade 10"
              questions={qs.slice(0, 3).map((q) => ({
                id: q.id,
                prompt: q.promptTex,
                mathTeX: q.promptTex,
                materialId: q.figure?.materialId,
                figureSvg: q.figure?.svg.split("/").pop(),
                options: q.choices ?? [q.answerTex ?? ""],
              }))}
              onSubmit={(a) => {
                void fetch("/api/exams/submit", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ examId: "demo", studentId: "s1", answers: a }),
                })
                  .then((r) => r.json())
                  .then((j) =>
                    alert(
                      `Submitted score: ${j.submission?.score ?? "?"}/${j.submission?.total ?? "?"}`,
                    ),
                  );
              }}
            />
          </section>
        </Suspense>
      ) : (
        <section className="mt-8 grid gap-4">
          <h2 className="font-display text-xl font-semibold text-ink">
            Live Exam Preview — pulls from free libs
          </h2>
          <p className="text-sm text-muted">
            Print: <code>assets/geometry_templates/*.svg</code> → Typst • Web:{" "}
            <code>&lt;GebraEmbed materialId&gt;</code> • Bank: <code>content/bank/*.md</code> •
            Vault: <code>Local_Math_Vault/</code>
          </p>
          {qs.map((q, i) => (
            <QuestionCard key={q.id} q={q} index={i} />
          ))}
        </section>
      )}

      <section className="mt-8 rounded-xl border border-border bg-surface p-5 shadow-sm">
        <h3 className="font-semibold text-ink">GeoGebra direct embed demo</h3>
        <p className="text-sm text-muted">
          Free applet — no GPU, drag points. Same SVG used for PDF.
        </p>
        <div className="mt-3">
          <GebraEmbed
            materialId="R4kXz7Mv"
            title="Inscribed Angle — GeoGebra Materials"
            width={560}
            height={340}
          />
        </div>
      </section>

      <Suspense fallback={null}>
        <Heavy />
      </Suspense>

      <footer className="mt-8 flex gap-4 text-sm text-muted">
        <a
          href="/api/health"
          className="underline decoration-border underline-offset-4 hover:text-ink"
        >
          API health
        </a>
        <a
          href="/api/exams/bank"
          className="underline decoration-border underline-offset-4 hover:text-ink"
        >
          Bank JSON
        </a>
        <span>Typst: bash scripts/fast_build.sh</span>
      </footer>
    </main>
  );
}
