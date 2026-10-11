#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";

const taskName = "DefaultProject-RD-Autofeed";
const projectRoot = path.resolve(import.meta.dirname + "/..");
const psPath = path.join(projectRoot, "scripts", "rd-autofeed.ps1");
const command = `powershell.exe -ExecutionPolicy Bypass -File '${psPath}'`;

function taskExists() {
  try { execSync(`schtasks /query /tn "${taskName}"`, { stdio: "ignore" }); return true; } catch { return false; }
}

if (taskExists()) {
  console.log(`Task ${taskName} exists — updating...`);
  execSync(`schtasks /delete /tn "${taskName}" /f`, { stdio: "ignore" });
}
const args = [`/create`, `/tn "${taskName}"`, `/tr "${command}"`, `/sc hourly`, `/mo 1`, `/f`, `/rl LIMITED`].join(" ");
try {
  execSync(`schtasks ${args}`, { stdio: "inherit" });
  console.log(`Task ${taskName} created: hourly -> ${command}`);
  console.log(`Test with: schtasks /run /tn ${taskName}`);
} catch (e) {
  console.error("Failed:", e.message);
  process.exit(1);
}
