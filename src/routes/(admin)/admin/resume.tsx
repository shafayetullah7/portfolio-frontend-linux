import { Title } from "@solidjs/meta";
import { A } from "@solidjs/router";
import { createResource, For, Show } from "solid-js";
import AdminResumeSettingsPanel from "~/components/admin/resume/AdminResumeSettingsPanel";
import Button from "~/components/ui/Button";
import QueryState from "~/components/ui/QueryState";
import { adminApi } from "~/lib/api/endpoints/admin";
import { collectAdminResumeWarnings } from "~/lib/resume/admin-resume-warnings";
import { estimateResumePages } from "~/lib/resume/estimate-resume-pages";
import { fetchResumeDocument } from "~/lib/resume/fetch-resume-document";

interface CheckItem {
  id: string;
  label: string;
  pass: boolean;
  href: string;
  optional?: boolean;
}

export default function AdminResumePage() {
  const [readiness] = createResource(async () => {
    const [contact, profile, experience, projects] = await Promise.all([
      adminApi.getContact(),
      adminApi.getProfile(),
      adminApi.listExperience(),
      adminApi.listProjects(),
    ]);
    const emailOk = Boolean(contact?.email?.trim());
    const summaryOk = Boolean(profile.profile?.resumeSummary?.trim());
    const experienceOk = (experience?.length ?? 0) > 0;
    const resumeProjectOk = (projects ?? []).some(
      (p) => p.published && p.includeOnResume,
    );
    const phoneOk = Boolean(contact?.phone?.trim());
    const education = await adminApi.listEducation();
    const educationOk = education.length > 0;

    const warnings = collectAdminResumeWarnings({
      contact,
      profile,
      projects,
      experience,
    });

    const core: CheckItem[] = [
      { id: "email", label: "Contact email set", pass: emailOk, href: "/admin/contact" },
      {
        id: "summary",
        label: "Resume summary filled",
        pass: summaryOk,
        href: "/admin/profile",
      },
      {
        id: "experience",
        label: "At least one experience entry",
        pass: experienceOk,
        href: "/admin/experience",
      },
      {
        id: "project",
        label: "At least one published project on resume",
        pass: resumeProjectOk,
        href: "/admin/projects",
      },
    ];

    const optional: CheckItem[] = [
      {
        id: "phone",
        label: "Phone on contact (optional)",
        pass: phoneOk,
        href: "/admin/contact",
        optional: true,
      },
      {
        id: "education",
        label: "Education entry (optional)",
        pass: educationOk,
        href: "/admin/education",
        optional: true,
      },
    ];

    return { core, optional, warnings };
  });

  const [resumeDoc] = createResource(() => fetchResumeDocument().catch(() => null));

  const pageEstimate = () => {
    const doc = resumeDoc();
    if (!doc) return null;
    return estimateResumePages(doc);
  };

  return (
    <>
      <Title>Admin — Resume</Title>
      <h1 class="mb-2 text-heading text-bf-text">Resume</h1>
      <p class="mb-6 max-w-2xl text-body text-bf-text-muted">
        The public site and the resume PDF share one database. Use curation flags and resume-only
        prose fields so the marketing site can stay rich while the PDF stays dense. Writing
        guidance: <code class="text-caption">docs/RESUME_CONTENT_GUIDE.md</code> in the monorepo.
      </p>

      <Show when={pageEstimate() !== null && pageEstimate()! >= 3}>
        <div class="mb-6 border border-bf-accent bg-bf-surface p-4 text-body text-bf-text-muted">
          Estimated length: about {pageEstimate()} pages. Consider trimming resume bullets,
          project highlights, or turning off &quot;Include on resume&quot; for some entries.
        </div>
      </Show>

      <div class="mb-8 flex flex-wrap gap-3">
        <A href="/resume" target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="outline">Preview Modern Split</Button>
        </A>
        <A href="/resume?theme=classic" target="_blank" rel="noopener noreferrer">
          <Button type="button" variant="outline">Preview Classic</Button>
        </A>
      </div>

      <QueryState
        loading={readiness.loading}
        error={readiness.error}
        loadingMessage="Loading readiness..."
      >
        <Show when={readiness()}>
          {(data) => (
            <div class="max-w-2xl space-y-8">
              <AdminResumeSettingsPanel />
              <Show when={data().warnings.length > 0}>
                <section>
                  <h2 class="mb-3 text-caption text-bf-accent">Quality warnings</h2>
                  <ul class="space-y-2">
                    <For each={data().warnings}>
                      {(item) => (
                        <li class="flex flex-col gap-2 border border-bf-accent bg-bf-surface p-3 sm:flex-row sm:items-start sm:justify-between">
                          <span class="text-body text-bf-text-muted">{item.message}</span>
                          <A
                            href={item.href}
                            class="shrink-0 text-caption text-bf-accent no-underline hover:underline"
                          >
                            Fix
                          </A>
                        </li>
                      )}
                    </For>
                  </ul>
                </section>
              </Show>

              <section>
                <h2 class="mb-3 text-caption text-bf-accent">Core checklist</h2>
                <ul class="space-y-2">
                  <For each={data().core}>
                    {(item) => (
                      <li class="flex items-center justify-between gap-4 border border-bf-border bg-bf-surface p-3">
                        <span class="text-body text-bf-text">
                          {item.pass ? "✓" : "○"} {item.label}
                        </span>
                        <A href={item.href} class="text-caption text-bf-accent no-underline hover:underline">
                          Edit
                        </A>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
              <section>
                <h2 class="mb-3 text-caption text-bf-accent">Optional</h2>
                <ul class="space-y-2">
                  <For each={data().optional}>
                    {(item) => (
                      <li class="flex items-center justify-between gap-4 border border-bf-border bg-bf-surface p-3">
                        <span class="text-body text-bf-text-muted">
                          {item.pass ? "✓" : "○"} {item.label}
                        </span>
                        <A href={item.href} class="text-caption text-bf-accent no-underline hover:underline">
                          Edit
                        </A>
                      </li>
                    )}
                  </For>
                </ul>
              </section>
            </div>
          )}
        </Show>
      </QueryState>
    </>
  );
}
