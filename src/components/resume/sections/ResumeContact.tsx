import { For, Show } from "solid-js";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeContactProps {
  personal: ResumeDocument["personal"];
}

export function ResumeContact(props: ResumeContactProps) {
  const { email, phone, location, links } = props.personal;

  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Contact" />
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
              >
                {link.label}
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
}
