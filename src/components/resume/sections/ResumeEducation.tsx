import { For, Show } from "solid-js";
import { formatResumeEducationRange } from "~/lib/resume/format-resume-date";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeEducationProps extends ResumeSectionLayoutProps {
  education: ResumeDocument["education"];
}

export function ResumeEducation(props: ResumeEducationProps) {
  return (
    <ResumeSectionShell title="Education" hideHeading={props.hideHeading} bare={props.bare}>
      <For each={props.education}>
        {(entry) => {
          const dates = formatResumeEducationRange(entry.startDate, entry.endDate);
          return (
            <article class="resume-entry">
              <h3 class="resume-entry__title">{entry.degree}</h3>
              <p class="resume-entry__meta">
                {entry.institution}
                {dates ? (
                  <>
                    <span class="resume-entry__sep"> · </span>
                    {dates}
                  </>
                ) : null}
              </p>
              <Show when={entry.description}>
                <p class="resume-education-desc">{entry.description}</p>
              </Show>
            </article>
          );
        }}
      </For>
    </ResumeSectionShell>
  );
}
