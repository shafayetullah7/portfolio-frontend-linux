import type { JSX } from "solid-js";
import { sectionHeaderClass } from "./documentTypography";
import {
  sectionHeaderStyle,
  type ThemeTokens,
} from "./tokens";

interface ModernSplitSectionProps {
  label: string;
  tokens: ThemeTokens;
  /** Summary section uses flex header in builder. */
  headerClass?: string;
  children: JSX.Element;
}

export function ModernSplitSection(props: ModernSplitSectionProps) {
  const headerClass = () =>
    props.headerClass ??
    sectionHeaderClass(props.tokens.typography, props.tokens.sectionHeaderSpacing);

  return (
    <section class={`${props.tokens.sectionGap} break-inside-avoid`}>
      <h3 class={headerClass()} style={sectionHeaderStyle(props.tokens)}>
        {props.label}
      </h3>
      {props.children}
    </section>
  );
}
