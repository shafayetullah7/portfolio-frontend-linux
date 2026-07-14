import { For, Show } from "solid-js";
import { Container, SectionHeader, Tag } from "~/components/ui";
import { useClientResource } from "~/lib/api/client-resource";
import { getExperience } from "~/lib/api/endpoints/public";
import type { ExperienceEntry } from "~/lib/api/types/portfolio.types";

function formatMonth(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 7) || iso;
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function dateRange(entry: ExperienceEntry): string {
  const start = formatMonth(entry.startDate);
  const end = entry.endDate ? formatMonth(entry.endDate) : "Present";
  return `${start} → ${end}`;
}

export default function ExperienceLog() {
  const experience = useClientResource(() => getExperience());

  const entries = () => {
    const list = experience.data();
    if (!list?.length) return [];
    return [...list].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  };

  return (
    <Show
      when={!experience.loading() && !experience.error() && entries().length > 0}
      fallback={
        <Show when={experience.loading()}>
          <section class="border-t border-bf-border py-16 sm:py-24" aria-busy="true" aria-label="Loading experience">
            <Container>
              <div class="mb-8 h-6 w-48 animate-pulse bg-bf-border" />
              <div class="space-y-6">
                <div class="h-24 w-full max-w-2xl animate-pulse bg-bf-border" />
                <div class="h-24 w-full max-w-2xl animate-pulse bg-bf-border" />
              </div>
            </Container>
          </section>
        </Show>
      }
    >
      <section id="experience" class="scroll-mt-20 border-t border-bf-border py-16 sm:py-24">
        <Container>
          <SectionHeader
            title="Experience_Log"
            caption="Roles and systems owned along the way."
          />
          <ul class="flex flex-col gap-10">
            <For each={entries()}>
              {(entry) => (
                <li class="border-l-2 border-bf-accent pl-4">
                  <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 class="text-heading text-bf-text">{entry.role}</h3>
                    <span class="text-body text-bf-accent">{entry.company}</span>
                  </div>
                  <p class="mt-1 text-caption text-bf-text-muted">
                    {dateRange(entry)}
                    <Show when={entry.level}>
                      <span class="text-bf-text-muted"> · {entry.level}</span>
                    </Show>
                  </p>
                  <Show when={entry.responsibilities?.length}>
                    <ul class="mt-3 list-inside list-disc space-y-1 text-body text-bf-text-muted">
                      <For each={entry.responsibilities}>
                        {(r) => <li>{r.content}</li>}
                      </For>
                    </ul>
                  </Show>
                  <Show when={entry.techTags?.length}>
                    <div class="mt-3 flex flex-wrap gap-2">
                      <For each={entry.techTags}>{(t) => <Tag>{t.tag}</Tag>}</For>
                    </div>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </Container>
      </section>
    </Show>
  );
}
