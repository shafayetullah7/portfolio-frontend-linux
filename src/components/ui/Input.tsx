import { JSX, splitProps } from "solid-js";

export default function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <input
      class={`w-full border border-bf-border bg-bf-surface px-3 py-2 text-body text-bf-text placeholder:text-bf-text-muted focus:border-bf-accent focus:outline-none focus:ring-1 focus:ring-bf-accent/50 ${local.class ?? ""}`}
      {...rest}
    />
  );
}
