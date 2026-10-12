import { For, Show } from "solid-js";
import { formatResumeCertDate } from "~/lib/resume/format-resume-date";
import { formatResumeLinkLabel } from "~/lib/resume/format-resume-link-label";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeCertificationsProps extends ResumeSectionLayoutProps {
  certifications: ResumeDocument["certifications"];
}

export function ResumeCertifications(props: ResumeCertificationsProps) {
  return (
    <ResumeSectionShell
      title="Certifications"
      hideHeading={props.hideHeading}
      bare={props.bare}
    >
      <For each={props.certifications}>
        {(cert) => {
          const dateLabel = formatResumeCertDate(cert.date);
          return (
            <article class="resume-entry resume-entry--compact">
              <h3 class="resume-entry__title">{cert.name}</h3>
              <p class="resume-entry__meta">
                {cert.issuer}
                {dateLabel ? (
                  <>
                    <span class="resume-entry__sep"> · </span>
                    {dateLabel}
                  </>
                ) : null}
              </p>
              <Show when={cert.url}>
                <a
                  class="resume-link"
                  href={cert.url!}
                  rel="noopener noreferrer"
                  target="_blank"
                  title={cert.url!}
                >
                  {formatResumeLinkLabel("Credential", cert.url!)}
                </a>
              </Show>
            </article>
          );
        }}
      </For>
    </ResumeSectionShell>
  );
}
