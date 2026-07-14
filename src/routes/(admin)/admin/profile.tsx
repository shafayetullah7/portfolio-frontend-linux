import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, Show } from "solid-js";
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
          <section class="space-y-3">
            <h2 class="text-caption text-bf-accent">Identity</h2>
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
                Bio
              </label>
              <Textarea
                id="profile-bio"
                rows={4}
                value={bio()}
                onInput={(e) => setBio(e.currentTarget.value)}
              />
            </div>
          </section>

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
