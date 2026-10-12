import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { Skill } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

export default function AdminSkillsPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [skills] = createResource(refresh, () => adminApi.listSkills());
  const [editing, setEditing] = createSignal<Skill | null>(null);
  const [creating, setCreating] = createSignal(false);
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");

  const reload = () => setRefresh((v) => v + 1);

  const [name, setName] = createSignal("");
  const [category, setCategory] = createSignal("");
  const [level, setLevel] = createSignal(50);
  const [sortOrder, setSortOrder] = createSignal(0);
  const [includeOnResume, setIncludeOnResume] = createSignal(true);

  const closeModal = () => {
    setCreating(false);
    setEditing(null);
    setError("");
  };

  const openCreate = () => {
    setName("");
    setCategory("");
    setLevel(50);
    setSortOrder(skills()?.length ?? 0);
    setIncludeOnResume(true);
    setError("");
    setCreating(true);
  };

  const openEdit = (s: Skill) => {
    setName(s.name);
    setCategory(s.category);
    setLevel(s.level);
    setSortOrder(s.sortOrder);
    setIncludeOnResume(s.includeOnResume ?? true);
    setError("");
    setEditing(s);
  };

  const save = async () => {
    const body = {
      name: name(),
      category: category(),
      level: level(),
      sortOrder: sortOrder(),
      includeOnResume: includeOnResume(),
    };
    setError("");
    try {
      if (editing()) {
        await adminApi.updateSkill(editing()!.id, body);
      } else {
        await adminApi.createSkill(body);
      }
      closeModal();
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed");
    }
  };

  const move = async (skill: Skill, dir: -1 | 1) => {
    const list = [...(skills() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = list.findIndex((s) => s.id === skill.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setError("");
    try {
      await adminApi.updateSkill(skill.id, { sortOrder: swap.sortOrder });
      await adminApi.updateSkill(swap.id, { sortOrder: skill.sortOrder });
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Reorder failed");
    }
  };

  const remove = async () => {
    const id = deleteId();
    if (!id) return;
    setError("");
    try {
      await adminApi.deleteSkill(id);
      setDeleteId(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <Title>Admin — Skills</Title>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="mb-1 text-heading text-bf-text">Skills</h1>
          <p class="text-body text-bf-text-muted">Capabilities shown on the public site.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          New skill
        </Button>
      </div>

      <Show when={error() && !creating() && !editing()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={skills.loading}
        error={skills.error}
        empty={!skills.loading && !skills.error && !(skills()?.length)}
        loadingMessage="Loading skills..."
        emptyMessage="No skills yet."
      >
        <div class="space-y-2">
          <For each={[...(skills() ?? [])].sort((a, b) => a.sortOrder - b.sortOrder)}>
            {(s) => (
              <div class="flex flex-col gap-3 border border-bf-border bg-bf-surface p-3 sm:flex-row sm:items-center sm:justify-between">
                <span class="min-w-0 text-body text-bf-text">
                  {s.name} — {s.level}% ({s.category})
                </span>
                <div class="flex flex-wrap gap-2">
                  <Button type="button" variant="ghost" onClick={() => move(s, -1)} aria-label="Move up">
                    ↑
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => move(s, 1)} aria-label="Move down">
                    ↓
                  </Button>
                  <Button type="button" variant="outline" onClick={() => openEdit(s)}>
                    Edit
                  </Button>
                  <Button type="button" variant="danger" onClick={() => setDeleteId(s.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </For>
        </div>
      </QueryState>

      <Modal open={creating() || !!editing()} onClose={closeModal} title={editing() ? "Edit skill" : "Create skill"}>
        <div class="space-y-3">
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="skill-name">
              Name
            </label>
            <Input id="skill-name" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="skill-category">
              Category
            </label>
            <Input
              id="skill-category"
              value={category()}
              onInput={(e) => setCategory(e.currentTarget.value)}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="skill-level">
              Level (0–100)
            </label>
            <Input
              id="skill-level"
              type="number"
              min={0}
              max={100}
              value={level()}
              onInput={(e) => setLevel(Number(e.currentTarget.value))}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="skill-sort">
              Sort order
            </label>
            <Input
              id="skill-sort"
              type="number"
              value={sortOrder()}
              onInput={(e) => setSortOrder(Number(e.currentTarget.value))}
            />
          </div>
          <AdminFieldHint variant="fact" class="mb-1" />
          <label class="flex items-center gap-2 text-body text-bf-text" for="skill-include-resume">
            <input
              id="skill-include-resume"
              type="checkbox"
              class="accent-[var(--color-bf-accent)]"
              checked={includeOnResume()}
              onChange={(e) => setIncludeOnResume(e.currentTarget.checked)}
            />
            Include on resume PDF
          </label>
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
        title="Delete skill"
        message="This cannot be undone."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
