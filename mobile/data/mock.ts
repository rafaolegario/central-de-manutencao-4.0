// ─── Types (mirror backend DTOs) ───────────────────────────────────────────

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

export interface MockUser {
  id: string;
  name: string;
  email: string;
  specialty: UserSpecialty;
  role: UserRole;
  active: boolean;
  createdAt: string;
}

export interface MockServiceOrder {
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

export interface MockServiceOrderLog {
  id: string;
  serviceOrderId: string;
  oldStatus: ServiceOrderStatus;
  newStatus: ServiceOrderStatus;
  changedAt: string;
  changedBy: string;
  description: string | null;
}

export interface MockCredential {
  email: string;
  password: string;
  userId: string;
}

// ─── Label Maps ─────────────────────────────────────────────────────────────

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

// ─── Mock Credentials ───────────────────────────────────────────────────────

export const MOCK_CREDENTIALS: MockCredential[] = [
  { email: 'admin@empresa.com', password: '123456', userId: 'u-001' },
  { email: 'joao.silva@empresa.com', password: '123456', userId: 'u-002' },
  { email: 'rafael.mendes@empresa.com', password: '123456', userId: 'u-008' },
];

// ─── Mock Users ─────────────────────────────────────────────────────────────

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u-001',
    name: 'Carlos Administrador',
    email: 'admin@empresa.com',
    specialty: 'General',
    role: 'Admin',
    active: true,
    createdAt: '2025-01-10T08:00:00Z',
  },
  {
    id: 'u-002',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    specialty: 'Eletrician',
    role: 'Technician',
    active: true,
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    id: 'u-003',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    specialty: 'Mechanic',
    role: 'Technician',
    active: true,
    createdAt: '2025-01-20T10:00:00Z',
  },
  {
    id: 'u-004',
    name: 'Pedro Costa',
    email: 'pedro.costa@empresa.com',
    specialty: 'Electromechanic',
    role: 'Technician',
    active: true,
    createdAt: '2025-02-01T08:30:00Z',
  },
  {
    id: 'u-005',
    name: 'Ana Oliveira',
    email: 'ana.oliveira@empresa.com',
    specialty: 'General',
    role: 'Technician',
    active: true,
    createdAt: '2025-02-10T09:00:00Z',
  },
  {
    id: 'u-006',
    name: 'Lucas Ferreira',
    email: 'lucas.ferreira@empresa.com',
    specialty: 'Eletrician',
    role: 'Technician',
    active: false,
    createdAt: '2025-02-15T11:00:00Z',
  },
  {
    id: 'u-007',
    name: 'Fernanda Lima',
    email: 'fernanda.lima@empresa.com',
    specialty: 'Mechanic',
    role: 'Technician',
    active: true,
    createdAt: '2025-03-01T08:00:00Z',
  },
  {
    id: 'u-008',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@empresa.com',
    specialty: 'General',
    role: 'Admin',
    active: true,
    createdAt: '2025-01-10T08:00:00Z',
  },
];

// ─── Mock Service Orders ─────────────────────────────────────────────────────

export const MOCK_SERVICE_ORDERS: MockServiceOrder[] = [
  {
    id: 'os-001',
    title: 'Substituição de rolamento — Motor da Esteira 3',
    description:
      'Motor apresentando vibração excessiva e ruído anormal. Necessária substituição imediata do rolamento dianteiro para evitar parada de linha.',
    location: 'Galpão A — Linha 3',
    createdAt: '2026-03-28T08:00:00Z',
    updatedAt: '2026-04-02T09:00:00Z',
    assignedAt: '2026-04-01T08:00:00Z',
    dueDate: '2026-04-10T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Critical',
    status: 'InProgress',
    technicianId: 'u-004',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes: null,
  },
  {
    id: 'os-002',
    title: 'Inspeção do painel elétrico — Setor B',
    description:
      'Painel elétrico do setor B apresentando aquecimento acima do normal. Verificar estado dos disjuntores, conexões e possível sobrecarga no circuito.',
    location: 'Setor B — Subestação 2',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: null,
    assignedAt: null,
    dueDate: '2026-04-12T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'High',
    status: 'Open',
    technicianId: null,
    createdBy: 'u-001',
    assignedBy: null,
    completionNotes: null,
  },
  {
    id: 'os-003',
    title: 'Troca de correia transportadora — Setor C',
    description:
      'Correia apresentando desgaste severo na borda lateral. Risco de ruptura iminente. Solicitar peça de reposição e realizar troca preventiva.',
    location: 'Setor C — Linha de Montagem',
    createdAt: '2026-03-30T14:00:00Z',
    updatedAt: '2026-04-03T11:00:00Z',
    assignedAt: '2026-04-03T11:00:00Z',
    dueDate: '2026-04-08T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'High',
    status: 'Assigned',
    technicianId: 'u-003',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes: null,
  },
  {
    id: 'os-004',
    title: 'Vazamento de óleo — Compressor 2',
    description:
      'Identificado vazamento de óleo no compressor 2 do setor industrial. Serviço pausado aguardando chegada de junta de vedação específica para o modelo.',
    location: 'Setor Industrial — Sala de Compressores',
    createdAt: '2026-03-25T09:00:00Z',
    updatedAt: '2026-04-05T16:00:00Z',
    assignedAt: '2026-03-26T08:00:00Z',
    dueDate: '2026-04-15T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Critical',
    status: 'Paused',
    technicianId: 'u-007',
    createdBy: 'u-008',
    assignedBy: 'u-008',
    completionNotes: null,
  },
  {
    id: 'os-005',
    title: 'Calibração de sensores — Linha de Montagem',
    description:
      'Calibração periódica dos sensores de proximidade e temperatura da linha de montagem conforme cronograma de manutenção preventiva.',
    location: 'Setor C — Linha de Montagem',
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-03-28T17:00:00Z',
    assignedAt: '2026-03-21T09:00:00Z',
    dueDate: '2026-03-30T18:00:00Z',
    completedAt: '2026-03-28T17:00:00Z',
    approvedAt: null,
    rejectedAt: null,
    priority: 'Medium',
    status: 'Completed',
    technicianId: 'u-002',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes:
      'Todos os 12 sensores calibrados com sucesso. Leituras dentro dos parâmetros estabelecidos. Próxima calibração prevista para 20/06/2026.',
  },
  {
    id: 'os-006',
    title: 'Revisão geral — Gerador de Emergência',
    description:
      'Revisão completa do gerador de emergência incluindo troca de óleo, filtros, verificação do sistema de partida e teste de carga.',
    location: 'Casa de Máquinas — Gerador 1',
    createdAt: '2026-03-15T08:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
    assignedAt: '2026-03-16T09:00:00Z',
    dueDate: '2026-04-01T18:00:00Z',
    completedAt: '2026-04-01T10:00:00Z',
    approvedAt: '2026-04-02T09:00:00Z',
    rejectedAt: null,
    priority: 'High',
    status: 'Approved',
    technicianId: 'u-004',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes:
      'Revisão completa realizada. Óleo e filtros trocados. Sistema de partida testado com sucesso. Gerador em perfeito estado de funcionamento.',
  },
  {
    id: 'os-007',
    title: 'Ruído anormal — Bomba Hidráulica 1',
    description:
      'Bomba hidráulica 1 apresentando ruído de cavitação. Após inspeção, identificado que o problema é estrutural e requer substituição completa da unidade.',
    location: 'Setor Hidráulico — Bomba 1',
    createdAt: '2026-03-10T11:00:00Z',
    updatedAt: '2026-03-22T14:00:00Z',
    assignedAt: '2026-03-11T08:00:00Z',
    dueDate: '2026-03-20T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: '2026-03-22T14:00:00Z',
    priority: 'Medium',
    status: 'Rejected',
    technicianId: 'u-002',
    createdBy: 'u-008',
    assignedBy: 'u-008',
    completionNotes: null,
  },
  {
    id: 'os-008',
    title: 'Limpeza do sistema de filtragem — Ar Comprimido',
    description:
      'Limpeza programada dos filtros do sistema de ar comprimido. Serviço cancelado pois a linha foi desativada temporariamente para reforma do setor.',
    location: 'Setor D — Rede de Ar Comprimido',
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-08T16:00:00Z',
    assignedAt: null,
    dueDate: '2026-03-15T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Low',
    status: 'Canceled',
    technicianId: null,
    createdBy: 'u-001',
    assignedBy: null,
    completionNotes: null,
  },
  {
    id: 'os-009',
    title: 'Falha intermitente — CLP da Linha 5',
    description:
      'CLP da linha 5 apresentando falhas intermitentes de comunicação. Problema reapareceu após reparo anterior. Necessária análise aprofundada do firmware e hardware.',
    location: 'Galpão B — Linha 5',
    createdAt: '2026-04-03T07:00:00Z',
    updatedAt: '2026-04-08T10:00:00Z',
    assignedAt: '2026-04-04T08:00:00Z',
    dueDate: '2026-04-11T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Critical',
    status: 'Reopened',
    technicianId: 'u-002',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes: null,
  },
  {
    id: 'os-010',
    title: 'Manutenção preventiva — Transportador de Correia',
    description:
      'Manutenção preventiva trimestral do transportador de correia principal. Lubrificação dos rolamentos, verificação de tensão e alinhamento da correia.',
    location: 'Galpão A — Transportador Principal',
    createdAt: '2026-04-07T09:00:00Z',
    updatedAt: null,
    assignedAt: null,
    dueDate: '2026-04-20T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Medium',
    status: 'Open',
    technicianId: null,
    createdBy: 'u-001',
    assignedBy: null,
    completionNotes: null,
  },
  {
    id: 'os-011',
    title: 'Troca de lâmpadas LED — Setor D',
    description:
      'Substituição de lâmpadas com defeito no setor D. Total de 8 luminárias com lâmpadas queimadas identificadas durante inspeção de rotina.',
    location: 'Setor D — Área de Expedição',
    createdAt: '2026-04-08T10:00:00Z',
    updatedAt: null,
    assignedAt: null,
    dueDate: '2026-04-25T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'Low',
    status: 'Open',
    technicianId: null,
    createdBy: 'u-008',
    assignedBy: null,
    completionNotes: null,
  },
  {
    id: 'os-012',
    title: 'Verificação de aterramento — Painéis Elétricos',
    description:
      'Verificação e medição da resistência de aterramento de todos os painéis elétricos conforme norma ABNT NBR 5410. Adequação obrigatória para renovação do alvará.',
    location: 'Múltiplos setores',
    createdAt: '2026-04-05T08:00:00Z',
    updatedAt: '2026-04-07T09:00:00Z',
    assignedAt: '2026-04-07T09:00:00Z',
    dueDate: '2026-04-18T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'High',
    status: 'Assigned',
    technicianId: 'u-002',
    createdBy: 'u-001',
    assignedBy: 'u-001',
    completionNotes: null,
  },
];

// ─── Mock Service Order Logs ─────────────────────────────────────────────────

export const MOCK_SERVICE_ORDER_LOGS: MockServiceOrderLog[] = [
  // os-001 (InProgress)
  { id: 'log-001-1', serviceOrderId: 'os-001', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-04-01T08:00:00Z', changedBy: 'u-001', description: 'Técnico Pedro Costa alocado para o serviço.' },
  { id: 'log-001-2', serviceOrderId: 'os-001', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-04-02T09:00:00Z', changedBy: 'u-004', description: 'Início dos trabalhos. Rolamento em análise.' },

  // os-003 (Assigned)
  { id: 'log-003-1', serviceOrderId: 'os-003', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-04-03T11:00:00Z', changedBy: 'u-001', description: 'Técnica Maria Santos designada para o serviço.' },

  // os-004 (Paused)
  { id: 'log-004-1', serviceOrderId: 'os-004', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-03-26T08:00:00Z', changedBy: 'u-008', description: 'Fernanda Lima alocada para o reparo.' },
  { id: 'log-004-2', serviceOrderId: 'os-004', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-03-27T09:00:00Z', changedBy: 'u-007', description: 'Início da inspeção do vazamento.' },
  { id: 'log-004-3', serviceOrderId: 'os-004', oldStatus: 'InProgress', newStatus: 'Paused', changedAt: '2026-04-05T16:00:00Z', changedBy: 'u-007', description: 'Pausado. Aguardando junta de vedação modelo XJ-42 (pedido realizado).' },

  // os-005 (Completed)
  { id: 'log-005-1', serviceOrderId: 'os-005', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-03-21T09:00:00Z', changedBy: 'u-001', description: 'João Silva designado para calibração.' },
  { id: 'log-005-2', serviceOrderId: 'os-005', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-03-25T08:00:00Z', changedBy: 'u-002', description: 'Início da calibração dos sensores.' },
  { id: 'log-005-3', serviceOrderId: 'os-005', oldStatus: 'InProgress', newStatus: 'Completed', changedAt: '2026-03-28T17:00:00Z', changedBy: 'u-002', description: 'Todos os 12 sensores calibrados com sucesso.' },

  // os-006 (Approved)
  { id: 'log-006-1', serviceOrderId: 'os-006', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-03-16T09:00:00Z', changedBy: 'u-001', description: 'Pedro Costa designado para revisão.' },
  { id: 'log-006-2', serviceOrderId: 'os-006', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-03-20T08:00:00Z', changedBy: 'u-004', description: 'Início da revisão geral.' },
  { id: 'log-006-3', serviceOrderId: 'os-006', oldStatus: 'InProgress', newStatus: 'Completed', changedAt: '2026-04-01T10:00:00Z', changedBy: 'u-004', description: 'Revisão concluída com sucesso.' },
  { id: 'log-006-4', serviceOrderId: 'os-006', oldStatus: 'Completed', newStatus: 'Approved', changedAt: '2026-04-02T09:00:00Z', changedBy: 'u-001', description: 'Serviço aprovado após inspeção visual.' },

  // os-007 (Rejected)
  { id: 'log-007-1', serviceOrderId: 'os-007', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-03-11T08:00:00Z', changedBy: 'u-008', description: 'João Silva designado para diagnóstico.' },
  { id: 'log-007-2', serviceOrderId: 'os-007', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-03-12T09:00:00Z', changedBy: 'u-002', description: 'Início do diagnóstico.' },
  { id: 'log-007-3', serviceOrderId: 'os-007', oldStatus: 'InProgress', newStatus: 'Rejected', changedAt: '2026-03-22T14:00:00Z', changedBy: 'u-008', description: 'Rejeitado. Problema estrutural identificado — requer substituição completa da unidade, não reparo.' },

  // os-008 (Canceled)
  { id: 'log-008-1', serviceOrderId: 'os-008', oldStatus: 'Open', newStatus: 'Canceled', changedAt: '2026-03-08T16:00:00Z', changedBy: 'u-001', description: 'Linha desativada para reforma. Serviço cancelado.' },

  // os-009 (Reopened)
  { id: 'log-009-1', serviceOrderId: 'os-009', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-04-04T08:00:00Z', changedBy: 'u-001', description: 'João Silva designado para análise.' },
  { id: 'log-009-2', serviceOrderId: 'os-009', oldStatus: 'Assigned', newStatus: 'InProgress', changedAt: '2026-04-05T09:00:00Z', changedBy: 'u-002', description: 'Início da análise do CLP.' },
  { id: 'log-009-3', serviceOrderId: 'os-009', oldStatus: 'InProgress', newStatus: 'Completed', changedAt: '2026-04-06T17:00:00Z', changedBy: 'u-002', description: 'Firmware atualizado e problema aparentemente resolvido.' },
  { id: 'log-009-4', serviceOrderId: 'os-009', oldStatus: 'Completed', newStatus: 'Reopened', changedAt: '2026-04-08T10:00:00Z', changedBy: 'u-001', description: 'Falha retornou após 2 dias. Necessária análise de hardware.' },

  // os-012 (Assigned)
  { id: 'log-012-1', serviceOrderId: 'os-012', oldStatus: 'Open', newStatus: 'Assigned', changedAt: '2026-04-07T09:00:00Z', changedBy: 'u-001', description: 'João Silva designado para verificação de aterramento.' },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────

export function getUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.id === id);
}

export function getOrderById(id: string): MockServiceOrder | undefined {
  return MOCK_SERVICE_ORDERS.find((o) => o.id === id);
}

export function getLogsForOrder(orderId: string): MockServiceOrderLog[] {
  return MOCK_SERVICE_ORDER_LOGS.filter((l) => l.serviceOrderId === orderId).sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );
}

export function getTechnicianName(id: string | null): string {
  if (!id) return 'Não atribuído';
  return getUserById(id)?.name ?? 'Desconhecido';
}

export function getInitials(name: string): string {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR') + ' ' +
    new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
