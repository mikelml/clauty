import type { PersonaId } from '@/mock/personas';

export type Act6Report = {
  agentId: string;
  title: string;
  metrics: { label: string; value: string }[];
  followUp?: string;
  savingLabel: string;
};

export const act6ByPersona: Record<PersonaId, Act6Report> = {
  roberto: {
    agentId: 'ventas',
    title: 'Reporte diario',
    metrics: [
      { label: 'Ventas hoy',     value: '$52,140' },
      { label: 'Tickets',        value: '38' },
      { label: 'Sucursales',     value: '2' },
    ],
    followUp: 'Daily compilado y enviado al grupo WhatsApp del contador automáticamente.',
    savingLabel: '35 min ahorrados',
  },
  mariana: {
    agentId: 'clientes',
    title: 'Reporte del día',
    metrics: [
      { label: 'Horas Cliente A', value: '5.2h' },
      { label: 'Horas Cliente B', value: '2.8h' },
      { label: 'Facturables',     value: '$28,500' },
    ],
    followUp: 'Sugiero follow-up al Cliente Puebla antes del viernes.',
    savingLabel: '20 min ahorrados',
  },
  sofia: {
    agentId: 'academico',
    title: 'Mañana en tu calendario',
    metrics: [
      { label: 'Clases',   value: '2' },
      { label: 'Entregas', value: '1' },
      { label: 'Pedidos',  value: '3' },
    ],
    followUp: 'Insumos verificados para los 3 pedidos de postres.',
    savingLabel: '15 min ahorrados',
  },
};
