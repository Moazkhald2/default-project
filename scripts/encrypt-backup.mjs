#!/usr/bin/env node
// encrypt-backup.mjs — AES-256-GCM encrypt a file with key from ~/.secrets/backup.key or BACKUP_PASSPHRASE
import { randomBytes, createCipheriv, createHash, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

function getKey() {
  // CodeQL: use scrypt for passphrase (was sha256), random 32-byte hex file remains high-entropy
  if (process.env.BACKUP_PASSPHRASE) {
    // Use a KDF consistently for passphrase-derived keys; never fall back to fast hashes.
    let salt = "math-academy-scrypt-salt-v1";
    try {
      const fileSalt = readFileSync(join(os.homedir(), ".secrets", "backup.salt"), "utf8").trim().slice(0, 32);
      if (fileSalt) salt = fileSalt;
    } catch {}
    return scryptSync(process.env.BACKUP_PASSPHRASE, salt, 32);
  }
  const keyPath = join(os.homedir(), ".secrets", "backup.key");
  if (existsSync(keyPath)) {
    const hex = readFileSync(keyPath, "utf8").trim();
    if (/^[0-9a-f]{64}$/i.test(hex)) return Buffer.from(hex, "hex");
    return createHash("sha256").update(hex).digest();
  }
  // generate
  const raw = randomBytes(32).toString("hex");
  mkdirSync(join(os.homedir(), ".secrets"), { recursive: true });
  // lgtm[js/file-system-race] — single-user key generation, TOCTOU acceptable
  writeFileSync(keyPath, raw, { mode: 0o600 });
  // also gitignore ensure
  try { writeFileSync(join(os.homedir(), ".secrets", ".gitignore"), "*\n!.gitignore\n", { flag: "wx" }); } catch {}
  console.log(`🔑 generated ${keyPath} (chmod 600) — BACK UP THIS KEY OFFLINE`);
  return Buffer.from(raw, "hex");
}

const file = process.argv[2];
if (!file || !existsSync(file)) { console.error("usage: node scripts/encrypt-backup.mjs <file> [--out <enc>]"); process.exit(1); }
const outIdx = process.argv.indexOf("--out");
const out = outIdx !== -1 ? process.argv[outIdx + 1] : `${file}.enc`;
const key = getKey();
const iv = randomBytes(12);
const cipher = createCipheriv("aes-256-gcm", key, iv);
const data = readFileSync(file);
const enc = Buffer.concat([cipher.update(data), cipher.final()]);
const tag = cipher.getAuthTag();
writeFileSync(out, Buffer.concat([iv, tag, enc]));
console.log(`✓ encrypted ${file} → ${out} (${(readFileSync(out).length/1024).toFixed(1)} KB) AES-256-GCM`);
