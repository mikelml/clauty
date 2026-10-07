# Dashboard App

## Qué es
App mobile/web del dashboard ClauTY. Expo + React Native con expo-router. Muestra la colonia de agentes en tiempo real, chat con agentes, notificaciones de nacimiento (genesis), reminders proactivos, y métricas. Diseño Monument Valley-inspired.

## Archivos clave
- `constants/config.ts` — URLs del gateway (BASE, SSE, STATUS, CHAT, HISTORY)
- `lib/pluginClient.ts` — HTTP client con timeout y auth token
- `lib/sse.ts` — Wrapper de EventSource para SSE
- `lib/types.ts` — Tipos TypeScript (Agent, ColonyStatus, ChatResponse, etc.)
- `hooks/useColony.ts` — Hook principal: SSE + polling fallback para estado de colonia
- `hooks/useChat.ts` — Hook de chat: enviar mensajes, historial, inject reminders
- `hooks/useAgent.ts` — Hook para detalle de un agente individual
- `hooks/useColonyMetrics.ts` — Hook para métricas de la colonia
- `hooks/useGenesis.ts` — Hook para eventos de genesis (propuestas de nuevos agentes)
- `hooks/useReminders.ts` — Hook para listar/cancelar reminders
- `app/_layout.tsx` — Layout principal con expo-router
- `components/` — Componentes UI (AgentCard, ChatBubbles, BirthCelebration, etc.)

## Configuración

| Parámetro | Default | Ubicación | Descripción |
|---|---|---|---|
| GATEWAY_URL | `http://127.0.0.1:18789` | `lib/pluginClient.ts:12` | URL base del gateway OpenClaw |
| AUTH_TOKEN | por entorno (`EXPO_PUBLIC_AUTH_TOKEN`) | `lib/pluginClient.ts` | Token de auth para el plugin; nunca en el código |
| BASE (local) | `http://127.0.0.1:18789` | `constants/config.ts:9` | URL base para desarrollo local |
| BASE (prod) | `EXPO_PUBLIC_GATEWAY_URL_PROD` | `constants/config.ts` | URL base para producción (por entorno) |
| POLL_INTERVAL_MS | 5000 | `hooks/useColony.ts:28` | Intervalo de polling cuando SSE no disponible |
| RECONNECT_BASE_MS | 1000 | `hooks/useColony.ts:29` | Base para backoff exponencial de SSE |
| RECONNECT_MAX_MS | 8000 | `hooks/useColony.ts:30` | Máx delay de reconexión SSE |
| RETRY_MOCK_INTERVAL | 30000 | `hooks/useColony.ts:236` | Reintento cuando en modo mock |
| CHAT_TIMEOUT | 35000 | `hooks/useChat.ts:127` | Timeout de fetch para chat |
| CLIENT_TIMEOUT | 8000 | `lib/pluginClient.ts:29` | Timeout default para requests HTTP |
| CHAT_CLIENT_TIMEOUT | 35000 | `lib/pluginClient.ts:75` | Timeout para chat en pluginClient |

## Cómo correr / testear
```bash
# Desarrollo (web)
cd dashboard && npx expo start --web

# Desarrollo (iOS simulator)
cd dashboard && npx expo start --ios

# Build web para deploy
cd dashboard && npx expo export --platform web

# Requiere que el plugin esté corriendo en OpenClaw para datos reales
# Sin plugin, usa mock data automáticamente
```

## Flujo principal
1. App monta → `useColony` hace GET `/clauty/status` para estado inicial
2. Abre conexión SSE a `/clauty/events` para updates en tiempo real
3. Si SSE falla → polling cada 5s como fallback
4. Si gateway offline → muestra mock data con agente "inventor"
5. Usuario envía mensaje → `useChat.sendMessage()` → POST `/clauty/chat`
6. Respuesta del agente aparece en chat bubbles
7. Eventos SSE tipados: `colony:snapshot`, `colony:delta`, `genesis:born`, `proactive:reminder`
8. `genesis:born` → muestra animación de nacimiento (BirthCelebration)

## Dependencias
- Plugin ClauTY corriendo en OpenClaw gateway (puerto 18789)
- Expo SDK 55 + React Native 0.83
- expo-router para navegación
- react-native-sse para EventSource
- react-native-reanimated para animaciones

## Estado actual
- **Funciona:** Colony view, chat, SSE en tiempo real, polling fallback, mock mode, birth celebrations
- **Funciona:** Reminders UI, agent detail, colony metrics
- **Falta:** Approve/reject de genesis proposals en UI, dreamtime status view
- **Hardcodes:** AUTH_TOKEN en pluginClient.ts, URLs en config.ts con detection local/prod
