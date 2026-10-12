import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import AdminFormSection from "~/components/admin/AdminFormSection";
import MediaPicker from "~/components/admin/MediaPicker";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import QueryState from "~/components/ui/QueryState";
import Textarea from "~/components/ui/Textarea";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";
import { refreshAdminSession } from "~/lib/auth";

export default function AdminProfilePage() {
  const [refresh, setRefresh] = createSignal(0);
  const [data] = createResource(refresh, () => adminApi.getProfile());
  const [name, setName] = createSignal("");
  const [headline, setHeadline] = createSignal("");
  const [bio, setBio] = createSignal("");
  const [resumeTitle, setResumeTitle] = createSignal("");
  const [resumeSummary, setResumeSummary] = createSignal("");
  const [os, setOs] = createSignal("");
  const [kernel, setKernel] = createSignal("");
  const [shell, setShell] = createSignal("");
  const [editor, setEditor] = createSignal("");
  const [avatarMediaId, setAvatarMediaId] = createSignal<string | null>(null);
  const [saving, setSaving] = createSignal(false);
  const [status, setStatus] = createSignal<{ kind: "idle" | "success" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  createEffect(() => {
    const d = data();
    if (!d) return;
    setName(d.profile?.name ?? "");
    setHeadline(d.profile?.headline ?? "");
    setBio(d.profile?.bio ?? "");
    setResumeTitle(d.profile?.resumeTitle ?? "");
    setResumeSummary(d.profile?.resumeSummary ?? "");
    setOs(d.systemInfo?.os ?? "");
    setKernel(d.systemInfo?.kernel ?? "");
    setShell(d.systemInfo?.shell ?? "");
    setEditor(d.systemInfo?.editor ?? "");
    setAvatarMediaId(d.profile?.avatarMediaId ?? null);
  });

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle", message: "" });
    try {
      await adminApi.updateProfile({
        name: name(),
        headline: headline(),
        bio: bio(),
        resumeTitle: resumeTitle().trim() || null,
        resumeSummary: resumeSummary().trim() || null,
        avatarMediaId: avatarMediaId(),
      });
      await adminApi.updateSystemInfo({
        os: os(),
        kernel: kernel(),
        shell: shell(),
        editor: editor(),
      });
      await refreshAdminSession();
      setRefresh((v) => v + 1);
      setStatus({ kind: "success", message: "Profile saved." });
    } catch (e: unknown) {
      const message =
        e instanceof ApiError
          ? e.message || "Save failed"
          : e instanceof Error
            ? e.message
            : "Save failed";
      setStatus({ kind: "error", message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Title>Admin — Profile</Title>
      <h1 class="mb-2 text-heading text-bf-text">Profile</h1>
      <p class="mb-6 text-body text-bf-text-muted">Identity and system info shown on the public site.</p>

      <QueryState
        loading={data.loading}
        error={data.error}
        empty={!data() && !data.loading && !data.error}
        loadingMessage="Loading profile..."
        emptyMessage="Profile not found."
      >
        <div class="max-w-xl space-y-6">
          <AdminFormSection title="Site content">
            <AdminFieldHint variant="site" />
            <MediaPicker
              label="Avatar"
              value={avatarMediaId()}
              onChange={setAvatarMediaId}
              allowUpload
              emptyFallback={name().slice(0, 2) || "?"}
            />
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-name">
                Name
              </label>
              <Input id="profile-name" value={name()} onInput={(e) => setName(e.currentTarget.value)} />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-headline">
                Headline
              </label>
              <Input
                id="profile-headline"
                value={headline()}
                onInput={(e) => setHeadline(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-bio">
                Bio (About)
              </label>
              <Textarea
                id="profile-bio"
                rows={4}
                value={bio()}
                onInput={(e) => setBio(e.currentTarget.value)}
              />
            </div>
          </AdminFormSection>

          <AdminFormSection title="Resume (print)">
            <AdminFieldHint variant="resume" />
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-resume-title">
                Resume job title (optional)
              </label>
              <Input
                id="profile-resume-title"
                maxLength={255}
                value={resumeTitle()}
                onInput={(e) => setResumeTitle(e.currentTarget.value)}
              />
              <p class="mt-1 text-caption text-bf-text-muted">
                Used on the PDF instead of headline when set. Not shown in the hero.
              </p>
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-resume-summary">
                Resume summary
              </label>
              <Textarea
                id="profile-resume-summary"
                rows={5}
                value={resumeSummary()}
                onInput={(e) => setResumeSummary(e.currentTarget.value)}
              />
              <p class="mt-1 text-caption text-bf-text-muted">
                Target ~3–5 lines (about 400–600 characters). Not the same as site bio.
              </p>
            </div>
          </AdminFormSection>

          <section class="space-y-3">
            <h2 class="text-caption text-bf-accent">System_Info</h2>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-os">
                OS
              </label>
              <Input id="profile-os" value={os()} onInput={(e) => setOs(e.currentTarget.value)} />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-kernel">
                Kernel
              </label>
              <Input
                id="profile-kernel"
                value={kernel()}
                onInput={(e) => setKernel(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-shell">
                Shell
              </label>
              <Input
                id="profile-shell"
                value={shell()}
                onInput={(e) => setShell(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="profile-editor">
                Editor
              </label>
              <Input
                id="profile-editor"
                value={editor()}
                onInput={(e) => setEditor(e.currentTarget.value)}
              />
            </div>
          </section>

          <Show when={status().kind !== "idle"}>
            <p
              class={`text-body ${status().kind === "success" ? "text-bf-accent" : "text-bf-error"}`}
            >
              {status().message}
            </p>
          </Show>

          <Button type="button" disabled={saving()} onClick={save}>
            {saving() ? "Saving..." : "Save"}
          </Button>
        </div>
      </QueryState>
    </>
  );
}
