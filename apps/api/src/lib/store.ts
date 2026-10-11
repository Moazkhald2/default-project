// Shared in-memory department store — single source of truth for API routes.
// Drizzle schema in db/schema.ts mirrors these shapes; when TURSO_* is bound,
// replace these arrays with db calls without changing route signatures.
export type PaymentStatus = "pending" | "paid" | "overdue";
export type Payment = {
  id: string;
  studentId: string;
  amount: number;
  month: string; // YYYY-MM
  status: PaymentStatus;
  createdAt: string;
};
export type Attend = { id: string; studentId: string; date: string; present: boolean };
export type Student = { id: string; name: string; grade: string; email?: string };
export type Submission = {
  id: string;
  examId: string;
  studentId: string;
  answers: Record<string, string>;
  score: number;
  total: number;
  createdAt: string;
};
const now = () => new Date().toISOString();
export const STUDENTS: Student[] = [
  { id: "s1", name: "Ali", grade: "10", email: "ali@example.com" },
];
export const PAYMENTS: Payment[] = [
  { id: "p1", studentId: "s1", amount: 500, month: "2026-08", status: "paid", createdAt: now() },
  { id: "p2", studentId: "s1", amount: 500, month: "2026-09", status: "pending", createdAt: now() },
];
export const ATTENDANCE: Attend[] = [
  { id: "a1", studentId: "s1", date: "2026-08-24", present: true },
  { id: "a2", studentId: "s1", date: "2026-08-23", present: true },
];
export const SUBMISSIONS: Submission[] = [];
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
export function markPaymentPaid(studentId: string, month: string, amount = 500): Payment {
  const found = PAYMENTS.find((p) => p.studentId === studentId && p.month === month);
  if (found) {
    found.status = "paid";
    return found;
  }
  const p: Payment = {
    id: `p${Date.now()}`,
    studentId,
    amount,
    month,
    status: "paid",
    createdAt: now(),
  };
  PAYMENTS.push(p);
  return p;
}
export function sweepOverdue(todayMonth: string = currentMonth()): Payment[] {
  const changed: Payment[] = [];
  for (const p of PAYMENTS) {
    if (p.status === "pending" && p.month < todayMonth) {
      p.status = "overdue";
      changed.push(p);
    }
  }
  return changed;
}
export function attendanceRate(studentId: string): { rate: number; records: Attend[] } {
  const list = ATTENDANCE.filter((a) => a.studentId === studentId);
  const rate = list.length ? list.filter((a) => a.present).length / list.length : 0;
  return { rate, records: list };
}
export function gradebookFor(studentId: string): {
  average: number;
  count: number;
  recent: { examId: string; score: number; total: number; date: string }[];
} {
  const subs = SUBMISSIONS.filter((s) => s.studentId === studentId);
  if (!subs.length) {
    return { average: 0, count: 0, recent: [] };
  }
  const pct = subs.map((s) => (s.total ? (s.score / s.total) * 100 : 0));
  const average = Math.round((pct.reduce((a, b) => a + b, 0) / pct.length) * 10) / 10;
  return {
    average,
    count: subs.length,
    recent: subs
      .slice(-5)
      .reverse()
      .map((s) => ({
        examId: s.examId,
        score: s.score,
        total: s.total,
        date: s.createdAt,
      })),
  };
}
