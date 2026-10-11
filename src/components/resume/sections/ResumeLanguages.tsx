import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeLanguagesProps {
  languages: ResumeDocument["languages"];
}

export function ResumeLanguages(props: ResumeLanguagesProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Languages" />
      <ul class="resume-plain-list">
        <For each={props.languages}>
          {(lang) => (
            <li>
              {lang.name}
              <span class="resume-entry__sep"> — </span>
              {lang.level}
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
