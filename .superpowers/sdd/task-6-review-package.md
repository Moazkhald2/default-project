# Review Package Task 6
Base: 8cd5e79eca2b6eea3e7794e2902321851e618498
Head: 8a9a28db6ee4db738b7b095792da13525bbf5593
Date: 2026-08-25T16:20:31.7588229+03:00


## git log 8cd5e79eca2b6eea3e7794e2902321851e618498..8a9a28db6ee4db738b7b095792da13525bbf5593
``n
8a9a28d feat(autopilot): local Task Scheduler setup Sunday 4am (Task6)

``n## git diff --stat
``n
 scripts/setup-autopilot-local.mjs | 36 ++++++++++++++++++++++++++++++++++++
 1 file changed, 36 insertions(+)

``n## git diff -U10
``n
diff --git a/scripts/setup-autopilot-local.mjs b/scripts/setup-autopilot-local.mjs
new file mode 100644
index 0000000..48cfb56
--- /dev/null
+++ b/scripts/setup-autopilot-local.mjs
@@ -0,0 +1,36 @@
+#!/usr/bin/env node
+import { execSync } from "node:child_process";
+import path from "node:path";
+
+const taskName = "MathMentor-Autopilot-Local";
+const projectRoot = path.resolve(import.meta.dirname ? import.meta.dirname + "/.." : "C:/Users/moaz7/OneDrive/Documents/Default Project");
+const psPath = path.join(projectRoot, "scripts", "autopilot.ps1");
+const command = `powershell.exe -ExecutionPolicy Bypass -File '${psPath}'`;
+
+function taskExists() {
+  try { execSync(`schtasks /query /tn "${taskName}"`, { stdio: "ignore" }); return true; } catch { return false; }
+}
+
+const args = [
+  `/create`,
+  `/tn "${taskName}"`,
+  `/tr "${command}"`,
+  `/sc weekly`,
+  `/d SUN`,
+  `/st 04:00`,
+  `/f`,
+  `/rl HIGHEST`
+].join(" ");
+
+if (taskExists()) {
+  console.log(`Task ${taskName} exists GÇö updating...`);
+  execSync(`schtasks /delete /tn "${taskName}" /f`, { stdio: "ignore" });
+}
+try {
+  execSync(`schtasks ${args}`, { stdio: "inherit" });
+  console.log(`G£ô Task ${taskName} created: Sunday 04:00 -> ${command}`);
+  console.log("Test with: schtasks /run /tn MathMentor-Autopilot-Local");
+} catch (e) {
+  console.error("Failed to create task (run as Admin):", e.message);
+  process.exit(1);
+}

``n
