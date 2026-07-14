import { JSX, splitProps } from "solid-js";

interface ContainerProps extends JSX.HTMLAttributes<HTMLDivElement> {}

export default function Container(props: ContainerProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <div class={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${local.class ?? ""}`} {...rest}>
      {local.children}
    </div>
  );
}
