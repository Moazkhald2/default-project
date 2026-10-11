import { useMemo } from "react";
import katex from "katex";

type MathProps = {
  tex: string;
  display?: boolean;
  className?: string;
};

// Shared render cache — the same tex recurs across QuestionCard/MathExam
// lists and React re-renders; KaTeX parse+render is pure CPU work.
// Bounded FIFO (300 entries) so memory stays flat.
const renderCache = new Map<string, string>();
const RENDER_CACHE_MAX = 300;

function renderCached(tex: string, display: boolean): string {
  const key = `${display ? "d" : "i"}:${tex}`;
  const hit = renderCache.get(key);
  if (hit !== undefined) return hit;
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      strict: false,
      trust: false,
    });
  } catch {
    html = `<span class="text-red-600">Invalid LaTeX: ${tex}</span>`;
  }
  if (renderCache.size >= RENDER_CACHE_MAX) {
    const oldest = renderCache.keys().next().value;
    if (oldest !== undefined) renderCache.delete(oldest);
  }
  renderCache.set(key, html);
  return html;
}

export function Math({ tex, display = false, className }: MathProps) {
  const html = useMemo(() => renderCached(tex, display), [tex, display]);

  return (
    <span
      className={className}
      // KaTeX output is sanitized by renderToString with throwOnError:false
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function BlockMath({ tex, className }: { tex: string; className?: string }) {
  return <Math tex={tex} display className={className} />;
}
