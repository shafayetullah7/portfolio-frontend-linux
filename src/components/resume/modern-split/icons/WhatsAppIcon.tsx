import type { IconProps } from "./Icon";

/** Filled chat-bubble mark — matches resume-builder (not outline Phone). */
export function WhatsAppIcon(props: IconProps) {
  const size = () => props.size ?? 24;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size()}
      height={size()}
      fill="currentColor"
      class={props.class}
      style={props.style}
      aria-label={props["aria-label"] ?? "WhatsApp"}
      aria-hidden={props["aria-label"] ? undefined : true}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.74.46 3.44 1.33 4.93L2.05 22l5.08-1.93a9.86 9.86 0 0 0 4.91 1.3h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.17 13.83c-.22.62-1.28 1.18-1.78 1.25-.47.07-1.07.1-1.73-.1-.4-.13-.91-.3-1.57-.59-2.76-1.2-4.56-4-4.7-4.19-.14-.19-1.12-1.49-1.12-2.85 0-1.36.71-2.03.96-2.31.26-.28.56-.35.75-.35.19 0 .38.01.55.01.18 0 .42-.07.65.49.24.58.82 2.01.89 2.16.07.15.12.33.02.53-.1.2-.15.33-.3.5-.15.17-.32.38-.46.5-.15.17-.3.35-.13.69.17.33.77 1.27 1.66 2.06 1.14 1.01 2.1 1.33 2.45 1.48.35.15.55.13.75-.08.2-.2.86-1 1.08-1.35.22-.35.44-.29.75-.17.31.12 1.96.93 2.3 1.1.34.17.57.26.65.4.08.14.08.8-.14 1.42z" />
    </svg>
  );
}
