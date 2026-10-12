import { For, Show } from "solid-js";
import { getHostname } from "~/lib/resume/get-hostname";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { ExternalLinkIcon } from "../icons";
import type { ThemeTokens } from "../tokens";

type ExperienceProject = ResumeDocument["experience"][number]["experienceProjects"][number];

interface ExperienceProjectEntryProps {
  project: ExperienceProject;
  tokens: ThemeTokens;
}

export function ExperienceProjectEntry(props: ExperienceProjectEntryProps) {
  const { project, tokens } = props;

  return (
    <div class="mb-2">
      <div class="flex items-center justify-between gap-2">
        <span class={`${tokens.typography.meta} font-semibold text-gray-800`}>
          {project.name}
        </span>
        <Show when={project.liveLink}>
          <a
            href={project.liveLink!}
            target="_blank"
            rel="noopener noreferrer"
            class={`${tokens.typography.meta} hover:underline flex items-center gap-1 shrink-0`}
            style={{ color: tokens.accent }}
          >
            <ExternalLinkIcon size={9} />
            {getHostname(project.liveLink!)}
          </a>
        </Show>
      </div>
      <Show when={project.projectDescription}>
        <div class={`${tokens.typography.meta} text-gray-500 italic mb-1`}>
          {project.projectDescription}
        </div>
      </Show>
      <Show when={project.format === "paragraph" && project.description}>
        <p
          class={`${tokens.typography.body} text-gray-700 mt-1 whitespace-pre-wrap leading-snug`}
        >
          {project.description}
        </p>
      </Show>
      <Show when={project.format === "bullets" && project.bullets.length > 0}>
        <ul
          class={`${tokens.typography.body} text-gray-700 list-disc list-outside ml-4 mt-1 leading-snug`}
        >
          <For each={project.bullets}>
            {(bullet) => (bullet ? <li>{bullet}</li> : null)}
          </For>
        </ul>
      </Show>
    </div>
  );
}
