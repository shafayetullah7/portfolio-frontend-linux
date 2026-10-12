import { For } from "solid-js";
import FeatureListEditor from "~/components/admin/projects/FeatureListEditor";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Textarea from "~/components/ui/Textarea";

export type ExperienceProjectFormRow = {
  name: string;
  projectDescription: string;
  format: "bullets" | "paragraph";
  description: string;
  bullets: string[];
  liveLink: string;
};

export const emptyExperienceProject = (): ExperienceProjectFormRow => ({
  name: "",
  projectDescription: "",
  format: "bullets",
  description: "",
  bullets: [],
  liveLink: "",
});

interface ExperienceProjectsEditorProps {
  items: ExperienceProjectFormRow[];
  onChange: (items: ExperienceProjectFormRow[]) => void;
}

export default function ExperienceProjectsEditor(props: ExperienceProjectsEditorProps) {
  const updateAt = (index: number, patch: Partial<ExperienceProjectFormRow>) => {
    const next = props.items.map((row, i) => (i === index ? { ...row, ...patch } : row));
    props.onChange(next);
  };

  const removeAt = (index: number) => {
    props.onChange(props.items.filter((_, i) => i !== index));
  };

  const move = (index: number, dir: -1 | 1) => {
    const swap = index + dir;
    if (swap < 0 || swap >= props.items.length) return;
    const next = [...props.items];
    const tmp = next[index];
    next[index] = next[swap];
    next[swap] = tmp;
    props.onChange(next);
  };

  return (
    <div class="space-y-4">
      <div class="flex items-center justify-between gap-2">
        <p class="text-caption text-bf-text-muted">Sub-projects (site + resume)</p>
        <Button
          type="button"
          variant="outline"
          onClick={() => props.onChange([...props.items, emptyExperienceProject()])}
        >
          Add sub-project
        </Button>
      </div>
      <For each={props.items}>
        {(row, index) => (
          <div class="space-y-3 border border-bf-border bg-bf-bg p-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="text-caption text-bf-accent">Sub-project {index() + 1}</span>
              <div class="flex gap-1">
                <Button type="button" variant="ghost" onClick={() => move(index(), -1)} aria-label="Move up">
                  ↑
                </Button>
                <Button type="button" variant="ghost" onClick={() => move(index(), 1)} aria-label="Move down">
                  ↓
                </Button>
                <Button type="button" variant="danger" onClick={() => removeAt(index())}>
                  Remove
                </Button>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted">Name</label>
              <Input
                value={row.name}
                onInput={(e) => updateAt(index(), { name: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted">Short description (site)</label>
              <Textarea
                rows={2}
                value={row.projectDescription}
                onInput={(e) => updateAt(index(), { projectDescription: e.currentTarget.value })}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted">Resume format</label>
              <Select
                options={[
                  { value: "bullets", label: "Bullets" },
                  { value: "paragraph", label: "Paragraph" },
                ]}
                value={row.format}
                onChange={(e) =>
                  updateAt(index(), { format: e.currentTarget.value as "bullets" | "paragraph" })
                }
              />
            </div>
            {row.format === "paragraph" ? (
              <div>
                <label class="mb-1 block text-caption text-bf-text-muted">Resume paragraph</label>
                <Textarea
                  rows={3}
                  value={row.description}
                  onInput={(e) => updateAt(index(), { description: e.currentTarget.value })}
                />
              </div>
            ) : (
              <FeatureListEditor
                label="Resume bullets"
                items={row.bullets}
                onChange={(bullets) => updateAt(index(), { bullets })}
                placeholder="Bullet"
              />
            )}
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted">Live link (optional)</label>
              <Input
                value={row.liveLink}
                onInput={(e) => updateAt(index(), { liveLink: e.currentTarget.value })}
              />
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
