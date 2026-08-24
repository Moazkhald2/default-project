import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import * as schema from "./schema";

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

async function collect(dir: string, out: string[] = []) {
  if (!existsSync(dir)) return out;
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await collect(full, out);
    else if (e.name.endsWith(".md")) out.push(full);
  }
  return out;
}

async function main() {
  const url = process.env.TURSO_DATABASE_URL ?? "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url, authToken });
  const db = drizzle(client);

  const roots = [
    path.resolve("../../Local_Math_Vault/Question_Bank"),
    path.resolve("../../content/bank"),
  ];
  const files: string[] = [];
  for (const r of roots) await collect(r, files);

  let inserted = 0;
  for (const f of files) {
    const src = await readFile(f, "utf8").catch(() => null);
    if (!src) continue;
    const p = parseFrontmatter(src);
    if (!p?.fm.id) continue;
    const prompt = p.body.split("\n\n")[0].replace(/\n/g, " ").slice(0, 2000);
    try {
      await db
        .insert(schema.questions)
        .values({
          id: p.fm.id,
          grade: p.fm.grade ?? "10",
          topic: (p.fm.topic ?? "general").replaceAll("-", "_"),
          difficulty: p.fm.difficulty ?? "medium",
          promptTex: prompt,
          figureSvg: p.fm.figure && p.fm.figure !== "null" ? p.fm.figure : null,
          materialId: p.fm.materialId ?? null,
          answerTex: p.body.match(/Answer:\s*(.*)/)?.[1]?.slice(0, 1000) ?? null,
          source: p.fm.source ?? null,
        })
        .onConflictDoUpdate({
          target: schema.questions.id,
          set: {
            grade: p.fm.grade ?? "10",
            topic: (p.fm.topic ?? "general").replaceAll("-", "_"),
            difficulty: p.fm.difficulty ?? "medium",
            promptTex: prompt,
          },
        });
      inserted += 1;
    } catch (e) {
      console.warn(`skip ${p.fm.id}:`, (e as Error).message);
    }
  }
  console.log(`Seeded ${inserted} questions → ${url.includes("file:") ? "dev.db" : "Turso"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
