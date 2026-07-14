import { Accessor, createEffect, onCleanup } from "solid-js";
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
      <section class="space-y-3">
        <h2 class="text-caption text-bf-accent">Basics</h2>
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
      </section>

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
        <h2 class="text-caption text-bf-accent">Links</h2>
        <div>
          <FieldLabel id="project-repo">Repo URL</FieldLabel>
          <Input
            id="project-repo"
            value={props.form().repoUrl}
            onInput={(e) => set({ repoUrl: e.currentTarget.value })}
          />
        </div>
        <div>
          <FieldLabel id="project-docs">Live / docs URL</FieldLabel>
          <Input
            id="project-docs"
            value={props.form().docsUrl}
            onInput={(e) => set({ docsUrl: e.currentTarget.value })}
          />
        </div>
      </section>

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
