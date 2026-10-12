import type { Project } from "~/lib/api/types/portfolio.types";
import type { ProjectFormValues } from "./ProjectForm";

export function projectToForm(project: Project): ProjectFormValues {
  return {
    title: project.title,
    slug: project.slug,
    stack: project.stack,
    description: project.description,
    status: project.status || "active",
    repoUrl: project.repoUrl ?? "",
    docsUrl: project.docsUrl ?? "",
    buildStatus: project.buildStatus ?? "",
    coverage: project.coverage ?? "",
    sortOrder: project.sortOrder ?? 0,
    published: project.published ?? false,
    screenshotMediaId: project.screenshotMediaId ?? null,
    screenshotUrl: project.screenshotUrl ?? null,
    features: project.features?.map((f) => f.content) ?? [],
    includeOnResume: project.includeOnResume ?? false,
    resumeSortOrder: project.resumeSortOrder ?? 0,
    resumeDescription: project.resumeDescription ?? "",
    resumeHighlights: project.resumeHighlights ?? [],
    startDate: project.startDate ? project.startDate.slice(0, 10) : "",
    endDate: project.endDate ? project.endDate.slice(0, 10) : "",
    liveUrl: project.liveUrl ?? "",
    resumeLinks:
      project.resumeLinks?.map((r) => ({
        label: r.label,
        liveUrl: r.liveUrl ?? "",
        githubUrl: r.githubUrl ?? "",
      })) ?? [],
  };
}

export function formToApiBody(form: ProjectFormValues) {
  return {
    title: form.title,
    slug: form.slug,
    stack: form.stack,
    description: form.description,
    status: form.status,
    repoUrl: form.repoUrl || null,
    docsUrl: form.docsUrl || null,
    buildStatus: form.buildStatus || null,
    coverage: form.coverage || null,
    sortOrder: form.sortOrder,
    published: form.published,
    screenshotMediaId: form.screenshotMediaId,
    features: form.features.filter(Boolean),
    includeOnResume: form.includeOnResume,
    resumeSortOrder: form.resumeSortOrder,
    resumeDescription: form.resumeDescription.trim() || null,
    resumeHighlights: form.resumeHighlights.filter(Boolean).length
      ? form.resumeHighlights.filter(Boolean)
      : null,
    startDate: form.startDate || null,
    endDate: form.endDate || null,
    liveUrl: form.liveUrl.trim() || null,
    resumeLinks: form.resumeLinks
      .filter((r) => r.label.trim() || r.liveUrl.trim() || r.githubUrl.trim())
      .map((r) => ({
        label: r.label.trim(),
        liveUrl: r.liveUrl.trim() || null,
        githubUrl: r.githubUrl.trim() || null,
      })),
  };
}

export function formsEqual(a: ProjectFormValues, b: ProjectFormValues) {
  return JSON.stringify(a) === JSON.stringify(b);
}
