import type { PersonaId } from '@/mock/personas';

export type Integration = {
  id: string;
  label: string;
  icon: string;       // emoji placeholder; logos reales llegan después
  status: 'live' | 'syncing' | 'idle';
};

export const integrationsByPersona: Record<PersonaId, Integration[]> = {
  roberto: [
    { id: 'whatsapp_business', label: 'WhatsApp Business', icon: '💬', status: 'live' },
    { id: 'contpaqi',          label: 'CONTPAQi',          icon: '📊', status: 'live' },
    { id: 'bbva_empresas',     label: 'BBVA Empresas',     icon: '🏦', status: 'syncing' },
    { id: 'satws',             label: 'SAT (Satws)',       icon: '📑', status: 'live' },
    { id: 'gmail',             label: 'Gmail',             icon: '✉️', status: 'live' },
    { id: 'amazon_mx',         label: 'Amazon MX',         icon: '📦', status: 'idle' },
    { id: 'apple_health',      label: 'Apple Health',      icon: '❤️', status: 'live' },
  ],
  mariana: [
    { id: 'figma',             label: 'Figma',             icon: '🎨', status: 'live' },
    { id: 'gmail',             label: 'Gmail',             icon: '✉️', status: 'live' },
    { id: 'google_calendar',   label: 'Google Calendar',   icon: '📅', status: 'live' },
    { id: 'bbva_personal',     label: 'BBVA (Belvo)',      icon: '🏦', status: 'live' },
    { id: 'notion',            label: 'Notion',            icon: '📝', status: 'live' },
    { id: 'apple_health',      label: 'Apple Health',      icon: '❤️', status: 'syncing' },
    { id: 'whatsapp',          label: 'WhatsApp',          icon: '💬', status: 'idle' },
  ],
  sofia: [
    { id: 'instagram_dm',      label: 'Instagram DM',      icon: '📸', status: 'live' },
    { id: 'uber_eats',         label: 'Uber Eats Merchant', icon: '🛵', status: 'live' },
    { id: 'canvas_tec',        label: 'Canvas Tec',        icon: '🎓', status: 'live' },
    { id: 'mercado_pago',      label: 'Mercado Pago',      icon: '💳', status: 'live' },
    { id: 'gmail',             label: 'Gmail',             icon: '✉️', status: 'idle' },
    { id: 'apple_health',      label: 'Apple Health',      icon: '❤️', status: 'live' },
    { id: 'whatsapp',          label: 'WhatsApp',          icon: '💬', status: 'live' },
  ],
};
