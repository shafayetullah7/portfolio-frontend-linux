import { describe, expect, it } from "vitest";
import { renderToString } from "solid-js/web";
import ClassicResume from "~/components/resume/ClassicResume";
import type { ResumeDocument } from "~/schemas/resume-document.schema";

const minimalClassicDoc: ResumeDocument = {
  schemaVersion: 1,
  generatedAt: "2026-01-01T00:00:00.000Z",
  personal: {
    fullName: "Alex Classic",
    jobTitle: "Engineer",
    summary: "Summary line for snapshot.",
    email: "alex@example.com",
    phone: null,
    location: null,
    links: [],
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  interests: [],
  certifications: [],
  meta: {
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

function domTextFromHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

describe("ClassicResume Q8 regression", () => {
  it("DOM text snapshot unchanged", () => {
    const html = renderToString(() => <ClassicResume doc={minimalClassicDoc} />);
    expect(domTextFromHtml(html)).toMatchInlineSnapshot(
      `"Alex Classic Engineer Contact alex@example.com Summary Summary line for snapshot. Experience Projects Skills Education Certifications Languages Interests"`,
    );
  });
});
