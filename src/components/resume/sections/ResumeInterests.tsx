import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeInterestsProps extends ResumeSectionLayoutProps {
  interests: ResumeDocument["interests"];
}

export function ResumeInterests(props: ResumeInterestsProps) {
  return (
    <ResumeSectionShell title="Interests" hideHeading={props.hideHeading} bare={props.bare}>
      <ul class="resume-chip-list">
        <For each={props.interests.items}>
          {(interest) => <li class="resume-chip">{interest.name}</li>}
        </For>
      </ul>
    </ResumeSectionShell>
  );
}
