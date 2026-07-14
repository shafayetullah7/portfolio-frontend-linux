import { ApiError } from "./types/index";
import { config } from "../config";
import { authApi } from "./endpoints/admin/auth.api";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean;
  unwrapData?: boolean;
  _retried?: boolean;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function buildURL(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  const base = config.api.baseUrl.endsWith("/")
    ? config.api.baseUrl
    : `${config.api.baseUrl}/`;
  const path = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

async function parseResponse<T>(response: Response, unwrapData: boolean): Promise<T> {
  if (response.status === 204) return {} as T;
  const result = await response.json().catch(() => ({}));
  if (unwrapData && result && typeof result === "object" && "data" in result) {
    return result.data as T;
  }
  return result as T;
}

export async function fetcher<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { params, strict = true, unwrapData = true, _retried = false, ...init } = options;
  const url = buildURL(endpoint, params);
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  const method = init.method?.toUpperCase() || "GET";
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    const xsrf = getCookie("xsrf-token");
    if (xsrf) headers.set("X-XSRF-TOKEN", xsrf);
  }

  const response = await fetch(url, { ...init, headers, credentials: "include" });

  if (
    response.status === 401 &&
    strict &&
    !_retried &&
    typeof window !== "undefined" &&
    endpoint.includes("/admin/") &&
    !endpoint.includes("/admin/auth/")
  ) {
    try {
      await authApi.refresh();
      return fetcher<T>(endpoint, { ...options, _retried: true });
    } catch {
      window.location.href = "/login";
      throw new ApiError("Unauthorized", 401);
    }
  }

  if (response.status === 401 && strict) {
    if (typeof window !== "undefined" && !endpoint.includes("/admin/auth/")) {
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401);
  }

  if (!response.ok) {
    if (strict || response.status !== 404) {
      const err = await response.json().catch(() => ({}));
      throw new ApiError(
        (err as { message?: string }).message || `API Error ${response.status}`,
        response.status,
        err,
      );
    }
  }

  return parseResponse<T>(response, unwrapData);
}

/** Cookie-free GET for public endpoints — safe on SSR and in the browser. */
export async function publicGet<T>(
  endpoint: string,
  options: { strict?: boolean; unwrapData?: boolean } = {},
): Promise<T> {
  const { strict = true, unwrapData = true } = options;
  const response = await fetch(buildURL(endpoint), { credentials: "omit" });

  if (!response.ok) {
    if (strict || response.status !== 404) {
      const err = await response.json().catch(() => ({}));
      throw new ApiError(
        (err as { message?: string }).message || `API Error ${response.status}`,
        response.status,
        err,
      );
    }
  }

  return parseResponse<T>(response, unwrapData);
}
