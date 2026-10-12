/**
 * Heuristic page estimate for Modern Split resume (print).
 * Target: prefer ≤2 pages; warn in admin at ≥3 (see PUBLIC_RESUME plan L9).
 *
 * Weighted line counts → page buckets (deterministic, no layout engine).
 */
import type { ResumeDocument } from "~/schemas/resume-document.schema";

function countExperienceMainContent(doc: ResumeDocument): number {
  return doc.experience.reduce((n, e) => {
    if (e.format === "paragraph" && e.paragraph.trim()) {
      return n + Math.ceil(e.paragraph.trim().length / 80);
    }
    return n + e.bullets.length;
  }, 0);
}

function countExperienceSubProjects(doc: ResumeDocument): number {
  return doc.experience.reduce(
    (n, e) =>
      n +
      e.experienceProjects.reduce(
        (sub, p) =>
          sub +
          2 +
          (p.format === "paragraph" && p.description.trim()
            ? Math.ceil(p.description.trim().length / 60)
            : p.bullets.length),
        0,
      ),
    0,
  );
}

function countProjectHighlights(doc: ResumeDocument): number {
  return doc.projects.reduce((n, p) => n + p.highlights.length, 0);
}

function countSidebarLines(doc: ResumeDocument): number {
  let n = doc.skills.reduce((acc, g) => acc + g.skills.length, 0);
  n += doc.education.length * 2;
  n += doc.certifications.length;
  n += doc.languages.length;
  n += doc.interests.items.length;
  if (doc.interests.format === "paragraph" && doc.interests.paragraph.trim()) {
    n += 3;
  }
  if (doc.personal.email) n += 1;
  if (doc.personal.phone) n += 1;
  if (doc.personal.whatsapp) n += 1;
  if (doc.personal.location) n += 1;
  n += doc.personal.links.length;
  const pii = doc.personal.pii;
  if (pii?.dateOfBirth || pii?.nationality || pii?.gender) n += 1;
  return n;
}

/** Returns estimated page count (integer, minimum 1). */
export function estimateResumePages(doc: ResumeDocument): number {
  const summaryLines = doc.personal.summary?.trim() ? 4 : 0;
  const expContent = countExperienceMainContent(doc);
  const expSubProjects = countExperienceSubProjects(doc);
  const projBlocks = doc.projects.length * 4;
  const projHighlights = countProjectHighlights(doc);
  const sidebar = countSidebarLines(doc);

  const mainScore =
    summaryLines + expContent + expSubProjects + projBlocks + projHighlights;
  const sidebarScore = sidebar;
  const total = mainScore + Math.ceil(sidebarScore / 2);

  if (total <= 18) return 1;
  if (total <= 36) return 2;
  if (total <= 54) return 3;
  return 4;
}
