const MAX_DISPLAY_LENGTH = 48;

/**
 * Human-scannable link text for resume PDF (hostname + path, no scheme).
 * Falls back to label when URL is missing or invalid.
 */
export function formatResumeLinkLabel(label: string, url: string): string {
  const trimmedUrl = url.trim();
  if (!trimmedUrl) return label.trim() || "Link";

  try {
    const parsed = new URL(trimmedUrl);
    let host = parsed.hostname.replace(/^www\./i, "");
    let path = parsed.pathname.replace(/\/$/, "") || "";
    if (path === "/") path = "";

    let display = path ? `${host}${path}` : host;
    if (display.length > MAX_DISPLAY_LENGTH) {
      display = `${display.slice(0, MAX_DISPLAY_LENGTH - 1).trimEnd()}…`;
    }
    return display;
  } catch {
    const fallback = label.trim();
    return fallback || trimmedUrl;
  }
}
