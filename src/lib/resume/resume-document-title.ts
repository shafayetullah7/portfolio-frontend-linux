/** Browser tab / save-as-PDF filename from profile full name. */
export function formatResumeDocumentTitle(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "Resume";

  const slug = trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  if (!slug) return "Resume";
  return `${slug}-Resume`;
}
