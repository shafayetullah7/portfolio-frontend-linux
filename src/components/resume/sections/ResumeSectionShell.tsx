import type { JSX } from "solid-js";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

export interface ResumeSectionLayoutProps {
  hideHeading?: boolean;
  /** Omit outer `<section class="resume-section">` when wrapped by ModernSplitSection. */
  bare?: boolean;
}

interface ResumeSectionShellProps extends ResumeSectionLayoutProps {
  title: string;
  children: JSX.Element;
}

export function ResumeSectionShell(props: ResumeSectionShellProps) {
  if (props.bare) {
    return <>{props.children}</>;
  }
  return (
    <section class="resume-section">
      {!props.hideHeading && <ResumeSectionHeading title={props.title} />}
      {props.children}
    </section>
  );
}
