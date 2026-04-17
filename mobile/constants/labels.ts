import type {
  ServiceOrderPriority,
  ServiceOrderStatus,
  StockMovementType,
  UserRole,
  UserSpecialty,
} from '@/types/api';

export const STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  Open: 'Aberta',
  Assigned: 'Atribuída',
  InProgress: 'Em Andamento',
  Paused: 'Pausada',
  Completed: 'Concluída',
  Approved: 'Aprovada',
  Rejected: 'Rejeitada',
  Reopened: 'Reaberta',
  Canceled: 'Cancelada',
};

export const PRIORITY_LABELS: Record<ServiceOrderPriority, string> = {
  Low: 'Baixa',
  Medium: 'Média',
  High: 'Alta',
  Critical: 'Crítica',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  Admin: 'Administrador',
  Technician: 'Técnico',
};

export const SPECIALTY_LABELS: Record<UserSpecialty, string> = {
  Eletrician: 'Eletricista',
  Mechanic: 'Mecânico',
  Electromechanic: 'Eletromecânico',
  General: 'Geral',
};

export const STOCK_MOVEMENT_LABELS: Record<StockMovementType, string> = {
  In: 'Entrada',
  Out: 'Saída',
};
