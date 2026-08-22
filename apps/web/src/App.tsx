import { lazy, Suspense } from "react";
import { PerfImage } from "./components/PerfImage";
const Heavy = lazy(() => import("./components/Heavy"));
export default function App() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-bold">Default Project</h1>
      <PerfImage src="https://picsum.photos/1200/600" alt="Hero" width={1200} height={600} priority />
      <Suspense fallback={null}><Heavy /></Suspense>
      <a href="/api/health" className="underline">API health</a>
    </main>
  );
}
