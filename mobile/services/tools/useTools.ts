import { useApiMutation } from '@/services/api/useApiMutation';
import { useApiQuery } from '@/services/api/useApiQuery';
import type {
  ActiveToolUsageListResponse,
  CreateToolRequest,
  EditToolRequest,
  Tool,
  ToolUsage,
} from '@/types/api';
import {
  createTool,
  editTool,
  getTool,
  listActiveUsages,
  listTools,
  returnTool,
  withdrawTool,
} from './toolService';

export function useTools(available?: boolean) {
  return useApiQuery<Tool[]>(() => listTools(available), [available]);
}

export function useTool(id: string) {
  return useApiQuery<Tool>(() => getTool(id), [id]);
}

export function useCreateTool() {
  return useApiMutation<CreateToolRequest, Tool>(createTool);
}

export function useEditTool() {
  return useApiMutation<{ id: string; data: EditToolRequest }, Tool>(
    ({ id, data }) => editTool(id, data)
  );
}

export function useWithdrawTool() {
  return useApiMutation<{ toolId: string; workOrderId: string }, ToolUsage>(
    ({ toolId, workOrderId }) => withdrawTool(toolId, { workOrderId })
  );
}

export function useReturnTool() {
  return useApiMutation<string, ToolUsage>(returnTool);
}

export function useActiveUsages() {
  return useApiQuery<ActiveToolUsageListResponse>(listActiveUsages);
}
