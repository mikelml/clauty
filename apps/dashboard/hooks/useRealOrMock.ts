/**
 * useRealOrMock — Unified hook that returns real colony data when the gateway
 * is connected, or falls back to mock data when offline.
 *
 * Consumers get a single API regardless of data source.
 */

import { useMock } from '@/mock/MockContext';
import { useColony } from './useColony';
import { useGenesis } from './useGenesis';
import { useChat, type ChatMessage as RealChatMessage } from './useChat';
import type { AgentData } from '@/lib/types';
import type { ConnectionState } from '@/lib/types';

export type DataSource = 'real' | 'mock' | 'loading';

export function useRealOrMockColony() {
  const colony = useColony();
  const genesis = useGenesis();
  const mock = useMock();

  const isReal = colony.dataSource === 'real';

  if (isReal) {
    // Map real agents to AgentData record format (same as mock colony)
    const colonyRecord: Record<string, AgentData> = {};
    for (const agent of colony.agents) {
      const { id, ...rest } = agent;
      colonyRecord[id] = rest;
    }

    return {
      dataSource: 'real' as const,
      colony: colonyRecord,
      connectionState: colony.connectionState,
      isConnected: colony.isConnected,
      isLoading: colony.isLoading,
      newBornAgent: genesis.newBornAgent,
      clearNewBorn: genesis.clearNewBorn,
      // Mock-specific fields — unavailable in real mode
      persona: mock.persona, // still needed for UI (header, etc.)
      isMockActive: false,
    };
  }

  // Fallback to mock
  return {
    dataSource: 'mock' as const,
    colony: mock.colony,
    connectionState: 'mock' as ConnectionState,
    isConnected: false,
    isLoading: colony.isLoading,
    newBornAgent: null,
    clearNewBorn: () => {},
    persona: mock.persona,
    isMockActive: true,
  };
}

export function useRealOrMockChat() {
  const colony = useColony();
  const realChat = useChat();
  const mock = useMock();

  const isReal = colony.dataSource === 'real';

  if (isReal) {
    return {
      dataSource: 'real' as const,
      messages: realChat.messages,
      sending: realChat.sending,
      connected: realChat.connected,
      error: realChat.error,
      sendMessage: realChat.sendMessage,
      injectReminder: realChat.injectReminder,
    };
  }

  // Fallback to mock
  return {
    dataSource: 'mock' as const,
    messages: mock.chatMessages,
    sending: false,
    connected: false,
    error: null,
    sendMessage: (text: string, _agentId?: string) => mock.sendUserMessage(text),
    injectReminder: (_data: { agentId?: string; text: string }) => {},
  };
}
