import { createSignal, onCleanup, onMount } from "solid-js";

export const A4_WIDTH_MM = 210;

const HORIZONTAL_PADDING_PX = 32;
const ZOOM_EPSILON = 0.001;

export function useA4PageZoom(getContainer: () => HTMLElement | undefined) {
  const [pageZoom, setPageZoom] = createSignal(1);

  onMount(() => {
    let lastZoom = 1;
    let rafId: number | undefined;

    const applyZoom = (next: number) => {
      if (Math.abs(next - lastZoom) < ZOOM_EPSILON) return;
      lastZoom = next;
      setPageZoom(next);
    };

    const measureZoom = (): number | null => {
      const container = getContainer();
      if (!container) return null;

      if (typeof window !== "undefined" && window.location.search.includes("parityFixture=")) {
        return 1;
      }

      const available = container.clientWidth - HORIZONTAL_PADDING_PX;
      const probe = document.createElement("div");
      probe.style.width = `${A4_WIDTH_MM}mm`;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.pointerEvents = "none";
      document.body.appendChild(probe);
      const pageWidthPx = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      if (pageWidthPx <= 0) return null;
      return Math.min(1, available / pageWidthPx);
    };

    const updateZoom = () => {
      const next = measureZoom();
      if (next === null) return;
      applyZoom(next);
    };

    const scheduleUpdate = () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        rafId = undefined;
        updateZoom();
      });
    };

    scheduleUpdate();
    const container = getContainer();
    if (!container) return;

    const observer = new ResizeObserver(() => scheduleUpdate());
    observer.observe(container);

    onCleanup(() => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
      observer.disconnect();
    });
  });

  return pageZoom;
}
