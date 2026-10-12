import { Accessor, createEffect, For, onCleanup, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import AdminFormSection from "~/components/admin/AdminFormSection";
import MediaPicker from "~/components/admin/MediaPicker";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Textarea from "~/components/ui/Textarea";
import FeatureListEditor from "./FeatureListEditor";
import { slugify } from "./slugify";

export interface ProjectFormValues {
  title: string;
  slug: string;
  stack: string;
  description: string;
  status: string;
  repoUrl: string;
  docsUrl: string;
  buildStatus: string;
  coverage: string;
  sortOrder: number;
  published: boolean;
  screenshotMediaId: string | null;
  screenshotUrl?: string | null;
  features: string[];
  includeOnResume: boolean;
  resumeSortOrder: number;
  resumeDescription: string;
  resumeHighlights: string[];
  startDate: string;
  endDate: string;
  liveUrl: string;
  resumeLinks: Array<{ label: string; liveUrl: string; githubUrl: string }>;
}

export const emptyProjectForm = (): ProjectFormValues => ({
  title: "",
  slug: "",
  stack: "",
  description: "",
  status: "active",
  repoUrl: "",
  docsUrl: "",
  buildStatus: "",
  coverage: "",
  sortOrder: 0,
  published: false,
  screenshotMediaId: null,
  features: [],
  includeOnResume: false,
  resumeSortOrder: 0,
  resumeDescription: "",
  resumeHighlights: [],
  startDate: "",
  endDate: "",
  liveUrl: "",
  resumeLinks: [],
});

interface ProjectFormProps {
  form: Accessor<ProjectFormValues>;
  onChange: (patch: Partial<ProjectFormValues>) => void;
  mode: "create" | "edit";
  slugTouched?: boolean;
  onSlugTouched?: () => void;
  dirty?: boolean;
}

function FieldLabel(props: { id: string; children: string }) {
  return (
    <label class="mb-1 block text-caption text-bf-text-muted" for={props.id}>
      {props.children}
    </label>
  );
}

export default function ProjectForm(props: ProjectFormProps) {
  const set = (patch: Partial<ProjectFormValues>) => props.onChange(patch);

  createEffect(() => {
    if (!props.dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    onCleanup(() => window.removeEventListener("beforeunload", onBeforeUnload));
  });

  const onTitleInput = (title: string) => {
    if (props.mode === "create" && !props.slugTouched) {
      set({ title, slug: slugify(title) });
      return;
    }
    set({ title });
  };

  return (
    <div class="space-y-8">
      <AdminFormSection title="Site content">
        <AdminFieldHint variant="site" />
        <div>
          <FieldLabel id="project-title">Title</FieldLabel>
          <Input
            id="project-title"
            value={props.form().title}
            onInput={(e) => onTitleInput(e.currentTarget.value)}
          />
        </div>
        <div>
          <FieldLabel id="project-slug">Slug</FieldLabel>
          <Input
            id="project-slug"
            value={props.form().slug}
            onInput={(e) => {
              props.onSlugTouched?.();
              set({ slug: e.currentTarget.value });
            }}
          />
        </div>
        <div>
          <FieldLabel id="project-stack">Stack</FieldLabel>
          <Input
            id="project-stack"
            value={props.form().stack}
            onInput={(e) => set({ stack: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-description">Description</FieldLabel>
          <Textarea
            id="project-description"
            rows={5}
            value={props.form().description}
            onInput={(e) => set({ description: e.currentTarget.value })}
          />
        </div>
      </AdminFormSection>

      <section class="space-y-3">
        <h2 class="text-caption text-bf-accent">Screenshot</h2>
        <MediaPicker
          value={props.form().screenshotMediaId}
          onChange={(screenshotMediaId) => set({ screenshotMediaId })}
          allowUpload
        />
      </section>

      <section class="space-y-3">
        <FeatureListEditor
          label="Features"
          items={props.form().features}
          onChange={(features) => set({ features })}
          placeholder="Feature"
        />
      </section>

      <section class="space-y-3">
        <h2 class="text-caption text-bf-accent">Timeline & links</h2>
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <FieldLabel id="project-start">Start date (optional)</FieldLabel>
            <Input
              id="project-start"
              type="date"
              value={props.form().startDate}
              onInput={(e) => set({ startDate: e.currentTarget.value })}
            />
          </div>
          <div>
            <FieldLabel id="project-end">End date (optional)</FieldLabel>
            <Input
              id="project-end"
              type="date"
              value={props.form().endDate}
              onInput={(e) => set({ endDate: e.currentTarget.value })}
            />
          </div>
        </div>
        <div>
          <FieldLabel id="project-repo">Repo URL</FieldLabel>
          <Input
            id="project-repo"
            value={props.form().repoUrl}
            onInput={(e) => set({ repoUrl: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-live">Live URL (site project page)</FieldLabel>
          <AdminFieldHint variant="fact" class="mb-1">
            Shown on /projects/[slug]. On the PDF, liveUrl is used when resume link rows are empty
            (else docs/repo URLs apply per assembler rules).
          </AdminFieldHint>
          <Input
            id="project-live"
            value={props.form().liveUrl}
            onInput={(e) => set({ liveUrl: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-docs">Docs URL (fallback)</FieldLabel>
          <Input
            id="project-docs"
            value={props.form().docsUrl}
            onInput={(e) => set({ docsUrl: e.currentTarget.value })}
          />
        </div>
      </section>

      <AdminFormSection title="Resume (print)">
        <AdminFieldHint variant="resume" />
        <label class="flex items-center gap-2 text-body text-bf-text" for="project-include-resume">
          <input
            id="project-include-resume"
            type="checkbox"
            class="accent-[var(--color-bf-accent)]"
            checked={props.form().includeOnResume}
            onChange={(e) => set({ includeOnResume: e.currentTarget.checked })}
          />
          Include on resume PDF
        </label>
        <AdminFieldHint variant="fact" class="mb-1">
          Published projects can still be omitted from the PDF when this is off.
        </AdminFieldHint>
        <div>
          <FieldLabel id="project-resume-sort">Resume sort order</FieldLabel>
          <Input
            id="project-resume-sort"
            type="number"
            value={props.form().resumeSortOrder}
            onInput={(e) => set({ resumeSortOrder: Number(e.currentTarget.value) })}
          />
        </div>
        <div>
          <FieldLabel id="project-resume-desc">Resume description (short)</FieldLabel>
          <Textarea
            id="project-resume-desc"
            rows={3}
            value={props.form().resumeDescription}
            onInput={(e) => set({ resumeDescription: e.currentTarget.value })}
          />
        </div>
        <FeatureListEditor
          label="Resume highlights"
          items={props.form().resumeHighlights}
          onChange={(resumeHighlights) => set({ resumeHighlights })}
          placeholder="Highlight for PDF"
        />
        <Show when={props.form().includeOnResume}>
          <div class="space-y-3 border-t border-bf-border pt-4">
            <div class="flex items-center justify-between gap-2">
              <p class="text-caption text-bf-text-muted">Resume link rows (PDF)</p>
              <button
                type="button"
                class="text-caption text-bf-accent hover:underline"
                onClick={() =>
                  set({
                    resumeLinks: [
                      ...props.form().resumeLinks,
                      { label: "", liveUrl: "", githubUrl: "" },
                    ],
                  })
                }
              >
                Add row
              </button>
            </div>
            <For each={props.form().resumeLinks}>
              {(row, index) => (
                <div class="grid gap-2 border border-bf-border p-3 sm:grid-cols-3">
                  <Input
                    placeholder="Label"
                    value={row.label}
                    onInput={(e) => {
                      const next = [...props.form().resumeLinks];
                      next[index()] = { ...row, label: e.currentTarget.value };
                      set({ resumeLinks: next });
                    }}
                  />
                  <Input
                    placeholder="Live URL"
                    value={row.liveUrl}
                    onInput={(e) => {
                      const next = [...props.form().resumeLinks];
                      next[index()] = { ...row, liveUrl: e.currentTarget.value };
                      set({ resumeLinks: next });
                    }}
                  />
                  <div class="flex gap-2">
                    <Input
                      placeholder="GitHub URL"
                      value={row.githubUrl}
                      onInput={(e) => {
                        const next = [...props.form().resumeLinks];
                        next[index()] = { ...row, githubUrl: e.currentTarget.value };
                        set({ resumeLinks: next });
                      }}
                    />
                    <button
                      type="button"
                      class="shrink-0 text-caption text-bf-error"
                      onClick={() =>
                        set({
                          resumeLinks: props.form().resumeLinks.filter((_, i) => i !== index()),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </AdminFormSection>

      <section class="space-y-3">
        <h2 class="text-caption text-bf-accent">Publishing</h2>
        <label class="flex items-center gap-2 text-body text-bf-text" for="project-published">
          <input
            id="project-published"
            type="checkbox"
            class="accent-[var(--color-bf-accent)]"
            checked={props.form().published}
            onChange={(e) => set({ published: e.currentTarget.checked })}
          />
          Published
        </label>
        <div>
          <FieldLabel id="project-status">Status</FieldLabel>
          <Select
            id="project-status"
            options={[
              { value: "active", label: "Active" },
              { value: "wip", label: "Work in progress" },
              { value: "archived", label: "Archived" },
            ]}
            value={props.form().status}
            onChange={(e) => set({ status: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-build">Build status</FieldLabel>
          <Input
            id="project-build"
            value={props.form().buildStatus}
            onInput={(e) => set({ buildStatus: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-coverage">Coverage</FieldLabel>
          <Input
            id="project-coverage"
            value={props.form().coverage}
            onInput={(e) => set({ coverage: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-sort">Sort order</FieldLabel>
          <Input
            id="project-sort"
            type="number"
            value={props.form().sortOrder}
            onInput={(e) => set({ sortOrder: Number(e.currentTarget.value) })}
          />
        </div>
      </section>
    </div>
  );
}
