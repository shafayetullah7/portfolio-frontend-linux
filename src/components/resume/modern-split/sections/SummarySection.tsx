import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { sectionHeaderClass } from "../documentTypography";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface SummarySectionProps {
  summary: ResumeDocument["personal"]["summary"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function SummarySection(props: SummarySectionProps) {
  if (!props.visible || !props.summary) return null;

  const headerClass = `${sectionHeaderClass(
    props.tokens.typography,
    props.tokens.sectionHeaderSpacing,
  )} flex items-center gap-2`;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens} headerClass={headerClass}>
      <p
        class={`text-gray-700 ${props.tokens.typography.body} ${props.tokens.summaryLeading} whitespace-pre-wrap`}
      >
        {props.summary}
      </p>
    </ModernSplitSection>
  );
}
