import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeInterestsProps {
  interests: ResumeDocument["interests"];
}

export function ResumeInterests(props: ResumeInterestsProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Interests" />
      <ul class="resume-chip-list">
        <For each={props.interests}>
          {(interest) => <li class="resume-chip">{interest.name}</li>}
        </For>
      </ul>
    </section>
  );
}
