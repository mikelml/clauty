/**
 * useColonyLog — unified timeline combining journals, observer events,
 * reminders, and dreamtime status from the ClauTY gateway.
 *
 * Polls every 10s and on screen focus via AppState.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { GATEWAY_URL, AUTH_TOKEN } from '@/lib/pluginClient';

export type LogEventType = 'journal' | 'event' | 'birth' | 'reminder' | 'dream';

export type LogEntry = {
  id: string;
  type: LogEventType;
  agentId: string;
  text: string;
  timestamp: number; // ms epoch
};

const POLL_MS = 10_000;
const FETCH_TIMEOUT = 8_000;

const headers = { Authorization: `Bearer ${AUTH_TOKEN}` };

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });
    if (!res.ok) return fallback;
    return (await res.json()) as T;
  } catch {
    return fallback;
  }
}

/** Map observer event names to our LogEventType */
function classifyEvent(eventName: string): LogEventType {
  if (eventName === 'genesis:born' || eventName === 'genesis:proposal') return 'birth';
  if (eventName.startsWith('proactive:') || eventName === 'reminder:fired') return 'reminder';
  if (eventName.startsWith('dreamtime:')) return 'dream';
  return 'event';
}

export function useColonyLog(agentIds?: string[]) {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchAll = useCallback(async () => {
    const ids = agentIds && agentIds.length > 0 ? agentIds : ['inventor'];

    // Fetch journals for each agent + observer log + reminders + dreamtime in parallel
    const journalPromises = ids.map((id) =>
      safeFetch<{ entries: any[] }>(
        `${GATEWAY_URL}/clauty/journals/${encodeURIComponent(id)}?limit=20`,
        { entries: [] },
      ),
    );

    const [journalResults, observerData, remindersData, dreamtimeData] = await Promise.all([
      Promise.all(journalPromises),
      safeFetch<{ entries: any[] }>(`${GATEWAY_URL}/clauty/observer/log?limit=30`, { entries: [] }),
      safeFetch<{ reminders: any[] }>(`${GATEWAY_URL}/clauty/reminders`, { reminders: [] }),
      safeFetch<any>(`${GATEWAY_URL}/clauty/dreamtime/status`, null),
    ]);

    if (!mountedRef.current) return;

    const timeline: LogEntry[] = [];

    // Journals
    journalResults.forEach((result, i) => {
      const agentId = ids[i];
      for (const e of result.entries || []) {
        timeline.push({
          id: `journal-${agentId}-${e.id ?? e.created_at}`,
          type: 'journal',
          agentId,
          text: e.text || e.content || '',
          timestamp: e.created_at ? new Date(e.created_at).getTime() : Date.now(),
        });
      }
    });

    // Observer events
    for (const e of observerData.entries || []) {
      const payload = typeof e.payload === 'object' ? e.payload : {};
      const text =
        (payload as any)?.text ||
        (payload as any)?.topic ||
        (payload as any)?.agentId ||
        e.event ||
        '';
      timeline.push({
        id: `obs-${e.id ?? e.timestamp}`,
        type: classifyEvent(e.event || ''),
        agentId: (payload as any)?.agentId || e.source || 'system',
        text: `${e.event}: ${typeof text === 'string' ? text : JSON.stringify(text)}`,
        timestamp: e.timestamp || Date.now(),
      });
    }

    // Reminders (active/pending)
    for (const r of remindersData.reminders || []) {
      timeline.push({
        id: `rem-${r.id}`,
        type: 'reminder',
        agentId: r.agentId || 'system',
        text: r.text || 'Reminder',
        timestamp: r.scheduledAt || Date.now(),
      });
    }

    // Dreamtime
    if (dreamtimeData && dreamtimeData.lastRun) {
      timeline.push({
        id: `dream-${dreamtimeData.lastRun}`,
        type: 'dream',
        agentId: 'system',
        text: dreamtimeData.summary || 'Dreamtime cycle completed',
        timestamp: typeof dreamtimeData.lastRun === 'number'
          ? dreamtimeData.lastRun
          : new Date(dreamtimeData.lastRun).getTime(),
      });
    }

    // Sort by timestamp descending
    timeline.sort((a, b) => b.timestamp - a.timestamp);

    setEntries(timeline);
    setLoading(false);
  }, [agentIds]);

  useEffect(() => {
    mountedRef.current = true;
    fetchAll();

    const interval = setInterval(fetchAll, POLL_MS);

    // Refetch on app focus
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetchAll();
    });

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
      sub.remove();
    };
  }, [fetchAll]);

  return { entries, loading, refresh: fetchAll };
}
