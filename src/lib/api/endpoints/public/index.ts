import { fetcher } from "../../api-client";
import type {
  ContactData,
  ExperienceEntry,
  ProfileData,
  Project,
  SiteContentData,
  Skill,
} from "../../types/portfolio.types";

export const getProfile = () => fetcher<ProfileData>("/api/v1/public/profile");
export const getProjects = () => fetcher<Project[]>("/api/v1/public/projects");
export const getProjectBySlug = (slug: string) =>
  fetcher<Project>(`/api/v1/public/projects/${slug}`, { strict: false })
    .then((data) => (data && typeof data === "object" && "slug" in data ? data : null))
    .catch(() => null);
export const getSkills = () => fetcher<Skill[]>("/api/v1/public/skills");
export const getExperience = () => fetcher<ExperienceEntry[]>("/api/v1/public/experience");
export const getContact = () => fetcher<ContactData | null>("/api/v1/public/contact");
export const getSiteContent = () =>
  fetcher<SiteContentData>("/api/v1/public/site-content");

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
