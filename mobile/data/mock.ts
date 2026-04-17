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

export {
  STATUS_LABELS,
  PRIORITY_LABELS,
  ROLE_LABELS,
  SPECIALTY_LABELS,
} from '@/constants/labels';

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
  {
    id: 'os-013',
    title: 'Reparo em quadro de comando — Prensa 2',
    description:
      'Quadro de comando da Prensa 2 apresentando disparo intermitente de disjuntor principal. Necessária inspeção de contatores, termostato e cabeamento interno.',
    location: 'Galpão B — Prensa 2',
    createdAt: '2026-04-10T07:30:00Z',
    updatedAt: '2026-04-13T09:00:00Z',
    assignedAt: '2026-04-11T08:00:00Z',
    dueDate: '2026-04-20T18:00:00Z',
    completedAt: null,
    approvedAt: null,
    rejectedAt: null,
    priority: 'High',
    status: 'InProgress',
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

// ─── Tools & Stock — Types ──────────────────────────────────────────────────

export type StockMovementType = 'In' | 'Out';

export interface MockTool {
  id: string;
  code: string;
  name: string;
  totalQuantity: number;
  availableQuantity: number;
  createdAt: string;
}

export interface MockToolUsage {
  id: string;
  toolId: string;
  workOrderId: string;
  technicianId: string;
  withdrawnAt: string;
  returnedAt: string | null;
}

export interface MockStockItem {
  id: string;
  code: string;
  name: string;
  quantity: number;
  minQuantity: number;
  createdAt: string;
}

export interface MockStockMovement {
  id: string;
  stockItemId: string;
  type: StockMovementType;
  quantity: number;
  workOrderId: string | null;
  note: string | null;
  createdAt: string;
}

export { STOCK_MOVEMENT_LABELS } from '@/constants/labels';

// ─── Mock Tools ─────────────────────────────────────────────────────────────

export const MOCK_TOOLS: MockTool[] = [
  { id: 't-001', code: 'MLT-DIG-01', name: 'Multímetro Digital Fluke 87V', totalQuantity: 5, availableQuantity: 3, createdAt: '2025-05-10T09:00:00Z' },
  { id: 't-002', code: 'CHV-IMP-18', name: 'Chave de Impacto 1/2" — 18V', totalQuantity: 3, availableQuantity: 1, createdAt: '2025-06-02T10:00:00Z' },
  { id: 't-003', code: 'FUR-IND-22', name: 'Furadeira Industrial 22mm', totalQuantity: 4, availableQuantity: 4, createdAt: '2025-06-20T11:00:00Z' },
  { id: 't-004', code: 'JGC-ESTR-12', name: 'Jogo de Chaves Estrela (12 peças)', totalQuantity: 10, availableQuantity: 7, createdAt: '2025-07-01T08:00:00Z' },
  { id: 't-005', code: 'ANL-VIB-01', name: 'Analisador de Vibração SKF', totalQuantity: 2, availableQuantity: 0, createdAt: '2025-07-15T09:30:00Z' },
  { id: 't-006', code: 'TRM-FLIR-E6', name: 'Termovisor FLIR E6', totalQuantity: 2, availableQuantity: 1, createdAt: '2025-08-03T10:00:00Z' },
  { id: 't-007', code: 'TRQ-100', name: 'Torquímetro 20–100 Nm', totalQuantity: 6, availableQuantity: 6, createdAt: '2025-09-12T09:00:00Z' },
  { id: 't-008', code: 'PQM-DIG-01', name: 'Paquímetro Digital 150mm', totalQuantity: 8, availableQuantity: 5, createdAt: '2025-10-05T08:30:00Z' },
];

// ─── Mock Tool Usages (active — ReturnedAt is null) ─────────────────────────

export const MOCK_TOOL_USAGES: MockToolUsage[] = [
  // Tool t-001 (Multímetro) — 2 out
  { id: 'tu-001', toolId: 't-001', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-13T09:15:00Z', returnedAt: null },
  { id: 'tu-002', toolId: 't-001', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-14T08:30:00Z', returnedAt: null },

  // Tool t-002 (Chave de Impacto) — 2 out
  { id: 'tu-003', toolId: 't-002', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-13T09:20:00Z', returnedAt: null },
  { id: 'tu-004', toolId: 't-002', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-14T08:32:00Z', returnedAt: null },

  // Tool t-004 (Jogo de Chaves Estrela) — 3 out
  { id: 'tu-005', toolId: 't-004', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-12T14:00:00Z', returnedAt: null },
  { id: 'tu-006', toolId: 't-004', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-13T10:00:00Z', returnedAt: null },
  { id: 'tu-007', toolId: 't-004', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-14T08:35:00Z', returnedAt: null },

  // Tool t-005 (Analisador de Vibração) — 2 out (all)
  { id: 'tu-008', toolId: 't-005', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-10T09:00:00Z', returnedAt: null },
  { id: 'tu-009', toolId: 't-005', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-11T13:00:00Z', returnedAt: null },

  // Tool t-006 (Termovisor) — 1 out
  { id: 'tu-010', toolId: 't-006', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-14T10:00:00Z', returnedAt: null },

  // Tool t-008 (Paquímetro) — 3 out
  { id: 'tu-011', toolId: 't-008', workOrderId: 'os-001', technicianId: 'u-004', withdrawnAt: '2026-04-13T09:25:00Z', returnedAt: null },
  { id: 'tu-012', toolId: 't-008', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-14T08:40:00Z', returnedAt: null },
  { id: 'tu-013', toolId: 't-008', workOrderId: 'os-013', technicianId: 'u-002', withdrawnAt: '2026-04-14T11:00:00Z', returnedAt: null },
];

// ─── Mock Stock Items ────────────────────────────────────────────────────────

export const MOCK_STOCK_ITEMS: MockStockItem[] = [
  { id: 's-001', code: 'BRG-6205', name: 'Rolamento SKF 6205-2RS', quantity: 24, minQuantity: 10, createdAt: '2025-04-10T08:00:00Z' },
  { id: 's-002', code: 'BELT-A42', name: 'Correia em V A42', quantity: 3, minQuantity: 5, createdAt: '2025-04-15T08:00:00Z' },
  { id: 's-003', code: 'OIL-HYD46', name: 'Óleo Hidráulico ISO 46 (L)', quantity: 18, minQuantity: 10, createdAt: '2025-05-02T08:00:00Z' },
  { id: 's-004', code: 'FLT-AIR300', name: 'Filtro de Ar Comprimido 300', quantity: 2, minQuantity: 6, createdAt: '2025-05-18T08:00:00Z' },
  { id: 's-005', code: 'SCR-M8X25', name: 'Parafuso Sextavado M8×25', quantity: 540, minQuantity: 100, createdAt: '2025-06-01T08:00:00Z' },
  { id: 's-006', code: 'LMP-LED20W', name: 'Lâmpada LED 20W E27', quantity: 45, minQuantity: 20, createdAt: '2025-06-15T08:00:00Z' },
  { id: 's-007', code: 'FUSE-10A', name: 'Fusível Cartucho 10A', quantity: 6, minQuantity: 15, createdAt: '2025-07-01T08:00:00Z' },
  { id: 's-008', code: 'WIRE-2.5MM', name: 'Cabo Flexível 2,5mm² (m)', quantity: 120, minQuantity: 50, createdAt: '2025-07-20T08:00:00Z' },
  { id: 's-009', code: 'JNT-XJ42', name: 'Junta de Vedação XJ-42', quantity: 8, minQuantity: 3, createdAt: '2025-08-10T08:00:00Z' },
  { id: 's-010', code: 'PNT-IND-GRY', name: 'Tinta Industrial Cinza (Lata 3,6L)', quantity: 12, minQuantity: 5, createdAt: '2025-09-01T08:00:00Z' },
];

// ─── Mock Stock Movements ────────────────────────────────────────────────────

export const MOCK_STOCK_MOVEMENTS: MockStockMovement[] = [
  { id: 'sm-001', stockItemId: 's-001', type: 'In', quantity: 20, workOrderId: null, note: 'Compra inicial — fornecedor Rolamar.', createdAt: '2025-04-10T08:30:00Z' },
  { id: 'sm-002', stockItemId: 's-001', type: 'In', quantity: 10, workOrderId: null, note: 'Reposição trimestral.', createdAt: '2026-01-12T09:00:00Z' },
  { id: 'sm-003', stockItemId: 's-001', type: 'Out', quantity: 6, workOrderId: 'os-001', note: 'Consumo OS-001.', createdAt: '2026-04-02T10:00:00Z' },
  { id: 'sm-004', stockItemId: 's-002', type: 'In', quantity: 15, workOrderId: null, note: 'Compra fornecedor CorreiaJá.', createdAt: '2025-06-20T10:00:00Z' },
  { id: 'sm-005', stockItemId: 's-002', type: 'Out', quantity: 12, workOrderId: null, note: 'Consumo acumulado Q1 2026.', createdAt: '2026-03-15T14:00:00Z' },
  { id: 'sm-006', stockItemId: 's-003', type: 'In', quantity: 40, workOrderId: null, note: 'Compra — tambor 40L.', createdAt: '2025-11-05T09:00:00Z' },
  { id: 'sm-007', stockItemId: 's-003', type: 'Out', quantity: 22, workOrderId: 'os-004', note: 'Troca total — Compressor 2.', createdAt: '2026-03-26T11:00:00Z' },
  { id: 'sm-008', stockItemId: 's-004', type: 'In', quantity: 10, workOrderId: null, note: 'Compra inicial.', createdAt: '2025-06-01T08:00:00Z' },
  { id: 'sm-009', stockItemId: 's-004', type: 'Out', quantity: 8, workOrderId: null, note: 'Substituição semestral.', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'sm-010', stockItemId: 's-007', type: 'In', quantity: 20, workOrderId: null, note: 'Compra lote inicial.', createdAt: '2025-07-15T09:00:00Z' },
  { id: 'sm-011', stockItemId: 's-007', type: 'Out', quantity: 14, workOrderId: null, note: 'Consumo geral.', createdAt: '2026-03-01T10:00:00Z' },
  { id: 'sm-012', stockItemId: 's-009', type: 'In', quantity: 8, workOrderId: null, note: 'Reposição após pedido especial XJ-42.', createdAt: '2026-04-08T14:00:00Z' },
  { id: 'sm-013', stockItemId: 's-010', type: 'In', quantity: 12, workOrderId: null, note: 'Compra para manutenção de pintura.', createdAt: '2026-02-20T08:30:00Z' },
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

export { formatDate, formatDateTime, getInitials } from '@/utils/format';

// ─── Tools & Stock — Helpers & Mutations ────────────────────────────────────

export function getToolById(id: string): MockTool | undefined {
  return MOCK_TOOLS.find((t) => t.id === id);
}

export function getStockItemById(id: string): MockStockItem | undefined {
  return MOCK_STOCK_ITEMS.find((s) => s.id === id);
}

export function isLowStock(item: MockStockItem): boolean {
  return item.quantity < item.minQuantity;
}

export function getOpenUsagesForTool(toolId: string): MockToolUsage[] {
  return MOCK_TOOL_USAGES.filter((u) => u.toolId === toolId && u.returnedAt === null).sort(
    (a, b) => new Date(b.withdrawnAt).getTime() - new Date(a.withdrawnAt).getTime()
  );
}

export function getActiveUsagesForTechnician(technicianId: string): MockToolUsage[] {
  return MOCK_TOOL_USAGES.filter(
    (u) => u.technicianId === technicianId && u.returnedAt === null
  ).sort((a, b) => new Date(b.withdrawnAt).getTime() - new Date(a.withdrawnAt).getTime());
}

export function getInProgressOrdersForTechnician(technicianId: string): MockServiceOrder[] {
  return MOCK_SERVICE_ORDERS.filter(
    (o) => o.technicianId === technicianId && o.status === 'InProgress'
  );
}

export function getMovementsForStockItem(stockItemId: string): MockStockMovement[] {
  return MOCK_STOCK_MOVEMENTS.filter((m) => m.stockItemId === stockItemId).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Mutation helpers — mutate module arrays in place and return the updated entities
// so detail screens can refresh their local state.

let usageCounter = MOCK_TOOL_USAGES.length;
let movementCounter = MOCK_STOCK_MOVEMENTS.length;

export function withdrawTool(params: {
  toolId: string;
  technicianId: string;
  workOrderId: string;
}): { tool: MockTool; usage: MockToolUsage } | { error: string } {
  const tool = getToolById(params.toolId);
  if (!tool) return { error: 'Ferramenta não encontrada.' };
  if (tool.availableQuantity <= 0)
    return { error: 'Ferramenta indisponível no momento.' };

  tool.availableQuantity -= 1;

  usageCounter += 1;
  const usage: MockToolUsage = {
    id: `tu-${String(usageCounter).padStart(3, '0')}`,
    toolId: params.toolId,
    workOrderId: params.workOrderId,
    technicianId: params.technicianId,
    withdrawnAt: new Date().toISOString(),
    returnedAt: null,
  };
  MOCK_TOOL_USAGES.push(usage);

  return { tool: { ...tool }, usage };
}

export function returnTool(usageId: string): { tool: MockTool; usage: MockToolUsage } | { error: string } {
  const usage = MOCK_TOOL_USAGES.find((u) => u.id === usageId);
  if (!usage) return { error: 'Registro de uso não encontrado.' };
  if (usage.returnedAt !== null) return { error: 'Esta ferramenta já foi devolvida.' };

  const tool = getToolById(usage.toolId);
  if (!tool) return { error: 'Ferramenta associada não encontrada.' };

  usage.returnedAt = new Date().toISOString();
  tool.availableQuantity = Math.min(tool.totalQuantity, tool.availableQuantity + 1);

  return { tool: { ...tool }, usage: { ...usage } };
}

export function replenishStock(params: {
  stockItemId: string;
  quantity: number;
  note?: string;
}): { item: MockStockItem; movement: MockStockMovement } | { error: string } {
  if (params.quantity <= 0)
    return { error: 'Quantidade deve ser maior que zero.' };

  const item = getStockItemById(params.stockItemId);
  if (!item) return { error: 'Item de estoque não encontrado.' };

  item.quantity += params.quantity;

  movementCounter += 1;
  const movement: MockStockMovement = {
    id: `sm-${String(movementCounter).padStart(3, '0')}`,
    stockItemId: params.stockItemId,
    type: 'In',
    quantity: params.quantity,
    workOrderId: null,
    note: params.note?.trim() ? params.note.trim() : null,
    createdAt: new Date().toISOString(),
  };
  MOCK_STOCK_MOVEMENTS.push(movement);

  return { item: { ...item }, movement };
}
