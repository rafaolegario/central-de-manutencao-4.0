import { useApiMutation } from '@/services/api/useApiMutation';
import { useApiQuery } from '@/services/api/useApiQuery';
import type {
  CreateUserRequest,
  CreateUserResponse,
  EditUserRequest,
  User,
  UserListParams,
} from '@/types/api';
import {
  createUser,
  deleteUser,
  editUser,
  getUser,
  listUsers,
  toggleUserActive,
} from './userService';

export function useUsers(params?: UserListParams) {
  return useApiQuery<User[]>(
    () => listUsers(params),
    [params?.role, params?.specialty, params?.active]
  );
}

export function useUser(id: string) {
  return useApiQuery<User>(() => getUser(id), [id]);
}

export function useCreateUser() {
  return useApiMutation<CreateUserRequest, CreateUserResponse>(createUser);
}

export function useEditUser() {
  return useApiMutation<{ id: string; data: EditUserRequest }, User>(
    ({ id, data }) => editUser(id, data)
  );
}

export function useDeleteUser() {
  return useApiMutation<string, void>(deleteUser);
}

export function useToggleUserActive() {
  return useApiMutation<{ id: string; active: boolean }, void>(
    ({ id, active }) => toggleUserActive(id, active)
  );
}
