import type { PersonaId } from '@/mock/personas';

export type DreamThread = {
  ts: string;                // "23:42"
  agentId: string;
  text: string;
  kind: 'thought' | 'query' | 'action';
  integrations?: string[];
};

// Acto 7 · 23:30+ — Dreamtime. Los agentes investigan en paralelo.
// Se van disparando secuencialmente en el chat con night styling.
export const act7ByPersona: Record<PersonaId, DreamThread[]> = {
  roberto: [
    { ts: '23:35', agentId: 'operaciones', text: 'Iniciando cruce de 12 semanas de CONTPAQi con clima histórico GDL…', kind: 'thought', integrations: ['contpaqi'] },
    { ts: '23:48', agentId: 'ventas',      text: 'Pattern emergente: los jueves con lluvia, llantas +60% ventas.', kind: 'query', integrations: ['contpaqi'] },
    { ts: '00:12', agentId: 'operaciones', text: 'Correlación fuerte: 87% de jueves lluviosos tuvieron pico de llantas.', kind: 'thought', integrations: ['contpaqi'] },
    { ts: '00:34', agentId: 'proveedores', text: 'Inventario actual vs forecast: estamos cortos de 3 medidas si llueve el próximo jueves.', kind: 'query', integrations: ['contpaqi'] },
    { ts: '01:20', agentId: 'operaciones', text: 'Propuesta lista: inventario dinámico por pronóstico climático.', kind: 'action' },
  ],
  mariana: [
    { ts: '23:42', agentId: 'negocio',   text: 'Consultando 23 benchmarks de diseño UX en LATAM…', kind: 'thought', integrations: ['glassdoor'] },
    { ts: '00:05', agentId: 'finanzas',  text: 'Cruzando con tu cashflow BBVA últimos 3 meses.', kind: 'query', integrations: ['bbva_personal'] },
    { ts: '00:28', agentId: 'negocio',   text: 'Puedes sostener 2 meses de transición de tarifas con ahorro actual.', kind: 'query' },
    { ts: '01:15', agentId: 'negocio',   text: '4 escenarios de pricing listos: conservador, neutral, optimizado, premium.', kind: 'action' },
  ],
  sofia: [
    { ts: '23:38', agentId: 'comercio',  text: 'Mapeando 15 cuentas de competencia directa en Monterrey…', kind: 'thought', integrations: ['instagram_dm'] },
    { ts: '23:55', agentId: 'postres',   text: 'Detecté 3 sabores NO explotados: matcha, ube, hibisco.', kind: 'query' },
    { ts: '00:18', agentId: 'comercio',  text: 'Viabilidad insumos con Mercado Libre: todos disponibles, envío 48h.', kind: 'query' },
    { ts: '00:52', agentId: 'academico', text: 'Ventana de experimentación: este sábado 10-13h libre.', kind: 'thought' },
    { ts: '01:30', agentId: 'comercio',  text: '3 nuevos sabores validados como oportunidad. Draft listo para tu review matinal.', kind: 'action' },
  ],
};
