import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import type { AgentData } from '@/lib/types';
import {
  personas,
  newbornToAgentData,
  type Persona,
  type PersonaId,
} from '@/mock/personas';
import { colonies } from '@/mock/colonies';
import { routeIntent, type MessageFlavor } from '@/mock/intentRouter';
import { TimelineDirector, type TimelinePhase } from '@/mock/director';
import type { AgentBeat } from '@/components/AgentBeatCard';
import type { Act6Report } from '@/mock/acts/act6';

export type NewbornStatus = 'pending' | 'adopted' | 'killed';

export type ChatMessage =
  | { id: string; kind: 'user'; text: string; ts: number }
  | {
      id: string;
      kind: 'agent';
      agentId: string;
      text: string;
      ts: number;
      typing?: boolean;
      flavor?: MessageFlavor;
      integrations?: string[];
    }
  | { id: string; kind: 'beat'; beat: AgentBeat; ts: number; typing?: boolean }
  | { id: string; kind: 'report'; report: Act6Report; ts: number; typing?: boolean };

type MockContextValue = {
  persona: Persona | null;
  colony: Record<string, AgentData>;
  newbornStatus: NewbornStatus;
  setPersona: (id: PersonaId | null) => void;
  adoptNewborn: () => void;
  killNewborn: () => void;
  chatMessages: ChatMessage[];
  sendUserMessage: (text: string) => void;

  // Timeline state
  timelinePhase: TimelinePhase;
  act1Visible: boolean;
  act2ModalOpen: boolean;
  act5OverlayOpen: boolean;
  nightMode: boolean;
  act8ModalOpen: boolean;
  closeAct2: () => void;
  closeAct5: () => void;
  closeAct8: () => void;
};

const MockContext = createContext<MockContextValue | null>(null);

let msgCounter = 0;
const nextId = () => `msg-${Date.now()}-${msgCounter++}`;

export function MockProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaId] = useState<PersonaId | null>(null);
  const [newbornStatus, setNewbornStatus] = useState<NewbornStatus>('pending');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Timeline state
  const [timelinePhase, setTimelinePhase] = useState<TimelinePhase>('idle');
  const [act1Visible, setAct1Visible] = useState(false);
  const [act2ModalOpen, setAct2ModalOpen] = useState(false);
  const [act5OverlayOpen, setAct5OverlayOpen] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [act8ModalOpen, setAct8ModalOpen] = useState(false);

  const directorRef = useRef<TimelineDirector | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const stopDirector = () => {
    if (directorRef.current) {
      directorRef.current.stop();
      directorRef.current = null;
    }
  };

  const resetTimelineState = () => {
    setTimelinePhase('idle');
    setAct1Visible(false);
    setAct2ModalOpen(false);
    setAct5OverlayOpen(false);
    setNightMode(false);
    setAct8ModalOpen(false);
  };

  const setPersona = useCallback((id: PersonaId | null) => {
    clearTimers();
    stopDirector();
    setPersonaId(id);
    setNewbornStatus('pending');
    setChatMessages([]);
    resetTimelineState();
  }, []);

  const adoptNewborn = useCallback(() => setNewbornStatus('adopted'), []);
  const killNewborn = useCallback(() => setNewbornStatus('killed'), []);

  // =================== Chat scheduling primitives ===================

  const scheduleAgentMessage = useCallback(
    (
      startAt: number,
      agentId: string,
      text: string,
      typingMs: number,
      flavor?: MessageFlavor,
      integrations?: string[],
    ) => {
      const t1 = setTimeout(() => {
        const typingId = nextId();
        setChatMessages((prev) => [
          ...prev,
          { id: typingId, kind: 'agent', agentId, text: '', ts: Date.now(), typing: true, flavor },
        ]);
        const t2 = setTimeout(() => {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === typingId && m.kind === 'agent'
                ? { ...m, text, typing: false, integrations }
                : m,
            ),
          );
        }, typingMs);
        timersRef.current.push(t2);
      }, startAt);
      timersRef.current.push(t1);
    },
    [],
  );

  const scheduleBeat = useCallback(
    (beat: AgentBeat, startAt: number, typingMs: number) => {
      const beatMsgId = nextId();
      const t1 = setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { id: beatMsgId, kind: 'beat', beat, ts: Date.now(), typing: true },
        ]);
        const t2 = setTimeout(() => {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === beatMsgId && m.kind === 'beat' ? { ...m, typing: false } : m,
            ),
          );
        }, typingMs);
        timersRef.current.push(t2);
      }, startAt);
      timersRef.current.push(t1);
    },
    [],
  );

  const scheduleReport = useCallback(
    (report: Act6Report, startAt: number, typingMs: number) => {
      const reportId = nextId();
      const t1 = setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { id: reportId, kind: 'report', report, ts: Date.now(), typing: true },
        ]);
        const t2 = setTimeout(() => {
          setChatMessages((prev) =>
            prev.map((m) =>
              m.id === reportId && m.kind === 'report' ? { ...m, typing: false } : m,
            ),
          );
        }, typingMs);
        timersRef.current.push(t2);
      }, startAt);
      timersRef.current.push(t1);
    },
    [],
  );

  // =================== Director lifecycle ===================

  // El director arranca cuando adoption ocurre. No lo detenemos en el cleanup
  // de este effect — Strict Mode en dev ejecutaría el effect 2x y crearía
  // directores duplicados. El director se detiene solo en setPersona() o al
  // desmontar el Provider (effect separado abajo).
  useEffect(() => {
    if (newbornStatus !== 'adopted' || !personaId) return;
    if (directorRef.current) return; // ya corriendo

    const director = new TimelineDirector({
      personaId,
      setPhase: setTimelinePhase,
      setAct1Visible,
      setAct2ModalOpen,
      setAct5OverlayOpen,
      setNightMode,
      setAct8ModalOpen,
      scheduleBeat,
      scheduleAgentThought: (agentId, text, startAt, typingMs, integrations) =>
        scheduleAgentMessage(startAt, agentId, text, typingMs, 'thought', integrations),
      scheduleAgentAction: (agentId, text, startAt, typingMs, integrations) =>
        scheduleAgentMessage(startAt, agentId, text, typingMs, 'action', integrations),
      scheduleReport,
    });
    directorRef.current = director;
    director.start();
  }, [newbornStatus, personaId, scheduleBeat, scheduleAgentMessage, scheduleReport]);

  // Unmount total: liberar timers del director.
  useEffect(() => {
    return () => {
      directorRef.current?.stop();
      directorRef.current = null;
    };
  }, []);

  const closeAct2 = useCallback(() => {
    directorRef.current?.closeAct2AndContinue();
  }, []);

  const closeAct5 = useCallback(() => {
    directorRef.current?.closeAct5AndContinue();
  }, []);

  const closeAct8 = useCallback(() => {
    directorRef.current?.closeAct8();
  }, []);

  // =================== User send (free chat) ===================

  const sendUserMessage = useCallback(
    (text: string) => {
      if (!personaId || !text.trim()) return;
      const trimmed = text.trim();

      const lastAgent = [...chatMessages]
        .reverse()
        .find((m) => m.kind === 'agent');
      const lastAgentId =
        lastAgent && lastAgent.kind === 'agent' ? lastAgent.agentId : undefined;

      const userMsg: ChatMessage = {
        id: nextId(),
        kind: 'user',
        text: trimmed,
        ts: Date.now(),
      };
      setChatMessages((prev) => [...prev, userMsg]);

      const intent = routeIntent(trimmed, personaId, lastAgentId);

      const mainStart = 420;
      const mainTyping = intent.typingMs ?? 1200;
      scheduleAgentMessage(
        mainStart,
        intent.agentId,
        intent.reply,
        mainTyping,
        'reply',
        intent.integrations,
      );

      let cursor = mainStart + mainTyping;
      intent.followups?.forEach((fu) => {
        cursor += fu.delayMs;
        const fuTyping = fu.typingMs ?? 900;
        scheduleAgentMessage(
          cursor,
          intent.agentId,
          fu.text,
          fuTyping,
          fu.flavor,
          fu.integrations,
        );
        cursor += fuTyping;
      });
    },
    [personaId, chatMessages, scheduleAgentMessage],
  );

  // =================== Context value ===================

  const value = useMemo<MockContextValue>(() => {
    const persona = personaId ? personas[personaId] : null;
    const baseline = personaId ? colonies[personaId] : {};

    const colony: Record<string, AgentData> = { ...baseline };
    if (persona && newbornStatus === 'adopted') {
      colony[persona.newborn.id] = newbornToAgentData(persona.newborn);
    }

    return {
      persona,
      colony,
      newbornStatus,
      setPersona,
      adoptNewborn,
      killNewborn,
      chatMessages,
      sendUserMessage,
      timelinePhase,
      act1Visible,
      act2ModalOpen,
      act5OverlayOpen,
      nightMode,
      act8ModalOpen,
      closeAct2,
      closeAct5,
      closeAct8,
    };
  }, [
    personaId, newbornStatus, setPersona, adoptNewborn, killNewborn,
    chatMessages, sendUserMessage,
    timelinePhase, act1Visible, act2ModalOpen, act5OverlayOpen, nightMode, act8ModalOpen,
    closeAct2, closeAct5, closeAct8,
  ]);

  return <MockContext.Provider value={value}>{children}</MockContext.Provider>;
}

export function useMock() {
  const ctx = useContext(MockContext);
  if (!ctx) throw new Error('useMock must be used within MockProvider');
  return ctx;
}

export function useMockPersona() {
  return useMock().persona;
}

export function useMockColony() {
  return useMock().colony;
}
