import { useState, useEffect, useRef, useCallback } from "react";
import { SSE_URL, STATUS_URL } from "@/constants/config";

export type AgentData = {
  state: string;
  metrics: { tasksCompleted: number; tasksFailed: number; tokensUsed: number };
  registeredAt: string;
  domain: string[] | null;
  maturityLevel: string | null;
};

export type ColonyData = {
  colony: Record<string, AgentData>;
  connectedClients: number;
  timestamp: string;
};

/**
 * Robust SSE hook with:
 * - Auto-reconnection with exponential backoff
 * - Periodic status poll as fallback (catches missed events)
 * - Stable connection state tracking
 */
export function useSSE(url: string = SSE_URL) {
  const [data, setData] = useState<ColonyData | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const backoffRef = useRef(1000);

  const connect = useCallback(() => {
    // Clean up previous
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }

    const es = new EventSource(url);
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      setError(null);
      backoffRef.current = 1000; // reset backoff on success
    };

    es.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data) as ColonyData;
        setData(parsed);
      } catch {}
    };

    es.onerror = () => {
      setConnected(false);
      setError("Reconectando...");
      es.close();
      esRef.current = null;

      // Exponential backoff: 1s → 2s → 4s → 8s (max 8s)
      const delay = backoffRef.current;
      backoffRef.current = Math.min(delay * 2, 8000);
      retryRef.current = setTimeout(connect, delay);
    };
  }, [url]);

  // Periodic status poll — catches any missed SSE events
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(STATUS_URL);
        if (res.ok) {
          const payload = (await res.json()) as ColonyData;
          setData(payload);
          if (!connected) setConnected(true);
        }
      } catch {
        // SSE is primary, poll is just backup — silent fail is fine
      }
    }, 20_000); // every 20s

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [connected]);

  // Main SSE connection
  useEffect(() => {
    connect();
    return () => {
      if (esRef.current) esRef.current.close();
      if (retryRef.current) clearTimeout(retryRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [connect]);

  return { data, connected, error };
}
