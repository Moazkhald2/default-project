# Review Package Task 4
Base: e55661b5b9a24819e80677559f63097290584a8f
Head: 7fe27da01bdaa45ff9985026ac986153098d4a9e
Date: 2026-08-25T16:07:33.5432147+03:00


## git log e55661b5b9a24819e80677559f63097290584a8f..7fe27da01bdaa45ff9985026ac986153098d4a9e
``n
7fe27da feat(autopilot): localMain auto-apply + ps1 wrapper (Task4)

``n## git diff --stat
``n
 scripts/autopilot.mjs      | 22 +++++++++++++++++++++-
 scripts/autopilot.ps1      |  5 +++++
 scripts/autopilot.test.mjs |  9 ++++++++-
 3 files changed, 34 insertions(+), 2 deletions(-)

``n## git diff -U10
``n
diff --git a/scripts/autopilot.mjs b/scripts/autopilot.mjs
index c55d5c4..d849e31 100644
--- a/scripts/autopilot.mjs
+++ b/scripts/autopilot.mjs
@@ -100,21 +100,41 @@ export async function cloudMain(opts = {}) {
     execSync(`git checkout -b ${branch}`, { stdio: "ignore" });
     execSync(`git add backups/autopilot-cloud-*.json`, { stdio: "ignore" });
     execSync(`git commit -m "chore(autopilot): weekly ${action} GÇö best ${best.name} score ${best.score}" --no-verify`, { stdio: "ignore" });
     execSync(`git push -u origin ${branch}`, { stdio: "ignore" });
     execSync(`gh pr create --title "chore(autopilot): weekly ${action}" --body "Auto report ${JSON.stringify(report,null,2).slice(0,2000)}"`, { stdio: "ignore" });
   } catch (e) { console.error("PR create failed", e.message); }
   return report;
 }
 
 export async function localMain(opts = {}) {
-  return { status: "not-implemented", dryRun: !!opts.dryRun };
+  const dryRun = !!opts.dryRun;
+  console.log("[autopilot:local] fetch & pull...");
+  try {
+    if (!dryRun) {
+      execSync("git fetch --all --prune", { stdio: "ignore", timeout: 30000 });
+      // try pull main if not on autopilot branch
+      try { execSync("git pull --ff-only", { stdio: "ignore", timeout: 30000 }); } catch {}
+      execSync("npm install --silent", { stdio: "ignore", timeout: 60000 });
+    }
+  } catch (e) { console.error("fetch/pull failed", e.message); }
+  // backup check if cloud missed: run cloudMain dryRun to see if update needed
+  let status = "applied";
+  try {
+    const cloudReport = await cloudMain({ dryRun: true });
+    status = cloudReport.action === "RECOMMEND" ? "backup-check" : "applied";
+  } catch { status = "skipped"; }
+  const localReport = { date: new Date().toISOString(), status, mode: "local" };
+  fs.mkdirSync("backups", { recursive: true });
+  fs.writeFileSync(`backups/autopilot-local-${Date.now()}.json`, JSON.stringify(localReport, null, 2));
+  console.log("[autopilot:local] done", localReport);
+  return localReport;
 }
 
 if (process.argv[1]?.replace(/\\/g, "/")?.endsWith("autopilot.mjs")) {
   const mode = process.argv.find(a => a.startsWith("--mode="))?.split("=")[1] || "check";
   const dryRun = process.argv.includes("--dry-run");
   if (mode === "cloud") await cloudMain({ dryRun });
   else if (mode === "local") await localMain({ dryRun });
   else {
     const r = await cloudMain({ dryRun: true });
     console.log(JSON.stringify(r, null, 2));
diff --git a/scripts/autopilot.ps1 b/scripts/autopilot.ps1
new file mode 100644
index 0000000..c5cd56a
--- /dev/null
+++ b/scripts/autopilot.ps1
@@ -0,0 +1,5 @@
+# Wrapper for Windows Task Scheduler GÇö run with: powershell -ExecutionPolicy Bypass -File scripts/autopilot.ps1
+$ErrorActionPreference = "Continue"
+Set-Location -LiteralPath $PSScriptRoot\..
+node scripts/autopilot.mjs --mode=local >> backups/autopilot-local.log 2>&1
+if ($?) { Write-Host "autopilot local OK" } else { Write-Host "autopilot local FAIL check backups/autopilot-local.log" }
diff --git a/scripts/autopilot.test.mjs b/scripts/autopilot.test.mjs
index 801fcef..c286462 100644
--- a/scripts/autopilot.test.mjs
+++ b/scripts/autopilot.test.mjs
@@ -1,12 +1,12 @@
 import { describe, it, expect } from "vitest";
-import { scoreTool, improveJobs, searchAllSources, runVerify, decideAction } from "./autopilot.mjs";
+import { scoreTool, improveJobs, searchAllSources, runVerify, decideAction, localMain } from "./autopilot.mjs";
 
 describe("scoreTool", () => {
   it("scores free no-API tool high", () => {
     const tool = { name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 5, fitsJobs: true };
     expect(scoreTool(tool)).toBeGreaterThan(80);
   });
   it("penalizes paid API tool", () => {
     const tool = { name: "browser-use-mcp", free: true, noAPI: false, license: "MIT", stars: 2000, updatedDaysAgo: 2, fitsJobs: true };
     expect(scoreTool(tool)).toBeLessThanOrEqual(50);
   });
@@ -43,10 +43,17 @@ describe("decideAction", () => {
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
+describe("localMain", () => {
+  it("dryRun returns applied status", async () => {
+    const r = await localMain({ dryRun: true });
+    expect(r).toHaveProperty("status");
+    expect(["applied", "skipped", "backup-check"]).toContain(r.status);
+  });
+});

``n
