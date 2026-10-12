import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import AdminFormSection from "~/components/admin/AdminFormSection";
import ExperienceProjectsEditor, {
  type ExperienceProjectFormRow,
} from "~/components/admin/experience/ExperienceProjectsEditor";
import FeatureListEditor from "~/components/admin/projects/FeatureListEditor";
import Textarea from "~/components/ui/Textarea";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import Input from "~/components/ui/Input";
import Modal from "~/components/ui/Modal";
import QueryState from "~/components/ui/QueryState";
import Select from "~/components/ui/Select";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { ExperienceEntry } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

export default function AdminExperiencePage() {
  const [refresh, setRefresh] = createSignal(0);
  const [entries] = createResource(refresh, () => adminApi.listExperience());
  const [editing, setEditing] = createSignal<ExperienceEntry | null>(null);
  const [creating, setCreating] = createSignal(false);
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");

  const reload = () => setRefresh((v) => v + 1);

  const emptyForm = () => ({
    company: "",
    role: "",
    location: "",
    startDate: "2024-01-01",
    endDate: "",
    level: "INFO" as "INFO" | "WARN",
    sortOrder: 0,
    includeOnResume: true,
    responsibilities: [] as string[],
    techTags: [] as string[],
    resumeBullets: [] as string[],
    resumeFormat: "bullets" as "bullets" | "paragraph",
    resumeParagraph: "",
    experienceProjects: [] as ExperienceProjectFormRow[],
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

  const openEdit = (e: ExperienceEntry) => {
    setForm({
      company: e.company,
      role: e.role,
      location: e.location ?? "",
      startDate: e.startDate.slice(0, 10),
      endDate: e.endDate ? e.endDate.slice(0, 10) : "",
      level: e.level,
      sortOrder: e.sortOrder ?? 0,
      includeOnResume: e.includeOnResume ?? true,
      responsibilities: e.responsibilities?.map((r) => r.content) ?? [],
      techTags: e.techTags?.map((t) => t.tag) ?? [],
      resumeBullets: e.resumeBullets ?? [],
      resumeFormat: e.resumeFormat ?? "bullets",
      resumeParagraph: e.resumeParagraph ?? "",
      experienceProjects:
        e.experienceProjects?.map((p) => ({
          name: p.name,
          projectDescription: p.projectDescription ?? "",
          format: p.format ?? "bullets",
          description: p.description ?? "",
          bullets: p.bullets ?? [],
          liveLink: p.liveLink ?? "",
        })) ?? [],
    });
    setError("");
    setEditing(e);
  };

  const set = (patch: Partial<ReturnType<typeof emptyForm>>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const save = async () => {
    const f = form();
    const body = {
      company: f.company,
      role: f.role,
      location: f.location.trim() || null,
      startDate: f.startDate,
      endDate: f.endDate || null,
      level: f.level,
      sortOrder: f.sortOrder,
      includeOnResume: f.includeOnResume,
      responsibilities: f.responsibilities.filter(Boolean),
      techTags: f.techTags.filter(Boolean),
      resumeBullets: f.resumeBullets.filter(Boolean).length
        ? f.resumeBullets.filter(Boolean)
        : null,
      resumeFormat: f.resumeFormat,
      resumeParagraph: f.resumeParagraph.trim() || null,
      experienceProjects: f.experienceProjects
        .filter((p) => p.name.trim())
        .map((p, sortOrder) => ({
          name: p.name.trim(),
          projectDescription: p.projectDescription.trim() || undefined,
          format: p.format,
          description: p.description.trim() || undefined,
          bullets: p.bullets.filter(Boolean).length ? p.bullets.filter(Boolean) : undefined,
          liveLink: p.liveLink.trim() || null,
          sortOrder,
        })),
    };
    setError("");
    try {
      if (editing()) {
        await adminApi.updateExperience(editing()!.id, body);
      } else {
        await adminApi.createExperience(body);
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
      await adminApi.deleteExperience(id);
      setDeleteId(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  const move = async (entry: ExperienceEntry, dir: -1 | 1) => {
    const list = [...(entries() ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
    const idx = list.findIndex((e) => e.id === entry.id);
    const swap = list[idx + dir];
    if (!swap) return;
    setError("");
    try {
      await adminApi.updateExperience(entry.id, { sortOrder: swap.sortOrder ?? idx + dir });
      await adminApi.updateExperience(swap.id, { sortOrder: entry.sortOrder ?? idx });
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Reorder failed");
    }
  };

  return (
    <>
      <Title>Admin — Experience</Title>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="mb-1 text-heading text-bf-text">Experience</h1>
          <p class="text-body text-bf-text-muted">Timeline entries for the public site.</p>
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
        loadingMessage="Loading experience..."
        emptyMessage="No experience entries yet."
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
                  {e.role} @ {e.company}
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
        title={editing() ? "Edit experience" : "Create experience"}
      >
        <div class="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
          <AdminFormSection title="Site content">
            <AdminFieldHint variant="site" />
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-company">
              Company
            </label>
            <Input
              id="exp-company"
              value={form().company}
              onInput={(e) => set({ company: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-role">
              Role
            </label>
            <Input
              id="exp-role"
              value={form().role}
              onInput={(e) => set({ role: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-location">
              Location
            </label>
            <AdminFieldHint variant="fact" class="mb-1" />
            <Input
              id="exp-location"
              maxLength={200}
              value={form().location}
              onInput={(e) => set({ location: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-start">
              Start date
            </label>
            <Input
              id="exp-start"
              type="date"
              value={form().startDate}
              onInput={(e) => set({ startDate: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-end">
              End date (optional)
            </label>
            <Input
              id="exp-end"
              type="date"
              value={form().endDate}
              onInput={(e) => set({ endDate: e.currentTarget.value })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-level">
              Level
            </label>
            <Select
              id="exp-level"
              options={[
                { value: "INFO", label: "INFO" },
                { value: "WARN", label: "WARN" },
              ]}
              value={form().level}
              onChange={(e) => set({ level: e.currentTarget.value as "INFO" | "WARN" })}
            />
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="exp-sort">
              Sort order
            </label>
            <Input
              id="exp-sort"
              type="number"
              value={form().sortOrder}
              onInput={(e) => set({ sortOrder: Number(e.currentTarget.value) })}
            />
          </div>
          <FeatureListEditor
            label="Responsibilities"
            items={form().responsibilities}
            onChange={(responsibilities) => set({ responsibilities })}
            placeholder="Responsibility"
          />
          <FeatureListEditor
            label="Tech tags"
            items={form().techTags}
            onChange={(techTags) => set({ techTags })}
            placeholder="tag"
          />
          </AdminFormSection>

          <AdminFormSection title="Resume (print)">
            <AdminFieldHint variant="resume" />
            <label class="flex items-center gap-2 text-body text-bf-text" for="exp-include-resume">
              <input
                id="exp-include-resume"
                type="checkbox"
                class="accent-[var(--color-bf-accent)]"
                checked={form().includeOnResume}
                onChange={(e) => set({ includeOnResume: e.currentTarget.checked })}
              />
              Include on resume PDF
            </label>
            <AdminFieldHint variant="fact" class="mb-1">
              When off, role stays on the site timeline but is omitted from the PDF.
            </AdminFieldHint>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="exp-resume-format">
                Resume body format
              </label>
              <Select
                id="exp-resume-format"
                options={[
                  { value: "bullets", label: "Bullets" },
                  { value: "paragraph", label: "Paragraph" },
                ]}
                value={form().resumeFormat}
                onChange={(e) =>
                  set({ resumeFormat: e.currentTarget.value as "bullets" | "paragraph" })
                }
              />
            </div>
            <Show
              when={form().resumeFormat === "paragraph"}
              fallback={
                <FeatureListEditor
                  label="Resume bullets (optional)"
                  items={form().resumeBullets}
                  onChange={(resumeBullets) => set({ resumeBullets })}
                  placeholder="Short bullet for PDF"
                />
              }
            >
              <div>
                <label class="mb-1 block text-caption text-bf-text-muted" for="exp-resume-para">
                  Resume paragraph
                </label>
                <Textarea
                  id="exp-resume-para"
                  rows={4}
                  value={form().resumeParagraph}
                  onInput={(e) => set({ resumeParagraph: e.currentTarget.value })}
                />
              </div>
            </Show>
            <ExperienceProjectsEditor
              items={form().experienceProjects}
              onChange={(experienceProjects) => set({ experienceProjects })}
            />
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
