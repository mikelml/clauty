/**
 * useIntegrations — fetches integration list from GET /clauty/integrations
 * with fallback to mock data when the gateway is offline.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { GATEWAY_URL, AUTH_TOKEN } from '@/lib/pluginClient';
import { integrationsByPersona, type Integration } from '@/mock/integrations';
import { useMockPersona } from '@/mock/MockContext';

export type RealIntegration = {
  id: string;
  name: string;
  enabled: boolean;
  status: 'connected' | 'available' | 'coming_soon';
  tier: number;
};

/** Map real API status to the mock Integration status used by UI */
function toMockStatus(status: string): Integration['status'] {
  if (status === 'connected') return 'live';
  if (status === 'available') return 'syncing';
  return 'idle';
}

export function useIntegrations() {
  const persona = useMockPersona();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [source, setSource] = useState<'real' | 'mock'>('mock');
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const fetchIntegrations = useCallback(async () => {
    try {
      const res = await fetch(`${GATEWAY_URL}/clauty/integrations`, {
        headers: { Authorization: `Bearer ${AUTH_TOKEN}` },
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!mountedRef.current) return;

      const list: RealIntegration[] = data.integrations || [];
      // Map to the Integration shape used by the existing UI
      const mapped: Integration[] = list.map((i) => ({
        id: i.id,
        label: i.name,
        icon: '',
        status: toMockStatus(i.status),
      }));

      if (mapped.length > 0) {
        setIntegrations(mapped);
        setSource('real');
      } else {
        throw new Error('empty');
      }
    } catch {
      // Fallback to mock
      if (!mountedRef.current) return;
      const mockList = persona ? integrationsByPersona[persona.id] || [] : [];
      setIntegrations(mockList);
      setSource('mock');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [persona]);

  useEffect(() => {
    mountedRef.current = true;
    fetchIntegrations();
    return () => { mountedRef.current = false; };
  }, [fetchIntegrations]);

  return { integrations, source, loading, refresh: fetchIntegrations };
}
