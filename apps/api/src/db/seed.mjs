#!/usr/bin/env node
// seed.mjs — push content/bank/*.md into SQLite via Drizzle
// Usage: node src/db/seed.mjs
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
// schema imported dynamically when DB wiring completes
void drizzle;
void Database;

function parse(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  const fm = {};
  for (const l of m[1].split("\n")) {
    const i = l.indexOf(":");
    if (i === -1) continue;
    fm[l.slice(0, i).trim()] = l.slice(i + 1).trim().replace(/^["']|["']$/g, "");
  }
  return { fm, body: m[2].trim() };
}

const files = (await readdir(path.resolve("../../content/bank"))).filter(f => f.endsWith(".md"));
for (const f of files) {
  const src = await readFile(path.resolve(`../../content/bank/${f}`), "utf8");
  const p = parse(src);
  if (!p) continue;
  console.log(`seed ${p.fm.id} — ${p.fm.topic}`);
  // db.insert(schema.questions).values({...}).onConflictDoUpdate...
}
console.log("seed done (wire drizzle insert when ready)");
