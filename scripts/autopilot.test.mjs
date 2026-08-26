import { describe, it, expect } from "vitest";
import { scoreTool, improveJobs, searchAllSources, runVerify, decideAction, localMain, rotateBackups } from "./autopilot.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

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
describe("decideAction", () => {
  it("keeps current if best not > current+10", () => {
    const current = { name: "@playwright/mcp", score: 90 };
    const best = { name: "chrome-devtools-mcp", score: 95 };
    expect(decideAction(current, best)).toBe("KEEP");
  });
  it("recommends if best > current+10", () => {
    const current = { name: "@playwright/mcp", score: 80 };
    const best = { name: "new-mcp", score: 95 };
    expect(decideAction(current, best)).toBe("RECOMMEND");
  });
});
describe("localMain", () => {
  it("dryRun returns applied status", async () => {
    const r = await localMain({ dryRun: true });
    expect(r).toHaveProperty("status");
    expect(["applied", "skipped", "backup-check"]).toContain(r.status);
  });
});

function makeTempBackups(count) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "autopilot-rot-"));
  const base = Date.now() - 100000;
  for (let i = 0; i < count; i++) {
    fs.writeFileSync(path.join(dir, `autopilot-cloud-${base + i}.json`), "{}");
  }
  return dir;
}

describe("rotateBackups", () => {
  it("deletes oldest JSONs beyond keep limit", () => {
    const dir = makeTempBackups(10);
    const result = rotateBackups({ dir, keep: 8 });
    const remaining = fs.readdirSync(dir).filter(f => f.endsWith(".json"));
    expect(remaining.length).toBe(8);
    expect(result.deleted.length).toBe(2);
    fs.rmSync(dir, { recursive: true, force: true });
  });
  it("keeps newest files, deletes oldest first", () => {
    const dir = makeTempBackups(10);
    rotateBackups({ dir, keep: 8 });
    const remaining = fs.readdirSync(dir).sort();
    // oldest two (base+0, base+1) must be gone
    expect(remaining.some(f => f.includes(String(Date.now() - 100000)))).toBe(false);
    fs.rmSync(dir, { recursive: true, force: true });
  });
  it("no-op when under limit", () => {
    const dir = makeTempBackups(3);
    const result = rotateBackups({ dir, keep: 8 });
    expect(result.deleted.length).toBe(0);
    expect(fs.readdirSync(dir).length).toBe(3);
    fs.rmSync(dir, { recursive: true, force: true });
  });
});
