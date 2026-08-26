# Review Package Task 1
Base: c7dea49e59a63540067ca3a2cdb376a6b95e0cb2
Head: 1cbc6396318a1b9bd2d74c7a38b227276e740ed1
Date: 2026-08-25T15:39:29.3675865+03:00


## git log c7dea49e59a63540067ca3a2cdb376a6b95e0cb2..1cbc6396318a1b9bd2d74c7a38b227276e740ed1
``n
1cbc639 feat(autopilot): core skeleton with scoreTool + discover stub (Task1)

``n## git diff --stat
``n
 package.json               |  5 ++++-
 scripts/autopilot.mjs      | 32 ++++++++++++++++++++++++++++++++
 scripts/autopilot.test.mjs | 17 +++++++++++++++++
 3 files changed, 53 insertions(+), 1 deletion(-)

``n## git diff -U10
``n
diff --git a/package.json b/package.json
index e37136c..dd0272f 100644
--- a/package.json
+++ b/package.json
@@ -3,40 +3,43 @@
   "private": true,
   "workspaces": [
     "apps/*",
     "packages/*"
   ],
   "type": "module",
   "scripts": {
     "dev": "concurrently \"npm run dev -w apps/api\" \"npm run dev -w apps/web\"",
     "build": "npm run build -ws --if-present",
     "verify": "node scripts/verify.mjs",
+    "kit:bootstrap": "powershell -ExecutionPolicy Bypass -File agent-kit/bootstrap.ps1",
     "fetch:libs": "node scripts/fetch_libraries.mjs all",
     "ingest": "node scripts/ingest.mjs content/bank",
     "ingest:vault": "node scripts/ingest.mjs Local_Math_Vault/Question_Bank",
     "sheet:build": "powershell -ExecutionPolicy Bypass -File scripts/fast_build.ps1",
     "sheet:generate": "node scripts/generate_sheet.mjs",
     "sheet:week": "node scripts/batch_generate.mjs --weeks=1-4 --grade=10",
     "vault:sync": "node scripts/fetch_libraries.mjs all && npm run ingest:vault",
     "deploy:check": "node scripts/deploy_check.mjs",
     "backup": "node scripts/backup.mjs",
     "backup:all": "node scripts/backup-all.mjs",
     "backup:system": "node scripts/backup-system.mjs --level full",
     "backup:memories": "node scripts/backup-system.mjs --level memories --no-projects",
     "backup:restore": "node scripts/restore.mjs",
     "backup:list": "node scripts/restore.mjs --list",
     "typecheck": "npm run typecheck -ws --if-present",
     "lint": "oxlint --type-aware --type-check",
     "lint:fix": "oxlint --fix --type-aware",
     "format": "oxfmt .",
     "format:check": "oxfmt --check .",
-    "test": "vitest run --if-present || echo no-tests-yet"
+    "test": "vitest run",
+    "autopilot:check": "node scripts/autopilot.mjs --mode=check",
+    "autopilot:setup-local": "node scripts/setup-autopilot-local.mjs"
   },
   "devDependencies": {
     "@types/node": "^26.2.0",
     "concurrently": "^9.1.2",
     "lint-staged": "^17.3.0",
     "oxfmt": "^0.64.0",
     "oxlint": "^1.79.0",
     "oxlint-tsgolint": "^7.0.2001",
     "typescript": "^5.7.3"
   },
diff --git a/scripts/autopilot.mjs b/scripts/autopilot.mjs
new file mode 100644
index 0000000..58ca610
--- /dev/null
+++ b/scripts/autopilot.mjs
@@ -0,0 +1,32 @@
+#!/usr/bin/env node
+import { execSync } from "node:child_process";
+import fs from "node:fs";
+
+export function scoreTool(tool) {
+  if (!tool.free) return 0;
+  let score = 50;
+  if (tool.noAPI) score += 30; else score -= 50;
+  if (tool.license === "MIT" || tool.license === "Apache-2.0") score += 10;
+  if (tool.stars > 100) score += 10;
+  if (tool.updatedDaysAgo < 30) score += 10;
+  if (tool.fitsJobs) score += 20;
+  if (tool.auditClean === false) score -= 30;
+  return Math.max(0, Math.min(100, score));
+}
+
+export async function discoverTools(opts = {}) {
+  // Task1: stub returns current playwright as baseline; real search added Task2
+  return [{ name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 2, fitsJobs: true, version: getCurrentToolVersion() }];
+}
+
+export function getCurrentToolVersion() {
+  try {
+    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
+    return pkg.devDependencies?.["@playwright/mcp"] || "unknown";
+  } catch { return "unknown"; }
+}
+
+const mode = process.argv.find(a => a.startsWith("--mode="))?.split("=")[1] || "check";
+if (process.argv[1]?.endsWith("autopilot.mjs")) {
+  console.log(`autopilot mode=${mode} score test:`, scoreTool({ free: true, noAPI: true, license: "MIT", stars: 500, updatedDaysAgo: 5, fitsJobs: true }));
+}
diff --git a/scripts/autopilot.test.mjs b/scripts/autopilot.test.mjs
new file mode 100644
index 0000000..61f9197
--- /dev/null
+++ b/scripts/autopilot.test.mjs
@@ -0,0 +1,17 @@
+import { describe, it, expect } from "vitest";
+import { scoreTool } from "./autopilot.mjs";
+
+describe("scoreTool", () => {
+  it("scores free no-API tool high", () => {
+    const tool = { name: "@playwright/mcp", free: true, noAPI: true, license: "MIT", stars: 5000, updatedDaysAgo: 5, fitsJobs: true };
+    expect(scoreTool(tool)).toBeGreaterThan(80);
+  });
+  it("penalizes paid API tool", () => {
+    const tool = { name: "browser-use-mcp", free: true, noAPI: false, license: "MIT", stars: 2000, updatedDaysAgo: 2, fitsJobs: true };
+    expect(scoreTool(tool)).toBeLessThanOrEqual(50);
+  });
+  it("rejects non-free", () => {
+    const tool = { name: "paid-tool", free: false, noAPI: true, license: "MIT", stars: 9999, updatedDaysAgo: 1, fitsJobs: true };
+    expect(scoreTool(tool)).toBe(0);
+  });
+});

``n
