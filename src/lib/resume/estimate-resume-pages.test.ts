import { describe, expect, it } from "vitest";
import { estimateResumePages } from "./estimate-resume-pages";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { minimalResumeDocument } from "./minimal-resume-document";

function minimalDoc(): ResumeDocument {
  return {
    ...minimalResumeDocument,
    generatedAt: new Date().toISOString(),
    personal: {
      ...minimalResumeDocument.personal,
      fullName: "Test User",
      summary: "Short summary.",
      email: "a@b.com",
    },
    skills: [{ category: "lang", skills: ["Go"] }],
    experience: [
      {
        id: "1",
        position: "Dev",
        company: "Co",
        location: null,
        startDate: "2020-01-01",
        endDate: null,
        current: true,
        format: "bullets",
        paragraph: "",
        bullets: ["Did things"],
        experienceProjects: [],
      },
    ],
    meta: {
      ...minimalResumeDocument.meta,
      sectionVisibility: {
        summary: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
        certifications: true,
        languages: true,
        interests: true,
      },
    },
  };
}

describe("estimateResumePages", () => {
  it("returns 1–2 for a sparse document", () => {
    expect(estimateResumePages(minimalDoc())).toBeLessThanOrEqual(2);
  });

  it("returns ≥3 for a bloated document", () => {
    const bloated = minimalDoc();
    bloated.experience = Array.from({ length: 6 }, (_, i) => ({
      id: String(i),
      position: `Role ${i}`,
      company: "Corp",
      location: "Remote",
      startDate: "2018-01-01",
      endDate: "2020-01-01",
      current: false,
      format: "bullets" as const,
      paragraph: "",
      bullets: ["a", "b", "c", "d", "e"],
      experienceProjects: [],
    }));
    bloated.projects = Array.from({ length: 5 }, (_, i) => ({
      id: String(i),
      name: `Project ${i}`,
      description: "x",
      technologies: ["Go"],
      highlights: ["h1", "h2", "h3"],
      startDate: null,
      endDate: null,
      links: [],
    }));
    bloated.education = Array.from({ length: 3 }, (_, i) => ({
      id: String(i),
      degree: "BSc",
      institution: "Uni",
      startDate: "2010-01-01",
      endDate: "2014-01-01",
      description: null,
    }));
    expect(estimateResumePages(bloated)).toBeGreaterThanOrEqual(3);
  });
});
