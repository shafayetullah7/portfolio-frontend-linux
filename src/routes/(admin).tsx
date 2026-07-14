import type { RouteSectionProps } from "@solidjs/router";
import { Meta } from "@solidjs/meta";
import { createEffect, Show } from "solid-js";
import AdminShell from "~/components/admin/AdminShell";
import { authApi } from "~/lib/api/endpoints/admin/auth.api";
import { refreshAdminSession, useAdminSession, useAdminSessionLoading } from "~/lib/auth";

export default function AdminLayout(props: RouteSectionProps) {
  const session = useAdminSession();
  const loading = useAdminSessionLoading();

  createEffect(() => {
    if (!loading() && session() === null) {
      window.location.href = "/login";
    }
  });

  const logout = async () => {
    await authApi.logout().catch(() => null);
    await refreshAdminSession();
    window.location.href = "/login";
  };

  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      <Show
        when={session()}
        fallback={
          <div class="bf-grid-bg flex min-h-screen items-center justify-center text-body text-bf-text-muted">
            Verifying session...
          </div>
        }
      >
        {(s) => (
          <AdminShell admin={s().admin} onLogout={logout}>
            {props.children}
          </AdminShell>
        )}
      </Show>
    </>
  );
}
