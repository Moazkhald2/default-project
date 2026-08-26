# Review Package Task 3
Base: e9da072cfcdeb0e850718912e726dada6c33cb01
Head: e55661b5b9a24819e80677559f63097290584a8f
Date: 2026-08-25T16:00:23.8184071+03:00


## git log e9da072cfcdeb0e850718912e726dada6c33cb01..e55661b5b9a24819e80677559f63097290584a8f
``n
e55661b feat(autopilot): cloudMain with decideAction + PR creation (Task3)

``n## git diff --stat
``n
 scripts/autopilot.mjs      | 52 ++++++++++++++++++++++++++++++++++++++--------
 scripts/autopilot.test.mjs | 14 ++++++++++++-
 2 files changed, 56 insertions(+), 10 deletions(-)

``n## git diff -U10
``n
diff --git a/scripts/autopilot.mjs b/scripts/autopilot.mjs
index 1c3b626..c55d5c4 100644
--- a/scripts/autopilot.mjs
+++ b/scripts/autopilot.mjs
@@ -68,21 +68,55 @@ export async function discoverTools(opts = {}) {
   return tools.map(t => ({ ...t, score: scoreTool(t) })).sort((a,b)=>b.score-a.score);
 }
 
 export function getCurrentToolVersion() {
   try {
     const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
     return pkg.devDependencies?.["@playwright/mcp"] || "unknown";
   } catch { return "unknown"; }
 }
 
-const mode = process.argv.find(a => a.startsWith("--mode="))?.split("=")[1] || "check";
-const dryRun = process.argv.includes("--dry-run");
-if (process.argv[1]?.endsWith("autopilot.mjs")) {
-  if (mode === "check") {
-    const report = await improveJobs(dryRun);
-    const tools = await discoverTools({ dryRun });
-    console.log(JSON.stringify({ mode, dryRun, report, tools, scoreSample: scoreTool({ free: true, noAPI: true, license: "MIT", stars: 500, updatedDaysAgo: 5, fitsJobs: true }) }, null, 2));
-  } else {
-    console.log(`autopilot mode=${mode} score test:`, scoreTool({ free: true, noAPI: true, license: "MIT", stars: 500, updatedDaysAgo: 5, fitsJobs: true }));
+export function decideAction(current, best) {
+  if (!best || !current) return "KEEP";
+  return best.score > current.score + 10 ? "RECOMMEND" : "KEEP";
+}
+
+export async function cloudMain(opts = {}) {
+  const dryRun = !!opts.dryRun;
+  console.log("[autopilot:cloud] discover...");
+  const tools = await discoverTools({ dryRun });
+  const current = tools.find(t => t.name === "@playwright/mcp") || tools[0];
+  const best = [...tools].sort((a,b)=>b.score-a.score)[0];
+  const action = decideAction(current, best);
+  console.log(`[autopilot:cloud] best=${best.name} score=${best.score} action=${action}`);
+  const improve = await improveJobs(dryRun);
+  console.log("[autopilot:cloud] improve:", improve);
+  if (improve.verify === "fail") { console.error("verify failed GÇö abort"); return { action: "ABORT", reason: "verify fail" }; }
+  const report = { date: new Date().toISOString(), tools, best, action, improve };
+  fs.mkdirSync("backups", { recursive: true });
+  fs.writeFileSync(`backups/autopilot-cloud-${Date.now()}.json`, JSON.stringify(report, null, 2));
+  if (dryRun) return report;
+  const branch = `autopilot/${new Date().toISOString().slice(0,10)}`;
+  try {
+    execSync(`git checkout -b ${branch}`, { stdio: "ignore" });
+    execSync(`git add backups/autopilot-cloud-*.json`, { stdio: "ignore" });
+    execSync(`git commit -m "chore(autopilot): weekly ${action} GÇö best ${best.name} score ${best.score}" --no-verify`, { stdio: "ignore" });
+    execSync(`git push -u origin ${branch}`, { stdio: "ignore" });
+    execSync(`gh pr create --title "chore(autopilot): weekly ${action}" --body "Auto report ${JSON.stringify(report,null,2).slice(0,2000)}"`, { stdio: "ignore" });
+  } catch (e) { console.error("PR create failed", e.message); }
+  return report;
+}
+
+export async function localMain(opts = {}) {
+  return { status: "not-implemented", dryRun: !!opts.dryRun };
+}
+
+if (process.argv[1]?.replace(/\\/g, "/")?.endsWith("autopilot.mjs")) {
+  const mode = process.argv.find(a => a.startsWith("--mode="))?.split("=")[1] || "check";
+  const dryRun = process.argv.includes("--dry-run");
+  if (mode === "cloud") await cloudMain({ dryRun });
+  else if (mode === "local") await localMain({ dryRun });
+  else {
+    const r = await cloudMain({ dryRun: true });
+    console.log(JSON.stringify(r, null, 2));
   }
 }
diff --git a/scripts/autopilot.test.mjs b/scripts/autopilot.test.mjs
index eedb327..801fcef 100644
--- a/scripts/autopilot.test.mjs
+++ b/scripts/autopilot.test.mjs
@@ -1,12 +1,12 @@
 import { describe, it, expect } from "vitest";
-import { scoreTool, improveJobs, searchAllSources, runVerify } from "./autopilot.mjs";
+import { scoreTool, improveJobs, searchAllSources, runVerify, decideAction } from "./autopilot.mjs";
 
 describe("scoreTool", () => {
   it("scores free no-API tool high", () => {
     const tool = { name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 5, fitsJobs: true };
     expect(scoreTool(tool)).toBeGreaterThan(80);
   });
   it("penalizes paid API tool", () => {
     const tool = { name: "browser-use-mcp", free: true, noAPI: false, license: "MIT", stars: 2000, updatedDaysAgo: 2, fitsJobs: true };
     expect(scoreTool(tool)).toBeLessThanOrEqual(50);
   });
@@ -31,10 +31,22 @@ describe("searchAllSources", () => {
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
+describe("decideAction", () => {
+  it("keeps current if best not > current+10", () => {
+    const current = { name: "@playwright/mcp", score: 90 };
+    const best = { name: "chrome-devtools-mcp", score: 95 };
+    expect(decideAction(current, best)).toBe("KEEP");
+  });
+  it("recommends if best > current+10", () => {
+    const current = { name: "@playwright/mcp", score: 80 };
+    const best = { name: "new-mcp", score: 95 };
+    expect(decideAction(current, best)).toBe("RECOMMEND");
+  });
+});

``n
