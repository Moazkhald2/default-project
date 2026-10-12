// drizzle-kit CLI config — plain object on purpose (no `drizzle-kit` import):
// the CLI runs via pinned `npx drizzle-kit@...` so the package is NOT in
// node_modules (its abandoned @esbuild-kit chain pins vulnerable esbuild).
// `defineConfig` is an identity helper; the CLI accepts this object as-is.
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: { url: "./dev.db" },
};
