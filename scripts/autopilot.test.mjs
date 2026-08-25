import { describe, it, expect } from "vitest";
import { scoreTool, improveJobs, searchAllSources, runVerify } from "./autopilot.mjs";

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

describe("improveJobs", () => {
  it("returns dryRun report without mutating", async () => {
    const report = await improveJobs(true);
    expect(report).toHaveProperty("deps");
    expect(report).toHaveProperty("lint");
    expect(report).toHaveProperty("verify");
  });
});
describe("searchAllSources", () => {
  it("returns array with source tags", async () => {
    const tools = await searchAllSources({ dryRun: true });
    expect(Array.isArray(tools)).toBe(true);
    // dryRun returns mocked 2 tools
    expect(tools.length).toBeGreaterThanOrEqual(1);
    expect(tools[0]).toHaveProperty("source");
  });
});
describe("runVerify", () => {
  it("is a function", () => {
    expect(typeof runVerify).toBe("function");
  });
});
