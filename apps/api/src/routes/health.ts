import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const health = new Hono();

health.get("/health", (c) => c.json({ status: "ok", ts: Date.now() }));

health.post(
  "/vitals",
  zValidator("json", z.object({ name: z.string(), value: z.number() }).passthrough()),
  (c) => {
    console.log("vitals", c.req.valid("json"));
    return c.json({ ok: true });
  }
);

export default health;
