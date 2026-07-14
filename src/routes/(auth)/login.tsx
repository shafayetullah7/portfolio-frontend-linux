import { Title } from "@solidjs/meta";
import { createSignal, Show } from "solid-js";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { authApi } from "~/lib/api/endpoints/admin/auth.api";
import { ApiError } from "~/lib/api/types";
import { refreshAdminSession } from "~/lib/auth";
import { loginSchema } from "~/schemas/login.schema";

export default function LoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [fieldErrors, setFieldErrors] = createSignal<Record<string, string>>({});
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const parsed = loginSchema.safeParse({
      email: email(),
      password: password(),
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
      await authApi.login(parsed.data.email, parsed.data.password);
      await refreshAdminSession();
      window.location.href = "/admin";
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bf-grid-bg flex min-h-screen items-center justify-center p-4">
      <Title>Login — Admin</Title>
      <div class="w-full max-w-md border border-bf-border bg-bf-surface p-8">
        <p class="mb-1 text-caption text-bf-text-muted">lite.linux / admin</p>
        <h1 class="mb-2 text-heading text-bf-text">Admin_Login</h1>
        <p class="mb-6 text-caption text-bf-text-muted">Sign in to manage portfolio content.</p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="admin-email">
              Email
            </label>
            <Input
              id="admin-email"
              type="email"
              autocomplete="username"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <Show when={fieldErrors().email}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="admin-password">
              Password
            </label>
            <Input
              id="admin-password"
              type="password"
              autocomplete="current-password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <Show when={fieldErrors().password}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <Show when={error()}>
            {(msg) => <p class="text-body text-bf-error">{msg()}</p>}
          </Show>
          <Button type="submit" disabled={loading()} class="w-full">
            {loading() ? "Authenticating..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
