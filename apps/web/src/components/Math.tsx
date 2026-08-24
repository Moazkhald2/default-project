import { useMemo } from "react";
import katex from "katex";

type MathProps = {
  tex: string;
  display?: boolean;
  className?: string;
};

export function Math({ tex, display = false, className }: MathProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return `<span class="text-red-600">Invalid LaTeX: ${tex}</span>`;
    }
  }, [tex, display]);

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
