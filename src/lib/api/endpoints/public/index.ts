import { fetcher, publicGet } from "../../api-client";
import type {
  ContactData,
  ExperienceEntry,
  ProfileData,
  Project,
  SiteContentData,
  Skill,
} from "../../types/portfolio.types";

export const getProfile = () => publicGet<ProfileData>("/api/v1/public/profile");
export const getProjects = () => publicGet<Project[]>("/api/v1/public/projects");
export const getProjectBySlug = (slug: string) =>
  publicGet<Project>(`/api/v1/public/projects/${slug}`, { strict: false })
    .then((data) => (data && typeof data === "object" && "slug" in data ? data : null))
    .catch(() => null);
export const getSkills = () => publicGet<Skill[]>("/api/v1/public/skills");
export const getExperience = () =>
  publicGet<ExperienceEntry[]>("/api/v1/public/experience");
export const getContact = () => publicGet<ContactData | null>("/api/v1/public/contact");
export const getSiteContent = () =>
  publicGet<SiteContentData>("/api/v1/public/site-content");

export const submitContact = (body: {
  name: string;
  email: string;
  subject: string;
  message: string;
  website?: string;
}) =>
  fetcher<{ sent: boolean }>("/api/v1/public/contact/submit", {
    method: "POST",
    body: JSON.stringify(body),
    strict: false,
  });
