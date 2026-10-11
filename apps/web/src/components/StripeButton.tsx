import { useState } from "react";
import { api } from "../lib/api";
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
    void api<{ demo?: boolean; url?: string }>(`/api/stripe/checkout`, {
      method: "POST",
      body: JSON.stringify({ studentId, month, amount }),
    })
      .then((j) => {
        if (j.demo) {
          void api("/api/stripe/webhook", {
            method: "POST",
            body: JSON.stringify({ studentId, month, amount }),
          }).then(() => setMsg(`Demo paid ${month} — ${amount} EGP (webhook wired)`));
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
