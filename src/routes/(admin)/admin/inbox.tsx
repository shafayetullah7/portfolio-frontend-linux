import { Title } from "@solidjs/meta";
import { createResource, createSignal, For, Show } from "solid-js";
import Button from "~/components/ui/Button";
import ConfirmDialog from "~/components/ui/ConfirmDialog";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";

type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export default function AdminInboxPage() {
  const [page, setPage] = createSignal(1);
  const limit = 20;
  const [refresh, setRefresh] = createSignal(0);
  const [result] = createResource(
    () => ({ page: page(), refresh: refresh() }),
    ({ page: p }) => adminApi.listSubmissions({ page: p, limit }),
  );
  const [deleteId, setDeleteId] = createSignal<string | null>(null);
  const [error, setError] = createSignal("");

  const submissions = () => (result()?.items ?? []) as Submission[];
  const reload = () => setRefresh((v) => v + 1);

  const markRead = async (id: string) => {
    setError("");
    try {
      await adminApi.markSubmissionRead(id);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Failed");
    }
  };

  const remove = async () => {
    const id = deleteId();
    if (!id) return;
    setError("");
    try {
      await adminApi.deleteSubmission(id);
      setDeleteId(null);
      reload();
    } catch (e: unknown) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <>
      <Title>Admin — Inbox</Title>
      <h1 class="mb-2 text-heading text-bf-text">Inbox</h1>
      <p class="mb-6 text-body text-bf-text-muted">Messages from the public contact form.</p>

      <Show when={error()}>
        {(msg) => <p class="mb-4 text-body text-bf-error">{msg()}</p>}
      </Show>

      <QueryState
        loading={result.loading}
        error={result.error}
        empty={!result.loading && !result.error && !submissions().length}
        loadingMessage="Loading inbox..."
        emptyMessage="No submissions yet."
      >
        <div class="space-y-4">
          <For each={submissions()}>
            {(s) => (
              <article
                class={`border bg-bf-surface p-4 ${
                  s.read ? "border-bf-border opacity-70" : "border-bf-accent"
                }`}
              >
                <div class="mb-2 flex flex-wrap justify-between gap-2">
                  <p class="text-body font-semibold text-bf-text">
                    {s.subject}
                    <Show when={!s.read}>
                      <span class="ml-2 text-caption text-bf-accent">Unread</span>
                    </Show>
                  </p>
                  <span class="text-caption text-bf-text-muted">
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                </div>
                <p class="mb-2 text-caption text-bf-text-muted">
                  {s.name} &lt;{s.email}&gt;
                </p>
                <p class="mb-4 whitespace-pre-wrap text-body text-bf-text">{s.message}</p>
                <div class="flex flex-wrap gap-2">
                  <Show when={!s.read}>
                    <Button type="button" variant="outline" onClick={() => markRead(s.id)}>
                      Mark read
                    </Button>
                  </Show>
                  <Button type="button" variant="danger" onClick={() => setDeleteId(s.id)}>
                    Delete
                  </Button>
                </div>
              </article>
            )}
          </For>
        </div>
        <div class="mt-6 flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={page() <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span class="text-caption text-bf-text-muted">Page {result()?.page ?? page()}</span>
          <Button
            type="button"
            variant="outline"
            disabled={submissions().length < limit}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </QueryState>

      <ConfirmDialog
        open={!!deleteId()}
        title="Delete submission"
        message="Remove this message?"
        confirmLabel="Delete"
        onConfirm={remove}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
}
