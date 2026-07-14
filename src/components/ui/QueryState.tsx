import { JSX, Show } from "solid-js";

interface QueryStateProps {
  loading: boolean;
  error?: unknown;
  empty?: boolean;
  loadingMessage?: string;
  errorMessage?: string;
  emptyMessage?: string;
  children: JSX.Element;
}

export default function QueryState(props: QueryStateProps) {
  return (
    <Show
      when={!props.loading && !props.error && !props.empty}
      fallback={
        <Show
          when={props.loading}
          fallback={
            <Show
              when={props.error}
              fallback={
                <p class="border border-bf-border p-6 text-body text-bf-text-muted">
                  {props.emptyMessage ?? "Nothing here yet."}
                </p>
              }
            >
              <p class="border border-bf-error p-6 text-body text-bf-error">
                {props.errorMessage ??
                  (props.error instanceof Error ? props.error.message : "Failed to load data")}
              </p>
            </Show>
          }
        >
          <p class="text-body text-bf-text-muted">{props.loadingMessage ?? "Loading..."}</p>
        </Show>
      }
    >
      {props.children}
    </Show>
  );
}
