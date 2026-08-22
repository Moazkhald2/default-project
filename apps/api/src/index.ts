import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import health from "./routes/health";

const app = new Hono();

app.use(logger());
app.use("/api/*", cors());
app.route("/api", health);
app.get("/", (c) => c.text("api ok — try /api/health"));

export default app;

// Node adapter — one line swap for Workers (wrangler handles export default)
if (import.meta.env?.MODE !== "worker") {
  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port: 3000 }, (info) => console.log(`api http://localhost:${info.port}`));
}
