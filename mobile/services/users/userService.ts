import { apiFetch } from '@/services/api/client';
import type {
  CreateUserRequest,
  CreateUserResponse,
  EditUserRequest,
  ToggleUserActiveRequest,
  User,
  UserListParams,
} from '@/types/api';

export function listUsers(params?: UserListParams): Promise<User[]> {
  return apiFetch<User[]>('/api/User', {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getUser(id: string): Promise<User> {
  return apiFetch<User>(`/api/User/${id}`);
}

export function createUser(data: CreateUserRequest): Promise<CreateUserResponse> {
  return apiFetch<CreateUserResponse>('/api/User', {
    method: 'POST',
    body: data,
  });
}

export function editUser(id: string, data: EditUserRequest): Promise<User> {
  return apiFetch<User>(`/api/User/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteUser(id: string): Promise<void> {
  return apiFetch<void>(`/api/User/${id}`, {
    method: 'DELETE',
  });
}

export function toggleUserActive(id: string, active: boolean): Promise<void> {
  return apiFetch<void>(`/api/User/${id}/active`, {
    method: 'PATCH',
    body: { active } satisfies ToggleUserActiveRequest,
  });
}
