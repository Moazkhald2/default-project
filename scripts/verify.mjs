import { execSync } from "child_process";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve } from "path";

const rootPkg = JSON.parse(readFileSync(join(resolve(), "package.json"), "utf8"));
const workspaces = rootPkg.workspaces || ["apps/*", "packages/*"];

// Find actual workspace package names from package.json files (cross-platform: no `ls`)
function getWorkspaceNames() {
  const names = [];
  for (const pattern of workspaces) {
    const base = pattern.replace("/*", "");
    let entries = [];
    try {
      entries = readdirSync(resolve(base), { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
    } catch {}
    for (const entry of entries) {
      const pkgPath = join(resolve(), base, entry, "package.json");
      if (!existsSync(pkgPath)) continue;
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
        if (pkg.name) names.push(pkg.name);
      } catch {}
    }
  }
  return names;
}

const workspaceNames = getWorkspaceNames();
const webPkg = workspaceNames.find((n) => n.endsWith("/web"));
const apiPkg = workspaceNames.find((n) => n.endsWith("/api"));

const cmds = [
  ...(webPkg ? [`npm run typecheck -w ${webPkg}`] : []),
  ...(apiPkg ? [`npm run typecheck -w ${apiPkg}`] : []),
  "npm run lint",
  "npm run test --ws --if-present",
  "npm run build --ws --if-present",
];

for (const c of cmds) {
  console.log(`\n> ${c}`);
  execSync(c, { stdio: "inherit" });
}

console.log("\n\u2713 verify passed \u2014 all layers integrated");
