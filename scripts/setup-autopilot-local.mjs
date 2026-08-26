#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";

const taskName = "MathMentor-Autopilot-Local";
const projectRoot = path.resolve(import.meta.dirname ? import.meta.dirname + "/.." : "C:/Users/moaz7/OneDrive/Documents/Default Project");
const psPath = path.join(projectRoot, "scripts", "autopilot.ps1");
const command = `powershell.exe -ExecutionPolicy Bypass -File '${psPath}'`;

function taskExists() {
  try { execSync(`schtasks /query /tn "${taskName}"`, { stdio: "ignore" }); return true; } catch { return false; }
}

const args = [
  `/create`,
  `/tn "${taskName}"`,
  `/tr "${command}"`,
  `/sc weekly`,
  `/d SUN`,
  `/st 04:00`,
  `/f`,
  `/rl HIGHEST`
].join(" ");

if (taskExists()) {
  console.log(`Task ${taskName} exists — updating...`);
  execSync(`schtasks /delete /tn "${taskName}" /f`, { stdio: "ignore" });
}
try {
  execSync(`schtasks ${args}`, { stdio: "inherit" });
  console.log(`✓ Task ${taskName} created: Sunday 04:00 -> ${command}`);
  console.log("Test with: schtasks /run /tn MathMentor-Autopilot-Local");
} catch (e) {
  console.error("Failed to create task (run as Admin):", e.message);
  process.exit(1);
}
