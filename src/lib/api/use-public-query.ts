import { createAsync } from "@solidjs/router";

type AsyncResult<T> =
  | { status: "ok"; data: T }
  | { status: "error"; error: unknown };

/**
 * Resource-shaped wrapper around `createAsync` for QueryState / loading UI.
 * Loading/error must be derived from the async value itself so SSR HTML and
 * client hydration stay in sync (no parallel signals that reset on hydrate).
 */
export function usePublicQueryResource<T>(fetcher: () => Promise<T>) {
  const result = createAsync(
    async (): Promise<AsyncResult<T>> => {
      try {
        return { status: "ok", data: await fetcher() };
      } catch (error) {
        return { status: "error", error };
      }
    },
    { deferStream: true },
  );

  return {
    data: (): T | undefined => {
      const r = result();
      return r?.status === "ok" ? r.data : undefined;
    },
    loading: () => result() === undefined,
    error: () => {
      const r = result();
      return r?.status === "error" ? r.error : undefined;
    },
  };
}
