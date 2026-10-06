import type { PersonaId } from '@/mock/personas';

export type Act8Dream = {
  greeting: string;           // "Buenos días, Roberto"
  headline: string;           // "Tu colonia investigó por ti anoche"
  agentIds: string[];         // quiénes participaron
  summary: string;            // 1-2 frases con el hallazgo principal
  findings: {                  // lista de entradas del diario
    agentId: string;
    text: string;
    integrations?: string[];
  }[];
  cta: string;                // "¿Lo vemos con café?"
};

export const act8ByPersona: Record<PersonaId, Act8Dream> = {
  roberto: {
    greeting: 'Buenos días, Roberto',
    headline: 'Tu colonia investigó por ti anoche',
    agentIds: ['operaciones', 'ventas', 'proveedores'],
    summary: 'Nuevo patrón detectado: los jueves lluviosos disparan ventas de llantas +60%. Propuesta de inventario dinámico lista.',
    findings: [
      { agentId: 'operaciones', text: 'Cruzamos 12 semanas CONTPAQi × OpenWeatherMap por zona GDL. Correlación 87%.', integrations: ['contpaqi'] },
      { agentId: 'ventas',      text: 'Jueves lluviosos: ticket promedio +24%, volumen llantas +60%.', integrations: ['contpaqi'] },
      { agentId: 'proveedores', text: 'Inventario actual queda corto de 3 medidas si llueve este jueves.', integrations: ['whatsapp_business'] },
    ],
    cta: '¿Hablamos?',
  },
  mariana: {
    greeting: 'Buenos días, Mariana',
    headline: 'Tu colonia investigó por ti anoche',
    agentIds: ['negocio', 'finanzas'],
    summary: '4 escenarios de pricing listos. Cashflow BBVA aguanta 2 meses de transición.',
    findings: [
      { agentId: 'negocio',  text: 'Consulté 23 benchmarks (Glassdoor, Payscale, DesignPro LATAM). Rango: $68K–$92K para UX senior CDMX.', integrations: ['glassdoor'] },
      { agentId: 'finanzas', text: 'Cashflow BBVA últimos 3 meses: estable. Puedes sostener 60 días sin cliente nuevo.', integrations: ['bbva_personal'] },
      { agentId: 'negocio',  text: '4 escenarios: conservador ($68K), neutral ($75K), optimizado ($82K), premium ($92K).' },
    ],
    cta: '¿Los vemos con café?',
  },
  sofia: {
    greeting: 'Buenos días, Sofía',
    headline: 'Tu colonia investigó por ti anoche',
    agentIds: ['comercio', 'postres', 'academico'],
    summary: '3 sabores sin explotar detectados en Monterrey. Insumos disponibles. Ventana el sábado 10-13h.',
    findings: [
      { agentId: 'comercio',  text: '15 cuentas de postres en MTY analizadas. Ninguna ofrece matcha, ube ni hibisco.', integrations: ['instagram_dm'] },
      { agentId: 'postres',   text: 'Los 3 sabores tienen ingredientes disponibles en Mercado Libre, envío 48h.' },
      { agentId: 'academico', text: 'Sábado 10-13h: ventana libre en tu calendario Canvas.', integrations: ['canvas_tec'] },
    ],
    cta: '¿Te enseño?',
  },
};
