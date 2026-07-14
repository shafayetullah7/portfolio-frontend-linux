import { For, Show } from "solid-js";
import { Container } from "~/components/ui";
import { platformLabel, siteConfig } from "~/content/site.config";
import { useContact } from "~/lib/contact";
import { useProfile } from "~/lib/profile";
import { useSiteContent } from "~/lib/site-content";

export default function SiteFooter() {
  const site = useSiteContent();
  const profile = useProfile();
  const contact = useContact();
  const socials = () => contact.socialLinks();

  return (
    <footer class="mt-auto border-t border-bf-border bg-bf-bg-elevated">
      <Container class="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-1">
          <p class="text-caption">{site.footerVersion()}</p>
          <p class="text-caption">
            {siteConfig.footer.copyright} {profile.name()}
          </p>
        </div>

        <Show
          when={
            !contact.resource.loading() &&
            !contact.resource.error() &&
            socials().length > 0
          }
        >
          <nav class="flex flex-wrap gap-4" aria-label="Social links">
            <For each={socials()}>
              {(link) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-caption text-bf-text-muted no-underline hover:text-bf-accent"
                >
                  {platformLabel(link.platform)}
                </a>
              )}
            </For>
          </nav>
        </Show>
      </Container>
    </footer>
  );
}
