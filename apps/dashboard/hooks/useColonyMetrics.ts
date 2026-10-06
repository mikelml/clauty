/**
 * useColonyMetrics — fetches aggregate colony stats from GET /clauty/metrics.
 *
 * Falls back to zeroed stats if gateway is unavailable.
 */

import { useState, useEffect, useCallback } from 'react';
import { GATEWAY_URL, AUTH_TOKEN } from '@/lib/pluginClient';
import type { ColonyStats, AgentRank } from '@/screens/ColonyWrappedPreview';

const METRICS_URL = `${GATEWAY_URL}/clauty/metrics`;

const DEFAULT_STATS: ColonyStats = {
  totalAgents: 0,
  totalMessages: 0,
  mostActiveAgent: 'ninguno',
  mostFrequentTopic: 'ninguno',
  firstAgentBorn: null,
  totalEvents: 0,
  pendingProposals: 0,
  topAgents: [],
};

type UseColonyMetricsReturn = {
  stats: ColonyStats;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useColonyMetrics(userId = 'default'): UseColonyMetricsReturn {
  const [stats, setStats] = useState<ColonyStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `${METRICS_URL}?userId=${encodeURIComponent(userId)}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.success && json.stats) {
        setStats({ ...DEFAULT_STATS, ...json.stats });
      } else {
        throw new Error(json.error || 'Invalid response');
      }
    } catch (err: any) {
      setError(err.message || 'Gateway unavailable');
      setStats(DEFAULT_STATS); // Show zeroed stats, not a crash
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refresh: fetchStats };
}
