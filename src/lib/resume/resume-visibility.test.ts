import { describe, expect, it } from "vitest";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { minimalResumeDocument } from "./minimal-resume-document";
import {
  hasResumeContact,
  hasResumeIdentity,
  isResumeSectionVisible,
} from "./resume-visibility";

function minimalDoc(overrides: Partial<ResumeDocument> = {}): ResumeDocument {
  return { ...minimalResumeDocument, ...overrides };
}

describe("isResumeSectionVisible", () => {
  it("returns true only when flag is true", () => {
    const doc = minimalDoc({
      meta: {
        ...minimalResumeDocument.meta,
        sectionVisibility: {
          ...minimalResumeDocument.meta.sectionVisibility,
          skills: true,
          summary: false,
        },
      },
    });
    expect(isResumeSectionVisible(doc, "skills")).toBe(true);
    expect(isResumeSectionVisible(doc, "summary")).toBe(false);
  });
});

describe("hasResumeContact", () => {
  it("is false when all contact fields empty", () => {
    expect(
      hasResumeContact(
        minimalDoc({
          personal: { ...minimalResumeDocument.personal, email: null },
        }),
      ),
    ).toBe(false);
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
