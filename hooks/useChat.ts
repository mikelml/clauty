import { useState, useEffect, useCallback, useRef } from 'react';
import { CHAT_URL, HISTORY_URL, STATUS_URL } from '@/constants/config';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
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

  const sendMessage = useCallback(async (text: string) => {
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
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error del servidor');
      }

      if (mountedRef.current) {
        setMessages((prev) => [
          ...prev,
          {
            id: uid(),
            role: 'assistant',
            text: data.response,
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || 'Error enviando mensaje');
      }
    } finally {
      if (mountedRef.current) setSending(false);
    }
  }, [sending]);

  return { messages, sending, connected, error, sendMessage };
}
