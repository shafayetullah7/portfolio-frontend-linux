import { Title } from "@solidjs/meta";
import { A, useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { authApi } from "~/lib/api/endpoints/admin/auth.api";
import { ApiError } from "~/lib/api/types";
import { registerSchema } from "~/schemas/register.schema";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = createSignal("");
  const [lastName, setLastName] = createSignal("");
  const [userName, setUserName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = registerSchema.safeParse({
      firstName: firstName(),
      lastName: lastName(),
      userName: userName(),
      email: email(),
      password: password(),
      confirmPassword: confirmPassword(),
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form");
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      setError("Please fix the highlighted fields.");
      return;
    }

    setLoading(true);
    try {
      await authApi.register({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        userName: parsed.data.userName,
        email: parsed.data.email,
        password: parsed.data.password,
      });
      navigate("/register/verify");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Registration failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bf-grid-bg flex min-h-screen items-center justify-center p-4">
      <Title>Register — Admin</Title>
      <div class="w-full max-w-md border border-bf-border bg-bf-surface p-8">
        <p class="mb-1 text-caption text-bf-text-muted">lite.linux / admin</p>
        <h1 class="mb-2 text-heading text-bf-text">Admin_Register</h1>
        <p class="mb-6 text-caption text-bf-text-muted">
          Create the first admin account. An approval code will be emailed.
        </p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-first-name">
              First name
            </label>
            <Input
              id="reg-first-name"
              autocomplete="given-name"
              value={firstName()}
              onInput={(e) => setFirstName(e.currentTarget.value)}
            />
            <Show when={fieldErrors().firstName}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-last-name">
              Last name
            </label>
            <Input
              id="reg-last-name"
              autocomplete="family-name"
              value={lastName()}
              onInput={(e) => setLastName(e.currentTarget.value)}
            />
            <Show when={fieldErrors().lastName}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-username">
              Username
            </label>
            <Input
              id="reg-username"
              autocomplete="username"
              value={userName()}
              onInput={(e) => setUserName(e.currentTarget.value)}
            />
            <Show when={fieldErrors().userName}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-email">
              Email
            </label>
            <Input
              id="reg-email"
              type="email"
              autocomplete="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <Show when={fieldErrors().email}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-password">
              Password
            </label>
            <Input
              id="reg-password"
              type="password"
              autocomplete="new-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <Show when={fieldErrors().password}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-confirm">
              Confirm password
            </label>
            <Input
              id="reg-confirm"
              type="password"
              autocomplete="new-password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
            />
            <Show when={fieldErrors().confirmPassword}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <Show when={error()}>
            {(msg) => <p class="text-body text-bf-error">{msg()}</p>}
          </Show>
          <Button type="submit" disabled={loading()} class="w-full">
            {loading() ? "Submitting..." : "Register"}
          </Button>
        </form>

        <p class="mt-6 text-center text-caption text-bf-text-muted">
          <A href="/login" class="text-bf-accent hover:underline">
            Back to login
          </A>
        </p>
      </div>
    </div>
  );
}
