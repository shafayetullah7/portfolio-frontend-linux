import type { ResumeDocument } from "~/schemas/resume-document.schema";

/** Minimal v2 document for unit tests. */
export const minimalResumeDocument: ResumeDocument = {
  schemaVersion: 2,
  generatedAt: "2026-01-01T00:00:00.000Z",
  personal: {
    fullName: "Ada Lovelace",
    jobTitle: "Engineer",
    summary: "Summary text.",
    email: "ada@example.com",
    phone: null,
    whatsapp: null,
    location: null,
    links: [],
    pii: null,
  },
  skills: [{ category: "Languages", skills: ["TypeScript"] }],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  interests: { format: "bullets", paragraph: "", items: [] },
  meta: {
    sectionLabels: {
      contact: "Contact",
      profile: "Profile",
      experience: "Work Experience",
      education: "Education and Training",
      skills: "Skills",
      projects: "Projects",
      languages: "Language Skills",
      interests: "Learning & Interests",
      certifications: "Certifications",
    },
    sectionVisibility: {
      summary: true,
      experience: false,
      projects: false,
      skills: true,
      education: false,
      certifications: false,
      languages: false,
      interests: false,
    },
  },
};
