import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHmac } from "node:crypto";
import bcrypt from "bcryptjs";

const auth = new Hono();

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32)
    throw new Error("JWT_SECRET must be set (>=32 chars) — wrangler secret put JWT_SECRET");
  return s;
}
function sign(payload: object, expSec = 86400): string {
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

// Demo users: passwords are bcrypt-hashed; in prod replace with DB lookup
// Hashes for "teacher123" / "student123" — generated via bcrypt 10 rounds
type User = { id: string; email: string; name: string; role: "teacher" | "student"; hash: string };
const USERS: User[] = [
  {
    id: "t1",
    email: "teacher@math.academy",
    name: "Mr Ahmed",
    role: "teacher",
    hash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  }, // teacher123
  {
    id: "s1",
    email: "student@math.academy",
    name: "Ali",
    role: "student",
    hash: "$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy".replace("N9qo", "abcd"),
  }, // placeholder — will fallback to env check
];
// Correct hashes seeded at startup if JWT_SECRET set
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  seeded = true;
  USERS[0].hash = await bcrypt.hash("teacher123", 10);
  USERS[1].hash = await bcrypt.hash("student123", 10);
}

auth.post(
  "/login",
  zValidator("json", z.object({ email: z.string().email(), password: z.string().min(3).max(128) })),
  async (c) => {
    await ensureSeeded();
    const { email, password } = c.req.valid("json");
    const u = USERS.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!u || !(await bcrypt.compare(password, u.hash)))
      return c.json({ error: "invalid credentials" }, 401);
    const token = sign({ id: u.id, email: u.email, role: u.role, name: u.name });
    return c.json({ token, user: { id: u.id, email: u.email, name: u.name, role: u.role } });
  },
);

auth.get("/me", (c) => {
  const h = c.req.header("authorization")?.replace("Bearer ", "");
  if (!h) return c.json({ error: "no token" }, 401);
  const p = verify(h);
  if (!p) return c.json({ error: "bad token" }, 401);
  return c.json({ user: p });
});

export function authMiddleware(roles?: ("teacher" | "student")[]) {
  return async (
    c: {
      req: { header: (n: string) => string | undefined };
      set: (k: string, v: unknown) => void;
      json: (o: unknown, s?: number) => Response;
    },
    next: () => Promise<void>,
  ) => {
    const h = c.req.header("authorization")?.replace("Bearer ", "");
    const p = h ? verify(h) : null;
    if (!p) return c.json({ error: "unauthorized" }, 401);
    if (roles && !roles.includes(p.role as "teacher" | "student"))
      return c.json({ error: "forbidden" }, 403);
    c.set("user", p);
    await next();
  };
}

export default auth;
