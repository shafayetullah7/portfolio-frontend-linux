import { JSX, splitProps } from "solid-js";

type ButtonVariant = "solid" | "outline" | "ghost";

const variants: Record<ButtonVariant, string> = {
  solid: "bg-bf-accent text-bf-bg hover:opacity-90 font-semibold",
  outline: "border border-bf-accent text-bf-accent hover:bg-bf-accent-dim",
  ghost: "text-bf-text-muted hover:text-bf-text hover:bg-bf-surface",
};

interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export default function Button(props: ButtonProps) {
  const [local, rest] = splitProps(props, ["variant", "class", "children"]);
  return (
    <button
      class={`inline-flex h-11 items-center justify-center px-4 text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50 disabled:opacity-50 ${variants[local.variant ?? "solid"]} ${local.class ?? ""}`}
      {...rest}
    >
      {local.children}
    </button>
  );
}
