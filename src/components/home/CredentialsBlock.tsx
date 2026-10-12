import { createMemo, For, Show } from "solid-js";
import { Container, SectionHeader, Tag } from "~/components/ui";
import {
  getCertificationsQuery,
  getInterestsQuery,
  getLanguagesQuery,
} from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import { formatResumeMonthYear } from "~/lib/resume/format-resume-date";
import { sortBySortOrder } from "~/lib/sort-by-sort-order";

export default function CredentialsBlock() {
  const certifications = usePublicQueryResource(() => getCertificationsQuery());
  const languages = usePublicQueryResource(() => getLanguagesQuery());
  const interests = usePublicQueryResource(() => getInterestsQuery());

  const certList = () => {
    if (certifications.error() || !certifications.data()?.length) return [];
    return sortBySortOrder(certifications.data()!);
  };

  const languageList = () => {
    if (languages.error() || !languages.data()?.length) return [];
    return sortBySortOrder(languages.data()!);
  };

  const interestList = () => {
    if (interests.error() || !interests.data()?.length) return [];
    return sortBySortOrder(interests.data()!);
  };

  const anyLoading = () =>
    certifications.loading() || languages.loading() || interests.loading();

  const hasContent = createMemo(() => {
    if (anyLoading()) return false;
    return (
      certList().length > 0 || languageList().length > 0 || interestList().length > 0
    );
  });

  const formatCertDate = (iso: string | null) => {
    if (!iso?.trim()) return "";
    return formatResumeMonthYear(iso.trim().slice(0, 10));
  };

  return (
    <Show
      when={hasContent()}
      fallback={
        <Show when={anyLoading()}>
          <section
            class="border-t border-bf-border py-16 sm:py-24"
            aria-busy="true"
            aria-label="Loading credentials"
          >
            <Container>
              <div class="mb-8 h-6 w-48 animate-pulse bg-bf-border" />
              <div class="h-24 w-full max-w-2xl animate-pulse bg-bf-border" />
            </Container>
          </section>
        </Show>
      }
    >
      <section id="credentials" class="scroll-mt-20 border-t border-bf-border py-16 sm:py-24">
        <Container>
          <SectionHeader
            title="Credentials"
            caption="Certifications, languages, and interests."
          />

          <div class="flex flex-col gap-10">
            <Show when={certList().length > 0}>
              <div>
                <h3 class="mb-4 text-caption uppercase tracking-wider text-bf-text-muted">
                  Certifications
                </h3>
                <ul class="flex flex-col gap-4">
                  <For each={certList()}>
                    {(cert) => (
                      <li class="border-l-2 border-bf-accent pl-4">
                        <p class="text-heading text-bf-text">{cert.name}</p>
                        <p class="text-body text-bf-text-muted">
                          {cert.issuer}
                          <Show when={formatCertDate(cert.date)}>
                            {(d) => <span> · {d()}</span>}
                          </Show>
                        </p>
                        <Show when={cert.url?.trim()}>
                          {(url) => (
                            <a
                              href={url()}
                              target="_blank"
                              rel="noopener noreferrer"
                              class="mt-1 inline-block text-caption text-bf-accent no-underline hover:underline"
                            >
                              View credential
                            </a>
                          )}
                        </Show>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </Show>

            <Show when={languageList().length > 0}>
              <div>
                <h3 class="mb-4 text-caption uppercase tracking-wider text-bf-text-muted">
                  Languages
                </h3>
                <div class="flex flex-wrap gap-2">
                  <For each={languageList()}>
                    {(lang) => <Tag>{lang.name} — {lang.level}</Tag>}
                  </For>
                </div>
              </div>
            </Show>

            <Show when={interestList().length > 0}>
              <div>
                <h3 class="mb-4 text-caption uppercase tracking-wider text-bf-text-muted">
                  Interests
                </h3>
                <div class="flex flex-wrap gap-2">
                  <For each={interestList()}>
                    {(item) => <Tag>{item.name}</Tag>}
                  </For>
                </div>
              </div>
            </Show>
          </div>
        </Container>
      </section>
    </Show>
  );
}
