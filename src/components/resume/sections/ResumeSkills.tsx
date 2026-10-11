import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeSkillsProps {
  skills: ResumeDocument["skills"];
}

export function ResumeSkills(props: ResumeSkillsProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Skills" />
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
    </section>
  );
}
