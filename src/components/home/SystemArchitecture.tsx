import { For } from "solid-js";
import ArchitectureDiagram from "~/components/home/ArchitectureDiagram";
import { Container, SectionHeader } from "~/components/ui";
import { useSiteContent } from "~/lib/site-content";

export default function SystemArchitecture() {
  const site = useSiteContent();

  return (
    <section id="architecture" class="scroll-mt-20 py-16 sm:py-24">
      <Container>
        <SectionHeader
          title="System_Architecture"
          caption="How request paths and data boundaries stay boring under load."
        />
        <div class="grid gap-10 md:grid-cols-2 md:items-start md:gap-12">
          <ul class="flex flex-col gap-6">
            <For each={site.principles()}>
              {(p) => (
                <li class="border-l-2 border-bf-accent pl-4">
                  <h3 class="text-heading text-bf-text">{p.title}</h3>
                  <p class="mt-2 text-body text-bf-text-muted">{p.body}</p>
                </li>
              )}
            </For>
          </ul>
          <ArchitectureDiagram />
        </div>
      </Container>
    </section>
  );
}
