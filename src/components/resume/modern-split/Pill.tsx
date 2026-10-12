import { pillClass } from "./documentTypography";
import type { ThemeTokens } from "./tokens";

interface PillProps {
  tokens: ThemeTokens;
  children: string;
}

export function Pill(props: PillProps) {
  return (
    <span
      class={pillClass(props.tokens.typography)}
      style={{
        "background-color": `${props.tokens.accent}15`,
        color: props.tokens.accent,
        "border-color": `${props.tokens.accent}30`,
      }}
    >
      {props.children}
    </span>
  );
}
