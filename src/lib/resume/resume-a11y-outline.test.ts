import { describe, expect, it } from "vitest";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { minimalResumeDocument } from "./minimal-resume-document";
import {
  assertValidResumeHeadingOrder,
  buildModernSplitA11yOutline,
  buildResumeA11yOutline,
} from "./resume-a11y-outline";

const minimalDoc: ResumeDocument = {
  ...minimalResumeDocument,
  personal: {
    ...minimalResumeDocument.personal,
    summary: "Short summary.",
  },
  experience: [
    {
      id: "e1",
      company: "Co",
      position: "Senior",
      location: null,
      startDate: "2020-01-01",
      endDate: null,
      current: true,
      format: "bullets",
      paragraph: "",
      bullets: ["Built APIs"],
      experienceProjects: [],
    },
  ],
  meta: {
    ...minimalResumeDocument.meta,
    sectionVisibility: {
      ...minimalResumeDocument.meta.sectionVisibility,
      summary: true,
      experience: true,
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
