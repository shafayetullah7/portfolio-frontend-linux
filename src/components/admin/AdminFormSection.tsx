import type { ParentProps } from "solid-js";

interface AdminFormSectionProps extends ParentProps {
  title: string;
  class?: string;
}

export default function AdminFormSection(props: AdminFormSectionProps) {
  return (
    <section class={`space-y-3 ${props.class ?? ""}`.trim()}>
      <h2 class="text-caption text-bf-accent">{props.title}</h2>
      {props.children}
    </section>
  );
}
