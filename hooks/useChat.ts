import { useState, useEffect, useCallback, useRef } from 'react';
import { Vibration } from 'react-native';
import { CHAT_URL, HISTORY_URL, STATUS_URL } from '@/constants/config';
import { formatReminderMessage } from '@/utils/reminderFormatter';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
  agentId?: string;
  isReminder?: boolean;
  isError?: boolean;
};

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function extractText(msg: any): string | null {
  if (!msg) return null;
  if (typeof msg === 'string') return msg;
  if (typeof msg.text === 'string') return msg.text;
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) {
    return (
      msg.content
        .filter((p: any) => p.type === 'text' && typeof p.text === 'string')
        .map((p: any) => p.text)
        .join('\n') || null
    );
  }
  return null;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  /**
   * Inject a proactive reminder into the chat feed.
   * Called from the screen/component that connects useColony's onReminder to this.
   */
  const injectReminder = useCallback((data: { agentId?: string; text: string }) => {
    if (!mountedRef.current) return;
    try {
      Vibration.vibrate([0, 200, 100, 200]);
    } catch {}

    const formattedText = formatReminderMessage(data.agentId || 'inventor', data.text);
    setMessages((prev) => [
      ...prev,
      {
        id: uid(),
        role: 'assistant',
        text: formattedText,
        timestamp: Date.now(),
        agentId: data.agentId || 'inventor',
        isReminder: true,
      },
    ]);
  }, []);

  // Check gateway connectivity + load history on mount
  useEffect(() => {
    mountedRef.current = true;

    (async () => {
      try {
        // Check if gateway is reachable
        const healthRes = await fetch(STATUS_URL);
        if (healthRes.ok) {
          if (mountedRef.current) setConnected(true);
        }
      } catch {
        if (mountedRef.current) setError('Gateway no disponible');
      }

      try {
        // Load chat history
        const histRes = await fetch(HISTORY_URL);
        if (histRes.ok) {
          const data = await histRes.json();
          if (data.messages && mountedRef.current) {
            const history: ChatMessage[] = data.messages
              .map((m: any) => {
                const text = extractText(m);
                if (!text) return null;
                return {
                  id: uid(),
                  role: m.role === 'user' ? 'user' : 'assistant',
                  text,
                  timestamp: m.timestamp || Date.now(),
                } as ChatMessage;
              })
              .filter(Boolean) as ChatMessage[];
            setMessages(history);
          }
        }
      } catch {
        // History load failed silently — not critical
      }
    })();

    return () => { mountedRef.current = false; };
  }, []);

  const sendMessage = useCallback(async (text: string, agentId?: string) => {
    if (!text.trim() || sending) return;

    const userMsg: ChatMessage = {
      id: uid(),
      role: 'user',
      text: text.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setSending(true);
    setError(null);

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 35_000);

      let res: Response;
      try {
        res = await fetch(CHAT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            agentId: agentId || undefined,
            sessionKey: 'clauty:web:main',
          }),
          signal: controller.signal,
        });
        clearTimeout(timer);
      } catch (fetchErr: any) {
        clearTimeout(timer);
        if (fetchErr.name === 'AbortError') {
          throw new Error('El agente está pensando... intenta de nuevo en un momento.');
        }
        if (fetchErr.message?.includes('Network request failed') || fetchErr.message?.includes('Failed to fetch')) {
          throw new Error('Sin conexión. Verifica tu red o que el plugin esté corriendo.');
        }
        throw fetchErr;
      }

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error('Token de acceso inválido. Verifica la configuración.');
        }
        throw new Error(data.error || `Error del servidor (${res.status})`);
      }

      if (mountedRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            text: data.response,
            timestamp: Date.now(),
            agentId: data.agentId || agentId,
          },
        ]);
      }
    } catch (err: any) {
      console.error('[chat error]', err);
      if (mountedRef.current) {
        const errText = err.message || 'No se pudo conectar con el agente. Intenta de nuevo.';
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            text: errText,
            timestamp: Date.now(),
            isError: true,
          } as ChatMessage,
        ]);
        setError(errText);
      }
    } finally {
      if (mountedRef.current) setSending(false);
    }
  }, [sending]);

  return { messages, sending, connected, error, sendMessage, injectReminder };
}
