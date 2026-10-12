import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import AdminFormSection from "~/components/admin/AdminFormSection";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import Select from "~/components/ui/Select";
import Textarea from "~/components/ui/Textarea";
import { adminApi } from "~/lib/api/endpoints/admin";
import type {
  ResumeSectionLabels,
  ResumeSectionVisibility,
  ResumeSettings,
} from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";
import {
  DEFAULT_RESUME_SECTION_LABELS,
  DEFAULT_RESUME_SECTION_VISIBILITY,
} from "~/lib/resume/resume-settings-defaults";

const LABEL_KEYS = Object.keys(DEFAULT_RESUME_SECTION_LABELS) as (keyof ResumeSectionLabels)[];

const VISIBILITY_KEYS = Object.keys(
  DEFAULT_RESUME_SECTION_VISIBILITY,
) as (keyof ResumeSectionVisibility)[];

const visibilityLabel: Record<keyof ResumeSectionVisibility, string> = {
  summary: "Profile summary",
  experience: "Experience",
  projects: "Projects",
  skills: "Skills",
  education: "Education",
  certifications: "Certifications",
  languages: "Languages",
  interests: "Interests",
};

export default function AdminResumeSettingsPanel() {
  const [settings, { mutate }] = createResource(() => adminApi.getResumeSettings());
  const [saving, setSaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [labels, setLabels] = createSignal<ResumeSectionLabels>({ ...DEFAULT_RESUME_SECTION_LABELS });
  const [visibility, setVisibility] = createSignal<ResumeSectionVisibility>({
    ...DEFAULT_RESUME_SECTION_VISIBILITY,
  });
  const [interestsFormat, setInterestsFormat] = createSignal<"bullets" | "paragraph">("bullets");
  const [interestsParagraph, setInterestsParagraph] = createSignal("");
  const [hydrated, setHydrated] = createSignal(false);

  const hydrateFrom = (s: ResumeSettings) => {
    setLabels({ ...s.sectionLabels });
    setVisibility({ ...s.sectionVisibility });
    setInterestsFormat(s.interestsFormat);
    setInterestsParagraph(s.interestsParagraph ?? "");
    setHydrated(true);
  };

  createEffect(() => {
    const s = settings();
    if (s && !hydrated()) hydrateFrom(s);
  });

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await adminApi.updateResumeSettings({
        sectionLabels: labels(),
        sectionVisibility: visibility(),
        interestsFormat: interestsFormat(),
        interestsParagraph: interestsParagraph(),
      });
      mutate(updated);
      hydrateFrom(updated);
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminFormSection title="Settings">
      <Show when={settings.error}>
        <p class="text-body text-bf-error">Failed to load resume settings.</p>
      </Show>
      <Show when={!settings.loading && settings()}>
        <div class="space-y-6">
          <div>
            <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-caption text-bf-accent">Section labels (PDF)</h3>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLabels({ ...DEFAULT_RESUME_SECTION_LABELS })}
              >
                Reset to defaults
              </Button>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <For each={LABEL_KEYS}>
                {(key) => (
                  <div>
                    <label class="mb-1 block text-caption text-bf-text-muted">{key}</label>
                    <Input
                      value={labels()[key]}
                      onInput={(e) =>
                        setLabels((prev) => ({ ...prev, [key]: e.currentTarget.value }))
                      }
                    />
                  </div>
                )}
              </For>
            </div>
          </div>

          <div>
            <h3 class="mb-2 text-caption text-bf-accent">Section visibility (PDF)</h3>
            <div class="space-y-2">
              <For each={VISIBILITY_KEYS}>
                {(key) => (
                  <label class="flex items-center gap-2 text-body text-bf-text">
                    <input
                      type="checkbox"
                      class="accent-[var(--color-bf-accent)]"
                      checked={visibility()[key]}
                      onChange={(e) =>
                        setVisibility((prev) => ({ ...prev, [key]: e.currentTarget.checked }))
                      }
                    />
                    {visibilityLabel[key]}
                  </label>
                )}
              </For>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-caption text-bf-accent">Interests (resume)</h3>
            <p class="text-caption text-bf-text-muted">
              Paragraph mode is resume-only and does not appear on the public site.
            </p>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted">Format</label>
              <Select
                options={[
                  { value: "bullets", label: "Bullets / list" },
                  { value: "paragraph", label: "Paragraph" },
                ]}
                value={interestsFormat()}
                onChange={(e) =>
                  setInterestsFormat(e.currentTarget.value as "bullets" | "paragraph")
                }
              />
            </div>
            <Show when={interestsFormat() === "paragraph"}>
              <div>
                <label class="mb-1 block text-caption text-bf-text-muted">Interests paragraph</label>
                <Textarea
                  rows={4}
                  value={interestsParagraph()}
                  onInput={(e) => setInterestsParagraph(e.currentTarget.value)}
                />
              </div>
            </Show>
          </div>

          <Show when={error()}>
            <p class="text-body text-bf-error">{error()}</p>
          </Show>

          <Button type="button" onClick={save} disabled={saving()}>
            {saving() ? "Saving…" : "Save settings"}
          </Button>
        </div>
      </Show>
    </AdminFormSection>
  );
}
