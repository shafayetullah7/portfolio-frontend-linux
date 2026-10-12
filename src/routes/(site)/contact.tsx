import Seo from "~/components/Seo";
import { A } from "@solidjs/router";
import { createSignal, For, Show } from "solid-js";
import { Button, Container, Input, SectionHeader, Textarea } from "~/components/ui";
import { platformLabel, siteConfig } from "~/content/site.config";
import { submitContact } from "~/lib/api/endpoints/public";
import { ApiError } from "~/lib/api/types";
import { useContact } from "~/lib/contact";
import { contactFormSchema } from "~/schemas/contact-form.schema";

type Status =
  | { kind: "idle" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

export default function ContactPage() {
  const contact = useContact();

  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [subject, setSubject] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [website, setWebsite] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [status, setStatus] = createSignal<Status>({ kind: "idle" });
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});

  const onSubmit = async (e: Event) => {
    e.preventDefault();
    setStatus({ kind: "idle" });
    setFieldErrors({});

    const parsed = contactFormSchema.safeParse({
      name: name(),
      email: email(),
      subject: subject(),
      message: message(),
      website: website() || undefined,
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setStatus({ kind: "error", message: "Please fix the highlighted fields." });
      return;
    }

    setSubmitting(true);
    try {
      await submitContact(parsed.data);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setWebsite("");
      setStatus({ kind: "success", message: "Message sent. I’ll get back to you soon." });
    } catch (err) {
      if (err instanceof ApiError && err.statusCode === 429) {
        setStatus({ kind: "error", message: "Please wait before sending again." });
      } else if (err instanceof ApiError) {
        setStatus({ kind: "error", message: err.message || "Failed to send message." });
      } else {
        setStatus({ kind: "error", message: "Failed to send message." });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title={`Contact — ${siteConfig.brand}`}
        description="Send a message or reach out via email and social links."
      />

      <Container class="overflow-x-hidden py-16 sm:py-24">
        <SectionHeader
          title="Contact.Me()"
          caption="Reach out about APIs, architecture, or collaboration."
        />

        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <aside class="flex flex-col gap-4 text-body">
            <Show when={contact.email()}>
              {(addr) => (
                <p>
                  <span class="text-caption">Email</span>
                  <br />
                  <a
                    href={`mailto:${addr()}`}
                    class="text-bf-accent no-underline hover:underline"
                  >
                    {addr()}
                  </a>
                </p>
              )}
            </Show>
            <Show when={contact.phone()}>
              {(num) => (
                <p>
                  <span class="text-caption">Phone</span>
                  <br />
                  <a
                    href={`tel:${num()}`}
                    class="text-bf-accent no-underline hover:underline"
                  >
                    {num()}
                  </a>
                </p>
              )}
            </Show>
            <Show when={contact.location()}>
              {(place) => (
                <p>
                  <span class="text-caption">Location</span>
                  <br />
                  <span class="text-bf-text-muted">{place()}</span>
                </p>
              )}
            </Show>
            <Show when={contact.socialLinks().length > 0}>
              <div>
                <span class="text-caption">Social</span>
                <ul class="mt-2 flex flex-col gap-2">
                  <For each={contact.socialLinks()}>
                    {(link) => (
                      <li>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="text-bf-text-muted no-underline hover:text-bf-accent"
                        >
                          {platformLabel(link.platform)}
                        </a>
                      </li>
                    )}
                  </For>
                </ul>
              </div>
            </Show>
            <A href="/" class="text-caption text-bf-text-muted no-underline hover:text-bf-accent">
              ← ./home
            </A>
          </aside>

          <form class="relative flex flex-col gap-4 border border-bf-border bg-bf-surface p-5 sm:p-6" onSubmit={onSubmit}>
            <div class="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
              <label>
                Website
                <Input
                  tabindex={-1}
                  autocomplete="off"
                  value={website()}
                  onInput={(e) => setWebsite(e.currentTarget.value)}
                />
              </label>
            </div>

            <div>
              <label class="mb-1 block text-caption" for="contact-name">
                Name
              </label>
              <Input
                id="contact-name"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                placeholder="Name"
                disabled={submitting()}
              />
              <Show when={fieldErrors().name}>
                <p class="mt-1 text-caption text-bf-error">{fieldErrors().name}</p>
              </Show>
            </div>

            <div>
              <label class="mb-1 block text-caption" for="contact-email">
                Email
              </label>
              <Input
                id="contact-email"
                type="email"
                value={email()}
                onInput={(e) => setEmail(e.currentTarget.value)}
                placeholder="Email"
                disabled={submitting()}
              />
              <Show when={fieldErrors().email}>
                <p class="mt-1 text-caption text-bf-error">{fieldErrors().email}</p>
              </Show>
            </div>

            <div>
              <label class="mb-1 block text-caption" for="contact-subject">
                Subject
              </label>
              <Input
                id="contact-subject"
                value={subject()}
                onInput={(e) => setSubject(e.currentTarget.value)}
                placeholder="Subject"
                disabled={submitting()}
              />
              <Show when={fieldErrors().subject}>
                <p class="mt-1 text-caption text-bf-error">{fieldErrors().subject}</p>
              </Show>
            </div>

            <div>
              <label class="mb-1 block text-caption" for="contact-message">
                Message
              </label>
              <Textarea
                id="contact-message"
                rows={5}
                value={message()}
                onInput={(e) => setMessage(e.currentTarget.value)}
                placeholder="Message"
                disabled={submitting()}
              />
              <Show when={fieldErrors().message}>
                <p class="mt-1 text-caption text-bf-error">{fieldErrors().message}</p>
              </Show>
            </div>

            <Button type="submit" disabled={submitting()}>
              {submitting() ? "Sending…" : "Send message"}
            </Button>

            <Show when={status().kind === "success"}>
              <p class="border border-bf-accent/40 bg-bf-accent-dim p-3 text-body text-bf-accent">
                {(status() as { kind: "success"; message: string }).message}
              </p>
            </Show>
            <Show when={status().kind === "error"}>
              <p class="border border-bf-error p-3 text-body text-bf-error">
                {(status() as { kind: "error"; message: string }).message}
              </p>
            </Show>
          </form>
        </div>
      </Container>
    </>
  );
}
