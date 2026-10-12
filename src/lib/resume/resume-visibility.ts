import type { ResumeDocument } from "~/schemas/resume-document.schema";

export function isResumeSectionVisible(
  doc: ResumeDocument,
  key: keyof ResumeDocument["meta"]["sectionVisibility"],
): boolean {
  return doc.meta.sectionVisibility[key] === true;
}

export function hasResumeContact(doc: ResumeDocument): boolean {
  const { email, phone, whatsapp, location, links, pii } = doc.personal;
  if (email?.trim()) return true;
  if (phone?.trim()) return true;
  if (whatsapp?.trim()) return true;
  if (location?.trim()) return true;
  if (links.length > 0) return true;
  if (pii?.dateOfBirth?.trim()) return true;
  if (pii?.nationality?.trim()) return true;
  if (pii?.gender?.trim()) return true;
  return false;
}

export function hasResumeIdentity(doc: ResumeDocument): boolean {
  return Boolean(doc.personal.fullName?.trim());
}
