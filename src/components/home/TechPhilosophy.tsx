import { For } from "solid-js";
import PhilosophyCard from "~/components/home/PhilosophyCard";
import { Container, SectionHeader } from "~/components/ui";
import { useSiteContent } from "~/lib/site-content";

export default function TechPhilosophy() {
  const site = useSiteContent();

  return (
    <section class="border-t border-bf-border py-16 sm:py-24">
      <Container>
        <SectionHeader
          title="Tech_Philosophy"
          caption="Defaults that keep systems honest when traffic and teams grow."
        />
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={site.philosophy()}>
            {(item) => (
              <PhilosophyCard
                title={item.title}
                body={item.body}
                icon={item.icon ?? undefined}
              />
            )}
          </For>
        </div>
      </Container>
    </section>
  );
}
