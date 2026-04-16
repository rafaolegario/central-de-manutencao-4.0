import type { ApiErrorResponse, RefreshTokenResponse } from '@/types/api';
import { API_BASE_URL } from './config';
import { ApiError } from './errors';

// ─── In-memory token state ─────────────────────────────────────────────────

let accessToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

// ─── Request types ──────────────────────────────────────────────────────────

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

// ─── Query string builder ───────────────────────────────────────────────────

function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ''
  );
  if (entries.length === 0) return '';
  const qs = entries
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
  return `?${qs}`;
}

// ─── Token refresh ──────────────────────────────────────────────────────────

let isRefreshing = false;

async function tryRefreshToken(): Promise<boolean> {
  if (isRefreshing || !accessToken) return false;
  isRefreshing = true;
  try {
    const res = await fetch(`${API_BASE_URL}/api/Authenticate/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) return false;
    const data: RefreshTokenResponse = await res.json();
    accessToken = data.token;
    return true;
  } catch {
    return false;
  } finally {
    isRefreshing = false;
  }
}

// ─── Core fetch function ────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, params, skipAuth = false } = options;

  const qs = params ? buildQueryString(params) : '';
  const url = `${API_BASE_URL}${path}${qs}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth && accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const fetchOptions: RequestInit = { method, headers };
  if (body !== undefined) {
    fetchOptions.body = JSON.stringify(body);
  }

  let response = await fetch(url, fetchOptions);

  // Handle 401: try refresh once, then retry
  if (response.status === 401 && !skipAuth) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...fetchOptions, headers });
    } else {
      onUnauthorized?.();
      throw new ApiError(401, ['Sessão expirada. Faça login novamente.']);
    }
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  // Handle errors
  if (!response.ok) {
    const errorBody: ApiErrorResponse | null = await response
      .json()
      .catch(() => null);
    const errors = errorBody?.errorMessages ?? [`Erro ${response.status}`];
    throw new ApiError(response.status, errors);
  }

  return response.json() as Promise<T>;
}
