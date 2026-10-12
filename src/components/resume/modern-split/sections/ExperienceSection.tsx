import { For, Show } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { formatModernSplitDateRange } from "../format-date";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";
import { ExperienceProjectEntry } from "./ExperienceProjectEntry";

interface ExperienceSectionProps {
  experience: ResumeDocument["experience"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function ExperienceSection(props: ExperienceSectionProps) {
  if (!props.visible || props.experience.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class={`flex flex-col ${props.tokens.blockGap}`}>
        <For each={props.experience}>
          {(exp) => (
            <div class={`${props.tokens.entryGap} break-inside-avoid`}>
              <div class="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 items-baseline">
                <p class={`${props.tokens.typography.body} min-w-0 leading-snug`}>
                  <span class="font-semibold text-gray-800">{exp.position}</span>
                  <Show when={exp.company}>
                    <span class="text-gray-400"> · </span>
                    <span class="font-semibold" style={{ color: props.tokens.accent }}>
                      {exp.company}
                    </span>
                  </Show>
                  <Show when={exp.location}>
                    <span class="text-gray-400"> · </span>
                    <span class="font-normal text-gray-600">{exp.location}</span>
                  </Show>
                </p>
                <span
                  class={`${props.tokens.typography.meta} text-gray-500 text-right whitespace-nowrap`}
                >
                  {formatModernSplitDateRange(
                    exp.startDate,
                    exp.endDate ?? "",
                    exp.current,
                  )}
                </span>
              </div>
              <Show when={exp.format === "paragraph" && exp.paragraph}>
                <p
                  class={`${props.tokens.typography.body} text-gray-700 mt-1 whitespace-pre-wrap leading-snug`}
                >
                  {exp.paragraph}
                </p>
              </Show>
              <Show when={exp.format === "bullets" && exp.bullets.length > 0}>
                <ul
                  class={`${props.tokens.typography.body} text-gray-700 list-disc list-outside ml-4 mt-1 leading-snug`}
                >
                  <For each={exp.bullets}>
                    {(bullet) => (bullet ? <li>{bullet}</li> : null)}
                  </For>
                </ul>
              </Show>
              <Show when={exp.experienceProjects.length > 0}>
                <div class="mt-2 ml-2 border-l border-gray-300 pl-2">
                  <For each={exp.experienceProjects}>
                    {(project) => (
                      <ExperienceProjectEntry project={project} tokens={props.tokens} />
                    )}
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
