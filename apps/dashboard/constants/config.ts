import { Platform } from 'react-native';

const isLocal =
  Platform.OS === 'web'
    ? typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    : true;

// La URL de producción se configura por entorno; nunca se escribe en el código.
const PROD = process.env.EXPO_PUBLIC_GATEWAY_URL_PROD ?? 'https://tu-gateway.ejemplo.com';
const BASE = isLocal ? 'http://127.0.0.1:18789' : PROD;

export const SSE_URL = `${BASE}/clauty/events`;
export const STATUS_URL = `${BASE}/clauty/status`;
export const CHAT_URL = `${BASE}/clauty/chat`;
export const HISTORY_URL = `${BASE}/clauty/chat/history`;
