import { describe, expect, it } from "vitest";
import { renderToString } from "solid-js/web";
import ModernSplitDocument from "./ModernSplitDocument";
import { minimalResumeDocument } from "~/lib/resume/minimal-resume-document";

const minimalDoc = minimalResumeDocument;

const LEGACY_CLASS_PATTERN =
  /\b(resume-section|resume-chip|resume-link|resume-entry|resume-bullets)\b/;

describe("Modern Split isolation", () => {
  it("does not emit legacy Classic resume classes", () => {
    const html = renderToString(() => <ModernSplitDocument doc={minimalDoc} />);
    expect(html).toContain("modern-split-doc");
    expect(LEGACY_CLASS_PATTERN.test(html)).toBe(false);
  });
});
