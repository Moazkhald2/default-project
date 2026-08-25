#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";

export function scoreTool(tool) {
  if (!tool.free) return 0;
  let score = 50;
  if (tool.noAPI) score += 30; else score -= 50;
  if (tool.license === "MIT" || tool.license === "Apache-2.0") score += 10;
  if (tool.stars > 100) score += 10;
  if (tool.updatedDaysAgo < 30) score += 10;
  if (tool.fitsJobs) score += 20;
  if (tool.auditClean === false) score -= 30;
  return Math.max(0, Math.min(100, score));
}

export async function discoverTools(opts = {}) {
  // Task1: stub returns current playwright as baseline; real search added Task2
  return [{ name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 2, fitsJobs: true, version: getCurrentToolVersion() }];
}

export function getCurrentToolVersion() {
  try {
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    return pkg.devDependencies?.["@playwright/mcp"] || "unknown";
  } catch { return "unknown"; }
}

const mode = process.argv.find(a => a.startsWith("--mode="))?.split("=")[1] || "check";
if (process.argv[1]?.endsWith("autopilot.mjs")) {
  console.log(`autopilot mode=${mode} score test:`, scoreTool({ free: true, noAPI: true, license: "MIT", stars: 500, updatedDaysAgo: 5, fitsJobs: true }));
}
