import { For, Show } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { Pill } from "../Pill";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface SkillsSectionProps {
  skills: ResumeDocument["skills"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function SkillsSection(props: SkillsSectionProps) {
  if (!props.visible || props.skills.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class={`flex flex-col ${props.tokens.itemGap}`}>
        <For each={props.skills}>
          {(skillCat) => (
            <div class="break-inside-avoid">
              <span
                class={`${props.tokens.typography.body} font-semibold text-gray-800 block mb-0.5`}
              >
                {skillCat.category}
              </span>
              <Show
                when={props.tokens.skillsStyle === "pills"}
                fallback={
                  <p class={`${props.tokens.typography.meta} text-gray-700 leading-snug`}>
                    {skillCat.skills.join(", ")}
                  </p>
                }
              >
                <div class="flex flex-wrap gap-1">
                  <For each={skillCat.skills}>
                    {(skill) => <Pill tokens={props.tokens}>{skill}</Pill>}
                  </For>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
    </ModernSplitSection>
  );
}
