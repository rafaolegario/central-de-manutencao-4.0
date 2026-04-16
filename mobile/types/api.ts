// ─── Enums / Union Types ────────────────────────────────────────────────────

export type UserRole = 'Admin' | 'Technician';
export type UserSpecialty = 'Eletrician' | 'Mechanic' | 'Electromechanic' | 'General';

export type ServiceOrderStatus =
  | 'Open'
  | 'Assigned'
  | 'InProgress'
  | 'Paused'
  | 'Completed'
  | 'Approved'
  | 'Rejected'
  | 'Reopened'
  | 'Canceled';

export type ServiceOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type StockMovementType = 'In' | 'Out';

// ─── Generic ────────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}

export interface ApiErrorResponse {
  errorMessages: string[];
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  role: string;
  specialty: string | null;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: AuthUserResponse;
}

export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

// ─── Service Orders ─────────────────────────────────────────────────────────

export interface ServiceOrder {
  id: string;
  title: string;
  description: string;
  location: string | null;
  createdAt: string;
  updatedAt: string | null;
  assignedAt: string | null;
  dueDate: string | null;
  completedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  priority: ServiceOrderPriority;
  status: ServiceOrderStatus;
  technicianId: string | null;
  createdBy: string;
  assignedBy: string | null;
  completionNotes: string | null;
}

export interface CreateServiceOrderRequest {
  title: string;
  description: string;
  location?: string;
  priority: string;
  dueDate?: string;
}

export interface CreateServiceOrderResponse {
  id: string;
  title: string;
  description: string;
  location: string | null;
  priority: string;
  status: string;
  createdBy: string;
  dueDate: string | null;
}

export interface EditServiceOrderRequest {
  title?: string;
  description?: string;
  location?: string;
  dueDate?: string;
}

export interface UpdateServiceOrderStatusRequest {
  status: string;
  technicianId?: string;
  completionNotes?: string;
}

export interface OrderListParams {
  status?: string;
  priority?: string;
  technicianId?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  orderBy?: string;
  orderDirection?: string;
  page?: number;
  pageSize?: number;
}

// ─── Tools ──────────────────────────────────────────────────────────────────

export interface ToolUsage {
  id: string;
  toolId: string;
  toolName: string | null;
  workOrderId: string | null;
  technicianId: string | null;
  technicianName: string | null;
  withdrawnAt: string;
  returnedAt: string | null;
}

export interface Tool {
  id: string;
  code: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
  openUsages: ToolUsage[] | null;
}

export interface CreateToolRequest {
  code: string;
  name: string;
  totalQuantity: string;
}

export interface EditToolRequest {
  code?: string;
  name?: string;
}

export interface WithdrawToolRequest {
  workOrderId: string;
}

export interface ActiveToolUsageListResponse {
  items: ToolUsage[];
}

// ─── Stock ──────────────────────────────────────────────────────────────────

export interface StockItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  minQuantity: number;
  isLow: boolean;
  createdAt: string;
}

export interface CreateStockItemRequest {
  code: string;
  name: string;
  quantity: string;
  minQuantity: string;
}

export interface EditStockItemRequest {
  code?: string;
  name?: string;
  minQuantity?: string;
}

export interface ReplenishStockRequest {
  quantity: string;
  note?: string;
}

export interface StockMovement {
  id: string;
  type: StockMovementType;
  quantity: number;
  workOrderId: string | null;
  note: string | null;
  createdAt: string;
}

// ─── Users ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
  role: string;
  active: boolean;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  specialty?: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
  specialty: string | null;
}

export interface EditUserRequest {
  name?: string;
  email?: string;
  specialty?: string;
  active?: boolean;
}

export interface ToggleUserActiveRequest {
  active: boolean;
}

export interface UserListParams {
  role?: string;
  specialty?: string;
  active?: boolean;
}
