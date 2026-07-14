import { JSX, splitProps } from "solid-js";

interface TagProps extends JSX.HTMLAttributes<HTMLSpanElement> {}

export default function Tag(props: TagProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <span
      class={`inline-flex border border-bf-border px-2 py-0.5 text-caption text-bf-accent ${local.class ?? ""}`}
      {...rest}
    >
      {local.children}
    </span>
  );
}
