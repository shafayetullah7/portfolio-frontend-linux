/**
 * Runtime validation for GET /api/v1/public/resume.
 * Keep in sync with portfolio-api/src/modules/resume/domain/resume-document.ts
 */
import { z } from "zod";

const resumeLinkKindSchema = z.enum([
  "website",
  "linkedin",
  "github",
  "gitlab",
  "other",
]);

const resumeLinkSchema = z.object({
  label: z.string(),
  url: z.string(),
  kind: resumeLinkKindSchema,
});

const sectionVisibilitySchema = z.object({
  summary: z.boolean(),
  experience: z.boolean(),
  projects: z.boolean(),
  skills: z.boolean(),
  education: z.boolean(),
  certifications: z.boolean(),
  languages: z.boolean(),
  interests: z.boolean(),
});

export const resumeDocumentSchema = z.object({
  schemaVersion: z.literal(1),
  generatedAt: z.string(),
  personal: z.object({
    fullName: z.string(),
    jobTitle: z.string(),
    summary: z.string(),
    email: z.string().nullable(),
    phone: z.string().nullable(),
    location: z.string().nullable(),
    links: z.array(resumeLinkSchema),
  }),
  skills: z.array(
    z.object({
      category: z.string(),
      skills: z.array(z.string()),
    }),
  ),
  experience: z.array(
    z.object({
      id: z.string(),
      company: z.string(),
      position: z.string(),
      location: z.string().nullable(),
      startDate: z.string(),
      endDate: z.string().nullable(),
      current: z.boolean(),
      bullets: z.array(z.string()),
    }),
  ),
  projects: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      technologies: z.array(z.string()),
      highlights: z.array(z.string()),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
      links: z.array(
        z.object({
          label: z.string(),
          liveUrl: z.string().nullable().optional(),
          githubUrl: z.string().nullable().optional(),
          /** Legacy flat link (Classic theme); Modern Split uses liveUrl/githubUrl. */
          url: z.string().optional(),
        }),
      ),
    }),
  ),
  education: z.array(
    z.object({
      id: z.string(),
      institution: z.string(),
      degree: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      description: z.string().nullable(),
    }),
  ),
  certifications: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      issuer: z.string(),
      date: z.string().nullable(),
      url: z.string().nullable(),
    }),
  ),
  languages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      level: z.string(),
    }),
  ),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ),
  meta: z.object({
    sectionVisibility: sectionVisibilitySchema,
  }),
});

export type ResumeDocument = z.infer<typeof resumeDocumentSchema>;
export type ResumeLinkKind = z.infer<typeof resumeLinkKindSchema>;
