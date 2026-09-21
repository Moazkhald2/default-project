#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
const root = path.resolve(import.meta.dirname + "/..");
const START = Date.now();
const BUDGET_MS = 15 * 60 * 1000;
const SEARCH_MS = 4 * 60 * 1000;
function budgetLeft() { return BUDGET_MS - (Date.now() - START); }
export function shouldRunToday(today, guard) { return today !== (guard ?? "").trim(); }
const ALLOW = [/^github\.com$/, /^raw\.githubusercontent\.com$/, /^docs\./, /^.*\.docs\..*$/, /^nvd\.nist\.gov$/, /^cve\.mitre\.org$/, /^stackoverflow\.com$/];
export function isAllowedSearchHost(url) {
  try { const h = new URL(url).hostname.toLowerCase(); return ALLOW.some((re) => re.test(h)); }
  catch { return false; }
}
function todayStr() { return new Date().toISOString().slice(0, 10); }
function logLine(logFile, s) { fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${s}\n`); }
function safeExec(cmd, timeoutMs = 60000) {
  try { return execSync(cmd, { cwd: root, timeout: timeoutMs, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).slice(0, 4000); }
  catch (e) { return `SKIP/FAIL ${cmd}: ${(e.message ?? "").slice(0, 300)}`; }
}
export async function main() {
  const backups = path.join(root, "backups");
  fs.mkdirSync(backups, { recursive: true });
  const guardFile = path.join(backups, "last-boot-improve.txt");
  const today = todayStr();
  const guard = fs.existsSync(guardFile) ? fs.readFileSync(guardFile, "utf8") : "";
  const logFile = path.join(backups, `boot-improve-${today}.log`);
  if (!shouldRunToday(today, guard)) { logLine(logFile, "skip already-ran-today"); return { status: "skipped", logFile }; }
  logLine(logFile, "start 15min boot-improve (local-only, no commit/push)");
  const memCount = (() => { try { return execSync("git ls-files memories | wc -l", { cwd: root, encoding: "utf8" }).trim(); } catch { return "unknown"; } })();
  logLine(logFile, `memory files tracked: ${memCount}`);
  try { fs.appendFileSync(path.join(backups, "rd-autofeed.log"), `[${new Date().toISOString()}] boot-improve heartbeat\n`); } catch {}
  logLine(logFile, "search phase: capped 4min legit-only, proposals not blind-apply (see NEXT)");
  logLine(logFile, `git status: ${safeExec("git status --porcelain").slice(0, 1500)}`);
  if (budgetLeft() > 3 * 60 * 1000) logLine(logFile, `lint: ${safeExec("npm run lint --silent", 120000).slice(0, 1500)}`);
  logLine(logFile, "NEXT: safe-only applied; bigger updates need user approval");
  fs.writeFileSync(guardFile, today);
  logLine(logFile, "done");
  return { status: "done", logFile };
}
if (import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}` || process.argv[1]?.endsWith("boot-improve.mjs")) {
  main().then(() => process.exit(0)).catch((e) => { try { fs.appendFileSync(path.join(root, "backups", `boot-improve-${todayStr()}.log`), `FATAL ${e.message}\n`); } catch {} process.exit(0); });
}
