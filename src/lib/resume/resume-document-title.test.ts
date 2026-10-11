import { describe, expect, it } from "vitest";
import { formatResumeDocumentTitle } from "./resume-document-title";

describe("formatResumeDocumentTitle", () => {
  it("formats a normal name", () => {
    expect(formatResumeDocumentTitle("Ada Lovelace")).toBe("Ada-Lovelace-Resume");
  });

  it("handles punctuation", () => {
    expect(formatResumeDocumentTitle("J. Q. Public")).toBe("J-Q-Public-Resume");
  });

  it("falls back when name is blank", () => {
    expect(formatResumeDocumentTitle("   ")).toBe("Resume");
  });
});
