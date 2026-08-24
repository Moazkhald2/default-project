import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const students = new Hono();

type Student = { id: string; name: string; grade: string; email?: string };
const STUDENTS: Student[] = [{ id: "s1", name: "Ali", grade: "10", email: "ali@example.com" }];

students.get("/", (c) => c.json(STUDENTS));

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
    const s: Student = { id: `s${Date.now()}`, ...b };
    STUDENTS.push(s);
    return c.json(s, 201);
  },
);

export default students;
