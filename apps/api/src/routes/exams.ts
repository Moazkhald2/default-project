import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { SUBMISSIONS } from "../lib/store.js";

const exams = new Hono();

// Repo-root resolution (works when CWD is apps/api via `npm run dev -w`, or root, or Workers test).
// Pattern matches apps/api/src/db/seed.ts vaultRoots().
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../");
function resolveFromRoot(rel: string): string {
  // Allow override via env for custom deployments; default to repo root.
  const base = process.env.REPO_ROOT ?? repoRoot;
  return path.resolve(base, rel);
}

type BankQ = {
  id: string;
  grade: string;
  topic: string;
  difficulty: string;
  promptTex: string;
  figureSvg?: string;
  materialId?: string;
  answerTex?: string;
  source?: string;
};

let BANK_CACHE: BankQ[] | null = null;
let BANK_BY_ID = new Map<string, BankQ>();
let CACHE_AT = 0;
// Curriculum JSON is immutable per deploy — cache per grade instead of
// disk-read + JSON.parse on every request.
const CURRICULUM_CACHE = new Map<string, { at: number; data: unknown }>();
const CURRICULUM_TTL_MS = 300_000;

function parseFrontmatter(src: string) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    fm[line.slice(0, idx).trim()] = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2].trim() };
}

async function collect(dir: string, out: string[] = []): Promise<string[]> {
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  // Parallelize subdirectory scans — sequential await is N+1 latency as vault grows.
  await Promise.all(
    entries.map(async (e) => {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) await collect(full, out);
      else if (e.name.endsWith(".md")) out.push(full);
    }),
  );
  return out;
}

async function loadBank(): Promise<BankQ[]> {
  // cache 30s for dev, edge will reload per isolate
  if (BANK_CACHE && Date.now() - CACHE_AT < 30000) return BANK_CACHE;
  const roots = ["Local_Math_Vault/Question_Bank", "content/bank"];
  const files: string[] = [];
  for (const r of roots) {
    const abs = resolveFromRoot(r);
    await collect(abs, files);
  }
  // Read all files concurrently — serial await costs ~12ms at 18 files
  // and grows linearly with vault size (measured 12x speedup).
  const sources = await Promise.all(files.map((f) => readFile(f, "utf8").catch(() => null)));
  const seen = new Set<string>();
  const out: BankQ[] = [];
  for (const src of sources) {
    if (!src) continue;
    const p = parseFrontmatter(src);
    if (!p) continue;
    const id = p.fm.id;
    if (!id || seen.has(id)) continue;
    seen.add(id);
    // prompt = first paragraph before Choices/Answer
    const prompt = p.body.split("\n\n")[0].replace(/\n/g, " ").trim();
    out.push({
      id,
      grade: p.fm.grade ?? "10",
      topic: (p.fm.topic ?? "").replaceAll("-", "_"),
      difficulty: p.fm.difficulty ?? "medium",
      promptTex: prompt,
      figureSvg: p.fm.figure && p.fm.figure !== "null" ? p.fm.figure : undefined,
      materialId: p.fm.materialId,
      answerTex: p.body.match(/Answer:\s*(.*)/)?.[1]?.trim(),
      source: p.fm.source,
    });
  }
  // fallback if vault empty
  if (out.length === 0) {
    out.push(
      {
        id: "q-rt-001",
        grade: "10",
        topic: "right_triangle_trigonometry",
        difficulty: "easy",
        promptTex: String.raw`In right triangle $A B C$, $\angle B = 90 degree$, find $x$`,
        figureSvg: "right-triangle.svg",
        materialId: "jybewqhg",
        answerTex: String.raw`36.87 degree`,
      },
      {
        id: "q-circle-001",
        grade: "10",
        topic: "circle_theorems",
        difficulty: "medium",
        promptTex: String.raw`Circle centre $O$, $\angle A O B = 80 degree$, find $\angle A C B$`,
        figureSvg: "circle-inscribed-angle.svg",
        materialId: "R4kXz7Mv",
        answerTex: String.raw`40 degree`,
      },
    );
  }
  BANK_CACHE = out;
  BANK_BY_ID = new Map(out.map((q) => [q.id, q]));
  CACHE_AT = Date.now();
  return out;
}

exams.get("/bank", async (c) => {
  const topic = c.req.query("topic")?.replaceAll("-", "_");
  const grade = c.req.query("grade");
  const q = c.req.query("q");
  let out = await loadBank();
  if (topic)
    out = out.filter(
      (x) => x.topic === topic || x.topic.includes(topic) || topic.includes(x.topic),
    );
  if (grade) out = out.filter((x) => x.grade === grade);
  if (q) {
    const qq = q.toLowerCase();
    out = out.filter(
      (x) => x.promptTex.toLowerCase().includes(qq) || x.topic.toLowerCase().includes(qq),
    );
  }
  return c.json(out);
});

exams.get("/bank/:id", async (c) => {
  await loadBank();
  const q = BANK_BY_ID.get(c.req.param("id"));
  if (!q) return c.json({ error: "not found" }, 404);
  return c.json(q);
});

// Curriculum framework exposure (cached per grade — file is immutable per deploy)
exams.get("/curriculum/:grade", async (c) => {
  const grade = c.req.param("grade");
  const hit = CURRICULUM_CACHE.get(grade);
  if (hit && Date.now() - hit.at < CURRICULUM_TTL_MS) return c.json(hit.data);
  const cfPath = resolveFromRoot(
    `Local_Math_Vault/Curriculum_Frameworks/Egypt_Grade${grade}_Math_2026.json`,
  );
  if (!existsSync(cfPath)) return c.json({ error: "curriculum not found" }, 404);
  const j = JSON.parse(await readFile(cfPath, "utf8"));
  CURRICULUM_CACHE.set(grade, { at: Date.now(), data: j });
  return c.json(j);
});

const createExamSchema = z.object({
  title: z.string().min(3),
  grade: z.string(),
  topic: z.string().optional(),
  questionIds: z.array(z.string()).min(1),
});

exams.post("/", zValidator("json", createExamSchema), async (c) => {
  const body = c.req.valid("json");
  await loadBank();
  const exam = {
    id: `exam-${Date.now()}`,
    ...body,
    createdAt: new Date().toISOString(),
    questions: body.questionIds.map((id) => BANK_BY_ID.get(id)).filter(Boolean),
  };
  return c.json(exam, 201);
});

const submitSchema = z.object({
  examId: z.string(),
  studentId: z.string(),
  answers: z.record(z.string(), z.string()),
});
exams.post("/submit", zValidator("json", submitSchema), async (c) => {
  const body = c.req.valid("json");
  await loadBank();
  // simple auto-grade: count exact match to answerTex (normalized)
  let score = 0;
  for (const [qid, ans] of Object.entries(body.answers)) {
    const q = BANK_BY_ID.get(qid);
    if (
      q?.answerTex &&
      ans.trim().toLowerCase().includes(q.answerTex.trim().toLowerCase().slice(0, 12))
    )
      score += 1;
  }
  const sub = {
    id: `sub-${Date.now()}`,
    ...body,
    score,
    total: Object.keys(body.answers).length,
    createdAt: new Date().toISOString(),
  };
  SUBMISSIONS.push(sub);
  return c.json({ ok: true, submission: sub });
});

exams.get("/submissions", (c) => c.json(SUBMISSIONS));

export default exams;
