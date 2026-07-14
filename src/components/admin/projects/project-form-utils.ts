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
  };
}

export function formsEqual(a: ProjectFormValues, b: ProjectFormValues) {
  return JSON.stringify(a) === JSON.stringify(b);
}
