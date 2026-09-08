import { Hono } from "hono";

const health = new Hono();

health.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

health.post("/vitals", async (c) => {
  // Accept both application/json and text/plain (sendBeacon legacy) bodies.
  try {
    const raw = await c.req.text();
    if (!raw) return c.json({ error: "empty body" }, 400);
    const body = JSON.parse(raw) as { name?: unknown; value?: unknown };
    if (
      typeof body.name !== "string" ||
      typeof body.value !== "number" ||
      !Number.isFinite(body.value)
    )
      return c.json({ error: "invalid vitals: need {name:string,value:number}" }, 400);
    console.log("vitals", { name: body.name, value: body.value });
    return c.json({ ok: true });
  } catch {
    return c.json({ error: "invalid JSON" }, 400);
  }
});

export default health;
