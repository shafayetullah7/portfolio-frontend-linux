import { For, Show } from "solid-js";
import { formatResumeLinkLabel } from "~/lib/resume/format-resume-link-label";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import {
  ResumeSectionShell,
  type ResumeSectionLayoutProps,
} from "./ResumeSectionShell";

interface ResumeContactProps extends ResumeSectionLayoutProps {
  personal: ResumeDocument["personal"];
}

export function ResumeContact(props: ResumeContactProps) {
  const { email, phone, location, links } = props.personal;

  return (
    <ResumeSectionShell title="Contact" hideHeading={props.hideHeading} bare={props.bare}>
      <ul class="resume-contact-list">
        <Show when={email}>
          <li>
            <a class="resume-link" href={`mailto:${email}`}>{email}</a>
          </li>
        </Show>
        <Show when={phone}>
          <li>
            <a class="resume-link" href={`tel:${phone}`}>{phone}</a>
          </li>
        </Show>
        <Show when={location}>
          <li class="resume-contact-list__text">{location}</li>
        </Show>
        <For each={links}>
          {(link) => (
            <li>
              <a
                class="resume-link"
                href={link.url}
                rel="noopener noreferrer"
                target="_blank"
                title={link.url}
              >
                {formatResumeLinkLabel(link.label, link.url)}
              </a>
            </li>
          )}
        </For>
      </ul>
    </ResumeSectionShell>
  );
}
