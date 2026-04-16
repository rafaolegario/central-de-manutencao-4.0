import { apiFetch } from '@/services/api/client';
import type { AuthResponse, LoginRequest, RefreshTokenResponse } from '@/types/api';

export function loginApi(email: string, password: string): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/Authenticate/login', {
    method: 'POST',
    body: { email, password } satisfies LoginRequest,
    skipAuth: true,
  });
}

export function refreshTokenApi(): Promise<RefreshTokenResponse> {
  return apiFetch<RefreshTokenResponse>('/api/Authenticate/refresh', {
    method: 'POST',
  });
}

export function logoutApi(): Promise<void> {
  return apiFetch<void>('/api/Authenticate/logout', {
    method: 'POST',
  });
}
