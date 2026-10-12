import { describe, expect, it } from "vitest";
import { formatResumeLinkLabel } from "./format-resume-link-label";

describe("formatResumeLinkLabel", () => {
  it("strips www and shows host + path", () => {
    expect(formatResumeLinkLabel("GitHub", "https://www.github.com/org/repo")).toBe(
      "github.com/org/repo",
    );
  });

  it("handles trailing slash on path", () => {
    expect(formatResumeLinkLabel("Link", "https://linkedin.com/in/ada/")).toBe(
      "linkedin.com/in/ada",
    );
  });

  it("falls back to label on invalid URL", () => {
    expect(formatResumeLinkLabel("My site", "not-a-url")).toBe("My site");
  });

  it("truncates very long paths", () => {
    const long = `https://example.com/${"a".repeat(80)}`;
    const out = formatResumeLinkLabel("Link", long);
    expect(out.length).toBeLessThanOrEqual(48);
    expect(out.endsWith("…")).toBe(true);
  });
});
