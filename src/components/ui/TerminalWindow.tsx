import { JSX, Show, splitProps } from "solid-js";

interface TerminalWindowProps extends JSX.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showDots?: boolean;
}

export default function TerminalWindow(props: TerminalWindowProps) {
  const [local, rest] = splitProps(props, ["class", "children", "title", "showDots"]);
  return (
    <div
      class={`overflow-hidden border border-bf-border bg-bf-surface ${local.class ?? ""}`}
      {...rest}
    >
      <div class="flex items-center gap-2 border-b border-bf-border bg-bf-bg-elevated px-3 py-2.5">
        <Show when={local.showDots !== false}>
          <span class="flex gap-1.5" aria-hidden="true">
            <span class="size-2.5 rounded-full bg-bf-border-strong" />
            <span class="size-2.5 rounded-full bg-bf-text-muted" />
            <span class="size-2.5 rounded-full bg-bf-accent" />
          </span>
        </Show>
        <Show when={local.title}>
          <span class="ml-1 text-caption text-bf-text-muted">{local.title}</span>
        </Show>
      </div>
      <div class="bg-bf-bg p-4 text-body text-bf-text sm:p-5">{local.children}</div>
    </div>
  );
}
