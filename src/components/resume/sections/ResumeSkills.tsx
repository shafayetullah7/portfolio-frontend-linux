import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeSkillsProps extends ResumeSectionLayoutProps {
  skills: ResumeDocument["skills"];
}

export function ResumeSkills(props: ResumeSkillsProps) {
  return (
    <ResumeSectionShell title="Skills" hideHeading={props.hideHeading} bare={props.bare}>
      <For each={props.skills}>
        {(group) => (
          <div class="resume-skill-group">
            <p class="resume-skill-group__label">{group.category}</p>
            <ul class="resume-chip-list">
              <For each={group.skills}>
                {(skill) => <li class="resume-chip">{skill}</li>}
              </For>
            </ul>
          </div>
        )}
      </For>
    </ResumeSectionShell>
  );
}
