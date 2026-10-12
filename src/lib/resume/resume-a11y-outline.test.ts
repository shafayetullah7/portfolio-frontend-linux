import { describe, expect, it } from "vitest";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  assertValidResumeHeadingOrder,
  buildModernSplitA11yOutline,
  buildResumeA11yOutline,
} from "./resume-a11y-outline";

const minimalDoc: ResumeDocument = {
  schemaVersion: 1,
  generatedAt: "2026-01-01T00:00:00.000Z",
  personal: {
    fullName: "Ada Lovelace",
    jobTitle: "Engineer",
    summary: "Short summary.",
    email: "ada@example.com",
    phone: null,
    location: null,
    links: [],
  },
  skills: [],
  experience: [
    {
      id: "e1",
      company: "Co",
      position: "Senior",
      location: null,
      startDate: "2020-01-01",
      endDate: null,
      current: true,
      bullets: ["Built APIs"],
    },
  ],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  interests: [],
  meta: {
    sectionVisibility: {
      summary: true,
      experience: true,
      projects: false,
      skills: false,
      education: false,
      certifications: false,
      languages: false,
      interests: false,
    },
  },
};

describe("resume a11y outline", () => {
  it("has single h1 and no level skips (Classic)", () => {
    const outline = buildResumeA11yOutline(minimalDoc);
    expect(() => assertValidResumeHeadingOrder(outline)).not.toThrow();
    expect(outline[0]).toEqual({ level: 1, text: "Ada Lovelace" });
  });

  it("Modern Split outline has no Contact or entry h3", () => {
    const outline = buildModernSplitA11yOutline(minimalDoc);
    expect(() => assertValidResumeHeadingOrder(outline)).not.toThrow();
    expect(outline.some((e) => e.text === "Contact")).toBe(false);
    expect(outline.filter((e) => e.level === 3)).toHaveLength(0);
    expect(outline).toContainEqual({ level: 2, text: "Work Experience" });
  });
});
