import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join, resolve } from "path";

const rootPkg = JSON.parse(readFileSync(join(resolve(), "package.json"), "utf8"));
const workspaces = rootPkg.workspaces || ["apps/*", "packages/*"];

// Find actual workspace package names from package.json files
function getWorkspaceNames() {
  const names = [];
  for (const pattern of workspaces) {
    const base = pattern.replace("/*", "");
    try {
      const entries = execSync(`ls ${base}`, { encoding: "utf8" }).trim().split("\n");
      for (const entry of entries) {
        const pkgPath = join(resolve(), base, entry, "package.json");
        try {
          const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
          names.push(pkg.name);
        } catch {}
      }
    } catch {}
  }
  return names;
}

const workspaceNames = getWorkspaceNames();
const webPkg = workspaceNames.find(n => n.endsWith("/web"));
const apiPkg = workspaceNames.find(n => n.endsWith("/api"));

const cmds = [
  ...(webPkg ? [`npm run typecheck -w ${webPkg}`] : []),
  ...(apiPkg ? [`npm run typecheck -w ${apiPkg}`] : []),
  "npm run lint",
  "npm run test -ws --if-present",
  "npm run build -ws --if-present",
];

for (const c of cmds) {
  console.log(`\n> ${c}`);
  execSync(c, { stdio: "inherit" });
}

console.log("\n\u2713 verify passed \u2014 all layers integrated");
