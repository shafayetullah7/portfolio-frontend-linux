import { Meta, Title } from "@solidjs/meta";
import ModernSplitSpike from "~/components/resume/ModernSplitSpike";
import { Container } from "~/components/ui";

export default function ResumeSpikePage() {
  const print = () => window.print();

  return (
    <>
      <Title>Resume — preview</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Meta name="description" content="Resume print layout spike (noindex)." />

      <div class="border-b border-bf-border bg-bf-bg-elevated resume-spike-toolbar">
        <Container class="flex flex-wrap items-center justify-between gap-3 py-3">
          <p class="text-caption text-bf-text-muted">
            R0 print spike — A4 Modern Split shell (placeholder copy).
          </p>
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
          <ModernSplitSpike />
        </Container>
      </div>
    </>
  );
}
