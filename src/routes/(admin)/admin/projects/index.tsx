import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import ProjectStatusBadges from "~/components/admin/projects/ProjectStatusBadges";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { Project } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

export default function AdminProjectsPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [projects] = createResource(refresh, () => adminApi.listProjects());
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");

  const reload = () => setRefresh((v) => v + 1);

  const remove = async () => {
    const id = deleteId();
    if (!id) return;
    setError("");
    try {
      await adminApi.deleteProject(id);
      setDeleteId(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  const move = async (project: Project, dir: -1 | 1) => {
    const list = [...(projects() ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = list.findIndex((p) => p.id === project.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setError("");
    try {
      await adminApi.updateProject(project.id, { sortOrder: swap.sortOrder ?? idx + dir });
      await adminApi.updateProject(swap.id, { sortOrder: project.sortOrder ?? idx });
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Reorder failed");
    }
  };

  const initials = (title: string) =>
    title
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <>
      <Title>Admin — Projects</Title>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="mb-1 text-heading text-bf-text">Projects</h1>
          <p class="text-body text-bf-text-muted">Create and publish featured deployments.</p>
        </div>
        <A href="/admin/projects/new">
          <Button type="button">New project</Button>
        </A>
      </div>

      <Show when={error()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={projects.loading}
        error={projects.error}
        empty={!projects.loading && !projects.error && !(projects()?.length)}
        loadingMessage="Loading projects..."
        emptyMessage="No projects yet."
      >
        <div class="space-y-3">
          <For
            each={[...(projects() ?? [])].sort(
              (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
            )}
          >
            {(p) => (
              <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-start sm:justify-between">
                <div class="flex min-w-0 gap-3">
                  <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden border border-bf-border bg-bf-bg">
                    <Show
                      when={p.screenshotUrl}
                      fallback={
                        <span class="text-caption text-bf-text-muted">{initials(p.title)}</span>
                      }
                    >
                      {(url) => (
                        <img src={url()} alt={p.title} class="h-full w-full object-cover" />
                      )}
                    </Show>
                  </div>
                  <div class="min-w-0">
                    <A
                      href={`/admin/projects/${p.id}`}
                      class="text-body font-semibold text-bf-text hover:text-bf-accent"
                    >
                      {p.title}
                    </A>
                    <p class="mb-2 text-caption text-bf-text-muted">{p.slug}</p>
                    <ProjectStatusBadges project={p} />
                  </div>
                </div>
                <div class="flex flex-wrap gap-2">
                  <A href={`/admin/projects/${p.id}`}>
                    <Button type="button" variant="outline">
                      View
                    </Button>
                  </A>
                  <A href={`/admin/projects/${p.id}/edit`}>
                    <Button type="button" variant="outline">
                      Edit
                    </Button>
                  </A>
                  <Button type="button" variant="ghost" onClick={() => move(p, -1)} aria-label="Move up">
                    ↑
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => move(p, 1)} aria-label="Move down">
                    ↓
                  </Button>
                  <Button type="button" variant="danger" onClick={() => setDeleteId(p.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </For>
        </div>
      </QueryState>

      <ConfirmDialog
        open={!!deleteId()}
        title="Delete project"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
