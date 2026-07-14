import { createResource, createSignal, createUniqueId, For, Show } from "solid-js";
import Button from "~/components/ui/Button";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { MediaItem } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

interface MediaPickerProps {
  value: string | null | undefined;
  onChange: (mediaId: string | null) => void;
  label?: string;
  allowUpload?: boolean;
  emptyFallback?: string;
}

export default function MediaPicker(props: MediaPickerProps) {
  const [media, { refetch }] = createResource(() => adminApi.listMedia());
  const [uploading, setUploading] = createSignal(false);
  const [showLibrary, setShowLibrary] = createSignal(false);
  const [status, setStatus] = createSignal("");

  const items = () => media() ?? [];
  const selected = () => items().find((m) => m.id === props.value) ?? null;
  const libraryItems = () => items().filter((m) => m.id !== props.value);

  const fileInputId = createUniqueId();

  const upload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("");
    try {
      const uploaded = (await adminApi.uploadMedia(file)) as MediaItem;
      await refetch();
      props.onChange(uploaded.id);
      setShowLibrary(false);
      setStatus("Upload complete");
    } catch (err: unknown) {
      if (err instanceof ApiError) setStatus(err.message || "Upload failed");
      else if (err instanceof Error) setStatus(err.message);
      else setStatus("Upload failed");
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  return (
    <div class="space-y-3">
      <Show when={props.label}>
        <p class="text-caption text-bf-text-muted">{props.label}</p>
      </Show>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border border-bf-border bg-bf-bg">
          <Show
            when={selected()?.url}
            fallback={
              <span class="text-caption text-bf-text-muted">
                {props.emptyFallback ?? "?"}
              </span>
            }
          >
            {(url) => (
              <img src={url()} alt={selected()?.fileName ?? "Selected media"} class="h-full w-full object-cover" />
            )}
          </Show>
        </div>

        <div class="flex flex-wrap gap-2">
          <Show when={props.allowUpload}>
            <input
              id={fileInputId}
              type="file"
              accept="image/*"
              class="hidden"
              disabled={uploading()}
              onChange={upload}
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading()}
              onClick={() => document.getElementById(fileInputId)?.click()}
            >
              {uploading() ? "Uploading..." : "Upload"}
            </Button>
          </Show>
          <Show when={libraryItems().length > 0}>
            <Button type="button" variant="outline" onClick={() => setShowLibrary((v) => !v)}>
              {showLibrary() ? "Hide library" : "Pick from library"}
            </Button>
          </Show>
          <Show when={props.value}>
            <Button type="button" variant="ghost" onClick={() => props.onChange(null)}>
              Clear
            </Button>
          </Show>
        </div>
      </div>

      <Show when={status()}>
        {(msg) => <p class="text-caption text-bf-text-muted">{msg()}</p>}
      </Show>

      <Show when={showLibrary() && libraryItems().length > 0}>
        <div class="space-y-2 border border-bf-border p-3">
          <p class="text-caption text-bf-text-muted">Library</p>
          <div class="flex flex-wrap gap-2">
            <For each={libraryItems()}>
              {(m) => (
                <button
                  type="button"
                  class="h-16 w-16 overflow-hidden border border-bf-border transition-colors hover:border-bf-accent"
                  onClick={() => {
                    props.onChange(m.id);
                    setShowLibrary(false);
                  }}
                >
                  <img src={m.url} alt={m.fileName} class="h-full w-full object-cover" />
                </button>
              )}
            </For>
          </div>
        </div>
      </Show>

      <Show when={!media.loading && items().length === 0 && !props.value}>
        <p class="text-caption text-bf-text-muted">
          No media yet.
          {props.allowUpload ? " Upload an image to get started." : " Upload files in Media admin first."}
        </p>
      </Show>
    </div>
  );
}
