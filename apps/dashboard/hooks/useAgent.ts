/**
 * useAgent — fetches full agent detail from GET /clauty/agent/:id
 *
 * Connects to the real gateway. Falls back to null on error.
 * Used by: dashboard/app/record/agent/[id].tsx
 */

import { useState, useEffect, useCallback } from 'react';
import { GATEWAY_URL, AUTH_TOKEN } from '@/lib/pluginClient';

export interface AgentDetail {
  id: string;
  state: 'idle' | 'thinking' | 'acting' | 'waiting' | 'dormant' | 'dead' | string;
  domain: string[] | null;
  maturityLevel: string | null;
  registeredAt: string;
  metrics: {
    tasksCompleted: number;
    tasksFailed: number;
    tokensUsed: number;
  };
  soulSummary: string | null;
  reflection: string | null;
  recentJournal: Array<{
    id: number;
    entry_type: string;
    text: string;
    created_at: string;
    tags: string[];
  }>;
  pendingReminders: Array<{
    id: string;
    text: string;
    agent_id: string;
    scheduled_at: number;
    status: string;
  }>;
}

type UseAgentReturn = {
  agent: AgentDetail | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useAgent(agentId: string | null | undefined): UseAgentReturn {
  const [agent, setAgent] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgent = useCallback(async () => {
    if (!agentId) {
      setLoading(false);
      setError('No agentId provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${GATEWAY_URL}/clauty/agent/${encodeURIComponent(agentId)}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        signal: AbortSignal.timeout(8_000),
      });

      if (res.status === 404) {
        setError(`Agent "${agentId}" not found`);
        setAgent(null);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: AgentDetail = await res.json();
      setAgent(data);
    } catch (err: any) {
      setError(err.message || 'Gateway unavailable');
      setAgent(null);
    } finally {
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    fetchAgent();
  }, [fetchAgent]);

  return { agent, loading, error, refresh: fetchAgent };
}
