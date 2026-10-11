import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import health from "./routes/health.js";
import exams from "./routes/exams.js";
import auth from "./routes/auth.js";
import hrms from "./routes/hrms.js";
import stripe from "./routes/stripe.js";
import students from "./routes/students.js";

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
let lastSweep = 0;
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
  // Sweep stale entries at most once per 60s — the old code iterated the
  // whole map (5000+ entries) on EVERY request once over threshold,
  // i.e. O(n) per request exactly under load.
  if (hits.size > 5000 && now - lastSweep > 60_000) {
    lastSweep = now;
    for (const [k, v] of hits) if (now - v.t > 60_000) hits.delete(k);
  }
  await next();
});

app.use(logger());
// CORS allowlist — no wildcard
const ALLOWED = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  "https://default-project.pages.dev",
  "https://default-project-aj2.pages.dev",
  "https://02dfcd8c.default-project-aj2.pages.dev",
]);
app.use(
  "/api/*",
  cors({
    origin: (origin) => (origin && ALLOWED.has(origin) ? origin : ""),
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
// Browsers request /favicon.ico automatically — return empty 204 instead of 404 spam.
app.get("/favicon.ico", (c) => c.body(null, 204));
app.get("/", (c) => c.text("api ok — try /api/health"));

export default app;

// Node adapter — only run in Node, never on Workers (Workers have `caches` global)
// Skip when imported (vitest, hono/client) — only auto-listen when run directly via tsx.
try {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const isWorkers = typeof caches !== "undefined";
  const isTest = !!process.env.VITEST || process.env.NODE_ENV === "test";
  const runDirectly =
    (process.argv[1] ?? "").replaceAll("\\", "/").endsWith("apps/api/src/index.ts") ||
    (process.argv[1] ?? "").replaceAll("\\", "/").endsWith("src/index.ts");
  if (!isWorkers && !isTest && runDirectly) {
    const { serve } = await import("@hono/node-server");
    serve({ fetch: app.fetch, port: 3000 }, (info) =>
      // eslint-disable-next-line no-console
      console.log(`api http://localhost:${info.port}`),
    );
  }
} catch {}
