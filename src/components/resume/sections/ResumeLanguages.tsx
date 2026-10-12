import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeLanguagesProps extends ResumeSectionLayoutProps {
  languages: ResumeDocument["languages"];
}

export function ResumeLanguages(props: ResumeLanguagesProps) {
  return (
    <ResumeSectionShell title="Languages" hideHeading={props.hideHeading} bare={props.bare}>
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
    </ResumeSectionShell>
  );
}
