import { Title } from "@solidjs/meta";
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import AdminFieldHint from "~/components/admin/AdminFieldHint";
import AdminFormSection from "~/components/admin/AdminFormSection";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import QueryState from "~/components/ui/QueryState";
import Select from "~/components/ui/Select";
import { adminApi } from "~/lib/api/endpoints/admin";
import { ApiError } from "~/lib/api/types";

const PLATFORMS = ["GITHUB", "LINKEDIN", "TWITTER", "WEBSITE", "EMAIL", "OTHER"] as const;

type SocialLink = { platform: string; url: string };

export default function AdminContactPage() {
  const [refresh, setRefresh] = createSignal(0);
  const [contact] = createResource(refresh, () => adminApi.getContact());
  const [email, setEmail] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [location, setLocation] = createSignal("");
  const [gpgKey, setGpgKey] = createSignal("");
  const [socialLinks, setSocialLinks] = createSignal<SocialLink[]>([]);
  const [saving, setSaving] = createSignal(false);
  const [status, setStatus] = createSignal<{ kind: "idle" | "success" | "error"; message: string }>({
    kind: "idle",
    message: "",
  });

  createEffect(() => {
    const c = contact();
    if (!c) return;
    setEmail(c.email);
    setPhone(c.phone ?? "");
    setLocation(c.location ?? "");
    setGpgKey(c.gpgKey ?? "");
    setSocialLinks(c.socialLinks?.map((l) => ({ platform: l.platform, url: l.url })) ?? []);
  });

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle", message: "" });
    try {
      await adminApi.updateContact({
        email: email(),
        phone: phone().trim() || null,
        location: location().trim() || null,
        gpgKey: gpgKey() || null,
        socialLinks: socialLinks(),
      });
      setRefresh((v) => v + 1);
      setStatus({ kind: "success", message: "Contact saved." });
    } catch (e: unknown) {
      setStatus({
        kind: "error",
        message:
          e instanceof ApiError ? e.message : e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setSocialLinks((links) => [...links, { platform: "GITHUB", url: "" }]);
  const updateLink = (i: number, patch: Partial<SocialLink>) =>
    setSocialLinks((links) => links.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  const removeLink = (i: number) =>
    setSocialLinks((links) => links.filter((_, idx) => idx !== i));

  return (
    <>
      <Title>Admin — Contact</Title>
      <h1 class="mb-2 text-heading text-bf-text">Contact</h1>
      <p class="mb-6 text-body text-bf-text-muted">Email and social links for the public contact page.</p>

      <QueryState
        loading={contact.loading}
        error={contact.error}
        loadingMessage="Loading contact..."
      >
        <div class="max-w-xl space-y-6">
          <AdminFormSection title="Contact facts">
            <AdminFieldHint variant="fact" />
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="contact-email">
                Email
              </label>
              <Input
                id="contact-email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="contact-phone">
                Phone
              </label>
              <Input
                id="contact-phone"
                maxLength={40}
                value={phone()}
                onInput={(e) => setPhone(e.currentTarget.value)}
              />
            </div>
            <div>
              <label class="mb-1 block text-caption text-bf-text-muted" for="contact-location">
                Location
              </label>
              <Input
                id="contact-location"
                maxLength={200}
                value={location()}
                onInput={(e) => setLocation(e.currentTarget.value)}
              />
            </div>
          </AdminFormSection>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="contact-gpg">
              GPG Key
            </label>
            <Input
              id="contact-gpg"
              value={gpgKey()}
              onInput={(e) => setGpgKey(e.currentTarget.value)}
            />
          </div>

          <p class="text-caption text-bf-accent">Social_Links</p>
          <For each={socialLinks()}>
            {(link, i) => (
              <div class="flex flex-wrap gap-2">
                <div>
                  <label class="sr-only" for={`social-platform-${i()}`}>
                    Platform
                  </label>
                  <Select
                    id={`social-platform-${i()}`}
                    class="w-36"
                    options={PLATFORMS.map((p) => ({ value: p, label: p }))}
                    value={link.platform}
                    onChange={(e) => updateLink(i(), { platform: e.currentTarget.value })}
                  />
                </div>
                <div class="min-w-0 flex-1">
                  <label class="sr-only" for={`social-url-${i()}`}>
                    URL
                  </label>
                  <Input
                    id={`social-url-${i()}`}
                    class="w-full"
                    placeholder="URL"
                    value={link.url}
                    onInput={(e) => updateLink(i(), { url: e.currentTarget.value })}
                  />
                </div>
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => removeLink(i())}
                  aria-label="Remove link"
                >
                  −
                </Button>
              </div>
            )}
          </For>
          <Button type="button" variant="ghost" onClick={addLink}>
            + Add link
          </Button>

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
