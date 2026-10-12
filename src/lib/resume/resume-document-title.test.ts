import { describe, expect, it } from "vitest";
import {
  formatResumeDocumentTitle,
  sanitizeResumeFilename,
} from "./resume-document-title";

describe("sanitizeResumeFilename", () => {
  it("trims and replaces spaces with hyphens", () => {
    expect(sanitizeResumeFilename("Ada Lovelace")).toBe("Ada-Lovelace");
  });

  it("strips non-word characters except spaces and hyphens", () => {
    expect(sanitizeResumeFilename("J. Q. Public")).toBe("J-Q-Public");
  });

  it("falls back to resume when empty after sanitization", () => {
    expect(sanitizeResumeFilename("   ")).toBe("resume");
    expect(sanitizeResumeFilename("!!!")).toBe("resume");
  });
});

describe("formatResumeDocumentTitle", () => {
  it("uses lowercase resume suffix", () => {
    expect(formatResumeDocumentTitle("Ada Lovelace")).toBe("Ada-Lovelace-resume");
  });

  it("handles punctuation in names", () => {
    expect(formatResumeDocumentTitle("J. Q. Public")).toBe("J-Q-Public-resume");
  });
});
