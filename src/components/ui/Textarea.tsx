import { JSX, splitProps } from "solid-js";

export default function Textarea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <textarea
      class={`w-full border border-bf-border bg-bf-surface p-3 text-body text-bf-text placeholder:text-bf-text-muted focus:border-bf-accent focus:outline-none focus:ring-1 focus:ring-bf-accent/50 ${local.class ?? ""}`}
      {...rest}
    />
  );
}
