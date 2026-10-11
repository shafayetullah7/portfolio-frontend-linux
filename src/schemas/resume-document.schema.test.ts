import { describe, expect, it } from "vitest";
import { resumeDocumentSchema } from "./resume-document.schema";

const validMinimal = {
  schemaVersion: 1 as const,
  generatedAt: "2026-01-01T00:00:00.000Z",
  personal: {
    fullName: "Test",
    jobTitle: "Dev",
    summary: "",
    email: null,
    phone: null,
    location: null,
    links: [],
  },
  skills: [],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  interests: [],
  meta: {
    sectionVisibility: {
      summary: false,
      experience: false,
      projects: false,
      skills: false,
      education: false,
      certifications: false,
      languages: false,
      interests: false,
    },
  },
};

describe("resumeDocumentSchema", () => {
  it("accepts a minimal valid document", () => {
    expect(resumeDocumentSchema.safeParse(validMinimal).success).toBe(true);
  });

  it("rejects wrong schemaVersion", () => {
    const result = resumeDocumentSchema.safeParse({
      ...validMinimal,
      schemaVersion: 2,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing personal", () => {
    const { personal: _p, ...rest } = validMinimal;
    const result = resumeDocumentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
