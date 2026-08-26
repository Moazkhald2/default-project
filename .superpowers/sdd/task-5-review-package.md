# Review Package Task 5
Base: 7fe27da01bdaa45ff9985026ac986153098d4a9e
Head: 8cd5e79eca2b6eea3e7794e2902321851e618498
Date: 2026-08-25T16:13:34.8781627+03:00


## git log 7fe27da01bdaa45ff9985026ac986153098d4a9e..8cd5e79eca2b6eea3e7794e2902321851e618498
``n
8cd5e79 ci(autopilot): weekly Sunday 3am cloud workflow PR-only (Task5)

``n## git diff --stat
``n
 .github/workflows/autopilot.yml | 38 ++++++++++++++++++++++++++++++++++++++
 1 file changed, 38 insertions(+)

``n## git diff -U10
``n
diff --git a/.github/workflows/autopilot.yml b/.github/workflows/autopilot.yml
new file mode 100644
index 0000000..8f43e96
--- /dev/null
+++ b/.github/workflows/autopilot.yml
@@ -0,0 +1,38 @@
+name: autopilot-weekly
+on:
+  schedule:
+    - cron: "0 3 * * 0"  # Sunday 03:00 UTC = 05:00 Cairo
+  workflow_dispatch:
+
+permissions:
+  contents: write
+  pull-requests: write
+
+concurrency:
+  group: autopilot
+  cancel-in-progress: true
+
+jobs:
+  autopilot:
+    runs-on: ubuntu-latest
+    timeout-minutes: 10
+    steps:
+      - uses: actions/checkout@v4
+        with:
+          fetch-depth: 0
+      - uses: actions/setup-node@v4
+        with:
+          node-version: "24"
+          cache: npm
+      - run: npm ci
+      - name: Run autopilot cloud
+        run: node scripts/autopilot.mjs --mode=cloud
+        env:
+          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
+          BRAVE_API_KEY: ${{ secrets.BRAVE_API_KEY }}
+      - name: Upload report
+        if: always()
+        uses: actions/upload-artifact@v4
+        with:
+          name: autopilot-report
+          path: backups/autopilot-*.json

``n
