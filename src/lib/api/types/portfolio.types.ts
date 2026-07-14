export interface ProfileData {
  profile: {
    name: string;
    headline: string;
    bio: string;
    avatarMediaId?: string | null;
  } | null;
  systemInfo: {
    os: string;
    kernel: string;
    shell: string;
    editor: string;
  } | null;
  avatarUrl: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  stack: string;
  description: string;
  status: string;
  repoUrl?: string | null;
  docsUrl?: string | null;
  buildStatus?: string | null;
  coverage?: string | null;
  screenshotUrl?: string | null;
  screenshotMediaId?: string | null;
  published?: boolean;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  features: { id: string; content: string; sortOrder: number }[];
}

export interface MediaItem {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  url: string;
  usesCount?: number;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  sortOrder: number;
}

export interface ExperienceEntry {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  level: "INFO" | "WARN";
  sortOrder?: number;
  responsibilities: { id: string; content: string }[];
  techTags: { id: string; tag: string }[];
}

export interface ContactData {
  email: string;
  gpgKey?: string | null;
  socialLinks: { id: string; platform: string; url: string }[];
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
}

export interface DashboardStats {
  projects: number;
  publishedProjects: number;
  draftProjects: number;
  skills: number;
  experiences: number;
  media: number;
  unreadSubmissions?: number;
}

export interface SiteMetric {
  id: string;
  label: string;
  value: string;
  sortOrder: number;
}

export interface SitePhilosophy {
  id: string;
  title: string;
  body: string;
  icon: string | null;
  sortOrder: number;
}

export interface SiteArchitecturePrinciple {
  id: string;
  title: string;
  body: string;
  sortOrder: number;
}

export interface SiteSettings {
  id?: string;
  brand: string;
  footerVersion: string;
  architectureNodeLabels: Record<string, string>;
}

export interface SiteContentData {
  settings: { brand: string; footerVersion: string };
  metrics: SiteMetric[];
  philosophy: SitePhilosophy[];
  architecturePrinciples: SiteArchitecturePrinciple[];
  architectureNodeLabels: Record<string, string>;
}
