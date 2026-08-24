import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const hrms = new Hono();

// In-memory HRMS — drizzledb when TURSO bound, keeps edge fast
type Payment = {
  id: string;
  studentId: string;
  amount: number;
  month: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
};
type Attend = { id: string; studentId: string; date: string; present: boolean };
const PAYMENTS: Payment[] = [
  {
    id: "p1",
    studentId: "s1",
    amount: 500,
    month: "2026-08",
    status: "paid",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    studentId: "s1",
    amount: 500,
    month: "2026-09",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
];
const ATTENDANCE: Attend[] = [
  { id: "a1", studentId: "s1", date: "2026-08-24", present: true },
  { id: "a2", studentId: "s1", date: "2026-08-23", present: true },
];
const STUDENTS = [{ id: "s1", name: "Ali", grade: "10" }];

// Gradebook analytics: avg, by topic, submissions
hrms.get("/gradebook/:studentId", (c) => {
  const sid = c.req.param("studentId");
  // mock: compute from submissions in exams route memory — here stub
  return c.json({
    student: STUDENTS.find((s) => s.id === sid) ?? { id: sid },
    average: 78.5,
    byTopic: [
      { topic: "quadratic_formula", avg: 85, count: 3 },
      { topic: "circle_theorems", avg: 72, count: 2 },
    ],
    recent: [{ examId: "demo", score: 2, total: 3, date: new Date().toISOString() }],
  });
});

hrms.get("/payments/:studentId", (c) => {
  const sid = c.req.param("studentId");
  return c.json(PAYMENTS.filter((p) => p.studentId === sid));
});
hrms.post(
  "/payments",
  zValidator(
    "json",
    z.object({
      studentId: z.string(),
      amount: z.number().positive(),
      month: z.string().regex(/^\d{4}-\d{2}$/),
      status: z.enum(["pending", "paid", "overdue"]).default("pending"),
    }),
  ),
  (c) => {
    const b = c.req.valid("json");
    const p: Payment = { id: `p${Date.now()}`, ...b, createdAt: new Date().toISOString() };
    PAYMENTS.push(p);
    return c.json(p, 201);
  },
);

hrms.get("/attendance/:studentId", (c) => {
  const sid = c.req.param("studentId");
  const list = ATTENDANCE.filter((a) => a.studentId === sid);
  const rate = list.length ? list.filter((a) => a.present).length / list.length : 0;
  return c.json({ studentId: sid, rate, records: list });
});
hrms.post(
  "/attendance",
  zValidator(
    "json",
    z.object({
      studentId: z.string(),
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      present: z.boolean(),
    }),
  ),
  (c) => {
    const b = c.req.valid("json");
    const a: Attend = { id: `a${Date.now()}`, ...b };
    ATTENDANCE.push(a);
    return c.json(a, 201);
  },
);

hrms.get("/overview", (c) => {
  return c.json({
    students: STUDENTS.length,
    pendingPayments: PAYMENTS.filter((p) => p.status === "pending").length,
    attendanceToday: ATTENDANCE.filter(
      (a) => a.date === new Date().toISOString().slice(0, 10) && a.present,
    ).length,
  });
});

export default hrms;
