import { useApiMutation } from '@/services/api/useApiMutation';
import { useApiQuery } from '@/services/api/useApiQuery';
import type {
  CreateServiceOrderRequest,
  CreateServiceOrderResponse,
  EditServiceOrderRequest,
  OrderListParams,
  PaginatedResponse,
  ServiceOrder,
  ServiceOrderLog,
  UpdateServiceOrderStatusRequest,
} from '@/types/api';
import {
  createOrder,
  deleteOrder,
  editOrder,
  getOrder,
  getOrderLogs,
  listOrders,
  updateOrderStatus,
} from './orderService';

export function useOrders(params?: OrderListParams) {
  return useApiQuery<PaginatedResponse<ServiceOrder>>(
    () => listOrders(params),
    [params?.status, params?.priority, params?.technicianId, params?.page, params?.pageSize]
  );
}

export function useOrder(id: string) {
  return useApiQuery<ServiceOrder>(() => getOrder(id), [id]);
}

export function useOrderLogs(id: string) {
  return useApiQuery<ServiceOrderLog[]>(() => getOrderLogs(id), [id]);
}

export function useCreateOrder() {
  return useApiMutation<CreateServiceOrderRequest, CreateServiceOrderResponse>(
    createOrder
  );
}

export function useEditOrder() {
  return useApiMutation<
    { id: string; data: EditServiceOrderRequest },
    ServiceOrder
  >(({ id, data }) => editOrder(id, data));
}

export function useDeleteOrder() {
  return useApiMutation<string, void>(deleteOrder);
}

export function useUpdateOrderStatus() {
  return useApiMutation<
    { id: string; data: UpdateServiceOrderStatusRequest },
    ServiceOrder
  >(({ id, data }) => updateOrderStatus(id, data));
}
