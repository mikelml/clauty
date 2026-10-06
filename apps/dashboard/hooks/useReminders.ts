/**
 * useReminders — fetches and manages pending reminders from the gateway.
 * Polls every 5 seconds for up-to-date time-until-trigger values.
 */

import { useState, useEffect, useCallback, useRef } from 'react';

const REMINDERS_URL = 'http://127.0.0.1:18789/clauty/reminders';

export type Reminder = {
  id: string;
  text: string;
  agentId: string;
  userId: string;
  scheduledAt: number;
  msUntilTrigger: number;
  status: string;
};

/**
 * Format milliseconds into a human-readable string.
 * e.g. 65000 → "en 1 minuto y 5 segundos"
 */
export function formatTimeRemaining(ms: number): string {
  if (ms <= 0) return "ahora";
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `en ${seconds} segundo${seconds !== 1 ? "s" : ""}`;
  }
  if (seconds === 0) {
    return `en ${minutes} minuto${minutes !== 1 ? "s" : ""}`;
  }
  return `en ${minutes} minuto${minutes !== 1 ? "s" : ""} y ${seconds} segundo${seconds !== 1 ? "s" : ""}`;
}

export function useReminders(userId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  const fetchReminders = useCallback(async () => {
    try {
      const url = userId
        ? `${REMINDERS_URL}?userId=${encodeURIComponent(userId)}`
        : REMINDERS_URL;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (mountedRef.current) {
          setReminders(data.reminders || []);
          setError(null);
        }
      }
    } catch {
      // Silent fail — gateway may not be available
    }
  }, [userId]);

  const cancelReminder = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${REMINDERS_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setReminders((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Poll every 5 seconds
  useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    fetchReminders().finally(() => {
      if (mountedRef.current) setLoading(false);
    });

    const interval = setInterval(fetchReminders, 5_000);

    return () => {
      mountedRef.current = false;
      clearInterval(interval);
    };
  }, [fetchReminders]);

  return { reminders, loading, error, cancelReminder, refresh: fetchReminders };
}
