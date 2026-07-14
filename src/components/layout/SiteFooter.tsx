import { For, Show } from "solid-js";
import { Container } from "~/components/ui";
import { platformLabel, siteConfig } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getContact, getProfile } from "~/lib/api/endpoints/public";

export default function SiteFooter() {
  const profile = useClientResource(() => getProfile());
  const contact = useClientResource(() => getContact());
  const displayName = () => profile.data()?.profile?.name ?? siteConfig.brand;
  const socials = () => contact.data()?.socialLinks ?? [];

  return (
    <footer class="mt-auto border-t border-bf-border bg-bf-bg-elevated">
      <Container class="flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-1">
          <p class="text-caption">{siteConfig.footer.version}</p>
          <p class="text-caption">
            {siteConfig.footer.copyright} {displayName()}
          </p>
        </div>

        <Show when={!contact.loading() && !contact.error() && socials().length > 0}>
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

        <div class="text-caption">
          <Show
            when={!profile.loading() && !profile.error()}
            fallback={
              <Show when={profile.error()} fallback={<span>API: …</span>}>
                <span class="text-bf-error">API: unreachable</span>
              </Show>
            }
          >
            <span class="text-bf-accent">API: ok</span>
          </Show>
        </div>
      </Container>
    </footer>
  );
}
