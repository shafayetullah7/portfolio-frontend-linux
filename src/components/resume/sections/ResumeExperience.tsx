import { For } from "solid-js";
import { formatResumeDateRange } from "~/lib/resume/format-resume-date";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeExperienceProps {
  experience: ResumeDocument["experience"];
}

export function ResumeExperience(props: ResumeExperienceProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Experience" />
      <For each={props.experience}>
        {(entry) => (
          <article class="resume-entry">
            <h3 class="resume-entry__title">
              {entry.position}
              <span class="resume-entry__sep"> · </span>
              {entry.company}
              {entry.location ? (
                <>
                  <span class="resume-entry__sep"> · </span>
                  <span class="resume-entry__location">{entry.location}</span>
                </>
              ) : null}
            </h3>
            <p class="resume-entry__meta">
              {formatResumeDateRange(entry.startDate, entry.endDate, entry.current)}
            </p>
            <ul class="resume-bullets">
              <For each={entry.bullets}>
                {(bullet) => <li>{bullet}</li>}
              </For>
            </ul>
          </article>
        )}
      </For>
    </section>
  );
}
