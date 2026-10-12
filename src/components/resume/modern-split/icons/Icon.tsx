import { splitProps, type JSX } from "solid-js";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  size?: number;
}

interface IconRootProps extends IconProps {
  children: JSX.Element;
  fill?: string;
}

export function Icon(props: IconRootProps) {
  const [local, rest] = splitProps(props, ["children", "fill", "class", "size"]);
  const size = () => local.size ?? 24;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      fill={local.fill ?? "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {local.children}
    </svg>
  );
}
