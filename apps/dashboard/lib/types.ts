/**
 * TypeScript types for ClauTY dashboard — plugin integration.
 */

/** Agent data without the id (used as values in Record<string, AgentData>) */
export type AgentData = {
  state: string; // 'idle' | 'thinking' | 'acting' | 'error'
  domain: string[] | null;
  maturityLevel: string | null;
  metrics: {
    tasksCompleted: number;
    tasksFailed: number;
    tokensUsed: number;
  };
  registeredAt: string;
};

export type Agent = AgentData & {
  id: string;
  name?: string;
};

export type ColonyStatus = {
  status: string;
  colony: Record<string, Agent>;
  agentsLoaded: number;
  connectedClients: number;
  reminders?: {
    active: number;
    triggered_today: number;
    missed: number;
  };
  uptime?: number;
  version?: string;
  timestamp: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  agentId?: string;
  isReminder?: boolean;
};

export type ChatResponse = {
  response: string;
  runId: string;
  sessionKey: string;
  agentId?: string;
};

export type SSEEvent = {
  type:
    | 'agent_update'
    | 'genesis:born'
    | 'proactive:reminder'
    | 'heartbeat'
    | string;
  payload: unknown;
};

export type ConnectionState = 'connected' | 'reconnecting' | 'offline' | 'mock';

export type ReminderPayload = {
  id: string;
  text: string;
  agentId: string;
  userId: string;
};
