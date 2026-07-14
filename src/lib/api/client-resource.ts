import { createResource, createSignal, onMount } from "solid-js";

export function useClientResource<T>(loader: () => Promise<T>, deps?: () => unknown) {
  const [active, setActive] = createSignal(false);
  const [resource, { refetch }] = createResource(
    () => (active() ? (deps ? deps() : true) : false),
    async () => loader(),
  );

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
