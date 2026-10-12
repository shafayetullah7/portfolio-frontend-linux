import { For } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface LanguagesSectionProps {
  languages: ResumeDocument["languages"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function LanguagesSection(props: LanguagesSectionProps) {
  if (!props.visible || props.languages.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class="flex flex-col gap-1">
        <For each={props.languages}>
          {(lang) => (
            <div class="flex justify-between">
              <span class={`${props.tokens.typography.body} font-semibold text-gray-800`}>
                {lang.name}
              </span>
              <span class={`${props.tokens.typography.meta} text-gray-500`}>{lang.level}</span>
            </div>
          )}
        </For>
      </div>
    </ModernSplitSection>
  );
}
