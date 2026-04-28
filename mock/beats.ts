import type { AgentBeat } from '@/components/AgentBeatCard';
import type { PersonaId } from '@/mock/personas';

// Timeline beats del martes 14 de octubre para cada persona.
// Cada beat es lo que el agente dice o propone en esa hora.
// El `time` es el label que se muestra como separador en el chat.

export type TimedBeat = {
  time: string;
  beat: AgentBeat;
};

export const beatsByPersona: Record<PersonaId, TimedBeat[]> = {
  roberto: [
    {
      time: '10:30 AM',
      beat: {
        kind: 'ping',
        id: 'r-1',
        agentId: 'proveedores',
        text: 'Proveedor Puebla subió 8% sin aviso. Encontré 2 alternativas 4-6% más baratas. Cotización lista.',
      },
    },
    {
      time: '1:00 PM',
      beat: {
        kind: 'prompt',
        id: 'r-2',
        agentId: 'nomina',
        title: 'Empleado pide $3,500 de adelanto.',
        body: 'Histórico CONTPAQi limpio. Validado por Contable. Puedo descontar en 2 quincenas.',
        ctas: [
          { label: 'Rechazar', intent: 'neutral' },
          { label: 'Aprobar', intent: 'primary' },
        ],
      },
    },
    {
      time: '3:30 PM',
      beat: {
        kind: 'prompt',
        id: 'r-3',
        agentId: 'familiar',
        title: 'Sofía vio unos Adidas Samba rosa esta semana.',
        body: 'Amazon MX $1,890 vs Liverpool $2,090. Llega antes de su cumple (9 días).',
        ctas: [
          { label: 'Más tarde', intent: 'neutral' },
          { label: 'Autorizar', intent: 'primary' },
        ],
      },
    },
    {
      time: '6:00 PM',
      beat: {
        kind: 'collab',
        id: 'r-4',
        agentIds: ['operaciones', 'ventas', 'nomina', 'proveedores'],
        title: 'Cerrar martes con staff mínimo + cold-call 3 talleres.',
        plan: 'Ahorro $3,200/sem en nómina + uso de 4h libres para prospectar talleres ya identificados en CONTPAQi.',
        projection: 'ROI 4x',
      },
    },
  ],

  mariana: [
    {
      time: '10:30 AM',
      beat: {
        kind: 'ping',
        id: 'm-1',
        agentId: 'clientes',
        text: 'Conceptos enviados al cliente Monterrey en 40 segundos. Figma exportado, email redactado en tu tono, archivo en Google Drive.',
      },
    },
    {
      time: '1:00 PM',
      beat: {
        kind: 'ping',
        id: 'm-2',
        agentId: 'finanzas',
        text: 'Depósito BBVA $28,500. Distribuí: 30% SAT, 20% ahorro, 50% operación. Aparté tu SAT trimestral.',
      },
    },
    {
      time: '3:30 PM',
      beat: {
        kind: 'prompt',
        id: 'm-3',
        agentId: 'bienestar',
        title: '4 horas en la silla.',
        body: 'Tienes hueco de 45 min. ¿Playlist Spotify 15 min para estirar? Focus Coach dice que la pausa te ayuda con el concepto Guadalajara atorado.',
        ctas: [
          { label: 'Ahora no', intent: 'neutral' },
          { label: 'Sí', intent: 'primary' },
        ],
      },
    },
    {
      time: '6:00 PM',
      beat: {
        kind: 'collab',
        id: 'm-4',
        agentIds: ['negocio', 'clientes', 'finanzas'],
        title: 'Subir tarifas 25% para nuevos desde 1 nov, mantener 3 actuales 3 meses.',
        plan: 'Template email pitch listo. Benchmarks Glassdoor + DesignPro + ADCE cruzados con tu cashflow BBVA.',
        projection: '+$18K MXN/mes',
      },
    },
  ],

  sofia: [
    {
      time: '10:30 AM',
      beat: {
        kind: 'ping',
        id: 's-1',
        agentId: 'postres',
        text: '2 pedidos nuevos en IG DM. Drafts preparados con precios calculados sobre costos reales.',
        policyLocked: true,
      },
    },
    {
      time: '1:00 PM',
      beat: {
        kind: 'ping',
        id: 's-2',
        agentId: 'finanzas',
        text: 'Depósito Uber Eats $487. Distribuí: 40% fondo Tec, 30% insumos, 30% lifestyle. Notion actualizado.',
      },
    },
    {
      time: '3:30 PM',
      beat: {
        kind: 'ping',
        id: 's-3',
        agentId: 'academico',
        text: 'Llevas 45% del parcial IO. Te reservé el bloque 17:00-17:20 para una simulación rápida antes de hornear.',
      },
    },
    {
      time: '6:00 PM',
      beat: {
        kind: 'collab',
        id: 's-4',
        agentIds: ['comercio', 'postres', 'academico'],
        title: 'Landing Framer + Mercado Pago OXXO/SPEI + horneado optimizado con Canvas.',
        plan: 'Canalizar los 60% de pedidos @tec_monterrey vía landing directa, sin DMs. Cronograma de horneado alineado con tu schedule Tec.',
        projection: '8 → 15 pedidos/sem',
      },
    },
  ],
};
