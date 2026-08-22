import { onCLS, onLCP, onINP } from "web-vitals";
export function initWebVitals(report = (m: any) => navigator.sendBeacon?.("/api/vitals", JSON.stringify(m))) {
  onCLS(report); onLCP(report); onINP(report);
}
