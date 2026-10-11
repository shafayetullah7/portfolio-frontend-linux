import type { ResumeDocument } from "~/schemas/resume-document.schema";

export function isResumeSectionVisible(
  doc: ResumeDocument,
  key: keyof ResumeDocument["meta"]["sectionVisibility"],
): boolean {
  return doc.meta.sectionVisibility[key] === true;
}

export function hasResumeContact(doc: ResumeDocument): boolean {
  const { email, phone, location, links } = doc.personal;
  if (email?.trim()) return true;
  if (phone?.trim()) return true;
  if (location?.trim()) return true;
  return links.length > 0;
}

export function hasResumeIdentity(doc: ResumeDocument): boolean {
  return Boolean(doc.personal.fullName?.trim());
}
