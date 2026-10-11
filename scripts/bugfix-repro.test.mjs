import { describe, it, expect } from "vitest";
import { improveJobs, rotateBackups, localMain } from "./autopilot.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

describe("bugfix repro: dryRun must not hit network", () => {
  it("improveJobs(true) returns fast without npm outdated", { timeout: 15000 }, async () => {
    const start = Date.now();
    const report = await improveJobs(true);
    const elapsed = Date.now() - start;
    // dryRun must skip heavy npm outdated -> <2000ms even on full disk
    expect(elapsed).toBeLessThan(2000);
    expect(report).toHaveProperty("deps");
  });
});

describe("bugfix repro: large backup rotation", () => {
  it("rotateBackups cleans old Default-Project zips beyond keep", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bugfix-rot-"));
    const base = Date.now() - 100000;
    for (let i = 0; i < 5; i++) {
      const p = path.join(dir, `Default-Project_2026-09-0${i}T20-48-58.zip`);
      fs.writeFileSync(p, "x".repeat(100));
      const t = new Date(base + i * 1000);
      fs.utimesSync(p, t, t);
    }
    // current rotateBackups only handles autopilot-*.json, so this should fail before fix
    const result = rotateBackups({ dir, prefix: "Default-Project_", keep: 2 });
    const remaining = fs.readdirSync(dir).filter((f) => f.endsWith(".zip"));
    expect(remaining.length).toBe(2);
    expect(result.deleted.length).toBe(3);
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("localMain dryRun completes within 5s default timeout", async () => {
    const r = await localMain({ dryRun: true });
    expect(r).toHaveProperty("status");
  });
});
