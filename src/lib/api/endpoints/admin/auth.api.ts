import { fetcher } from "../../api-client";
import type { AdminUser } from "../../types/portfolio.types";

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
};

export type RegistrationStatus = {
  hasPending: boolean;
  otpExpiresAt?: string;
  locked?: boolean;
};

export const authApi = {
  login: (email: string, password: string) =>
    fetcher<{ admin: AdminUser }>("/api/v1/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      strict: false,
    }),
  logout: () =>
    fetcher<null>("/api/v1/admin/auth/logout", { method: "POST", strict: false }),
  refresh: () =>
    fetcher<null>("/api/v1/admin/auth/refresh", { method: "POST", strict: false }),
  check: () =>
    fetcher<{ admin: AdminUser }>("/api/v1/admin/auth/check", { strict: false }).catch(() => null),
  register: (body: RegisterPayload) =>
    fetcher<{ pendingId: string; otpExpiresAt: string }>("/api/v1/admin/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
      strict: false,
    }),
  verifyRegistration: (otp: string) =>
    fetcher<{ admin: AdminUser }>("/api/v1/admin/auth/verify-registration", {
      method: "POST",
      body: JSON.stringify({ otp }),
      strict: false,
    }),
  resendRegistrationOtp: () =>
    fetcher<{ otpExpiresAt: string; sent: boolean }>(
      "/api/v1/admin/auth/resend-registration-otp",
      { method: "POST", strict: false },
    ),
  getRegistrationStatus: () =>
    fetcher<RegistrationStatus>("/api/v1/admin/auth/registration-status", {
      strict: false,
    }).catch(() => ({ hasPending: false })),
};
