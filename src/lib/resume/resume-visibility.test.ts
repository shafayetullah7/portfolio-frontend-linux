import { describe, expect, it } from "vitest";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  hasResumeContact,
  hasResumeIdentity,
  isResumeSectionVisible,
} from "./resume-visibility";

function minimalDoc(overrides: Partial<ResumeDocument> = {}): ResumeDocument {
  return {
    schemaVersion: 1,
    generatedAt: "2026-01-01T00:00:00.000Z",
    personal: {
      fullName: "Ada Lovelace",
      jobTitle: "Engineer",
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
    ...overrides,
  };
}

describe("isResumeSectionVisible", () => {
  it("returns true only when flag is true", () => {
    const doc = minimalDoc({
      meta: {
        sectionVisibility: {
          ...minimalDoc().meta.sectionVisibility,
          skills: true,
        },
      },
    });
    expect(isResumeSectionVisible(doc, "skills")).toBe(true);
    expect(isResumeSectionVisible(doc, "summary")).toBe(false);
  });
});

describe("hasResumeContact", () => {
  it("is false when all contact fields empty", () => {
    expect(hasResumeContact(minimalDoc())).toBe(false);
  });

  it("is true when email present", () => {
    const doc = minimalDoc({
      personal: { ...minimalDoc().personal, email: "a@example.com" },
    });
    expect(hasResumeContact(doc)).toBe(true);
  });
});

describe("hasResumeIdentity", () => {
  it("is false for blank name", () => {
    const doc = minimalDoc({
      personal: { ...minimalDoc().personal, fullName: "   " },
    });
    expect(hasResumeIdentity(doc)).toBe(false);
  });

  it("is true for non-empty name", () => {
    expect(hasResumeIdentity(minimalDoc())).toBe(true);
  });
});
