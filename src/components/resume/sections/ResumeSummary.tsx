import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeSummaryProps {
  summary: ResumeDocument["personal"]["summary"];
}

export function ResumeSummary(props: ResumeSummaryProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Summary" />
      <p class="resume-summary">{props.summary}</p>
    </section>
  );
}
