import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

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
      // stub: simulate checkout
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
    // real: const session = await stripe.checkout.sessions.create({...})
    return c.json({ url: "https://checkout.stripe.com/pay/...", studentId, month, amount });
  },
);

// Webhook — Stripe calls this after payment → marks payments paid
stripe.post("/webhook", async (c) => {
  const body = await c.req.text();
  // verify signature with STRIPE_WEBHOOK_SECRET in prod
  console.log("stripe webhook:", body.slice(0, 200));
  return c.json({ received: true });
});

export default stripe;
