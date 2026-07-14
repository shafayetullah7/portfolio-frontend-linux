import { Title } from "@solidjs/meta";
import { A, useNavigate, useParams } from "@solidjs/router";
import { createResource, createSignal, For, Show } from "solid-js";
import ProjectStatusBadges from "~/components/admin/projects/ProjectStatusBadges";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";

export default function AdminProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = createSignal(false);
  const [error, setError] = createSignal("");
  const [project] = createResource(() => params.id, (id) => adminApi.getProject(id));

  const remove = async () => {
    setError("");
    try {
      await adminApi.deleteProject(params.id);
      navigate("/admin/projects");
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <Title>Admin — Project</Title>
      <p class="mb-2 text-caption text-bf-text-muted">
        <A href="/admin/projects" class="hover:text-bf-accent">
          Projects
        </A>
        <Show when={project()?.title}>
          {(title) => <> / {title()}</>}
        </Show>
      </p>
      <h1 class="mb-6 text-heading text-bf-text">Project_Detail</h1>

      <QueryState
        loading={project.loading}
        error={project.error}
        empty={!project() && !project.loading && !project.error}
        loadingMessage="Loading project..."
        emptyMessage="Project not found."
      >
        <Show when={project()}>
          {(p) => (
            <>
              <div class="mb-6 flex flex-wrap gap-2">
                <A href="/admin/projects">
                  <Button type="button" variant="ghost">
                    Back
                  </Button>
                </A>
                <A href={`/admin/projects/${p().id}/edit`}>
                  <Button type="button" variant="outline">
                    Edit
                  </Button>
                </A>
                <Show when={p().published}>
                  <a href={`/projects/${p().slug}`} target="_blank" rel="noopener noreferrer">
                    <Button type="button" variant="outline">
                      Preview public
                    </Button>
                  </a>
                </Show>
                <Button type="button" variant="danger" onClick={() => setDeleteOpen(true)}>
                  Delete
                </Button>
              </div>

              <Show when={error()}>
                {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
              </Show>

              <div class="max-w-2xl space-y-4 border border-bf-border bg-bf-surface p-5">
                <div>
                  <h2 class="text-heading text-bf-text">{p().title}</h2>
                  <p class="text-caption text-bf-text-muted">{p().slug}</p>
                </div>
                <ProjectStatusBadges project={p()} />
                <p class="text-body text-bf-text">{p().description}</p>
                <p class="text-caption text-bf-text-muted">Stack: {p().stack}</p>
                <Show when={p().features?.length}>
                  <ul class="list-inside list-disc space-y-1 text-body text-bf-text-muted">
                    <For each={p().features}>{(f) => <li>{f.content}</li>}</For>
                  </ul>
                </Show>
                <Show when={p().screenshotUrl}>
                  {(url) => (
                    <img
                      src={url()}
                      alt={p().title}
                      class="max-h-64 w-full border border-bf-border object-cover"
                    />
                  )}
                </Show>
              </div>
            </>
          )}
        </Show>
      </QueryState>

      <ConfirmDialog
        open={deleteOpen()}
        title="Delete project"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
