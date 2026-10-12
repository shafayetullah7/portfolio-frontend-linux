import { describe, expect, it } from "vitest";
import { renderToString } from "solid-js/web";
import ClassicResume from "~/components/resume/ClassicResume";
import { minimalResumeDocument } from "~/lib/resume/minimal-resume-document";

const minimalClassicDoc = {
  ...minimalResumeDocument,
  personal: {
    ...minimalResumeDocument.personal,
    fullName: "Alex Classic",
    summary: "Summary line for snapshot.",
    email: "alex@example.com",
  },
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
      `"Alex Classic Engineer Contact alex@example.com Summary Summary line for snapshot. Experience Projects Skills Languages TypeScript Education Certifications Languages Interests"`,
    );
  });
});
