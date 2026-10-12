import { For, Show } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { formatModernSplitDateRange } from "../format-date";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface EducationSectionProps {
  education: ResumeDocument["education"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function EducationSection(props: EducationSectionProps) {
  if (!props.visible || props.education.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class={`flex flex-col ${props.tokens.itemGap}`}>
        <For each={props.education}>
          {(edu) => (
            <div class="break-inside-avoid">
              <span class={`${props.tokens.typography.body} font-semibold text-gray-800 block`}>
                {edu.degree}
              </span>
              <span class={`${props.tokens.typography.meta} text-gray-600`}>
                {edu.institution}
              </span>
              <span class={`${props.tokens.typography.meta} text-gray-500 block`}>
                {formatModernSplitDateRange(
                  edu.startDate ?? "",
                  edu.endDate ?? "",
                  false,
                )}
              </span>
              <Show when={edu.description}>
                <p class={`${props.tokens.typography.meta} text-gray-600 mt-0.5 leading-snug`}>
                  {edu.description}
                </p>
              </Show>
            </div>
          )}
        </For>
      </div>
    </ModernSplitSection>
  );
}
