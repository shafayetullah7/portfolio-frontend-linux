import { Show } from "solid-js";
import { Container } from "~/components/ui";
import { siteConfig } from "~/content/site.config";
import { useClientResource } from "~/lib/api/client-resource";
import { getProfile } from "~/lib/api/endpoints/public";

export default function SiteFooter() {
  const profile = useClientResource(() => getProfile());
  const displayName = () => profile.data()?.profile?.name ?? siteConfig.brand;

  return (
    <footer class="mt-auto border-t border-bf-border bg-bf-bg-elevated">
      <Container class="flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-col gap-1">
          <p class="text-caption">{siteConfig.footer.version}</p>
          <p class="text-caption">
            {siteConfig.footer.copyright} {displayName()}
          </p>
        </div>
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
