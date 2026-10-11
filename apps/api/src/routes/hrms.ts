import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  ATTENDANCE,
  PAYMENTS,
  STUDENTS,
  attendanceRate,
  currentMonth,
  gradebookFor,
  markPaymentPaid,
  sweepOverdue,
} from "../lib/store.js";

const hrms = new Hono();
// Gradebook analytics: wired to real SUBMISSIONS via gradebookFor().
// byTopic stays heuristic until submissions carry topic metadata.
hrms.get("/gradebook/:studentId", (c) => {
  const sid = c.req.param("studentId");
  const gb = gradebookFor(sid);
  return c.json({
    student: STUDENTS.find((s) => s.id === sid) ?? { id: sid },
    average: gb.average,
    count: gb.count,
    byTopic: [],
    recent: gb.recent,
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
    if (b.status === "paid") return c.json(markPaymentPaid(b.studentId, b.month, b.amount), 201);
    const p = { id: `p${Date.now()}`, ...b, createdAt: new Date().toISOString() };
    PAYMENTS.push(p);
    return c.json(p, 201);
  },
);
// Mark a single payment paid/overdue/pending — PaymentsPanel + Stripe webhook use this.
hrms.patch(
  "/payments/:id",
  zValidator("json", z.object({ status: z.enum(["pending", "paid", "overdue"]) })),
  (c) => {
    const p = PAYMENTS.find((x) => x.id === c.req.param("id"));
    if (!p) return c.json({ error: "not found" }, 404);
    p.status = c.req.valid("json").status;
    return c.json(p);
  },
);
// Automation: mark pending months before current month as overdue.
hrms.post("/payments/sweep", (c) => {
  const month = c.req.query("month") ?? currentMonth();
  const changed = sweepOverdue(month);
  return c.json({ month, changed: changed.length, payments: changed });
});
hrms.get("/attendance/:studentId", (c) => {
  const sid = c.req.param("studentId");
  const { rate, records } = attendanceRate(sid);
  return c.json({ studentId: sid, rate, records });
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
    const existing = ATTENDANCE.find((a) => a.studentId === b.studentId && a.date === b.date);
    if (existing) {
      existing.present = b.present;
      return c.json(existing);
    }
    const a = { id: `a${Date.now()}`, ...b };
    ATTENDANCE.push(a);
    return c.json(a, 201);
  },
);
hrms.get("/overview", (c) => {
  const today = new Date().toISOString().slice(0, 10);
  return c.json({
    students: STUDENTS.length,
    pendingPayments: PAYMENTS.filter((p) => p.status === "pending").length,
    overduePayments: PAYMENTS.filter((p) => p.status === "overdue").length,
    attendanceToday: ATTENDANCE.filter((a) => a.date === today && a.present).length,
  });
});
export default hrms;
