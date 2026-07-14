import { For } from "solid-js";
import { Container, MetricChip } from "~/components/ui";
import { useSiteContent } from "~/lib/site-content";

export default function MetricsStrip() {
  const site = useSiteContent();

  return (
    <section class="border-b border-bf-border bg-bf-bg" aria-label="Marketing platform metrics">
      <Container class="flex flex-col gap-4 py-10 sm:py-12">
        <p class="text-caption text-bf-text-muted">Sample targets — not live telemetry.</p>
        <div class="flex flex-wrap items-start gap-10 sm:gap-16">
          <For each={site.metrics()}>
            {(m) => <MetricChip value={m.value} label={m.label} />}
          </For>
        </div>
      </Container>
    </section>
  );
}
