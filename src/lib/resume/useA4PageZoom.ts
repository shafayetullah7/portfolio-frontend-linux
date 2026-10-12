import { createSignal, onCleanup, onMount } from "solid-js";

export const A4_WIDTH_MM = 210;

const HORIZONTAL_PADDING_PX = 32;

export function useA4PageZoom(getContainer: () => HTMLElement | undefined) {
  const [pageZoom, setPageZoom] = createSignal(1);

  onMount(() => {
    const updateZoom = () => {
      const container = getContainer();
      if (!container) return;

      if (typeof window !== "undefined" && window.location.search.includes("parityFixture=")) {
        setPageZoom(1);
        return;
      }

      const available = container.clientWidth - HORIZONTAL_PADDING_PX;
      const probe = document.createElement("div");
      probe.style.width = `${A4_WIDTH_MM}mm`;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      document.body.appendChild(probe);
      const pageWidthPx = probe.getBoundingClientRect().width;
      document.body.removeChild(probe);
      if (pageWidthPx > 0) {
        setPageZoom(Math.min(1, available / pageWidthPx));
      }
    };

    updateZoom();
    const container = getContainer();
    if (!container) return;

    const observer = new ResizeObserver(updateZoom);
    observer.observe(container);
    onCleanup(() => observer.disconnect());
  });

  return pageZoom;
}
