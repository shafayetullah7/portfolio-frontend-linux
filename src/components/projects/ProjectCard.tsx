import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Tag } from "~/components/ui";
import type { Project } from "~/lib/api/types/portfolio.types";
import { parseStack } from "~/lib/projects";
import { truncateBio } from "~/content/site.config";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard(props: ProjectCardProps) {
  const tags = () => parseStack(props.project.stack);
  const initials = () =>
    props.project.title
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <article class="group min-w-0 border border-bf-border bg-bf-surface transition-colors hover:border-bf-accent/40">
      <div class="grid min-w-0 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        <A
          href={`/projects/${props.project.slug}`}
          class="relative block aspect-[16/10] overflow-hidden border-b border-bf-border bg-bf-bg no-underline md:aspect-auto md:h-48 md:border-b-0 md:border-r"
        >
          <Show
            when={props.project.screenshotUrl}
            fallback={
              <div class="bf-media-grid relative flex h-full flex-col items-center justify-center gap-2">
                <span class="text-[2rem] font-bold tracking-widest text-bf-accent/80">{initials()}</span>
                <span class="text-caption uppercase tracking-[0.14em] text-bf-text-muted">
                  No screenshot
                </span>
              </div>
            }
          >
            <img
              src={props.project.screenshotUrl!}
              alt={props.project.title}
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </Show>
        </A>

        <div class="flex flex-col gap-4 p-5 sm:p-6">
          <div class="flex flex-wrap gap-2">
            <For each={tags()}>{(t) => <Tag>{t}</Tag>}</For>
          </div>

          <div>
            <h3 class="text-heading text-bf-text">
              <A
                href={`/projects/${props.project.slug}`}
                class="text-bf-text no-underline hover:text-bf-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
              >
                {props.project.title}
              </A>
            </h3>
            <p class="mt-2 text-body text-bf-text-muted">
              {truncateBio(props.project.description, 140)}
            </p>
          </div>

          <div class="flex flex-wrap gap-x-5 gap-y-2 border-t border-bf-border pt-3 text-caption">
            <Show when={props.project.status}>
              <span>
                <span class="text-bf-text-muted">Status </span>
                <span class="font-semibold uppercase text-bf-accent">{props.project.status}</span>
              </span>
            </Show>
            <Show when={props.project.buildStatus}>
              <span>
                <span class="text-bf-text-muted">Build </span>
                <span class="text-bf-text">{props.project.buildStatus}</span>
              </span>
            </Show>
            <Show when={props.project.coverage}>
              <span>
                <span class="text-bf-text-muted">Coverage </span>
                <span class="text-bf-text">{props.project.coverage}</span>
              </span>
            </Show>
          </div>

          <div class="mt-auto flex flex-wrap gap-4 text-caption">
            <A
              href={`/projects/${props.project.slug}`}
              class="text-bf-accent no-underline hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
            >
              Detail →
            </A>
            <Show when={props.project.repoUrl}>
              <a
                href={props.project.repoUrl!}
                target="_blank"
                rel="noopener noreferrer"
                class="text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
              >
                Repo
              </a>
            </Show>
            <Show when={props.project.docsUrl}>
              <a
                href={props.project.docsUrl!}
                target="_blank"
                rel="noopener noreferrer"
                class="text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
              >
                Live / Docs
              </a>
            </Show>
          </div>
        </div>
      </div>
    </article>
  );
}
