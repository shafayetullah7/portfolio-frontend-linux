import { JSX, For, splitProps } from "solid-js";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
}

export default function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ["class", "options"]);
  return (
    <select
      class={`w-full border border-bf-border bg-bf-surface px-3 py-2 text-body text-bf-text focus:border-bf-accent focus:outline-none focus:ring-1 focus:ring-bf-accent/50 ${local.class ?? ""}`}
      {...rest}
    >
      <For each={local.options}>{(opt) => <option value={opt.value}>{opt.label}</option>}</For>
    </select>
  );
}
