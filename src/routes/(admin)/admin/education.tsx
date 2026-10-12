import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import AdminFormSection from "~/components/admin/AdminFormSection";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import QueryState from "~/components/ui/QueryState";
import Textarea from "~/components/ui/Textarea";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { EducationEntry } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

export default function AdminEducationPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [entries] = createResource(refresh, () => adminApi.listEducation());
  const [editing, setEditing] = createSignal<EducationEntry | null>(null);
  const [creating, setCreating] = createSignal(false);
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");

  const reload = () => setRefresh((v) => v + 1);

  const emptyForm = () => ({
    institution: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
    includeOnResume: true,
    sortOrder: 0,
  });

  const [form, setForm] = createSignal(emptyForm());

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
    setError("");
  };

  const openCreate = () => {
    setForm({ ...emptyForm(), sortOrder: entries()?.length ?? 0 });
    setError("");
    setCreating(true);
  };

  const openEdit = (e: EducationEntry) => {
    setForm({
      institution: e.institution,
      degree: e.degree,
      startDate: e.startDate ? e.startDate.slice(0, 10) : "",
      endDate: e.endDate ? e.endDate.slice(0, 10) : "",
      description: e.description ?? "",
      includeOnResume: e.includeOnResume ?? true,
      sortOrder: e.sortOrder ?? 0,
    });
    setError("");
    setEditing(e);
  };

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const save = async () => {
    const f = form();
    const body = {
      institution: f.institution,
      degree: f.degree,
      startDate: f.startDate || null,
      endDate: f.endDate || null,
      description: f.description.trim() || null,
      includeOnResume: f.includeOnResume,
      sortOrder: f.sortOrder,
    };
    setError("");
    try {
      if (editing()) {
        await adminApi.updateEducation(editing()!.id, body);
      } else {
        await adminApi.createEducation(body);
      }
      closeModal();
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed");
    }
  };

  const remove = async () => {
    const id = deleteId();
    if (!id) return;
    setError("");
    try {
      await adminApi.deleteEducation(id);
      setDeleteId(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  const move = async (entry: EducationEntry, dir: -1 | 1) => {
    const list = [...(entries() ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = list.findIndex((e) => e.id === entry.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setError("");
    try {
      await adminApi.updateEducation(entry.id, { sortOrder: swap.sortOrder ?? idx + dir });
      await adminApi.updateEducation(swap.id, { sortOrder: entry.sortOrder ?? idx });
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Reorder failed");
    }
  };

  return (
    <>
      <Title>Admin — Education</Title>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="mb-1 text-heading text-bf-text">Education</h1>
          <p class="text-body text-bf-text-muted">Degrees and training for the site and resume.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          New entry
        </Button>
      </div>

      <Show when={error() && !creating() && !editing()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={entries.loading}
        error={entries.error}
        empty={!entries.loading && !entries.error && !(entries()?.length)}
        loadingMessage="Loading education..."
        emptyMessage="No education entries yet."
      >
        <div class="space-y-2">
          <For
            each={[...(entries() ?? [])].sort(
              (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
            )}
          >
            {(e) => (
              <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                <span class="min-w-0 text-body text-bf-text">
                  {e.degree} — {e.institution}
                </span>
                <div class="flex flex-wrap gap-2">
                  <Button type="button" variant="ghost" onClick={() => move(e, -1)} aria-label="Move up">
                    ↑
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => move(e, 1)} aria-label="Move down">
                    ↓
                  </Button>
                  <Button type="button" variant="outline" onClick={() => openEdit(e)}>
                    Edit
                  </Button>
                  <Button type="button" variant="danger" onClick={() => setDeleteId(e.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </For>
        </div>
      </QueryState>

      <Modal
        open={creating() || !!editing()}
        onClose={closeModal}
        title={editing() ? "Edit education" : "Create education"}
      >
        <div class="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <AdminFormSection title="Site content">
            <AdminFieldHint variant="fact" />
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-degree">
                Degree
              </label>
              <Input
                id="edu-degree"
                value={form().degree}
                onInput={(e) => set({ degree: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-institution">
                Institution
              </label>
              <Input
                id="edu-institution"
                value={form().institution}
                onInput={(e) => set({ institution: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-start">
                Start date (optional)
              </label>
              <Input
                id="edu-start"
                type="date"
                value={form().startDate}
                onInput={(e) => set({ startDate: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-end">
                End date (optional)
              </label>
              <Input
                id="edu-end"
                type="date"
                value={form().endDate}
                onInput={(e) => set({ endDate: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-desc">
                Description (optional)
              </label>
              <AdminFieldHint variant="site" class="mb-1" />
              <Textarea
                id="edu-desc"
                rows={3}
                value={form().description}
                onInput={(e) => set({ description: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="edu-sort">
                Sort order
              </label>
              <Input
                id="edu-sort"
                type="number"
                value={form().sortOrder}
                onInput={(e) => set({ sortOrder: Number(e.currentTarget.value) })}
              />
            </div>
          </AdminFormSection>

          <AdminFormSection title="Resume (print)">
            <label class="flex items-center gap-2 text-body text-bf-text" for="edu-include-resume">
              <input
                id="edu-include-resume"
                type="checkbox"
                class="accent-[var(--color-bf-accent)]"
                checked={form().includeOnResume}
                onChange={(e) => set({ includeOnResume: e.currentTarget.checked })}
              />
              Include on resume PDF
            </label>
          </AdminFormSection>

          <Show when={error()}>
            {(msg) => <p class="text-body text-bf-error">{msg()}</p>}
          </Show>
        </div>
        <div class="mt-4 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={closeModal}>
            Cancel
          </Button>
          <Button type="button" onClick={save}>
            Save
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId()}
        title="Delete entry"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
