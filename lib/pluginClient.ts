/**
 * pluginClient.ts — HTTP client for the ClauTY OpenClaw plugin gateway.
 *
 * All requests use the plugin auth token. CORS is open on the plugin side.
 * All requests have AbortController timeout protection.
 */

import { STATUS_URL, CHAT_URL } from '@/constants/config';
import type { ColonyStatus, ChatResponse } from './types';

export const GATEWAY_URL = 'http://127.0.0.1:18789';
export const AUTH_TOKEN = '<TU_TOKEN_DEL_GATEWAY>';

const DEFAULT_HEADERS = {
  'Authorization': `Bearer ${AUTH_TOKEN}`,
  'Content-Type': 'application/json',
};

/**
 * Fetch with AbortController timeout.
 * Throws Error('Gateway timeout (Xs)') if request takes too long.
 * Throws Error('AUTH_INVALID') on 401/403.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs = 8_000
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);

    if (res.status === 401 || res.status === 403) {
      throw new Error('AUTH_INVALID');
    }

    return res;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Gateway timeout (${timeoutMs / 1000}s)`);
    }
    throw err;
  }
}

/**
 * GET /clauty/status — returns current colony state.
 */
export async function getStatus(): Promise<ColonyStatus> {
  const res = await fetchWithTimeout(STATUS_URL, {
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  }, 8_000);
  if (!res.ok) {
    throw new Error(`Status request failed: ${res.status}`);
  }
  return res.json() as Promise<ColonyStatus>;
}

/**
 * POST /clauty/chat — send a message to the active agent.
 * Uses 30s timeout because LLM can be slow.
 */
export async function sendChatMessage(
  message: string,
  sessionKey?: string
): Promise<ChatResponse> {
  const res = await fetchWithTimeout(CHAT_URL, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: JSON.stringify({ message, sessionKey: sessionKey || 'clauty:web:main' }),
  }, 35_000); // [ROBUST] 35s — slightly more than the 30s LLM timeout

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as any).error || `Chat request failed: ${res.status}`);
  }
  return res.json() as Promise<ChatResponse>;
}

/**
 * POST /clauty/rescan — force rediscovery of colony agents.
 */
export async function triggerRescan(): Promise<{ added: number; total: number }> {
  const res = await fetchWithTimeout(`${GATEWAY_URL}/clauty/rescan`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
  });
  if (!res.ok) {
    throw new Error(`Rescan request failed: ${res.status}`);
  }
  return res.json();
}

/**
 * GET /clauty/reminders — list pending reminders.
 */
export async function getReminders(userId?: string): Promise<any[]> {
  const url = userId
    ? `${GATEWAY_URL}/clauty/reminders?userId=${encodeURIComponent(userId)}`
    : `${GATEWAY_URL}/clauty/reminders`;
  try {
    const res = await fetchWithTimeout(url, {
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.reminders || [];
  } catch {
    return [];
  }
}

/**
 * DELETE /clauty/reminders/:id — cancel a pending reminder.
 */
export async function cancelReminder(id: string): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${GATEWAY_URL}/clauty/reminders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
