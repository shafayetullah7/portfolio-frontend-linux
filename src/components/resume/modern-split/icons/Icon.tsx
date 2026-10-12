import type { JSX } from "solid-js";

export interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  size?: number;
}

interface IconRootProps extends IconProps {
  children: JSX.Element;
  fill?: string;
}

export function Icon(props: IconRootProps) {
  const size = () => props.size ?? 24;
  const { children, fill, class: className, size: _size, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      fill={fill ?? "none"}
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={className}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  );
}
