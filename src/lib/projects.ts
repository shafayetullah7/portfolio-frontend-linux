import type { Project } from "~/lib/api/types/portfolio.types";

/** Split stack on commas, pipes, or middle dots (preserves multi-word tags). */
export function parseStack(stack: string): string[] {
  return stack
    .split(/[,|·•]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    const ao = a.sortOrder ?? 0;
    const bo = b.sortOrder ?? 0;
    if (ao !== bo) return ao - bo;
    return a.title.localeCompare(b.title);
  });
}

export function featuredProjects(projects: Project[], n = 2): Project[] {
  return sortProjects(projects).slice(0, n);
}
