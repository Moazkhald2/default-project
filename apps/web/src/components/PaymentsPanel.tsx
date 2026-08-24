import { useEffect, useState } from "react";

type Payment = { id: string; month: string; amount: number; status: string };

export function PaymentsPanel({ studentId = "s1" }: { studentId?: string }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [overview, setOverview] = useState<{
    pendingPayments: number;
    attendanceToday: number;
  } | null>(null);

  const load = () => {
    void fetch(`/api/hrms/payments/${studentId}`)
      .then((r) => r.json())
      .then(setPayments);
    void fetch("/api/hrms/overview")
      .then((r) => r.json())
      .then(setOverview);
  };

  useEffect(load, [studentId]);

  const markPaid = (id: string) => {
    // stub: in real app PATCH; here just POST new
    void fetch("/api/hrms/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, amount: 500, month: "2026-10", status: "paid" }),
    }).then(load);
    // visual
    setPayments((p) => p.map((x) => (x.id === id ? { ...x, status: "paid" } : x)));
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <h3 className="font-semibold text-ink">Payments & Attendance — HRMS</h3>
      {overview ? (
        <p className="text-sm text-muted">
          Pending: {overview.pendingPayments} • Today present: {overview.attendanceToday}
        </p>
      ) : null}
      <div className="mt-3 grid gap-2">
        {payments.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-xl border border-border bg-surface px-3 py-2 text-sm"
          >
            <span>
              {p.month} — {p.amount} EGP
            </span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${p.status === "paid" ? "bg-green-100 text-green-700" : p.status === "overdue" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}
            >
              {p.status}
            </span>
            {p.status !== "paid" ? (
              <button
                onClick={() => markPaid(p.id)}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs hover:bg-canvas"
              >
                Mark paid
              </button>
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted">
        DB: payments table (Drizzle) — also visible in /api/hrms/payments/s1
      </p>
    </div>
  );
}
