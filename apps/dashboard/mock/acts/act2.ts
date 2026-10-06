import type { PersonaId } from '@/mock/personas';

export type BitacoraEntry = {
  ts: string;
  agentId: string;
  text: string;
  kind: 'thought' | 'action' | 'note';
  integrations?: string[];
};

export const act2ByPersona: Record<PersonaId, BitacoraEntry[]> = {
  roberto: [
    { ts: '10:25', agentId: 'proveedores', text: 'WhatsApp entrante: Distribuidor Puebla anuncia aumento 8%.', kind: 'note', integrations: ['whatsapp_business'] },
    { ts: '10:26', agentId: 'proveedores', text: 'Cruzando histórico CONTPAQi de últimos 6 meses con el nuevo precio…', kind: 'thought', integrations: ['contpaqi'] },
    { ts: '10:28', agentId: 'proveedores', text: 'Distribuidor Aceites GDL a $318. 2 alternativas 4-6% más baratas listas.', kind: 'action', integrations: ['contpaqi'] },
    { ts: '10:30', agentId: 'ventas', text: 'Cotización compartida a tu dashboard para cuando salgas de la junta.', kind: 'action' },
  ],
  mariana: [
    { ts: '10:28', agentId: 'clientes', text: 'Usuario pidió enviar los 3 conceptos al cliente Monterrey.', kind: 'note' },
    { ts: '10:28', agentId: 'creativo', text: 'Exportando frames desde Figma (PNG 2x + PDF preview)…', kind: 'thought', integrations: ['figma'] },
    { ts: '10:29', agentId: 'clientes', text: 'Redactando email en tono warm-professional aprendido de Mariana…', kind: 'thought', integrations: ['gmail'] },
    { ts: '10:30', agentId: 'clientes', text: 'Enviado en 40 seg. Copia archivada en Drive.', kind: 'action', integrations: ['gmail'] },
  ],
  sofia: [
    { ts: '10:25', agentId: 'postres', text: 'Instagram DM: 2 pedidos nuevos (brownies x6 + red velvet individual).', kind: 'note', integrations: ['instagram_dm'] },
    { ts: '10:27', agentId: 'postres', text: 'Calculando precios con costos reales: $408 y $45.', kind: 'thought' },
    { ts: '10:28', agentId: 'postres', text: 'Drafts preparados para Sofía. No envío — política: requiere su aprobación.', kind: 'action' },
    { ts: '10:30', agentId: 'comercio', text: 'Observando los 2 pedidos: ambos de cuentas @tec_monterrey. Patrón sostenido.', kind: 'thought', integrations: ['instagram_dm'] },
  ],
};
