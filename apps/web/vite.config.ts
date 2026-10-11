import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:3000" },
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' http://localhost:3000",
      "X-Frame-Options": "DENY",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    },
  },
  build: {
    target: "es2022",
    // No sourcemaps in prod — the old `true` emitted a 1.8MB index.js.map
    // (4x the JS payload) on every deploy for zero runtime benefit.
    sourcemap: false,
    rollupOptions: {
      output: {
        // Split stable vendor chunks so repeat visits reuse cached
        // react/katex across deploys instead of re-downloading one 475KB blob.
        // (Rolldown requires function form — object form fails the build.)
        manualChunks(id) {
          if (id.includes("node_modules/katex")) return "katex";
          if (
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler")
          )
            return "vendor";
          return undefined;
        },
      },
    },
  },
  test: { environment: "jsdom", globals: true },
});
