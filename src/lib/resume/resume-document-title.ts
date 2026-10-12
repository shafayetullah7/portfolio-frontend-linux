/** Browser tab / save-as-PDF filename from profile full name (builder G-C06). */
export function sanitizeResumeFilename(name: string): string {
  return name.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-") || "resume";
}

export function formatResumeDocumentTitle(fullName: string): string {
  return `${sanitizeResumeFilename(fullName)}-resume`;
}
