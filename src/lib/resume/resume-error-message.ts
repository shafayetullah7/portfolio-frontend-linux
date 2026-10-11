import { ApiError } from "~/lib/api/types";

export function resumeErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 502) {
      return "Resume data from the server was invalid. Try again later.";
    }
    return error.message || "Could not load resume.";
  }
  return "Could not load resume. Check that the API is running and try again.";
}
