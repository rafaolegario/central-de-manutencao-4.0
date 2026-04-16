import { apiFetch } from '@/services/api/client';
import type {
  CreateStockItemRequest,
  EditStockItemRequest,
  PaginatedResponse,
  ReplenishStockRequest,
  StockItem,
  StockMovement,
} from '@/types/api';

export function listStockItems(lowStock?: boolean): Promise<StockItem[]> {
  return apiFetch<StockItem[]>('/api/stock', {
    params: lowStock !== undefined ? { lowStock } : undefined,
  });
}

export function getStockItem(id: string): Promise<StockItem> {
  return apiFetch<StockItem>(`/api/stock/${id}`);
}

export function createStockItem(data: CreateStockItemRequest): Promise<StockItem> {
  return apiFetch<StockItem>('/api/stock', {
    method: 'POST',
    body: data,
  });
}

export function editStockItem(
  id: string,
  data: EditStockItemRequest
): Promise<StockItem> {
  return apiFetch<StockItem>(`/api/stock/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function replenishStock(
  id: string,
  data: ReplenishStockRequest
): Promise<StockItem> {
  return apiFetch<StockItem>(`/api/stock/${id}/replenish`, {
    method: 'POST',
    body: data,
  });
}

export function listMovements(
  id: string,
  page?: number,
  pageSize?: number
): Promise<PaginatedResponse<StockMovement>> {
  return apiFetch<PaginatedResponse<StockMovement>>(
    `/api/stock/${id}/movements`,
    { params: { page, pageSize } }
  );
}
