import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const dbUrl =
      process.env.TURSO_DATABASE_URL ?? `file:${path.resolve(repoRoot, "apps/api/dev.db")}`;
    const dbAuthToken = process.env.TURSO_AUTH_TOKEN;
    _db = drizzle(createClient({ url: dbUrl, authToken: dbAuthToken }));
  }
  return _db;
}
