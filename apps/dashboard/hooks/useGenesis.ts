/**
 * useGenesis — hook exposing the birth state of a new colony agent.
 * Listens to the SSE event genesis:born via useColony and enriches the data
 * with role and color derived from the agent's domain.
 */

import { useColony } from './useColony';
import { useCallback } from 'react';

export interface NewBornAgent {
  id: string;
  domain: string[];
  role: string;   // domain[0] or 'assistant' if domain is empty
  color: string;  // color mapped from role
}

const ROLE_COLORS: Record<string, string> = {
  dev: '#6C63FF',
  design: '#FF6584',
  finance: '#43E97B',
  ops: '#F093FB',
  assistant: '#4FC3F7',
  inventor: '#8B6AAE',
  cocina: '#FF8C42',
  jardineria: '#52C41A',
  mascotas: '#FFBB33',
  nintendo: '#E60012',
  pokemon: '#FFCB05',
  taxi: '#F8C300',
  videojuegos: '#6C63FF',
};

export function useGenesis() {
  const { newBornAgent, clearNewBornAgent } = useColony();

  const enriched: NewBornAgent | null = newBornAgent
    ? {
        ...newBornAgent,
        role: newBornAgent.domain[0] ?? 'assistant',
        color:
          ROLE_COLORS[newBornAgent.id] ??
          ROLE_COLORS[newBornAgent.domain[0]] ??
          ROLE_COLORS.assistant,
      }
    : null;

  const clearNewBorn = useCallback(() => {
    clearNewBornAgent();
  }, [clearNewBornAgent]);

  return { newBornAgent: enriched, clearNewBorn };
}
