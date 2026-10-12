import { For, Show } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { Pill } from "../Pill";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface InterestsSectionProps {
  interests: ResumeDocument["interests"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function InterestsSection(props: InterestsSectionProps) {
  if (!props.visible) return null;

  const format = () => props.interests.format;
  const paragraph = () => props.interests.paragraph.trim();
  const items = () => props.interests.items;

  if (format() === "paragraph" && !paragraph()) return null;
  if (format() === "bullets" && items().length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <Show
        when={format() === "paragraph" && paragraph()}
        fallback={
          <div class="flex flex-wrap gap-1">
            <For each={items()}>
              {(interest) => <Pill tokens={props.tokens}>{interest.name}</Pill>}
            </For>
          </div>
        }
      >
        <p class={`${props.tokens.typography.meta} text-gray-600 leading-snug`}>
          {paragraph()}
        </p>
      </Show>
    </ModernSplitSection>
  );
}
