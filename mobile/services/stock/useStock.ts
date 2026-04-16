import { useApiMutation } from '@/services/api/useApiMutation';
import { useApiQuery } from '@/services/api/useApiQuery';
import type {
  CreateStockItemRequest,
  EditStockItemRequest,
  PaginatedResponse,
  ReplenishStockRequest,
  StockItem,
  StockMovement,
} from '@/types/api';
import {
  createStockItem,
  editStockItem,
  getStockItem,
  listMovements,
  listStockItems,
  replenishStock,
} from './stockService';

export function useStockItems(lowStock?: boolean) {
  return useApiQuery<StockItem[]>(() => listStockItems(lowStock), [lowStock]);
}

export function useStockItem(id: string) {
  return useApiQuery<StockItem>(() => getStockItem(id), [id]);
}

export function useCreateStockItem() {
  return useApiMutation<CreateStockItemRequest, StockItem>(createStockItem);
}

export function useEditStockItem() {
  return useApiMutation<{ id: string; data: EditStockItemRequest }, StockItem>(
    ({ id, data }) => editStockItem(id, data)
  );
}

export function useReplenishStock() {
  return useApiMutation<{ id: string; data: ReplenishStockRequest }, StockItem>(
    ({ id, data }) => replenishStock(id, data)
  );
}

export function useStockMovements(id: string, page?: number, pageSize?: number) {
  return useApiQuery<PaginatedResponse<StockMovement>>(
    () => listMovements(id, page, pageSize),
    [id, page, pageSize]
  );
}
