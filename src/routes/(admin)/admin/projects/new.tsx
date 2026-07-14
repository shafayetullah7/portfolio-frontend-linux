import { Title } from "@solidjs/meta";
import { A, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import ProjectForm, { emptyProjectForm } from "~/components/admin/projects/ProjectForm";
import { formToApiBody, formsEqual } from "~/components/admin/projects/project-form-utils";
import Button from "~/components/ui/Button";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { Project } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";
import { projectSchema } from "~/schemas/admin/project.schema";

export default function AdminProjectNewPage() {
  const navigate = useNavigate();
  const [form, setForm] = createSignal(emptyProjectForm());
  const [initial] = createSignal(emptyProjectForm());
  const [slugTouched, setSlugTouched] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");

  const dirty = () => !formsEqual(form(), initial());
  const set = (patch: Partial<ReturnType<typeof emptyProjectForm>>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const cancel = () => {
    if (dirty() && !confirm("Discard unsaved changes?")) return;
    navigate("/admin/projects");
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
      const created = (await adminApi.createProject(formToApiBody(f))) as Project;
      navigate(`/admin/projects/${created.id}`);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Title>Admin — New Project</Title>
      <p class="mb-2 text-caption text-bf-text-muted">
        <A href="/admin/projects" class="hover:text-bf-accent">
          Projects
        </A>{" "}
        / New
      </p>
      <h1 class="mb-6 text-heading text-bf-text">Create_Project</h1>

      <ProjectForm
        form={form}
        onChange={set}
        mode="create"
        slugTouched={slugTouched()}
        onSlugTouched={() => setSlugTouched(true)}
        dirty={dirty()}
      />

      {error() && <p class="mt-4 text-body text-bf-error">{error()}</p>}

      <div class="sticky bottom-0 mt-8 flex flex-wrap justify-end gap-2 border-t border-bf-border bg-bf-bg py-4">
        <Button type="button" variant="ghost" disabled={saving()} onClick={cancel}>
          Cancel
        </Button>
        <Button type="button" disabled={saving()} onClick={save}>
          {saving() ? "Saving..." : "Save"}
        </Button>
      </div>
    </>
  );
}
