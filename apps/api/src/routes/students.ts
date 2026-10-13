import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { STUDENTS } from "../lib/store.js";

const students = new Hono();

// M3: sanitize CSV fields — strip HTML tags and dangerous characters
function sanitizeCsvField(field: string): string {
  return field
    .replaceAll("<", "")
    .replaceAll(">", "")
    .replaceAll('"', "")
    .replaceAll("'", "")
    .replaceAll("`", "")
    .trim()
    .slice(0, 200);
}

// H4: proper CSV line parser — handles quoted commas ("a, b",10)
function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQ) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQ = false;
      } else cur += ch;
    } else if (ch === '"') inQ = true;
    else if (ch === ",") {
      out.push(cur.trim());
      cur = "";
    } else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

students.get("/", (c) => {
  const q = c.req.query("q")?.toLowerCase();
  const grade = c.req.query("grade");
  // H1: grade allowlist when present
  if (grade !== undefined && !/^\d{1,2}$/.test(grade))
    return c.json({ error: "invalid grade" }, 400);
  let out = STUDENTS;
  if (grade) out = out.filter((s) => s.grade === grade);
  if (q) out = out.filter((s) => s.name.toLowerCase().includes(q));
  return c.json(out);
});
students.get("/:id", (c) => {
  const s = STUDENTS.find((x) => x.id === c.req.param("id"));
  if (!s) return c.json({ error: "not found" }, 404);
  return c.json(s);
});
// H4: csv max 50k chars, 500 lines
students.post(
  "/import",
  zValidator("json", z.object({ csv: z.string().min(10).max(50000) })),
  (c) => {
    const { csv } = c.req.valid("json");
    const lines = csv.trim().split("\n");
    if (lines.length > 500) return c.json({ error: "csv too many lines (max 500)" }, 400);
    const header = (lines[0] ?? "").toLowerCase();
    const hasHeader = header.includes("name") && header.includes("grade");
    const start = hasHeader ? 1 : 0;
    let added = 0;
    for (let i = start; i < lines.length; i++) {
      const [rawName, rawGrade, rawEmail] = parseCsvLine(lines[i]);
      const name = sanitizeCsvField(rawName);
      const grade = sanitizeCsvField(rawGrade);
      const email = sanitizeCsvField(rawEmail);
      if (!name || !grade) continue;
      if (name.length > 100 || grade.length > 4) continue;
      const id = `s-${randomUUID()}`;
      STUDENTS.push({ id, name, grade, email: email || undefined });
      added += 1;
    }
    return c.json({ added, total: STUDENTS.length, students: STUDENTS.slice(-added) });
  },
);
students.post(
  "/",
  zValidator(
    "json",
    z.object({
      name: z.string().min(2).max(100),
      grade: z.string().regex(/^\d{1,2}$/),
      email: z.string().email().max(254).optional(),
    }),
  ),
  (c) => {
    const b = c.req.valid("json");
    const s = { id: `s-${randomUUID()}`, ...b };
    STUDENTS.push(s);
    return c.json(s, 201);
  },
);
students.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(2).max(100).optional(),
      grade: z
        .string()
        .regex(/^\d{1,2}$/)
        .optional(),
      email: z.string().email().max(254).optional(),
    }),
  ),
  (c) => {
    const s = STUDENTS.find((x) => x.id === c.req.param("id"));
    if (!s) return c.json({ error: "not found" }, 404);
    Object.assign(s, c.req.valid("json"));
    return c.json(s);
  },
);
students.delete("/:id", (c) => {
  const idx = STUDENTS.findIndex((x) => x.id === c.req.param("id"));
  if (idx === -1) return c.json({ error: "not found" }, 404);
  const [removed] = STUDENTS.splice(idx, 1);
  return c.json(removed);
});
export default students;
