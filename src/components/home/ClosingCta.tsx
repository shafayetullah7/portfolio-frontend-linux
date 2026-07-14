import { A } from "@solidjs/router";
import { Container } from "~/components/ui";

export default function ClosingCta() {
  return (
    <section class="border-t border-bf-border bg-bf-bg-elevated py-16 sm:py-24">
      <Container class="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-display text-bf-text">Ready to scale?</h2>
          <p class="mt-2 max-w-xl text-body text-bf-text-muted">
            Spin up a conversation about APIs, data, and the ops model behind them.
          </p>
        </div>
        <A
          href="/contact"
          class="inline-flex h-11 shrink-0 items-center justify-center bg-bf-accent px-6 text-body font-semibold text-bf-bg no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
        >
          Initialize Chat
        </A>
      </Container>
    </section>
  );
}
