// Metadata visual y de atribución para cada agente mock.
// Tres tonos por agente: `color` (bright, solo para avatar/dot),
// `soft` (pastel, para bg tints y botones), `deep` (para texto/labels legibles).

export type AgentMeta = {
  id: string;
  label: string;
  color: string;   // bright / hero
  soft: string;    // pastel para fondos y botones
  deep: string;    // saturada pero legible para texto sobre oscuro
};

export const agentMeta: Record<string, AgentMeta> = {
  // ===== Roberto =====
  proveedores: { id: 'proveedores', label: 'Proveedores', color: '#FF6B5E', soft: '#FFB8AE', deep: '#E6836F' },
  ventas:      { id: 'ventas',      label: 'Ventas',      color: '#5FD683', soft: '#B5E8C4', deep: '#88D9A1' },
  nomina:      { id: 'nomina',      label: 'Nómina',      color: '#F2CD5A', soft: '#FBE8A6', deep: '#E6C878' },
  familiar:    { id: 'familiar',    label: 'Familiar',    color: '#FF7A9A', soft: '#FFC4D4', deep: '#F09AB3' },
  contable:    { id: 'contable',    label: 'Contable',    color: '#8B89E6', soft: '#C6C4F0', deep: '#A4A2E8' },
  compras:     { id: 'compras',     label: 'Compras',     color: '#5FD5CE', soft: '#B5E6E2', deep: '#88D9D2' },
  operaciones: { id: 'operaciones', label: 'Operaciones', color: '#FFB06B', soft: '#FFD4A8', deep: '#F0B97D' },

  // ===== Mariana =====
  clientes:    { id: 'clientes',    label: 'Clientes',    color: '#6AA9F0', soft: '#B5D4F0', deep: '#8FB9EA' },
  finanzas:    { id: 'finanzas',    label: 'Finanzas',    color: '#5FD683', soft: '#B5E8C4', deep: '#88D9A1' },
  creativo:    { id: 'creativo',    label: 'Creativo',    color: '#C57BDB', soft: '#DFB5E8', deep: '#CA9ADB' },
  bienestar:   { id: 'bienestar',   label: 'Bienestar',   color: '#FFB06B', soft: '#FFD4A8', deep: '#F0B97D' },
  contenido:   { id: 'contenido',   label: 'Contenido',   color: '#F2CD5A', soft: '#FBE8A6', deep: '#E6C878' },
  focus_coach: { id: 'focus_coach', label: 'Focus Coach', color: '#F5D76E', soft: '#FBE8A6', deep: '#E6C878' },
  negocio:     { id: 'negocio',     label: 'Negocio',     color: '#C57BDB', soft: '#DFB5E8', deep: '#CA9ADB' },

  // ===== Sofía =====
  academico:   { id: 'academico',   label: 'Académico',   color: '#8B89E6', soft: '#C6C4F0', deep: '#A4A2E8' },
  postres:     { id: 'postres',     label: 'Postres',     color: '#FF7A9A', soft: '#FFC4D4', deep: '#F09AB3' },
  social:      { id: 'social',      label: 'Social',      color: '#7EDCFF', soft: '#BFEAFA', deep: '#9FD7EC' },
  comercio:    { id: 'comercio',    label: 'Comercio',    color: '#F5D76E', soft: '#FBE8A6', deep: '#E6C878' },
};

export function getAgentMeta(id: string): AgentMeta {
  return agentMeta[id] ?? { id, label: id, color: '#AEAEB2', soft: '#CFCFD4', deep: '#B8B8BE' };
}
