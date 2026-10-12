/** Builder D4 defaults — mirror portfolio-api resume_settings schema. */
export const DEFAULT_RESUME_SECTION_LABELS = {
  contact: "Contact",
  profile: "Profile",
  experience: "Work Experience",
  education: "Education and Training",
  skills: "Skills",
  projects: "Projects",
  languages: "Language Skills",
  interests: "Learning & Interests",
  certifications: "Certifications",
} as const;

export const DEFAULT_RESUME_SECTION_VISIBILITY = {
  summary: true,
  experience: true,
  projects: true,
  skills: true,
  education: true,
  certifications: true,
  languages: true,
  interests: true,
} as const;
