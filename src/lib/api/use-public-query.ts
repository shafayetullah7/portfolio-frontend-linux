import { createAsync } from "@solidjs/router";
import { createSignal } from "solid-js";

/** Resource-shaped wrapper around `createAsync` for QueryState / loading UI. */
export function usePublicQueryResource<T>(fetcher: () => Promise<T>) {
  const [error, setError] = createSignal<unknown>();
  const [settled, setSettled] = createSignal(false);

  const value = createAsync(
    async (): Promise<T | undefined> => {
      setError(undefined);
      setSettled(false);
      try {
        const result = await fetcher();
        setSettled(true);
        return result;
      } catch (e) {
        setError(() => e);
        setSettled(true);
        return undefined;
      }
    },
    { deferStream: true },
  );

  return {
    data: (): T | undefined => {
      if (error()) return undefined;
      return value.latest as T | undefined;
    },
    loading: () => !settled(),
    error: () => error(),
  };
}
