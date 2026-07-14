import { createResource, createSignal, onMount } from "solid-js";

export function useClientResource<T>(loader: () => Promise<T>) {
  const [active, setActive] = createSignal(false);
  const [resource, { refetch }] = createResource(active, async (isActive) => {
    if (!isActive) return undefined;
    return loader();
  });

  onMount(() => setActive(true));

  return {
    data: () => {
      if (!active() || resource.loading) return undefined;
      if (resource.error) return undefined;
      return resource() as T | undefined;
    },
    loading: () => !active() || resource.loading,
    error: () => (active() && !resource.loading ? resource.error : undefined),
    refetch,
  };
}
