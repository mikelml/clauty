import type { AgentData } from '@/lib/types';
import type { PersonaId } from '@/mock/personas';

// Colonias base, sin el newborn. El newborn se inyecta en MockContext
// cuando el usuario lo adopta desde el Opening.

export const robertoColony: Record<string, AgentData> = {
  proveedores: { state: 'idle',    metrics: { tasksCompleted: 23, tasksFailed: 1, tokensUsed: 14500 }, registeredAt: '2026-04-14T08:00:00Z', domain: null, maturityLevel: 'senior' },
  ventas:      { state: 'acting',  metrics: { tasksCompleted: 87, tasksFailed: 0, tokensUsed: 42000 }, registeredAt: '2026-04-14T08:00:00Z', domain: null, maturityLevel: 'senior' },
  nomina:      { state: 'idle',    metrics: { tasksCompleted: 12, tasksFailed: 0, tokensUsed: 7800 },  registeredAt: '2026-04-14T08:00:00Z', domain: null, maturityLevel: 'senior' },
  familiar:    { state: 'idle',    metrics: { tasksCompleted: 4,  tasksFailed: 0, tokensUsed: 2100 },  registeredAt: '2026-05-14T09:00:00Z', domain: null, maturityLevel: 'mid' },
  contable:    { state: 'waiting', metrics: { tasksCompleted: 8,  tasksFailed: 0, tokensUsed: 5200 },  registeredAt: '2026-06-14T09:00:00Z', domain: null, maturityLevel: 'mid' },
  compras:     { state: 'idle',    metrics: { tasksCompleted: 2,  tasksFailed: 0, tokensUsed: 900 },   registeredAt: '2026-07-14T09:00:00Z', domain: null, maturityLevel: 'junior' },
};

export const marianaColony: Record<string, AgentData> = {
  clientes:   { state: 'idle',     metrics: { tasksCompleted: 54, tasksFailed: 0, tokensUsed: 28000 }, registeredAt: '2026-06-17T08:00:00Z', domain: null, maturityLevel: 'senior' },
  finanzas:   { state: 'idle',     metrics: { tasksCompleted: 31, tasksFailed: 0, tokensUsed: 12000 }, registeredAt: '2026-06-17T08:00:00Z', domain: null, maturityLevel: 'senior' },
  creativo:   { state: 'thinking', metrics: { tasksCompleted: 42, tasksFailed: 0, tokensUsed: 35000 }, registeredAt: '2026-06-17T08:00:00Z', domain: null, maturityLevel: 'senior' },
  bienestar:  { state: 'waiting',  metrics: { tasksCompleted: 18, tasksFailed: 0, tokensUsed: 6500 },  registeredAt: '2026-06-17T08:00:00Z', domain: null, maturityLevel: 'senior' },
  contenido:  { state: 'idle',     metrics: { tasksCompleted: 11, tasksFailed: 0, tokensUsed: 8200 },  registeredAt: '2026-07-20T09:00:00Z', domain: null, maturityLevel: 'mid' },
};

export const sofiaColony: Record<string, AgentData> = {
  academico:  { state: 'waiting',  metrics: { tasksCompleted: 26, tasksFailed: 0, tokensUsed: 11000 }, registeredAt: '2026-08-17T08:00:00Z', domain: null, maturityLevel: 'mid' },
  postres:    { state: 'thinking', metrics: { tasksCompleted: 34, tasksFailed: 0, tokensUsed: 9500 },  registeredAt: '2026-08-17T08:00:00Z', domain: null, maturityLevel: 'mid' },
  social:     { state: 'dormant',  metrics: { tasksCompleted: 8,  tasksFailed: 0, tokensUsed: 1800 },  registeredAt: '2026-08-17T08:00:00Z', domain: null, maturityLevel: 'junior' },
  finanzas:   { state: 'idle',     metrics: { tasksCompleted: 6,  tasksFailed: 0, tokensUsed: 2200 },  registeredAt: '2026-09-17T09:00:00Z', domain: null, maturityLevel: 'junior' },
};

export const colonies: Record<PersonaId, Record<string, AgentData>> = {
  roberto: robertoColony,
  mariana: marianaColony,
  sofia: sofiaColony,
};
