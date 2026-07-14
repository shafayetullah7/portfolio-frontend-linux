import { Title } from "@solidjs/meta";
import { A, useNavigate, useParams } from "@solidjs/router";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import ProjectForm from "~/components/admin/projects/ProjectForm";
import {
  formToApiBody,
  formsEqual,
  projectToForm,
} from "~/components/admin/projects/project-form-utils";
import Button from "~/components/ui/Button";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";
import { projectSchema } from "~/schemas/admin/project.schema";

export default function AdminProjectEditPage() {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project] = createResource(() => params.id, (id) => adminApi.getProject(id));
  const [form, setForm] = createSignal(
    projectToForm({
      id: "",
      title: "",
      slug: "",
      stack: "",
      description: "",
      status: "active",
      features: [],
    }),
  );
  const [initial, setInitial] = createSignal(form());
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");

  createEffect(() => {
    const p = project();
    if (!p) return;
    const next = projectToForm(p);
    setForm(next);
    setInitial(next);
  });

  const dirty = () => !formsEqual(form(), initial());
  const set = (patch: Partial<ReturnType<typeof projectToForm>>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const cancel = () => {
    if (dirty() && !confirm("Discard unsaved changes?")) return;
    navigate(`/admin/projects/${params.id}`);
  };

  const save = async () => {
    const f = form();
    const parsed = projectSchema.safeParse(f);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid form");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await adminApi.updateProject(params.id, formToApiBody(f));
      navigate(`/admin/projects/${params.id}`);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Title>Admin — Edit Project</Title>
      <p class="mb-2 text-caption text-bf-text-muted">
        <A href="/admin/projects" class="hover:text-bf-accent">
          Projects
        </A>
        <Show when={project()?.title}>
          {(title) => (
            <>
              {" "}
              /{" "}
              <A href={`/admin/projects/${params.id}`} class="hover:text-bf-accent">
                {title()}
              </A>
            </>
          )}
        </Show>{" "}
        / Edit
      </p>
      <h1 class="mb-6 text-heading text-bf-text">Edit_Project</h1>

      <QueryState
        loading={project.loading}
        error={project.error}
        empty={!project() && !project.loading && !project.error}
        loadingMessage="Loading project..."
        emptyMessage="Project not found."
      >
        <ProjectForm form={form} onChange={set} mode="edit" dirty={dirty()} />
      </QueryState>

      <Show when={error()}>
        {(msg) => <p class="mt-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <Show when={project()}>
        <div class="sticky bottom-0 mt-8 flex flex-wrap justify-end gap-2 border-t border-bf-border bg-bf-bg py-4">
          <Button type="button" variant="ghost" disabled={saving()} onClick={cancel}>
            Cancel
          </Button>
          <Button type="button" disabled={saving()} onClick={save}>
            {saving() ? "Saving..." : "Save"}
          </Button>
        </div>
      </Show>
    </>
  );
}
