#!/usr/bin/env node
// decrypt-backup.mjs — reverse of encrypt-backup.mjs
import { createDecipheriv, createHash, scryptSync } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import os from "node:os";

function getKey() {
  if (process.env.BACKUP_PASSPHRASE) {
    const salt = (() => { try { return readFileSync(join(os.homedir(), ".secrets", "backup.salt"), "utf8").trim().slice(0, 32); } catch { return "math-academy-scrypt-salt-v1"; } })();
    try { return scryptSync(process.env.BACKUP_PASSPHRASE, salt, 32); } catch { return createHash("sha256").update(process.env.BACKUP_PASSPHRASE).digest(); }
  }
  const keyPath = join(os.homedir(), ".secrets", "backup.key");
  if (!existsSync(keyPath)) { console.error(`missing ${keyPath} — set BACKUP_PASSPHRASE env`); process.exit(1); }
  const hex = readFileSync(keyPath, "utf8").trim();
  if (/^[0-9a-f]{64}$/i.test(hex)) return Buffer.from(hex, "hex");
  return createHash("sha256").update(hex).digest();
}
const file = process.argv[2];
if (!file || !existsSync(file)) { console.error("usage: node scripts/decrypt-backup.mjs <file.enc> [--out <zip>]"); process.exit(1); }
const outIdx = process.argv.indexOf("--out");
const out = outIdx !== -1 ? process.argv[outIdx + 1] : file.replace(/\.enc$/, "");
const key = getKey();
const blob = readFileSync(file);
const iv = blob.subarray(0, 12);
const tag = blob.subarray(12, 28);
const enc = blob.subarray(28);
const decipher = createDecipheriv("aes-256-gcm", key, iv);
decipher.setAuthTag(tag);
const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
writeFileSync(out, dec);
console.log(`✓ decrypted ${file} → ${out} (${(dec.length/1024).toFixed(1)} KB)`);
