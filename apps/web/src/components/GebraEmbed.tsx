import { useEffect, useRef, useId } from "react";

declare global {
  interface Window {
    GGBApplet?: new (
      params: Record<string, unknown>,
      noPreview?: boolean,
    ) => { inject: (id: string) => void };
  }
}

type GebraEmbedProps = {
  materialId: string;
  appName?: "geometry" | "classic" | "graphing" | "3d" | "suite";
  width?: number;
  height?: number;
  showToolBar?: boolean;
  showAlgebraInput?: boolean;
  enableShiftDragZoom?: boolean;
  title?: string;
};

const GGB_SCRIPT = "https://www.geogebra.org/apps/deployggb.js";
let scriptPromise: Promise<void> | null = null;

function loadGgbScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.GGBApplet) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = GGB_SCRIPT;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load GeoGebra deployggb.js"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function GebraEmbed({
  materialId,
  appName = "geometry",
  width = 600,
  height = 450,
  showToolBar = false,
  showAlgebraInput = false,
  enableShiftDragZoom = true,
  title,
}: GebraEmbedProps) {
  const id = useId().replaceAll(":", "-");
  const containerId = `ggb-${id}`;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadGgbScript()
      .then(() => {
        if (cancelled || !window.GGBApplet || !ref.current) return;
        const params = {
          appName,
          material_id: materialId,
          width,
          height,
          showToolBar,
          showAlgebraInput,
          enableShiftDragZoom,
          showResetIcon: true,
          enableLabelDrags: false,
        };
        const applet = new window.GGBApplet(params, true);
        // inject expects existing div id
        applet.inject(containerId);
      })
      .catch((e) => {
        if (ref.current) ref.current.innerText = String(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [
    materialId,
    appName,
    width,
    height,
    showToolBar,
    showAlgebraInput,
    enableShiftDragZoom,
    containerId,
  ]);

  return (
    <div className="rounded-xl border border-border bg-surface p-2 shadow-sm">
      {title ? <p className="mb-2 text-sm font-medium text-ink">{title}</p> : null}
      <div
        id={containerId}
        ref={ref}
        style={{ width, height, maxWidth: "100%" }}
        className="overflow-hidden rounded-lg bg-canvas"
        aria-label={title ?? `GeoGebra ${materialId}`}
      />
      <p className="mt-2 text-xs text-muted">
        Interactive — drag points. Source: GeoGebra Materials {materialId}
      </p>
    </div>
  );
}

// Static fallback for PDFs / no-JS: use SVG export
export function GebraStaticFallback({ svgSrc, alt }: { svgSrc: string; alt: string }) {
  return (
    <img
      src={svgSrc}
      alt={alt}
      width={600}
      height={450}
      loading="lazy"
      decoding="async"
      className="mx-auto rounded-xl border border-border bg-surface"
    />
  );
}
