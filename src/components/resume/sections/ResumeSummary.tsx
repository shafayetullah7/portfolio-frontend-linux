import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeSummaryProps extends ResumeSectionLayoutProps {
  summary: ResumeDocument["personal"]["summary"];
}

export function ResumeSummary(props: ResumeSummaryProps) {
  return (
    <ResumeSectionShell title="Summary" hideHeading={props.hideHeading} bare={props.bare}>
      <p class="resume-summary">{props.summary}</p>
    </ResumeSectionShell>
  );
}
