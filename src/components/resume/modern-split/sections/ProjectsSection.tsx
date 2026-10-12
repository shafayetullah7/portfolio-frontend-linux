import { For, Show } from "solid-js";
import { getHostname } from "~/lib/resume/get-hostname";
import { modernSplitProjectLinkRows } from "~/lib/resume/project-link-rows";
import type { ResumeDocument } from "~/schemas/resume-document.schema";
import { formatModernSplitDateRange } from "../format-date";
import { ExternalLinkIcon, GitHubIcon } from "../icons";
import { Pill } from "../Pill";
import { ModernSplitSection } from "../ModernSplitSection";
import type { ThemeTokens } from "../tokens";

interface ProjectsSectionProps {
  projects: ResumeDocument["projects"];
  label: string;
  tokens: ThemeTokens;
  visible: boolean;
}

export function ProjectsSection(props: ProjectsSectionProps) {
  if (!props.visible || props.projects.length === 0) return null;

  return (
    <ModernSplitSection label={props.label} tokens={props.tokens}>
      <div class={`flex flex-col ${props.tokens.blockGap}`}>
        <For each={props.projects}>
          {(proj) => (
            <div class="break-inside-avoid">
              <div class="flex justify-between items-baseline">
                <span class={`${props.tokens.typography.body} font-semibold text-gray-800`}>
                  {proj.name}
                </span>
                <span class={`${props.tokens.typography.meta} text-gray-500`}>
                  {formatModernSplitDateRange(
                    proj.startDate ?? "",
                    proj.endDate ?? "",
                    false,
                  )}
                </span>
              </div>
              <Show when={proj.description}>
                <p class={`${props.tokens.typography.body} text-gray-700 mt-0.5 leading-snug`}>
                  {proj.description}
                </p>
              </Show>
              <Show when={proj.technologies.length > 0}>
                <div class="flex flex-wrap gap-1 mt-1">
                  <For each={proj.technologies}>
                    {(tech) => <Pill tokens={props.tokens}>{tech}</Pill>}
                  </For>
                </div>
              </Show>
              <Show when={proj.highlights.length > 0}>
                <ul
                  class={`${props.tokens.typography.body} text-gray-700 list-disc list-outside ml-4 mt-1 leading-snug`}
                >
                  <For each={proj.highlights}>
                    {(h) => (h ? <li>{h}</li> : null)}
                  </For>
                </ul>
              </Show>
              <Show when={modernSplitProjectLinkRows(proj.links).length > 0}>
                <div class={`flex flex-col gap-1 ${props.tokens.typography.meta} mt-1`}>
                  <For each={modernSplitProjectLinkRows(proj.links)}>
                    {(link) => (
                      <div class="flex items-center gap-2 flex-wrap">
                        <span class="font-medium text-gray-600">{link.label}:</span>
                        <Show when={link.liveUrl}>
                          <a
                            href={link.liveUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:underline flex items-center gap-1"
                            style={{ color: props.tokens.accent }}
                          >
                            <ExternalLinkIcon size={10} />
                            {getHostname(link.liveUrl!)}
                          </a>
                        </Show>
                        <Show when={link.liveUrl && link.githubUrl}>
                          <span class="text-gray-400">|</span>
                        </Show>
                        <Show when={link.githubUrl}>
                          <a
                            href={link.githubUrl!}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="hover:underline flex items-center gap-1"
                            style={{ color: props.tokens.accent }}
                          >
                            <GitHubIcon size={10} />
                            {getHostname(link.githubUrl!)}
                          </a>
                        </Show>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </div>
          )}
        </For>
      </div>
    </ModernSplitSection>
  );
}
