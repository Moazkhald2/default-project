import { onCLS, onLCP, onINP } from "web-vitals";
import type { Metric } from "web-vitals";

export function initWebVitals(
  report: (m: Metric) => void = (m) => {
    navigator.sendBeacon?.("/api/vitals", JSON.stringify(m));
  },
) {
  onCLS(report);
  onLCP(report);
  onINP(report);
}
