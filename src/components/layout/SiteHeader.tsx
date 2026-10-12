import { A } from "@solidjs/router";
import { Container } from "~/components/ui";
import { useProfile } from "~/lib/profile";

export default function SiteHeader() {
  const profile = useProfile();

  return (
    <header class="site-chrome border-b border-bf-border bg-bf-bg-elevated/90 backdrop-blur-sm">
      <Container class="flex h-14 items-center justify-between gap-4">
        <A
          href="/"
          class="text-body font-semibold text-bf-accent no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
        >
          {profile.name()}
        </A>
        <nav class="flex items-center gap-4" aria-label="Primary">
          <A
            href="/#experience"
            class="text-caption text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            ./experience
          </A>
          <A
            href="/#education"
            class="text-caption text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            ./education
          </A>
          <A
            href="/#credentials"
            class="text-caption text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            ./credentials
          </A>
          <A
            href="/projects"
            class="text-caption text-bf-text-muted no-underline hover:text-bf-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            ./projects
          </A>
          <A
            href="/contact"
            class="inline-flex h-9 items-center bg-bf-accent px-3 text-caption font-semibold text-bf-bg no-underline hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bf-accent/50"
          >
            Contact.Me()
          </A>
        </nav>
      </Container>
    </header>
  );
}
