import { Meta, Title } from "@solidjs/meta";
import { A, useSearchParams } from "@solidjs/router";
import { Show } from "solid-js";
import ClassicResume from "~/components/resume/ClassicResume";
import ModernSplitResume from "~/components/resume/ModernSplitResume";
import { Container } from "~/components/ui";
import { getResumeQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import { formatResumeDocumentTitle } from "~/lib/resume/resume-document-title";
import { resumeErrorMessage } from "~/lib/resume/resume-error-message";
import { hasResumeIdentity } from "~/lib/resume/resume-visibility";
import { useResumeDocumentTitle } from "~/lib/resume/use-resume-document-title";

export type ResumeTheme = "modern" | "classic";

function parseResumeTheme(raw: string | string[] | undefined): ResumeTheme {
  const value = Array.isArray(raw) ? raw[0] : raw;
  return value === "classic" ? "classic" : "modern";
}

function ResumePageSkeleton() {
  return (
    <div class="resume-page-skeleton" aria-busy="true" aria-label="Loading resume">
      <div class="resume-page-skeleton__paper">
        <div class="resume-page-skeleton__block resume-page-skeleton__block--wide" />
        <div class="resume-page-skeleton__block" />
        <div class="resume-page-skeleton__block" />
      </div>
    </div>
  );
}

export default function ResumePage() {
  const [searchParams] = useSearchParams();
  const theme = () => parseResumeTheme(searchParams.theme);

  const resume = usePublicQueryResource(() => getResumeQuery());

  const doc = () => resume.data();
  const isReady = () => {
    const d = doc();
    return d != null && hasResumeIdentity(d);
  };
  const isEmpty = () => {
    const d = doc();
    return d != null && !hasResumeIdentity(d);
  };

  const titleForDoc = () => {
    const d = doc();
    if (!d || !hasResumeIdentity(d)) return "Resume";
    return formatResumeDocumentTitle(d.personal.fullName);
  };

  useResumeDocumentTitle(() => {
    const d = doc();
    return d && hasResumeIdentity(d) ? d.personal.fullName : undefined;
  });

  const print = () => {
    if (!isReady()) return;
    window.print();
  };

  const themeLinkClass = (t: ResumeTheme) =>
    `inline-flex h-9 items-center justify-center border px-4 text-caption font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50 ${
      theme() === t
        ? "border-bf-accent bg-bf-accent-dim text-bf-accent"
        : "border-bf-border text-bf-text-muted hover:text-bf-text"
    }`;

  return (
    <>
      <Title>{titleForDoc()}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Meta name="description" content="Printable resume view (noindex)." />

      <div class="border-b border-bf-border bg-bf-bg-elevated resume-toolbar">
        <Container class="flex flex-col gap-3 py-3">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <p class="text-caption text-bf-text-muted">
              {theme() === "classic"
                ? "Classic single-column layout — companion for parsers, not an ATS guarantee."
                : "Modern Split resume — open print or save as PDF from your browser."}
            </p>
            <Show when={isReady()}>
              <button
                type="button"
                class="inline-flex h-9 items-center justify-center border border-bf-accent px-4 text-caption font-semibold text-bf-accent hover:bg-bf-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
                onClick={print}
                aria-label="Print or save as PDF"
              >
                Print / Save PDF
              </button>
            </Show>
          </div>
          <div class="flex flex-wrap gap-2" role="group" aria-label="Resume layout theme">
            <A href="/resume" class={themeLinkClass("modern")}>Modern Split</A>
            <A href="/resume?theme=classic" class={themeLinkClass("classic")}>
              Classic (single column)
            </A>
          </div>
        </Container>
      </div>

      <main class="resume-preview-stage" id="resume-main">
        <div class="resume-preview-inner">
          <Show when={resume.loading()}>
            <ResumePageSkeleton />
          </Show>

          <Show when={!resume.loading() && resume.error()}>
            <p class="resume-state-message resume-state-message--error" role="alert">
              {resumeErrorMessage(resume.error())}
            </p>
          </Show>

          <Show when={!resume.loading() && !resume.error() && isEmpty()}>
            <p class="resume-state-message">Resume is not available yet.</p>
          </Show>

          <Show when={isReady()}>
            <Show when={doc()}>
              {(d) =>
                theme() === "classic" ? (
                  <ClassicResume doc={d()} />
                ) : (
                  <ModernSplitResume doc={d()} />
                )
              }
            </Show>
          </Show>
        </div>
      </main>
    </>
  );
}
