import { Show } from "solid-js";

export type AdminFieldHintVariant = "fact" | "site" | "resume";

const DEFAULT_COPY: Record<AdminFieldHintVariant, string> = {
  fact: "Fact — shown on the public site and on the resume PDF.",
  site: "Site narrative — public portfolio only; not used as the resume summary.",
  resume: "Resume narrative — print/PDF only unless noted; not required on the marketing site.",
};

interface AdminFieldHintProps {
  variant: AdminFieldHintVariant;
  children?: string;
  class?: string;
}

export default function AdminFieldHint(props: AdminFieldHintProps) {
  const text = () => props.children ?? DEFAULT_COPY[props.variant];
  return (
    <Show when={text()}>
      <p class={`text-caption text-bf-text-muted ${props.class ?? ""}`.trim()}>{text()}</p>
    </Show>
  );
}
