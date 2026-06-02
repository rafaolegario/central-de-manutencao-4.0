import { apiFetch } from '@/services/api/client';
import type {
  AuthResponse,
  CheckEmailRequest,
  CheckEmailResponse,
  LoginRequest,
  RefreshTokenResponse,
  RegisterFirstAdminRequest,
  SetFirstPasswordRequest,
} from '@/types/api';

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

export function checkEmailApi(email: string): Promise<CheckEmailResponse> {
  return apiFetch<CheckEmailResponse>('/api/Authenticate/check-email', {
    method: 'POST',
    body: { email } satisfies CheckEmailRequest,
    skipAuth: true,
  });
}

export function setFirstPasswordApi(
  email: string,
  newPassword: string,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/Authenticate/set-password', {
    method: 'POST',
    body: { email, newPassword } satisfies SetFirstPasswordRequest,
    skipAuth: true,
  });
}

export function registerFirstAdminApi(
  data: RegisterFirstAdminRequest,
): Promise<AuthResponse> {
  return apiFetch<AuthResponse>('/api/Authenticate/register-first-admin', {
    method: 'POST',
    body: data,
    skipAuth: true,
  });
}
