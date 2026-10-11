import { query } from "@solidjs/router";
import { publicGet } from "~/lib/api/api-client";
import { fetchResumeDocument } from "~/lib/resume/fetch-resume-document";
import type {
  ContactData,
  ExperienceEntry,
  ProfileData,
  Project,
  SiteContentData,
  Skill,
} from "~/lib/api/types/portfolio.types";
import type { ResumeDocument } from "~/lib/api/types/resume.types";

export const getSiteContentQuery = query(
  () => publicGet<SiteContentData>("/api/v1/public/site-content"),
  "site-content",
);

export const getProfileQuery = query(
  () => publicGet<ProfileData>("/api/v1/public/profile"),
  "profile",
);

export const getSkillsQuery = query(
  () => publicGet<Skill[]>("/api/v1/public/skills"),
  "skills",
);

export const getExperienceQuery = query(
  () => publicGet<ExperienceEntry[]>("/api/v1/public/experience"),
  "experience",
);

export const getProjectsQuery = query(
  () => publicGet<Project[]>("/api/v1/public/projects"),
  "projects",
);

export const getContactQuery = query(
  () => publicGet<ContactData | null>("/api/v1/public/contact"),
  "contact",
);

export const getResumeQuery = query(
  (): Promise<ResumeDocument> => fetchResumeDocument(),
  "resume",
);

export const getProjectBySlugQuery = query(async (slug: string) => {
  try {
    const data = await publicGet<Project>(`/api/v1/public/projects/${slug}`, {
      strict: false,
    });
    return data && typeof data === "object" && "slug" in data ? data : null;
  } catch {
    return null;
  }
}, "project");
