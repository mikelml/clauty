import type { AgentData } from '@/lib/types';

export type PersonaId = 'mariana' | 'roberto' | 'sofia';

export type EvidenceIntegration = {
  id: string;    // matches keys en components/IntegrationLogo
  label: string;
};

export type Newborn = {
  id: string;                  // agent id (e.g. 'operaciones')
  role: string;                // display: "Operaciones"
  color: string;               // card accent
  evidenceTitle: string;       // one-liner shown prominently
  evidenceBody: string;        // narrative with datos crudos
  evidenceIntegrations: EvidenceIntegration[];
  defaultState: AgentData['state']; // state cuando se adopta
};

export type Persona = {
  id: PersonaId;
  name: string;
  role: string;
  city: string;
  months: number;
  agentCount: number;         // count TRAS adoptar al newborn
  accent: string;
  newborn: Newborn;
};

export const personas: Record<PersonaId, Persona> = {
  roberto: {
    id: 'roberto',
    name: 'Roberto Gutiérrez',
    role: 'Dueño de Refaccionarias Gutiérrez',
    city: 'Guadalajara',
    months: 6,
    agentCount: 7,
    accent: '#FF9500',
    newborn: {
      id: 'operaciones',
      role: 'Operaciones',
      color: '#FF9500',
      evidenceTitle: 'Detecté un patrón que te cuesta $3,200 a la semana.',
      evidenceBody:
        'Analicé 12 semanas de ventas en tu CONTPAQi: los martes Tlaquepaque cae 40%. Con 1 empleado menos los martes ahorras $3,200 MXN/semana. 12 semanas de data adjuntas.',
      evidenceIntegrations: [
        { id: 'contpaqi', label: 'CONTPAQi' },
        { id: 'bbva_empresas', label: 'BBVA Empresas' },
      ],
      defaultState: 'thinking',
    },
  },
  mariana: {
    id: 'mariana',
    name: 'Mariana Mendoza',
    role: 'Diseñadora UX freelance',
    city: 'CDMX',
    months: 4,
    agentCount: 6,
    accent: '#AF52DE',
    newborn: {
      id: 'negocio',
      role: 'Negocio',
      color: '#AF52DE',
      evidenceTitle: 'Estás cobrando 30% por debajo del mercado.',
      evidenceBody:
        'Revisé tu Gmail y tu Calendar: rechazaste 4 proyectos en 3 semanas por tiempo. Crucé 5 benchmarks (Glassdoor, DesignPro, ADCE México) — tus tarifas están 30% abajo del mercado UX senior CDMX. Preparé propuesta.',
      evidenceIntegrations: [
        { id: 'gmail', label: 'Gmail' },
        { id: 'google_calendar', label: 'Google Calendar' },
        { id: 'glassdoor', label: 'Glassdoor' },
      ],
      defaultState: 'acting',
    },
  },
  sofia: {
    id: 'sofia',
    name: 'Sofía Gutiérrez',
    role: 'Estudiante ITESM + Dulces Sofi',
    city: 'Monterrey',
    months: 2,
    agentCount: 5,
    accent: '#FF2D55',
    newborn: {
      id: 'comercio',
      role: 'Comercio',
      color: '#FF2D55',
      evidenceTitle: 'El 60% de tus pedidos viene del mismo lugar.',
      evidenceBody:
        'Crucé tus 82 pedidos de Instagram DM: 60% vienen de cuentas conectadas a @tec_monterrey. Armar landing con OXXO/SPEI vía Mercado Pago te ahorra 2-3h/semana. Maqueta lista en Figma.',
      evidenceIntegrations: [
        { id: 'instagram_dm', label: 'Instagram DM' },
        { id: 'mercado_pago', label: 'Mercado Pago' },
        { id: 'figma', label: 'Figma' },
      ],
      defaultState: 'acting',
    },
  },
};

export const personaList: Persona[] = [
  personas.roberto,
  personas.mariana,
  personas.sofia,
];

export function newbornToAgentData(nb: Newborn): AgentData {
  return {
    state: nb.defaultState,
    metrics: { tasksCompleted: 0, tasksFailed: 0, tokensUsed: 0 },
    registeredAt: '2026-10-14T06:00:00Z',
    domain: null,
    maturityLevel: 'junior',
  };
}
