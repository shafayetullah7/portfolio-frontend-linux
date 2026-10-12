import { For, Show } from "solid-js";
import { Container, SectionHeader } from "~/components/ui";
import { getEducationQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import type { EducationEntry } from "~/lib/api/types/portfolio.types";
import {
  formatResumeEducationRange,
} from "~/lib/resume/format-resume-date";
import { sortBySortOrder } from "~/lib/sort-by-sort-order";

function toDateIso(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, 10);
}

function dateRange(entry: EducationEntry): string {
  return formatResumeEducationRange(
    toDateIso(entry.startDate),
    toDateIso(entry.endDate),
  );
}

export default function EducationLog() {
  const education = usePublicQueryResource(() => getEducationQuery());

  const entries = () => {
    const list = education.data();
    if (!list?.length) return [];
    return sortBySortOrder(list);
  };

  return (
    <Show
      when={!education.loading() && !education.error() && entries().length > 0}
      fallback={
        <Show when={education.loading()}>
          <section
            class="border-t border-bf-border py-16 sm:py-24"
            aria-busy="true"
            aria-label="Loading education"
          >
            <Container>
              <div class="mb-8 h-6 w-48 animate-pulse bg-bf-border" />
              <div class="space-y-6">
                <div class="h-20 w-full max-w-2xl animate-pulse bg-bf-border" />
              </div>
            </Container>
          </section>
        </Show>
      }
    >
      <section id="education" class="scroll-mt-20 border-t border-bf-border py-16 sm:py-24">
        <Container>
          <SectionHeader
            title="Education_Log"
            caption="Formal training and degrees."
          />
          <ul class="flex flex-col gap-8">
            <For each={entries()}>
              {(entry) => (
                <li class="border-l-2 border-bf-accent pl-4">
                  <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 class="text-heading text-bf-text">{entry.degree}</h3>
                    <span class="text-body text-bf-accent">{entry.institution}</span>
                  </div>
                  <Show when={dateRange(entry)}>
                    {(range) => (
                      <p class="mt-1 text-caption text-bf-text-muted">{range()}</p>
                    )}
                  </Show>
                  <Show when={entry.description?.trim()}>
                    <p class="mt-2 text-body text-bf-text-muted">{entry.description?.trim()}</p>
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
