/**
 * useColony — Single SSE connection for all colony events (snapshots, deltas,
 * genesis, reminders). Other hooks consume colony state via this hook, not
 * separate SSE connections.
 *
 * Primary hook for connecting the dashboard to the ClauTY plugin gateway.
 *
 * Strategy:
 * 1. Poll /clauty/status every 5s as baseline
 * 2. SSE /clauty/events for real-time updates (typed events: genesis:born, proactive:reminder)
 * 3. Fall back to mock data if gateway is unavailable
 * 4. Replay buffer: reconnecting clients receive events missed during disconnect
 *
 * [ROBUST] SSE reconnects automatically with exponential backoff
 * [ROBUST] Polling as fallback when SSE fails
 * [ROBUST] Mock data when gateway is completely offline
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { GATEWAY_URL, AUTH_TOKEN, getStatus } from '@/lib/pluginClient';
import EventSource from '@/lib/sse';
import type { Agent, ColonyStatus, ConnectionState, ReminderPayload } from '@/lib/types';

const SSE_URL = `${GATEWAY_URL}/clauty/events`;
const POLL_INTERVAL_MS = 5_000;
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 8_000;

// Fallback mock agents when gateway is unavailable
const MOCK_AGENTS: Agent[] = [
  {
    id: 'inventor',
    state: 'idle',
    domain: ['tecnologia'],
    maturityLevel: null,
    metrics: { tasksCompleted: 0, tasksFailed: 0, tokensUsed: 0 },
    registeredAt: new Date().toISOString(),
  },
];

type UseColonyOptions = {
  onReminder?: (reminder: ReminderPayload) => void;
  onGenesisBorn?: (data: { agentId: string; domain: string[] }) => void;
};

type UseColonyReturn = {
  agents: Agent[];
  colony: Record<string, Agent>;
  connectionState: ConnectionState;
  isConnected: boolean;
  isLoading: boolean;
  dataSource: 'real' | 'mock' | 'loading';
  error: string | null;
  refresh: () => void;
  newBornAgent: { id: string; domain: string[] } | null;
  clearNewBornAgent: () => void;
};

export function useColony(options?: UseColonyOptions): UseColonyReturn {
  const [colony, setColony] = useState<Record<string, Agent>>({});
  const [connectionState, setConnectionState] = useState<ConnectionState>('offline');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<'real' | 'mock' | 'loading'>('loading');
  const [newBornAgent, setNewBornAgent] = useState<{ id: string; domain: string[] } | null>(null);

  const esRef = useRef<EventSource | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const backoffRef = useRef(RECONNECT_BASE_MS);
  const mountedRef = useRef(true);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // ── Polling fallback ─────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollRef.current) return; // already polling

    pollRef.current = setInterval(async () => {
      try {
        const status: ColonyStatus = await getStatus();
        if (!mountedRef.current) return;
        setColony(status.colony || {});
        setConnectionState('connected');
        setDataSource('real');
        setError(null);
      } catch {
        if (!mountedRef.current) return;
        setConnectionState('offline');
        setDataSource('mock');
      }
    }, POLL_INTERVAL_MS);
  }, []);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // ── SSE connection ────────────────────────────────────────────────────────
  const connectSSE = useCallback(() => {
    // Prevent duplicate connections
    if (esRef.current) {
      try { esRef.current.close(); } catch {}
      esRef.current = null;
    }
    // Clear any pending retry
    if (retryRef.current) {
      clearTimeout(retryRef.current);
      retryRef.current = null;
    }

    try {
      const es = new EventSource(SSE_URL);
      esRef.current = es;

      es.onopen = () => {
        if (!mountedRef.current) return;
        console.log('[SSE] Connected to colony OK');
        setConnectionState('connected');
        setDataSource('real');
        setError(null);
        backoffRef.current = RECONNECT_BASE_MS;
        stopPolling(); // SSE takes over from polling
      };

      // Untyped message (backward compat) — treat as full snapshot
      es.onmessage = (e) => {
        if (!mountedRef.current) return;
        try {
          const data: ColonyStatus = JSON.parse(e.data);
          setColony(data.colony || {});
        } catch {}
      };

      // Typed event: colony:snapshot — full colony replacement
      es.addEventListener('colony:snapshot', (e: MessageEvent) => {
        if (!mountedRef.current) return;
        try {
          const data: ColonyStatus = JSON.parse(e.data);
          setColony(data.colony || {});
        } catch {}
      });

      // Typed event: colony:delta — merge only changed agents
      es.addEventListener('colony:delta', (e: MessageEvent) => {
        if (!mountedRef.current) return;
        try {
          const data: ColonyStatus = JSON.parse(e.data);
          const delta = data.colony || {};
          setColony((prev) => {
            const next = { ...prev };
            for (const [id, agent] of Object.entries(delta)) {
              if (agent === null) {
                delete next[id]; // agent removed
              } else {
                next[id] = agent as Agent;
              }
            }
            return next;
          });
        } catch {}
      });

      // Typed event: genesis:born
      es.addEventListener('genesis:born', (e: MessageEvent) => {
        if (!mountedRef.current) return;
        try {
          const data = JSON.parse(e.data);
          // console.log('[SSE] genesis:born:', data.agentId);
          setNewBornAgent({ id: data.agentId, domain: data.domain ?? [] });
          optionsRef.current?.onGenesisBorn?.(data);
        } catch {}
      });

      // Typed event: proactive:reminder
      es.addEventListener('proactive:reminder', (e: MessageEvent) => {
        if (!mountedRef.current) return;
        try {
          const reminder: ReminderPayload = JSON.parse(e.data);
          // console.log('[Dashboard] proactive:reminder received:', reminder.text);
          optionsRef.current?.onReminder?.(reminder);
        } catch {}
      });

      es.onerror = (err: any) => {
        if (!mountedRef.current) return;
        console.warn('[SSE] Error/disconnect:', err?.type, err?.message, 'readyState:', es.readyState);
        setConnectionState('reconnecting');
        es.close();
        esRef.current = null;

        // Fall back to polling while reconnecting
        startPolling();

        // Schedule SSE reconnect with exponential backoff
        const delay = backoffRef.current;
        backoffRef.current = Math.min(delay * 2, RECONNECT_MAX_MS);
        retryRef.current = setTimeout(connectSSE, delay);
      };
    } catch {
      // EventSource might not be available — use polling only
      startPolling();
    }
  }, [startPolling, stopPolling]);

  // ── Initial data load ─────────────────────────────────────────────────────
  const refresh = useCallback(async () => {
    try {
      const status = await getStatus();
      if (!mountedRef.current) return;
      setColony(status.colony || {});
      setConnectionState('connected');
      setDataSource('real');
      setError(null);
    } catch (err: any) {
      if (!mountedRef.current) return;
      setConnectionState('offline');
      setDataSource('mock');
      setError(err.message || 'Gateway no disponible');
    }
  }, []);

  // ── Mount / unmount ───────────────────────────────────────────────────────
  useEffect(() => {
    mountedRef.current = true;

    // Initial load
    setIsLoading(true);
    refresh().finally(() => {
      if (mountedRef.current) setIsLoading(false);
    });

    // Start SSE (falls back to polling internally)
    connectSSE();

    // Retry gateway every 30s when offline (check via ref, not stale closure)
    const retryWhenMock = setInterval(async () => {
      // Only retry if no active SSE connection
      if (esRef.current) return;
      try {
        const status = await getStatus();
        if (mountedRef.current && status?.colony) {
          setColony(status.colony);
          connectSSE();
        }
      } catch {}
    }, 30_000);

    return () => {
      mountedRef.current = false;
      if (esRef.current) esRef.current.close();
      if (retryRef.current) clearTimeout(retryRef.current);
      stopPolling();
      clearInterval(retryWhenMock);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived state ─────────────────────────────────────────────────────────
  const agents = Object.entries(colony).map(([id, agent]) => ({ id, ...agent }));
  const effectiveAgents = dataSource === 'mock' ? MOCK_AGENTS : agents;
  const effectiveColony = dataSource === 'mock'
    ? Object.fromEntries(MOCK_AGENTS.map((a) => [a.id, a]))
    : colony;

  const clearNewBornAgent = useCallback(() => setNewBornAgent(null), []);

  return {
    agents: effectiveAgents,
    colony: effectiveColony,
    connectionState,
    isConnected: connectionState === 'connected',
    isLoading,
    dataSource,
    error,
    refresh,
    newBornAgent,
    clearNewBornAgent,
  };
}
