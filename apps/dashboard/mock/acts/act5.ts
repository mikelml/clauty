import type { PersonaId } from '@/mock/personas';

export type Act5Plan = {
  agentIds: string[];
  title: string;
  plan: string;
  projection: string;
  integrations: string[];
};

export const act5ByPersona: Record<PersonaId, Act5Plan> = {
  roberto: {
    agentIds: ['operaciones', 'ventas', 'nomina', 'proveedores'],
    title: 'Cerrar martes con staff mínimo + cold-call 3 talleres.',
    plan: 'Ahorro $3,200/sem en nómina + uso de 4h libres para prospectar talleres identificados en CONTPAQi.',
    projection: 'ROI 4x',
    integrations: ['contpaqi', 'bbva_empresas'],
  },
  mariana: {
    agentIds: ['negocio', 'clientes', 'finanzas'],
    title: 'Subir tarifas 25% para nuevos desde 1 nov.',
    plan: 'Mantener 3 clientes actuales 3 meses. Template email pitch listo. Benchmarks Glassdoor + DesignPro + ADCE validados.',
    projection: '+$18K MXN/mes',
    integrations: ['gmail', 'glassdoor'],
  },
  sofia: {
    agentIds: ['comercio', 'postres', 'academico'],
    title: 'Landing directa para clientes @tec_monterrey.',
    plan: 'Framer + Mercado Pago OXXO/SPEI + cronograma horneado alineado con tu schedule Tec.',
    projection: '8 → 15 pedidos/sem',
    integrations: ['mercado_pago', 'figma', 'canvas_tec'],
  },
};
