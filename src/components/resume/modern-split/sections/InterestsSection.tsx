import { For } from "solid-js";
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
  const items = () => props.interests.items;
  if (!props.visible || items().length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class="flex flex-wrap gap-1">
        <For each={items()}>
          {(interest) => <Pill tokens={props.tokens}>{interest.name}</Pill>}
        </For>
      </div>
    </ModernSplitSection>
  );
}
