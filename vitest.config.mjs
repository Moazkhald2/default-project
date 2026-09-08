import { defineConfig } from "vitest/config";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      resolve(root, "apps/web"),
      resolve(root, "apps/api"),
      {
        test: {
          name: "scripts",
          include: ["scripts/**/*.test.mjs"],
          exclude: ["**/node_modules/**", "**/dist/**", "**/test-project/**"],
          environment: "node",
        },
      },
    ],
  },
});
