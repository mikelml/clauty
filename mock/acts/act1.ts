import type { PersonaId } from '@/mock/personas';

export type Act1Widget = {
  agentId: string;
  time: string;         // "7:00 AM"
  title: string;
  body: string;
  integrations: string[];
};

export const act1ByPersona: Record<PersonaId, Act1Widget> = {
  roberto: {
    agentId: 'ventas',
    time: '7:00 AM',
    title: 'Ventas ayer · $47,380 MXN',
    body: '+12% vs mismo día semana pasada. Alert: Balatas Bosch P/N 0986 con 3 unidades, venta promedio 8/sem.',
    integrations: ['contpaqi', 'whatsapp_business'],
  },
  mariana: {
    agentId: 'clientes',
    time: '7:00 AM',
    title: '14 correos nocturnos triados',
    body: '2 urgentes en rojo: cliente Monterrey firma mañana contrato $45K MXN.',
    integrations: ['gmail', 'google_calendar'],
  },
  sofia: {
    agentId: 'academico',
    time: '7:00 AM',
    title: 'Parcial Investigación de Operaciones · viernes',
    body: 'Llevas 40% del material. 2 bloques libres hoy — propongo 20 min simulación 5pm.',
    integrations: ['canvas_tec'],
  },
};
