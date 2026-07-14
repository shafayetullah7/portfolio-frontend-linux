import { For } from "solid-js";
import { Container, MetricChip } from "~/components/ui";
import { useSiteContent } from "~/lib/site-content";

export default function MetricsStrip() {
  const site = useSiteContent();

  return (
    <section class="border-b border-bf-border bg-bf-bg" aria-label="Platform metrics">
      <Container class="flex flex-wrap items-start gap-10 py-10 sm:gap-16 sm:py-12">
        <For each={site.metrics()}>
          {(m) => <MetricChip value={m.value} label={m.label} />}
        </For>
      </Container>
    </section>
  );
}
