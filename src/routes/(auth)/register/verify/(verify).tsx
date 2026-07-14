import { Title } from "@solidjs/meta";
import { A, useNavigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import Button from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { authApi } from "~/lib/api/endpoints/admin/auth.api";
import { ApiError } from "~/lib/api/types";
import { verifyRegistrationSchema } from "~/schemas/verify-registration.schema";

export default function VerifyRegistrationPage() {
  const navigate = useNavigate();
  const [otp, setOtp] = createSignal("");
  const [error, setError] = createSignal("");
  const [fieldError, setFieldError] = createSignal("");
  const [info, setInfo] = createSignal("Approval code sent to the administrator email.");
  const [loading, setLoading] = createSignal(false);
  const [resendLoading, setResendLoading] = createSignal(false);
  const [cooldown, setCooldown] = createSignal(0);

  onMount(async () => {
    const status = await authApi.getRegistrationStatus();
    if (!status.hasPending) {
      navigate("/register");
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setFieldError("");

    const parsed = verifyRegistrationSchema.safeParse({ otp: otp() });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0]?.message ?? "Invalid code");
      return;
    }

    setLoading(true);
    try {
      await authApi.verifyRegistration(parsed.data.otp);
      window.location.href = "/login?registered=1";
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Verification failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown() > 0) return;
    setResendLoading(true);
    setError("");
    try {
      const result = await authApi.resendRegistrationOtp();
      if (result.sent) {
        setInfo("A new approval code was sent to the administrator email.");
      } else {
        setInfo("The current approval code is still valid.");
      }
      setCooldown(60);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to resend code");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to resend code");
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div class="bf-grid-bg flex min-h-screen items-center justify-center p-4">
      <Title>Verify Registration — Admin</Title>
      <div class="w-full max-w-md border border-bf-border bg-bf-surface p-8">
        <p class="mb-1 text-caption text-bf-text-muted">lite.linux / admin</p>
        <h1 class="mb-2 text-heading text-bf-text">Verify_Registration</h1>
        <p class="mb-6 text-body text-bf-text-muted">{info()}</p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="mb-1 block text-caption text-bf-text-muted" for="reg-otp">
              Approval code
            </label>
            <Input
              id="reg-otp"
              inputMode="numeric"
              maxLength={6}
              autocomplete="one-time-code"
              value={otp()}
              onInput={(e) => setOtp(e.currentTarget.value)}
            />
            <Show when={fieldError()}>
              {(msg) => <p class="mt-1 text-caption text-bf-error">{msg()}</p>}
            </Show>
          </div>
          <Show when={error()}>
            {(msg) => <p class="text-body text-bf-error">{msg()}</p>}
          </Show>
          <Button type="submit" disabled={loading()} class="w-full">
            {loading() ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div class="mt-4 flex flex-col gap-2">
          <Button
            type="button"
            variant="ghost"
            disabled={resendLoading() || cooldown() > 0}
            class="w-full"
            onClick={handleResend}
          >
            {cooldown() > 0
              ? `Resend in ${cooldown()}s`
              : resendLoading()
                ? "Sending..."
                : "Resend code"}
          </Button>
          <A href="/register" class="text-center text-caption text-bf-accent hover:underline">
            Back to registration
          </A>
        </div>
      </div>
    </div>
  );
}
