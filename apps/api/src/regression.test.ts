import { describe, it, expect } from "vitest";
import app from "./index";

describe("regression: deep-scan fixes", () => {
  it("GET /favicon.ico returns 204 (no 404 spam)", async () => {
    const res = await app.request("/favicon.ico");
    expect(res.status).toBe(204);
  });

  it("POST /api/vitals accepts application/json {name,value}", async () => {
    const res = await app.request("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "LCP", value: 1234, id: "v1" }),
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/vitals accepts text/plain JSON (sendBeacon legacy)", async () => {
    const res = await app.request("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ name: "CLS", value: 0.05 }),
    });
    expect(res.status).toBe(200);
  });

  it("POST /api/vitals rejects invalid payload with 400", async () => {
    const res = await app.request("/api/vitals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "LCP" }),
    });
    expect(res.status).toBe(400);
  });

  it("GET /api/exams/curriculum/10 returns real framework (not 404)", async () => {
    const res = await app.request("/api/exams/curriculum/10");
    expect(res.status).toBe(200);
    const j = (await res.json()) as Record<string, unknown>;
    expect(j).toBeTruthy();
  });

  it("GET /api/exams/bank loads real vault (more than 2 fallback rows)", async () => {
    const res = await app.request("/api/exams/bank");
    expect(res.status).toBe(200);
    const j = (await res.json()) as unknown[];
    expect(Array.isArray(j)).toBe(true);
    expect(j.length).toBeGreaterThan(2);
  });
});
