import { ApiError } from "./types/index";
import { config } from "../config";

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  strict?: boolean;
  unwrapData?: boolean;
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
  const { params, strict = true, unwrapData = true, ...init } = options;
  const url = buildURL(endpoint, params);
  const headers = new Headers(init.headers || {});
  if (!headers.has("Content-Type") && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...init, headers });

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
