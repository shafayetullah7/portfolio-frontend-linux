import { fetcher, type FetchOptions } from "../../api-client";
import type {
  ProfileData,
  Project,
  Skill,
  ExperienceEntry,
  ContactData,
  DashboardStats,
  MediaItem,
} from "../../types/portfolio.types";

const admin = (path: string, init?: FetchOptions) =>
  fetcher(`/api/v1/admin${path}`, init);

export const adminApi = {
  dashboard: () => admin("/dashboard") as Promise<DashboardStats>,
  getProfile: () => admin("/profile") as Promise<ProfileData>,
  updateProfile: (body: unknown) =>
    admin("/profile", { method: "PUT", body: JSON.stringify(body) }),
  updateSystemInfo: (body: unknown) =>
    admin("/system-info", { method: "PUT", body: JSON.stringify(body) }),
  listProjects: () => admin("/projects") as Promise<Project[]>,
  getProject: (id: string) => admin(`/projects/${id}`) as Promise<Project>,
  createProject: (body: unknown) =>
    admin("/projects", { method: "POST", body: JSON.stringify(body) }),
  updateProject: (id: string, body: unknown) =>
    admin(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteProject: (id: string) => admin(`/projects/${id}`, { method: "DELETE" }),
  listSkills: () => admin("/skills") as Promise<Skill[]>,
  createSkill: (body: unknown) =>
    admin("/skills", { method: "POST", body: JSON.stringify(body) }),
  updateSkill: (id: string, body: unknown) =>
    admin(`/skills/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteSkill: (id: string) => admin(`/skills/${id}`, { method: "DELETE" }),
  listExperience: () => admin("/experience") as Promise<ExperienceEntry[]>,
  createExperience: (body: unknown) =>
    admin("/experience", { method: "POST", body: JSON.stringify(body) }),
  updateExperience: (id: string, body: unknown) =>
    admin(`/experience/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteExperience: (id: string) => admin(`/experience/${id}`, { method: "DELETE" }),
  getContact: () => admin("/contact") as Promise<ContactData | null>,
  updateContact: (body: unknown) =>
    admin("/contact", { method: "PUT", body: JSON.stringify(body) }),
  listSubmissions: (params?: { page?: number; limit?: number }) =>
    admin("/contact/submissions", {
      params: {
        page: params?.page,
        limit: params?.limit,
      },
    }) as Promise<{ items: unknown[]; page: number; limit: number }>,
  markSubmissionRead: (id: string) =>
    admin(`/contact/submissions/${id}`, { method: "PATCH" }),
  deleteSubmission: (id: string) =>
    admin(`/contact/submissions/${id}`, { method: "DELETE" }),
  listMedia: () => admin("/media") as Promise<MediaItem[]>,
  uploadMedia: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return admin("/media/upload", { method: "POST", body: form });
  },
  deleteMedia: (id: string) => admin(`/media/${id}`, { method: "DELETE" }),
};
