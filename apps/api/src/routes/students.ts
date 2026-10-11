import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { STUDENTS } from "../lib/store.js";

const students = new Hono();
students.get("/", (c) => {
  const q = c.req.query("q")?.toLowerCase();
  const grade = c.req.query("grade");
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
students.post("/import", zValidator("json", z.object({ csv: z.string().min(10) })), (c) => {
  const { csv } = c.req.valid("json");
  const lines = csv.trim().split("\n");
  const header = lines[0].toLowerCase();
  const hasHeader = header.includes("name") && header.includes("grade");
  const start = hasHeader ? 1 : 0;
  let added = 0;
  for (let i = start; i < lines.length; i++) {
    const [name, grade, email] = lines[i].split(",").map((s) => s.trim());
    if (!name || !grade) continue;
    const id = `s${Date.now()}_${added}`;
    STUDENTS.push({ id, name, grade, email });
    added += 1;
  }
  return c.json({ added, total: STUDENTS.length, students: STUDENTS.slice(-added) });
});
students.post(
  "/",
  zValidator(
    "json",
    z.object({ name: z.string().min(2), grade: z.string(), email: z.string().email().optional() }),
  ),
  (c) => {
    const b = c.req.valid("json");
    const s = { id: `s${Date.now()}`, ...b };
    STUDENTS.push(s);
    return c.json(s, 201);
  },
);
students.put(
  "/:id",
  zValidator(
    "json",
    z.object({
      name: z.string().min(2).optional(),
      grade: z.string().optional(),
      email: z.string().email().optional(),
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
