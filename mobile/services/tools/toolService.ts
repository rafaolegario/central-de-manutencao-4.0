import { apiFetch } from '@/services/api/client';
import type {
  ActiveToolUsageListResponse,
  CreateToolRequest,
  EditToolRequest,
  Tool,
  ToolUsage,
  WithdrawToolRequest,
} from '@/types/api';

export function listTools(available?: boolean): Promise<Tool[]> {
  return apiFetch<Tool[]>('/api/tools', {
    params: available !== undefined ? { available } : undefined,
  });
}

export function getTool(id: string): Promise<Tool> {
  return apiFetch<Tool>(`/api/tools/${id}`);
}

export function createTool(data: CreateToolRequest): Promise<Tool> {
  return apiFetch<Tool>('/api/tools', {
    method: 'POST',
    body: data,
  });
}

export function editTool(id: string, data: EditToolRequest): Promise<Tool> {
  return apiFetch<Tool>(`/api/tools/${id}`, {
    method: 'PUT',
    body: data,
  });
}

export function withdrawTool(
  toolId: string,
  data: WithdrawToolRequest
): Promise<ToolUsage> {
  return apiFetch<ToolUsage>(`/api/tools/${toolId}/withdraw`, {
    method: 'POST',
    body: data,
  });
}

export function returnTool(usageId: string): Promise<ToolUsage> {
  return apiFetch<ToolUsage>(`/api/tools/usage/${usageId}/return`, {
    method: 'POST',
  });
}

export function listActiveUsages(): Promise<ActiveToolUsageListResponse> {
  return apiFetch<ActiveToolUsageListResponse>('/api/tools/usage/active');
}
