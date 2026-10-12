import type { ResumeDocument } from "~/schemas/resume-document.schema";

export type ProjectLinkRow = ResumeDocument["projects"][number]["links"][number];

/** Builder-shaped rows for Modern Split (supports legacy flat `url` as liveUrl). */
export function modernSplitProjectLinkRows(
  links: ProjectLinkRow[],
): Array<{ label: string; liveUrl: string | null; githubUrl: string | null }> {
  return links
    .map((link) => {
      const liveUrl = link.liveUrl?.trim() || link.url?.trim() || null;
      const githubUrl = link.githubUrl?.trim() || null;
      return {
        label: link.label,
        liveUrl,
        githubUrl,
      };
    })
    .filter((row) => row.liveUrl || row.githubUrl);
}

/** Flat href list for Classic resume markup. */
export function classicProjectHrefLinks(
  links: ProjectLinkRow[],
): Array<{ label: string; url: string }> {
  const out: Array<{ label: string; url: string }> = [];
  for (const link of links) {
    if (link.url && !link.liveUrl && !link.githubUrl) {
      out.push({ label: link.label, url: link.url });
      continue;
    }
    if (link.liveUrl?.trim()) {
      out.push({ label: link.label, url: link.liveUrl.trim() });
    }
    if (link.githubUrl?.trim()) {
      out.push({ label: "GitHub", url: link.githubUrl.trim() });
    }
  }
  return out;
}
