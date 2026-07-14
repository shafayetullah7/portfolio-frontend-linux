import { Show } from "solid-js";
import type { Project } from "~/lib/api/types/portfolio.types";

export default function ProjectStatusBadges(props: {
  project: Pick<Project, "published" | "status" | "buildStatus" | "coverage">;
}) {
  return (
    <div class="flex flex-wrap gap-2">
      <span
        class={`border px-2 py-0.5 text-caption ${
          props.project.published
            ? "border-bf-accent text-bf-accent"
            : "border-bf-warn text-bf-warn"
        }`}
      >
        {props.project.published ? "Published" : "Draft"}
      </span>
      <Show when={props.project.status}>
        {(status) => (
          <span class="border border-bf-border px-2 py-0.5 text-caption text-bf-text-muted">
            {status()}
          </span>
        )}
      </Show>
      <Show when={props.project.buildStatus}>
        {(build) => (
          <span class="border border-bf-border px-2 py-0.5 text-caption text-bf-text-muted">
            Build: {build()}
          </span>
        )}
      </Show>
      <Show when={props.project.coverage}>
        {(cov) => (
          <span class="border border-bf-border px-2 py-0.5 text-caption text-bf-text-muted">
            Coverage: {cov()}
          </span>
        )}
      </Show>
    </div>
  );
}
