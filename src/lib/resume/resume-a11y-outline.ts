import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { hasResumeContact, isResumeSectionVisible } from "./resume-visibility";

export type ResumeA11yOutlineEntry = { level: 1 | 2 | 3; text: string };

/**
 * Expected heading order for resume themes (for automated smoke tests).
 * Mirrors section components: one h1 (name), h2 per section, h3 per entry title.
 */
export function buildResumeA11yOutline(doc: ResumeDocument): ResumeA11yOutlineEntry[] {
  const outline: ResumeA11yOutlineEntry[] = [
    { level: 1, text: doc.personal.fullName },
  ];

  if (hasResumeContact(doc)) {
    outline.push({ level: 2, text: "Contact" });
  }
  if (isResumeSectionVisible(doc, "summary")) {
    outline.push({ level: 2, text: "Summary" });
  }
  if (isResumeSectionVisible(doc, "experience")) {
    outline.push({ level: 2, text: "Experience" });
    for (const e of doc.experience) {
      outline.push({ level: 3, text: `${e.position} · ${e.company}` });
    }
  }
  if (isResumeSectionVisible(doc, "projects")) {
    outline.push({ level: 2, text: "Projects" });
    for (const p of doc.projects) {
      outline.push({ level: 3, text: p.name });
    }
  }
  if (isResumeSectionVisible(doc, "skills")) {
    outline.push({ level: 2, text: "Skills" });
  }
  if (isResumeSectionVisible(doc, "education")) {
    outline.push({ level: 2, text: "Education" });
  }
  if (isResumeSectionVisible(doc, "certifications")) {
    outline.push({ level: 2, text: "Certifications" });
  }
  if (isResumeSectionVisible(doc, "languages")) {
    outline.push({ level: 2, text: "Languages" });
  }
  if (isResumeSectionVisible(doc, "interests")) {
    outline.push({ level: 2, text: "Interests" });
  }

  return outline;
}

/** Modern Split: section h2 only (D9); no Contact heading; no per-entry h3. */
export function buildModernSplitA11yOutline(doc: ResumeDocument): ResumeA11yOutlineEntry[] {
  const labels = doc.meta.sectionLabels;
  const outline: ResumeA11yOutlineEntry[] = [
    { level: 1, text: doc.personal.fullName },
  ];

  if (isResumeSectionVisible(doc, "skills")) {
    outline.push({ level: 2, text: labels.skills });
  }
  if (isResumeSectionVisible(doc, "education")) {
    outline.push({ level: 2, text: labels.education });
  }
  if (isResumeSectionVisible(doc, "certifications")) {
    outline.push({ level: 2, text: labels.certifications });
  }
  if (isResumeSectionVisible(doc, "languages")) {
    outline.push({ level: 2, text: labels.languages });
  }
  if (isResumeSectionVisible(doc, "interests")) {
    outline.push({ level: 2, text: labels.interests });
  }
  if (isResumeSectionVisible(doc, "summary")) {
    outline.push({ level: 2, text: labels.profile });
  }
  if (isResumeSectionVisible(doc, "experience")) {
    outline.push({ level: 2, text: labels.experience });
  }
  if (isResumeSectionVisible(doc, "projects")) {
    outline.push({ level: 2, text: labels.projects });
  }

  return outline;
}

export function assertValidResumeHeadingOrder(outline: ResumeA11yOutlineEntry[]): void {
  const h1Count = outline.filter((e) => e.level === 1).length;
  if (h1Count !== 1) {
    throw new Error(`Expected exactly one h1, got ${h1Count}`);
  }
  let last = 0;
  for (const entry of outline) {
    if (entry.level > last + 1) {
      throw new Error(`Heading level skip: ${last} → ${entry.level} (${entry.text})`);
    }
    last = entry.level;
  }
}
