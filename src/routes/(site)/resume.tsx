import { Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import ModernSplitResume from "~/components/resume/ModernSplitResume";
import { Container } from "~/components/ui";
import QueryState from "~/components/ui/QueryState";
import { getResumeQuery } from "~/lib/api/public-queries";
import { usePublicQueryResource } from "~/lib/api/use-public-query";
import { hasResumeIdentity } from "~/lib/resume/resume-visibility";

export default function ResumePage() {
  const resume = usePublicQueryResource(() => getResumeQuery());

  const doc = () => resume.data();
  const isEmpty = () => {
    const d = doc();
    return d != null && !hasResumeIdentity(d);
  };

  const print = () => window.print();

  return (
    <>
      <Show
        when={doc()}
        fallback={<Title>Resume</Title>}
      >
        {(d) => <Title>{`${d().personal.fullName} — Resume`}</Title>}
      </Show>
      <Meta name="robots" content="noindex, nofollow" />
      <Meta name="description" content="Resume print view (noindex)." />

      <div class="border-b border-bf-border bg-bf-bg-elevated resume-toolbar">
        <Container class="flex flex-wrap items-center justify-between gap-3 py-3">
          <p class="text-caption text-bf-text-muted">Modern Split resume — print or save as PDF.</p>
          <button
            type="button"
            class="inline-flex h-9 items-center justify-center border border-bf-accent px-4 text-caption font-semibold text-bf-accent hover:bg-bf-accent-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
            onClick={print}
          >
            Print / Save PDF
          </button>
        </Container>
      </div>

      <div class="bg-neutral-300 py-8 sm:py-12">
        <Container>
          <QueryState
            loading={resume.loading()}
            error={resume.error()}
            empty={isEmpty()}
            loadingMessage="Loading resume…"
            errorMessage="Could not load resume. Check that the API is running and try again."
            emptyMessage="Resume is not available yet."
          >
            <Show when={doc()}>{(d) => <ModernSplitResume doc={d()} />}</Show>
          </QueryState>
        </Container>
      </div>
    </>
  );
}
