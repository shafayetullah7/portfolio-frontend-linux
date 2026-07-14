import { Title } from "@solidjs/meta";
import { createResource, createSignal, createUniqueId, For, Show } from "solid-js";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import type { MediaItem } from "~/lib/api/types/portfolio.types";
import { ApiError } from "~/lib/api/types";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [media] = createResource(refresh, () => adminApi.listMedia() as Promise<MediaItem[]>);
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [uploading, setUploading] = createSignal(false);
  const [status, setStatus] = createSignal("");
  const [error, setError] = createSignal("");
  const fileInputId = createUniqueId();

  const reload = () => setRefresh((v) => v + 1);

  const upload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    setStatus("");
    try {
      await adminApi.uploadMedia(file);
      setStatus("Upload complete");
      reload();
    } catch (err: unknown) {
      setError(
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Upload failed",
      );
    } finally {
      setUploading(false);
      input.value = "";
    }
  };

  const copyUrl = async (url: string) => {
    setError("");
    setStatus("");
    try {
      await navigator.clipboard.writeText(url);
      setStatus("URL copied");
    } catch {
      setError("Copy failed");
    }
  };

  const remove = async () => {
    const id = deleteId();
    if (!id) return;
    const item = media()?.find((m) => m.id === id);
    if (item?.usesCount && item.usesCount > 0) {
      setError("Media is in use — unlink it first");
      setDeleteId(null);
      return;
    }
    setError("");
    try {
      await adminApi.deleteMedia(id);
      setDeleteId(null);
      setStatus("Media deleted");
      reload();
    } catch (err: unknown) {
      setError(
        err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Delete failed",
      );
    }
  };

  return (
    <>
      <Title>Admin — Media</Title>
      <div class="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 class="mb-1 text-heading text-bf-text">Media</h1>
          <p class="text-body text-bf-text-muted">Uploads for avatars and project screenshots.</p>
        </div>
        <div>
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
            disabled={uploading()}
            onClick={() => document.getElementById(fileInputId)?.click()}
          >
            {uploading() ? "Uploading..." : "Upload image"}
          </Button>
        </div>
      </div>

      <Show when={status()}>
        {(msg) => <p class="mb-4 text-body text-bf-accent">{msg()}</p>}
      </Show>
      <Show when={error()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={media.loading}
        error={media.error}
        empty={!media.loading && !media.error && !(media()?.length)}
        loadingMessage="Loading media..."
        emptyMessage="No media uploaded yet."
      >
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <For each={media()}>
            {(m) => (
              <div class="border border-bf-border bg-bf-surface p-3">
                <div class="mb-2 aspect-video overflow-hidden border border-bf-border bg-bf-bg">
                  <img src={m.url} alt={m.fileName} class="h-full w-full object-cover" />
                </div>
                <p class="truncate text-caption text-bf-text">{m.fileName}</p>
                <p class="text-caption text-bf-text-muted">
                  {m.mimeType} · {formatSize(m.size)}
                </p>
                <Show when={m.usesCount}>
                  {(count) => (
                    <p class="text-caption text-bf-accent">In use: {count()}</p>
                  )}
                </Show>
                <div class="mt-2 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    class="flex-1"
                    onClick={() => copyUrl(m.url)}
                  >
                    Copy URL
                  </Button>
                  <Button type="button" variant="danger" onClick={() => setDeleteId(m.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </For>
        </div>
      </QueryState>

      <ConfirmDialog
        open={!!deleteId()}
        title="Delete media"
        message="This will remove the file from storage."
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
