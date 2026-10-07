import type { AgentBeat } from '@/components/AgentBeatCard';
import type { PersonaId } from '@/mock/personas';

// Acto 4 · 3:30 PM — Bienestar y contexto social (+ semilla A2A).
export const act4ByPersona: Record<PersonaId, AgentBeat[]> = {
  roberto: [
    {
      kind: 'prompt',
      id: 'act4-r-1',
      agentId: 'familiar',
      title: 'Sofía vio unos Adidas Samba rosa esta semana.',
      body: 'Amazon MX $1,890 vs Liverpool $2,090. Llega antes de su cumple (9 días).',
      ctas: [
        { label: 'Más tarde', intent: 'neutral' },
        { label: 'Autorizar', intent: 'primary' },
      ],
    },
  ],
  mariana: [
    {
      kind: 'prompt',
      id: 'act4-m-1',
      agentId: 'bienestar',
      title: '4 horas en la silla.',
      body: 'Tienes hueco de 45 min. ¿Playlist 15 min para estirar? Focus Coach dice que la pausa ayuda con el concepto atorado.',
      ctas: [
        { label: 'Ahora no', intent: 'neutral' },
        { label: 'Sí', intent: 'primary' },
      ],
    },
  ],
  sofia: [
    {
      kind: 'ping',
      id: 'act4-s-1',
      agentId: 'social',
      text: 'Detecté interés repetido en Adidas Samba rosa. Señal compartida con tu red de confianza (familiar).',
    },
  ],
};
