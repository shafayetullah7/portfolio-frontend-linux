import { describe, expect, it } from "vitest";
import { renderToString } from "solid-js/web";
import ModernSplitDocument from "./ModernSplitDocument";
import type { ResumeDocument } from "~/schemas/resume-document.schema";

const minimalDoc: ResumeDocument = {
  schemaVersion: 1,
  generatedAt: "2026-01-01T00:00:00.000Z",
  personal: {
    fullName: "Ada Lovelace",
    jobTitle: "Engineer",
    summary: "Summary text.",
    email: "ada@example.com",
    phone: null,
    location: null,
    links: [],
  },
  skills: [{ category: "Languages", skills: ["TypeScript"] }],
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  interests: [],
  meta: {
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

const LEGACY_CLASS_PATTERN =
  /\b(resume-section|resume-chip|resume-link|resume-entry|resume-bullets)\b/;

describe("Modern Split isolation", () => {
  it("does not emit legacy Classic resume classes", () => {
    const html = renderToString(() => <ModernSplitDocument doc={minimalDoc} />);
    expect(html).toContain("modern-split-doc");
    expect(LEGACY_CLASS_PATTERN.test(html)).toBe(false);
  });
});
