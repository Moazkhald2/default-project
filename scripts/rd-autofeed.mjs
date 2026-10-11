#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname + "/..");
const logDir = path.join(root, "backups");
fs.mkdirSync(logDir, { recursive: true });

const stamp = new Date().toISOString();
const logFile = path.join(logDir, "rd-autofeed.log");
const line = `[${stamp}] R&D autofeed heartbeat — use task_run DAG for multi-step work (auto-feeds dashboard+rd_review via GraphRuntime.afterTask)\n`;
fs.appendFileSync(logFile, line);

// rotate >1MB
try {
  if (fs.statSync(logFile).size > 1024 * 1024) fs.writeFileSync(logFile, line);
} catch {}

console.log(line.trim());
console.log("Rule: simple goal → flat mode, multi-step → dag mode, dept auto-inferred. Every task_run counts.");
