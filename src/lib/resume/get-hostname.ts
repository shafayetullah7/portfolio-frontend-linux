/** Builder-aligned hostname display (Modern Split). */
export function getHostname(url: string): string {
  try {
    const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
    return (
      urlObj.hostname.replace("www.", "") +
      (urlObj.pathname !== "/" ? urlObj.pathname : "")
    );
  } catch {
    return url;
  }
}
