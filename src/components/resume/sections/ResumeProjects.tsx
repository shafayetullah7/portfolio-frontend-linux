import { For, Show } from "solid-js";
import { formatResumeLinkLabel } from "~/lib/resume/format-resume-link-label";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ResumeSectionHeading } from "./ResumeSectionHeading";

interface ResumeProjectsProps {
  projects: ResumeDocument["projects"];
}

export function ResumeProjects(props: ResumeProjectsProps) {
  return (
    <section class="resume-section">
      <ResumeSectionHeading title="Projects" />
      <For each={props.projects}>
        {(project) => (
          <article class="resume-entry">
            <h3 class="resume-entry__title">{project.name}</h3>
            <Show when={project.technologies.length > 0}>
              <p class="resume-entry__meta">{project.technologies.join(" · ")}</p>
            </Show>
            <Show when={project.description}>
              <p class="resume-project-desc">{project.description}</p>
            </Show>
            <Show when={project.highlights.length > 0}>
              <ul class="resume-bullets">
                <For each={project.highlights}>
                  {(highlight) => <li>{highlight}</li>}
                </For>
              </ul>
            </Show>
            <Show when={project.links.length > 0}>
              <ul class="resume-project-links">
                <For each={project.links}>
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
            </Show>
          </article>
        )}
      </For>
    </section>
  );
}
