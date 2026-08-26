import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import health from "./routes/health";
import exams from "./routes/exams";
import auth from "./routes/auth";
import hrms from "./routes/hrms";
import stripe from "./routes/stripe";
import students from "./routes/students";

const app = new Hono();

// --- security headers (HSTS + CSP + anti-clickjacking) ---
app.use(
  secureHeaders({
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://fonts.googleapis.com"],
      frameAncestors: ["'none'"],
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// --- rate limit: 60 req / 60s per IP (in-memory) ---
const hits = new Map<string, { n: number; t: number }>();
app.use("/api/*", async (c, next) => {
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
    c.req.header("cf-connecting-ip") ??
    "local";
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.t > 60_000) hits.set(ip, { n: 1, t: now });
  else {
    cur.n++;
    if (cur.n > 60) return c.json({ error: "rate limited" }, 429);
  }
  if (hits.size > 5000) for (const [k, v] of hits) if (now - v.t > 60_000) hits.delete(k);
  await next();
});

app.use(logger());
// CORS allowlist — no wildcard
const ALLOWED = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "https://default-project.pages.dev",
]);
app.use(
  "/api/*",
  cors({
    origin: (origin) =>
      origin && ALLOWED.has(origin) ? origin : ALLOWED.has(origin ?? "") ? origin! : "",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
    credentials: true,
  }),
);
app.route("/api", health);
app.route("/api/auth", auth);
app.route("/api/exams", exams);
app.route("/api/hrms", hrms);
app.route("/api/stripe", stripe);
app.route("/api/students", students);
app.get("/", (c) => c.text("api ok — try /api/health"));

export default app;

// Node adapter — one line swap for Workers (wrangler handles export default)
if (import.meta.env?.MODE !== "worker") {
  const { serve } = await import("@hono/node-server");
  serve({ fetch: app.fetch, port: 3000 }, (info) =>
    // eslint-disable-next-line no-console
    console.log(`api http://localhost:${info.port}`),
  );
}
