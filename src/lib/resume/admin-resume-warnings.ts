import type {
  ContactData,
  ExperienceEntry,
  ProfileData,
  Project,
} from "~/lib/api/types/portfolio.types";

export type AdminResumeWarningSeverity = "error" | "warn" | "info";

export interface AdminResumeWarning {
  id: string;
  message: string;
  href: string;
  severity: AdminResumeWarningSeverity;
}

export interface AdminResumeWarningInput {
  contact: ContactData | null | undefined;
  profile: ProfileData | null | undefined;
  projects: Project[] | null | undefined;
  experience: ExperienceEntry[] | null | undefined;
}

export function collectAdminResumeWarnings(
  input: AdminResumeWarningInput,
): AdminResumeWarning[] {
  const warnings: AdminResumeWarning[] = [];

  const email = input.contact?.email?.trim();
  if (!email) {
    warnings.push({
      id: "contact-email",
      message: "Contact email is missing — resume PDF needs an email.",
      href: "/admin/contact",
      severity: "error",
    });
  }

  const phone = input.contact?.phone?.trim();
  if (!phone) {
    warnings.push({
      id: "contact-phone",
      message: "Phone is empty — recommended on the resume PDF.",
      href: "/admin/contact",
      severity: "warn",
    });
  }

  const summary = input.profile?.profile?.resumeSummary?.trim();
  if (!summary) {
    warnings.push({
      id: "profile-resume-summary",
      message: "Resume summary is empty — the PDF will omit the summary section.",
      href: "/admin/profile",
      severity: "warn",
    });
  }

  for (const project of input.projects ?? []) {
    if (!project.published || !project.includeOnResume) continue;
    const hasResumeDesc = Boolean(project.resumeDescription?.trim());
    if (!hasResumeDesc) {
      warnings.push({
        id: `project-fallback-${project.id}`,
        message: `"${project.title}" uses truncated site description on the PDF — add resume description.`,
        href: `/admin/projects/${project.id}/edit`,
        severity: "warn",
      });
    }
  }

  for (const exp of input.experience ?? []) {
    if (!exp.includeOnResume) continue;
    const hasResumeBullets =
      Array.isArray(exp.resumeBullets) && exp.resumeBullets.some((b) => b.trim());
    const hasSiteBullets = (exp.responsibilities ?? []).some((r) => r.content?.trim());
    if (!hasResumeBullets && hasSiteBullets) {
      warnings.push({
        id: `experience-fallback-${exp.id}`,
        message: `${exp.role} at ${exp.company}: PDF will use capped site responsibilities (add resume bullets for tighter copy).`,
        href: "/admin/experience",
        severity: "info",
      });
    }
  }

  return warnings;
}
