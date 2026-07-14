import { For } from "solid-js";
import { Container, MetricChip } from "~/components/ui";
import { siteConfig } from "~/content/site.config";

export default function MetricsStrip() {
  return (
    <section class="border-y border-bf-border bg-bf-bg-elevated">
      <Container class="flex flex-wrap items-start gap-8 py-8 sm:gap-12 sm:py-10">
        <For each={siteConfig.metrics}>
          {(m) => <MetricChip value={m.value} label={m.label} />}
        </For>
      </Container>
    </section>
  );
}
