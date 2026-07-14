import { For, Show } from "solid-js";
import ProjectCard from "~/components/projects/ProjectCard";
import type { Project } from "~/lib/api/types/portfolio.types";

interface ProjectGridProps {
  projects: Project[];
  emptyMessage?: string;
}

export default function ProjectGrid(props: ProjectGridProps) {
  return (
    <Show
      when={props.projects.length > 0}
      fallback={
        <p class="border border-bf-border p-6 text-body text-bf-text-muted">
          {props.emptyMessage ?? "No published projects yet."}
        </p>
      }
    >
      <div class="flex flex-col gap-5">
        <For each={props.projects}>{(p) => <ProjectCard project={p} />}</For>
      </div>
    </Show>
  );
}
