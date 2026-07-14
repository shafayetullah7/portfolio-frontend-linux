import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Tag } from "~/components/ui";
import type { Project } from "~/lib/api/types/portfolio.types";
import { parseStack } from "~/lib/projects";

interface ProjectDetailProps {
  project: Project;
}

export default function ProjectDetail(props: ProjectDetailProps) {
  const tags = () => parseStack(props.project.stack);
  const initials = () =>
    props.project.title
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <article class="flex flex-col gap-8">
      <div>
        <A href="/projects" class="text-caption text-bf-text-muted no-underline hover:text-bf-accent">
          ← ./projects
        </A>
        <h1 class="mt-4 text-display text-bf-text">{props.project.title}</h1>
        <div class="mt-4 flex flex-wrap gap-2">
          <For each={tags()}>{(t) => <Tag>{t}</Tag>}</For>
        </div>
      </div>

      <div class="min-h-56 overflow-hidden border border-bf-border bg-bf-bg-elevated">
        <Show
          when={props.project.screenshotUrl}
          fallback={
            <div class="flex min-h-56 items-center justify-center text-heading text-bf-text-muted">
              {initials()}
            </div>
          }
        >
          <img
            src={props.project.screenshotUrl!}
            alt={props.project.title}
            class="max-h-[28rem] w-full object-cover"
          />
        </Show>
      </div>

      <p class="max-w-3xl text-body text-bf-text-muted">{props.project.description}</p>

      <div class="flex flex-wrap gap-4 text-caption">
        <Show when={props.project.status}>
          <span>
            <span class="text-bf-text-muted">Status </span>
            <span class="text-bf-accent">{props.project.status}</span>
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

      <Show when={props.project.features?.length}>
        <div>
          <h2 class="text-heading text-bf-text">Features</h2>
          <ul class="mt-3 list-disc space-y-2 pl-5 text-body text-bf-text-muted">
            <For each={[...props.project.features].sort((a, b) => a.sortOrder - b.sortOrder)}>
              {(f) => <li>{f.content}</li>}
            </For>
          </ul>
        </div>
      </Show>

      <div class="flex flex-wrap gap-4 text-body">
        <Show when={props.project.repoUrl}>
          <a
            href={props.project.repoUrl!}
            target="_blank"
            rel="noopener noreferrer"
            class="text-bf-accent no-underline hover:underline"
          >
            Repo →
          </a>
        </Show>
        <Show when={props.project.docsUrl}>
          <a
            href={props.project.docsUrl!}
            target="_blank"
            rel="noopener noreferrer"
            class="text-bf-accent no-underline hover:underline"
          >
            Live / Docs →
          </a>
        </Show>
      </div>
    </article>
  );
}
