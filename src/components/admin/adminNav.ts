export interface AdminNavItem {
  path: string;
  label: string;
  caption: string;
}

export const adminNav: AdminNavItem[] = [
  { path: "/admin", label: "Dashboard", caption: "overview" },
  { path: "/admin/profile", label: "Profile", caption: "identity" },
  { path: "/admin/site", label: "Site", caption: "content" },
  { path: "/admin/projects", label: "Projects", caption: "deployments" },
  { path: "/admin/skills", label: "Skills", caption: "capabilities" },
  { path: "/admin/experience", label: "Experience", caption: "timeline" },
  { path: "/admin/contact", label: "Contact", caption: "config" },
  { path: "/admin/inbox", label: "Inbox", caption: "messages" },
  { path: "/admin/media", label: "Media", caption: "uploads" },
];
