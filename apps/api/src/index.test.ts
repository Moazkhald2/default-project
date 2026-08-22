import { describe, it, expect } from "vitest";
import app from "./index";

describe("api", () => {
  it("GET /api/health returns ok", async () => {
    const res = await app.request("/api/health");
    expect(res.status).toBe(200);
    const j = (await res.json()) as { status: string };
    expect(j.status).toBe("ok");
  });
});
