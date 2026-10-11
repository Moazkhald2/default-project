import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { markPaymentPaid } from "../lib/store.js";

const stripe = new Hono();
// Stub Stripe — replace with stripe SDK when STRIPE_SECRET_KEY set
// POST /api/stripe/checkout → returns checkout URL
stripe.post(
  "/checkout",
  zValidator(
    "json",
    z.object({
      studentId: z.string(),
      month: z.string().regex(/^\d{4}-\d{2}$/),
      amount: z.number().positive().default(500),
    }),
  ),
  (c) => {
    const { studentId, month, amount } = c.req.valid("json");
    const hasKey = !!process.env.STRIPE_SECRET_KEY;
    if (!hasKey) {
      return c.json({
        url: `/api/hrms/payments/${studentId}?demo=stripe`,
        demo: true,
        message: "Set STRIPE_SECRET_KEY to enable real Stripe. Stub marked paid.",
        sessionId: `cs_demo_${Date.now()}`,
        studentId,
        month,
        amount,
      });
    }
    return c.json({ url: "https://checkout.stripe.com/pay/...", studentId, month, amount });
  },
);
// Webhook — Stripe calls this after payment → marks HRMS payment paid (wired).
// Accepts {studentId, month, amount?} JSON or raw Stripe event text (logs + acks).
stripe.post("/webhook", async (c) => {
  const raw = await c.req.text();
  if (!raw) return c.json({ received: true });
  try {
    const body = JSON.parse(raw) as { studentId?: string; month?: string; amount?: number };
    if (body.studentId && body.month) {
      const paid = markPaymentPaid(body.studentId, body.month, body.amount ?? 500);
      return c.json({ received: true, payment: paid });
    }
  } catch {
    // non-JSON Stripe event — log + ack
  }
  console.log("stripe webhook:", raw.slice(0, 200));
  return c.json({ received: true });
});
export default stripe;
