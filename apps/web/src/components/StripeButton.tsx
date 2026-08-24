import { useState } from "react";

export function StripeButton({
  studentId = "s1",
  month = "2026-10",
  amount = 500,
}: {
  studentId?: string;
  month?: string;
  amount?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const pay = () => {
    setLoading(true);
    void fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, month, amount }),
    })
      .then((r) => r.json())
      .then((j) => {
        if (j.demo) {
          // stub → mark paid via hrms
          void fetch("/api/hrms/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId, month, amount, status: "paid" }),
          }).then(() =>
            setMsg(`Demo paid ${month} — ${amount} EGP (set STRIPE_SECRET_KEY for real)`),
          );
        } else if (j.url) window.location.href = j.url;
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="rounded-xl border border-border bg-surface p-3 shadow-sm">
      <button
        onClick={pay}
        disabled={loading}
        className="w-full rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay ${amount} EGP — ${month}`}
      </button>
      {msg ? (
        <p className="mt-2 text-xs text-success">{msg}</p>
      ) : (
        <p className="text-xs text-muted">Stripe stub — add STRIPE_SECRET_KEY env to go live</p>
      )}
    </div>
  );
}
