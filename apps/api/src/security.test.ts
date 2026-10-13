import { describe, it, expect } from "vitest";
import app from "./index";

describe("security headers", () => {
  it("includes HSTS header", async () => {
    const res = await app.request("/api/health");
    expect(res.headers.get("strict-transport-security")).toContain("max-age=63072000");
  });

  it("includes X-Content-Type-Options header", async () => {
    const res = await app.request("/api/health");
    expect(res.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("includes Referrer-Policy header", async () => {
    const res = await app.request("/api/health");
    expect(res.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
  });

  it("includes Permissions-Policy header", async () => {
    const res = await app.request("/api/health");
    expect(res.headers.get("permissions-policy")).toContain("camera=()");
  });

  it("includes Content-Security-Policy header", async () => {
    const res = await app.request("/api/health");
    expect(res.headers.get("content-security-policy")).toBeTruthy();
  });
});

describe("CORS", () => {
  it("allows production domain", async () => {
    const res = await app.request("/api/health", {
      headers: { Origin: "https://math-mentor-lms.pages.dev" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBe(
      "https://math-mentor-lms.pages.dev",
    );
  });

  it("blocks unknown origins", async () => {
    const res = await app.request("/api/health", {
      headers: { Origin: "https://evil.com" },
    });
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});

describe("auth security", () => {
  it("login returns 401 for invalid credentials", async () => {
    const res = await app.request("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "wrongpassword" }),
    });
    expect(res.status).toBe(401);
  });

  it("logout clears the cookie", async () => {
    const res = await app.request("/api/auth/logout", { method: "POST" });
    expect(res.status).toBe(200);
    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("Max-Age=0");
  });

  it("requires auth for students routes", async () => {
    const res = await app.request("/api/students");
    expect(res.status).toBe(401);
  });

  it("requires auth for hrms routes", async () => {
    const res = await app.request("/api/hrms/overview");
    expect(res.status).toBe(401);
  });
});

describe("rate limiting", () => {
  it("returns 429 after too many requests", async () => {
    let lastStatus = 200;
    for (let i = 0; i < 70; i++) {
      const res = await app.request("/api/health");
      lastStatus = res.status;
      if (lastStatus === 429) break;
    }
    expect(lastStatus).toBe(429);
  });
});
