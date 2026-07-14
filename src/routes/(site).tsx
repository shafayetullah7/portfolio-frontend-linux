import type { RouteSectionProps } from "@solidjs/router";
import SiteFooter from "~/components/layout/SiteFooter";
import SiteHeader from "~/components/layout/SiteHeader";
import { ProfileProvider } from "~/lib/profile";
import { SiteContentProvider } from "~/lib/site-content";

export default function SiteLayout(props: RouteSectionProps) {
  return (
    <SiteContentProvider>
      <ProfileProvider>
        <div class="bf-grid-bg flex min-h-screen flex-col">
          <SiteHeader />
          <main class="flex-1">{props.children}</main>
          <SiteFooter />
        </div>
      </ProfileProvider>
    </SiteContentProvider>
  );
}
