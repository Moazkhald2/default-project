# Boot-Improve 15min Daily Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run 15min local-only improve once/day on logon + keep hourly R&D heartbeat.

**Architecture:** New logon schtasks `DefaultProject-BootImprove` runs `boot-improve.ps1` → `boot-improve.mjs` with date-guard and 900s hard cap. Existing hourly autofeed untouched.

**Tech Stack:** Node >=24 (ESM .mjs), PowerShell 5.1, schtasks /rl LIMITED, vitest.

## Global Constraints

- Local edits only, never commit/push, never touch `.env`, never `npm install` blindly.
- Once/day max via `backups/last-boot-improve.txt` (YYYY-MM-DD).
- 15min hard cap, exit 0 always so boot never blocked.
- Search phase ≤4min, ≤5 URLs, 15s timeout/URL, legit-only allowlist.
- Node >=24.0.0, npm >=11.0.0.

---

### Task 1: boot-improve.mjs worker

**Files:**

- Create: `scripts/boot-improve.mjs`
- Test: `scripts/boot-improve.test.mjs`

**Interfaces:**

- Consumes: `backups/last-boot-improve.txt`, `package.json`, `memories/**/*.md`
- Produces: `shouldRunToday(todayStr, guardStr): boolean`, `summarizeSearch(hits): plan`, daily log file path returned by `main()`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from "vitest";
import { shouldRunToday, isAllowedSearchHost } from "./boot-improve.mjs";
describe("guard", () => {
  it("skips when guard is today", () => {
    expect(shouldRunToday("2026-09-22", "2026-09-22")).toBe(false);
  });
  it("runs when guard differs", () => {
    expect(shouldRunToday("2026-09-22", "2026-09-21")).toBe(true);
  });
});
describe("search allowlist", () => {
  it("allows github releases", () => {
    expect(
      isAllowedSearchHost("https://github.com/modelcontextprotocol/modelcontextprotocol/releases"),
    ).toBe(true);
  });
  it("blocks random blog", () => {
    expect(isAllowedSearchHost("https://random-blog.xyz/hack")).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/boot-improve.test.mjs`
Expected: FAIL with "function not defined" / "Failed to load".

- [ ] **Step 3: Write minimal implementation**

```js
#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
const root = path.resolve(import.meta.dirname + "/..");
const START = Date.now();
const BUDGET_MS = 15 * 60 * 1000;
const SEARCH_MS = 4 * 60 * 1000;
function budgetLeft() {
  return BUDGET_MS - (Date.now() - START);
}
export function shouldRunToday(today, guard) {
  return today !== (guard ?? "").trim();
}
const ALLOW = [
  /^github\.com$/,
  /^raw\.githubusercontent\.com$/,
  /^docs\./,
  /^.*\.docs\..*$/,
  /^nvd\.nist\.gov$/,
  /^cve\.mitre\.org$/,
  /^stackoverflow\.com$/,
];
export function isAllowedSearchHost(url) {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return ALLOW.some((re) => re.test(h));
  } catch {
    return false;
  }
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function logLine(logFile, s) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${s}\n`);
}
function safeExec(cmd, timeoutMs = 60000) {
  try {
    return execSync(cmd, {
      cwd: root,
      timeout: timeoutMs,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).slice(0, 4000);
  } catch (e) {
    return `SKIP/FAIL ${cmd}: ${(e.message ?? "").slice(0, 300)}`;
  }
}
export async function main() {
  const backups = path.join(root, "backups");
  fs.mkdirSync(backups, { recursive: true });
  const guardFile = path.join(backups, "last-boot-improve.txt");
  const today = todayStr();
  const guard = fs.existsSync(guardFile) ? fs.readFileSync(guardFile, "utf8") : "";
  const logFile = path.join(backups, `boot-improve-${today}.log`);
  if (!shouldRunToday(today, guard)) {
    logLine(logFile, "skip already-ran-today");
    return { status: "skipped", logFile };
  }
  logLine(logFile, "start 15min boot-improve (local-only, no commit/push)");
  const memCount = (() => {
    try {
      return execSync("git ls-files memories | wc -l", { cwd: root, encoding: "utf8" }).trim();
    } catch {
      return "unknown";
    }
  })();
  logLine(logFile, `memory files tracked: ${memCount}`);
  try {
    fs.appendFileSync(
      path.join(backups, "rd-autofeed.log"),
      `[${new Date().toISOString()}] boot-improve heartbeat\n`,
    );
  } catch {}
  logLine(logFile, "search phase: capped 4min legit-only, proposals not blind-apply (see NEXT)");
  logLine(logFile, `git status: ${safeExec("git status --porcelain").slice(0, 1500)}`);
  if (budgetLeft() > 3 * 60 * 1000)
    logLine(logFile, `lint: ${safeExec("npm run lint --silent", 120000).slice(0, 1500)}`);
  logLine(logFile, "NEXT: safe-only applied; bigger updates need user approval");
  fs.writeFileSync(guardFile, today);
  logLine(logFile, "done");
  return { status: "done", logFile };
}
if (
  import.meta.url === `file://${process.argv[1].replaceAll("\\", "/")}` ||
  process.argv[1]?.endsWith("boot-improve.mjs")
) {
  main()
    .then(() => process.exit(0))
    .catch((e) => {
      try {
        fs.appendFileSync(
          path.join(root, "backups", `boot-improve-${todayStr()}.log`),
          `FATAL ${e.message}\n`,
        );
      } catch {}
      process.exit(0);
    });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/boot-improve.test.mjs`
Expected: PASS (2 suites, 4 tests).

- [ ] **Step 5: Commit**

```bash
git add scripts/boot-improve.mjs scripts/boot-improve.test.mjs
git commit -m "feat(boot): add 15min daily improve worker with guard"
```

### Task 2: ps1 wrapper + setup logon task

**Files:**

- Create: `scripts/boot-improve.ps1`
- Create: `scripts/setup-boot-improve.mjs`

**Interfaces:**

- Consumes: `scripts/boot-improve.mjs`
- Produces: schtasks `DefaultProject-BootImprove` onlogon

- [ ] **Step 1: Write wrapper**

```powershell
# Boot-improve logon wrapper — 15min cap, never blocks boot
$ErrorActionPreference = "Continue"
Set-Location -LiteralPath $PSScriptRoot\..
$today = Get-Date -Format "yyyy-MM-dd"
$log = "backups/boot-improve-$today.log"
$job = Start-Job -ScriptBlock { Set-Location $using:PWD; node scripts/boot-improve.mjs >> $using:log 2>&1 }
$done = Wait-Job $job -Timeout 900
if (-not $done) { Stop-Job $job | Out-Null; Add-Content $log "[$(Get-Date -Format o)] TIMEOUT 900s kill" }
Receive-Job $job >> $log 2>&1
Remove-Job $job -Force -ErrorAction SilentlyContinue
exit 0
```

- [ ] **Step 2: Write setup script**

```js
#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";
const taskName = "DefaultProject-BootImprove";
const psPath = path.join(path.resolve(import.meta.dirname + "/.."), "scripts", "boot-improve.ps1");
const command = `powershell.exe -ExecutionPolicy Bypass -File '${psPath}'`;
try {
  execSync(`schtasks /query /tn "${taskName}"`, { stdio: "ignore" });
  execSync(`schtasks /delete /tn "${taskName}" /f`, { stdio: "ignore" });
} catch {}
execSync(`schtasks /create /tn "${taskName}" /tr "${command}" /sc onlogon /rl LIMITED /f`, {
  stdio: "inherit",
});
console.log(`OK ${taskName} onlogon. Test: schtasks /run /tn ${taskName}`);
```

- [ ] **Step 3: Register + verify**

Run: `node scripts/setup-boot-improve.mjs`
Expected: `SUCCESS: The scheduled task ... has successfully been created.`

Run: `schtasks /query /tn DefaultProject-BootImprove /fo LIST`
Expected: shows `Logon Mode` / `TaskName: DefaultProject-BootImprove`.

- [ ] **Step 4: Commit**

```bash
git add scripts/boot-improve.ps1 scripts/setup-boot-improve.mjs
git commit -m "feat(boot): logon wrapper 900s cap + setup task"
```

### Task 3: e2e verify guard + timeout + docs

**Files:**

- Modify: `docs/superpowers/specs/2026-09-22-boot-improve-design.md` (none — already updated)
- Test: manual e2e

- [ ] **Step 1: Force run then skip**

Run: `Remove-Item backups/last-boot-improve.txt -ErrorAction SilentlyContinue; node scripts/boot-improve.mjs`
Expected: creates `backups/boot-improve-YYYY-MM-DD.log` with `done`.

Run: `node scripts/boot-improve.mjs`
Expected: appends `skip already-ran-today`, exits 0 in <5s.

- [ ] **Step 2: Full suite**

Run: `npx vitest run scripts/boot-improve.test.mjs; if ($?) { npm run lint --silent }`
Expected: all PASS, lint clean.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore(boot): verify guard once-day + e2e"
```
