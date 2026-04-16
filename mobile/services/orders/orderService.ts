import { apiFetch } from '@/services/api/client';
import type {
  CreateServiceOrderRequest,
  CreateServiceOrderResponse,
  EditServiceOrderRequest,
  OrderListParams,
  PaginatedResponse,
  ServiceOrder,
  UpdateServiceOrderStatusRequest,
} from '@/types/api';

export function listOrders(
  params?: OrderListParams
): Promise<PaginatedResponse<ServiceOrder>> {
  return apiFetch<PaginatedResponse<ServiceOrder>>('/api/ServiceOrder', {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getOrder(id: string): Promise<ServiceOrder> {
  return apiFetch<ServiceOrder>(`/api/ServiceOrder/${id}`);
}

export function createOrder(
  data: CreateServiceOrderRequest
): Promise<CreateServiceOrderResponse> {
  return apiFetch<CreateServiceOrderResponse>('/api/ServiceOrder', {
    method: 'POST',
    body: data,
  });
}

export function editOrder(
  id: string,
  data: EditServiceOrderRequest
): Promise<ServiceOrder> {
  return apiFetch<ServiceOrder>(`/api/ServiceOrder/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function deleteOrder(id: string): Promise<void> {
  return apiFetch<void>(`/api/ServiceOrder/${id}`, {
    method: 'DELETE',
  });
}

export function updateOrderStatus(
  id: string,
  data: UpdateServiceOrderStatusRequest
): Promise<ServiceOrder> {
  return apiFetch<ServiceOrder>(`/api/ServiceOrder/${id}/status`, {
    method: 'PATCH',
    body: data,
  });
}
