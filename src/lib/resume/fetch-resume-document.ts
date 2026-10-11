import { publicGet } from "~/lib/api/api-client";
import { ApiError } from "~/lib/api/types";
import {
  resumeDocumentSchema,
  type ResumeDocument,
} from "~/schemas/resume-document.schema";

export async function fetchResumeDocument(): Promise<ResumeDocument> {
  const raw = await publicGet<unknown>("/api/v1/public/resume");
  const parsed = resumeDocumentSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ApiError("Invalid resume document", 502, parsed.error);
  }
  return parsed.data;
}
