import type { RouteSectionProps } from "@solidjs/router";
import { Meta } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useAdminSession, useAdminSessionLoading } from "~/lib/auth";

export default function AuthLayout(props: RouteSectionProps) {
  const session = useAdminSession();
  const loading = useAdminSessionLoading();

  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      <Show
        when={!loading()}
        fallback={
          <div class="bf-grid-bg flex min-h-screen items-center justify-center text-body text-bf-text-muted">
            Loading...
          </div>
        }
      >
        <Show when={session()} fallback={props.children}>
          <Navigate href="/admin" />
        </Show>
      </Show>
    </>
  );
}
