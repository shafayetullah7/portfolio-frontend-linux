import { createResource, createRoot, createSignal, onMount } from "solid-js";
import { authApi } from "../api/endpoints/admin/auth.api";
import type { AdminUser } from "../api/types/portfolio.types";

export type AdminSession = { admin: AdminUser } | null;

const sessionStore = createRoot(() => {
  const [active, setActive] = createSignal(false);
  const [resource, { refetch }] = createResource(active, async (isActive) => {
    if (!isActive) return undefined;
    return authApi.check();
  });

  return {
    activate() {
      setActive(true);
    },
    session(): AdminSession | undefined {
      if (!active()) return undefined;
      if (resource.loading) return undefined;
      return resource() ?? null;
    },
    loading() {
      return !active() || resource.loading;
    },
    refresh() {
      if (!active()) {
        setActive(true);
      }
      return refetch();
    },
  };
});

export function refreshAdminSession() {
  return sessionStore.refresh();
}

export function useAdminSession() {
  onMount(() => sessionStore.activate());
  return sessionStore.session;
}

export function useAdminSessionLoading() {
  onMount(() => sessionStore.activate());
  return sessionStore.loading;
}
