import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import Button from "~/components/ui/Button";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";

export default function AdminDashboard() {
  const [stats] = createResource(() => adminApi.dashboard());

  return (
    <>
      <Title>Admin — Dashboard</Title>
      <h1 class="mb-2 text-heading text-bf-text">Dashboard</h1>
      <p class="mb-6 text-body text-bf-text-muted">Portfolio CMS overview.</p>

      <QueryState
        loading={stats.loading}
        error={stats.error}
        empty={!stats() && !stats.loading && !stats.error}
        loadingMessage="Loading stats..."
        emptyMessage="No dashboard data."
      >
        <Show when={stats()}>
          {(s) => (
            <>
              <div class="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="border border-bf-border bg-bf-surface p-4">
                  <p class="text-caption text-bf-text-muted">Projects</p>
                  <p class="text-heading text-bf-accent">{s().projects}</p>
                  <p class="text-caption text-bf-text-muted">
                    {s().publishedProjects} pub · {s().draftProjects} draft
                  </p>
                </div>
                <div class="border border-bf-border bg-bf-surface p-4">
                  <p class="text-caption text-bf-text-muted">Skills</p>
                  <p class="text-heading text-bf-accent">{s().skills}</p>
                </div>
                <div class="border border-bf-border bg-bf-surface p-4">
                  <p class="text-caption text-bf-text-muted">Experience</p>
                  <p class="text-heading text-bf-accent">{s().experiences}</p>
                </div>
                <div class="border border-bf-border bg-bf-surface p-4">
                  <p class="text-caption text-bf-text-muted">Media</p>
                  <p class="text-heading text-bf-accent">{s().media}</p>
                </div>
              </div>

              <Show when={(s().unreadSubmissions ?? 0) > 0}>
                <div class="mb-6 border border-bf-accent bg-bf-surface p-4">
                  <p class="text-body text-bf-text">
                    {s().unreadSubmissions} unread message(s)
                  </p>
                  <A href="/admin/inbox">
                    <Button type="button" variant="outline" class="mt-2">
                      View inbox
                    </Button>
                  </A>
                </div>
              </Show>

              <div class="flex flex-wrap gap-2">
                <A href="/admin/profile">
                  <Button type="button" variant="outline">
                    Edit profile
                  </Button>
                </A>
                <A href="/admin/projects">
                  <Button type="button" variant="outline">
                    Manage projects
                  </Button>
                </A>
                <A href="/admin/skills">
                  <Button type="button" variant="outline">
                    Skills
                  </Button>
                </A>
                <A href="/admin/media">
                  <Button type="button" variant="outline">
                    Media library
                  </Button>
                </A>
                <A href="/admin/inbox">
                  <Button type="button" variant="outline">
                    Inbox
                  </Button>
                </A>
              </div>
            </>
          )}
        </Show>
      </QueryState>
    </>
  );
}
