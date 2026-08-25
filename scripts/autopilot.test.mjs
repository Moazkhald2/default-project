import { describe, it, expect } from "vitest";
import { scoreTool } from "./autopilot.mjs";

describe("scoreTool", () => {
  it("scores free no-API tool high", () => {
    const tool = { name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 5, fitsJobs: true };
    expect(scoreTool(tool)).toBeGreaterThan(80);
  });
  it("penalizes paid API tool", () => {
    const tool = { name: "browser-use-mcp", free: true, noAPI: false, license: "MIT", stars: 2000, updatedDaysAgo: 2, fitsJobs: true };
    expect(scoreTool(tool)).toBeLessThanOrEqual(50);
  });
  it("rejects non-free", () => {
    const tool = { name: "paid-tool", free: false, noAPI: true, license: "MIT", stars: 9999, updatedDaysAgo: 1, fitsJobs: true };
    expect(scoreTool(tool)).toBe(0);
  });
});
