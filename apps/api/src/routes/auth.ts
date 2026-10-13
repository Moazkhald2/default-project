import { Hono } from "hono";
import type { Context, Next } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getDb } from "../db/client.js";
import { users } from "../db/schema.js";

const auth = new Hono();

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32)
    throw new Error("JWT_SECRET must be set (>=32 chars) — wrangler secret put JWT_SECRET");
  return s;
}
function sign(payload: object, expSec = 3600): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + expSec }),
  ).toString("base64url");
  const sig = createHmac("sha256", getSecret()).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}
function verify(token: string): Record<string, string> | null {
  try {
    const [h, b, s] = token.split(".");
    if (!h || !b || !s) return null;
    // H2: enforce alg — reject none/RS256 confusion attacks
    try {
      const header = JSON.parse(Buffer.from(h, "base64url").toString("utf8")) as {
        alg?: string;
      };
      if (header.alg !== "HS256") return null;
    } catch {
      return null;
    }
    const expect = createHmac("sha256", getSecret()).update(`${h}.${b}`).digest("base64url");
    if (expect.length !== s.length) return null;
    let diff = 0;
    for (let i = 0; i < expect.length; i++) diff |= expect.charCodeAt(i) ^ s.charCodeAt(i);
    if (diff !== 0) return null;
    const payload = JSON.parse(Buffer.from(b, "base64url").toString("utf8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

// C2: users are looked up from the database — no hardcoded credentials.
// Seed users via: npx tsx apps/api/src/db/seed.ts (creates users table + default users)

function getTokenFromRequest(c: Context): string | null {
  const authHeader = c.req.header("authorization");
  if (authHeader?.startsWith("Bearer ")) return authHeader.slice(7);
  const cookieHeader = c.req.header("cookie");
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}

auth.post(
  "/login",
  zValidator("json", z.object({ email: z.string().email(), password: z.string().min(3).max(128) })),
  async (c) => {
    const { email, password } = c.req.valid("json");
    try {
      const db = getDb();
      const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()));
      if (!user || !(await bcrypt.compare(password, user.passwordHash)))
        return c.json({ error: "invalid credentials" }, 401);
      const token = sign({ id: user.id, email: user.email, role: user.role, name: user.name });
      c.header(
        "Set-Cookie",
        `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
      );
      return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } catch {
      return c.json({ error: "invalid credentials" }, 401);
    }
  },
);

auth.post("/logout", (c) => {
  c.header("Set-Cookie", "token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0");
  return c.json({ ok: true });
});

auth.get("/me", (c) => {
  const token = getTokenFromRequest(c);
  if (!token) return c.json({ error: "no token" }, 401);
  const p = verify(token);
  if (!p) return c.json({ error: "bad token" }, 401);
  return c.json({ user: p });
});

export function authMiddleware(roles?: ("teacher" | "student")[]) {
  return async (c: Context, next: Next) => {
    const token = getTokenFromRequest(c);
    const p = token ? verify(token) : null;
    if (!p) return c.json({ error: "unauthorized" }, 401);
    if (roles && !roles.includes(p.role as "teacher" | "student"))
      return c.json({ error: "forbidden" }, 403);
    c.set("user", p);
    await next();
  };
}

export default auth;
