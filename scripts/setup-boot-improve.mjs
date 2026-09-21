#!/usr/bin/env node
import { execSync } from "node:child_process";
import path from "node:path";
const taskName = "DefaultProject-BootImprove";
const psPath = path.join(path.resolve(import.meta.dirname + "/.."), "scripts", "boot-improve.ps1");
const command = `powershell.exe -ExecutionPolicy Bypass -File '${psPath}'`;
try { execSync(`schtasks /query /tn "${taskName}"`, { stdio: "ignore" }); execSync(`schtasks /delete /tn "${taskName}" /f`, { stdio: "ignore" }); } catch {}
execSync(`schtasks /create /tn "${taskName}" /tr "${command}" /sc onlogon /rl LIMITED /f`, { stdio: "inherit" });
console.log(`OK ${taskName} onlogon. Test: schtasks /run /tn ${taskName}`);
