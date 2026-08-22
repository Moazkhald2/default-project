import { execSync } from "child_process";

const cmds = [
  "npm run typecheck -w @app/web",
  "npm run typecheck -w @app/api",
  "npm run lint",
  "npm run test -ws --if-present",
  "npm run build -ws --if-present",
];

for (const c of cmds) {
  console.log(`\n> ${c}`);
  execSync(c, { stdio: "inherit" });
}

console.log("\n\u2713 verify passed \u2014 all layers integrated");
