import { onCLS, onLCP, onINP } from "web-vitals";
import type { Metric } from "web-vitals";

export function initWebVitals(
  report: (m: Metric) => void = (m) => {
    // sendBeacon defaults to text/plain which fails Hono zValidator("json") (400).
    // Send as application/json Blob; fall back to fetch keepalive.
    try {
      const payload = JSON.stringify({ name: m.name, value: m.value, id: m.id });
      const blob = new Blob([payload], { type: "application/json" });
      const ok = navigator.sendBeacon?.("/api/vitals", blob);
      if (!ok) {
        void fetch("/api/vitals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // never break app for telemetry
    }
  },
) {
  onCLS(report);
  onLCP(report);
  onINP(report);
}
