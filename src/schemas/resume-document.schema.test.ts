import { describe, expect, it } from "vitest";
import { minimalResumeDocument } from "~/lib/resume/minimal-resume-document";
import { resumeDocumentSchema } from "./resume-document.schema";

describe("resumeDocumentSchema", () => {
  it("accepts a minimal valid document", () => {
    expect(resumeDocumentSchema.safeParse(minimalResumeDocument).success).toBe(
      true,
    );
  });

  it("rejects wrong schemaVersion", () => {
    const result = resumeDocumentSchema.safeParse({
      ...minimalResumeDocument,
      schemaVersion: 1,
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing personal", () => {
    const { personal: _p, ...rest } = minimalResumeDocument;
    const result = resumeDocumentSchema.safeParse(rest);
    expect(result.success).toBe(false);
  });
});
