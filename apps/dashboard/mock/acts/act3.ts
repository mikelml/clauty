import type { AgentBeat } from '@/components/AgentBeatCard';
import type { PersonaId } from '@/mock/personas';

// Acto 3 · 1:00 PM — Finanzas que se cuidan solas.
// Cada persona recibe 1-2 beats en chat.
export const act3ByPersona: Record<PersonaId, AgentBeat[]> = {
  roberto: [
    {
      kind: 'prompt',
      id: 'act3-r-1',
      agentId: 'nomina',
      title: 'Empleado pide $3,500 de adelanto.',
      body: 'Histórico CONTPAQi limpio. Validado por Contable. Puedo descontar en 2 quincenas.',
      ctas: [
        { label: 'Rechazar', intent: 'neutral' },
        { label: 'Aprobar', intent: 'primary' },
      ],
    },
  ],
  mariana: [
    {
      kind: 'ping',
      id: 'act3-m-1',
      agentId: 'finanzas',
      text: 'Depósito BBVA $28,500. Distribuí: 30% SAT, 20% ahorro, 50% operación. Aparté tu SAT trimestral.',
    },
  ],
  sofia: [
    {
      kind: 'ping',
      id: 'act3-s-1',
      agentId: 'finanzas',
      text: 'Depósito Uber Eats $487. Distribuí: 40% fondo Tec, 30% insumos, 30% lifestyle.',
    },
  ],
};
