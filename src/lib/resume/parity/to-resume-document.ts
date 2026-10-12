/**
 * Re-export parity converter (single source: tools/resume-parity).
 * Keep in sync — harness vitest validates against lite Zod schema.
 */
export {
  builderToResumeDocument,
  PARITY_GENERATED_AT,
  type ParityResumeDocument,
} from "../../../../../tools/resume-parity/src/to-resume-document";
