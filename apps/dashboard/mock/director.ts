import type { AgentBeat } from '@/components/AgentBeatCard';
import type { PersonaId } from '@/mock/personas';
import { act2ByPersona } from '@/mock/acts/act2';
import { act3ByPersona } from '@/mock/acts/act3';
import { act4ByPersona } from '@/mock/acts/act4';
import { act6ByPersona, type Act6Report } from '@/mock/acts/act6';
import { act7ByPersona } from '@/mock/acts/act7';

export type TimelinePhase =
  | 'idle'
  | 'act1' | 'act2' | 'act3' | 'act4'
  | 'act5' | 'act6' | 'act7' | 'act8'
  | 'completed';

// El director le pide al MockContext que materialice mensajes en el chat.
export type DirectorCallbacks = {
  personaId: PersonaId;
  setPhase: (p: TimelinePhase) => void;
  setAct1Visible: (v: boolean) => void;
  setAct2ModalOpen: (v: boolean) => void;
  setAct5OverlayOpen: (v: boolean) => void;
  setNightMode: (v: boolean) => void;
  setAct8ModalOpen: (v: boolean) => void;
  scheduleBeat: (beat: AgentBeat, startAtMs: number, typingMs: number) => void;
  scheduleAgentThought: (
    agentId: string,
    text: string,
    startAtMs: number,
    typingMs: number,
    integrations?: string[],
  ) => void;
  scheduleAgentAction: (
    agentId: string,
    text: string,
    startAtMs: number,
    typingMs: number,
    integrations?: string[],
  ) => void;
  scheduleReport: (report: Act6Report, startAtMs: number, typingMs: number) => void;
};

// Timing (ms) — tuned para grabación fluida
const TIMING = {
  ACT1_DELAY: 10_000,        // 10s tras adoption
  ACT1_VISIBLE: 12_000,      // widget visible antes de cerrar y abrir Act2
  ACT2_AUTO_CLOSE: 45_000,   // si user no cierra, se cierra solo (margen generoso para leer)
  ACT3_DELAY: 600,           // tras cerrar act2
  ACT3_BEAT_TYPING: 1_300,
  ACT3_BEAT_GAP: 1_400,
  ACT4_DELAY: 4_000,
  ACT4_BEAT_TYPING: 1_300,
  ACT4_BEAT_GAP: 1_400,
  ACT5_DELAY: 3_000,
  ACT5_VISIBLE: 40_000,      // convergencia visible largo rato; user puede cerrar antes
  ACT6_DELAY: 400,
  ACT6_TYPING: 1_000,
  ACT6_VISIBLE: 5_000,
  ACT7_TYPING: 900,
  ACT7_GAP: 1_400,
  ACT8_DELAY: 1_000,
};

export class TimelineDirector {
  private timers: ReturnType<typeof setTimeout>[] = [];
  private active = true;

  constructor(private cb: DirectorCallbacks) {}

  start() {
    this.cb.setPhase('idle');
    this.schedule(TIMING.ACT1_DELAY, () => this.runAct1());
  }

  stop() {
    this.active = false;
    this.timers.forEach(clearTimeout);
    this.timers = [];
  }

  closeAct2AndContinue() {
    if (!this.active) return;
    this.cb.setAct2ModalOpen(false);
    this.schedule(TIMING.ACT3_DELAY, () => this.runAct3());
  }

  closeAct5AndContinue() {
    if (!this.active) return;
    this.cb.setAct5OverlayOpen(false);
    this.schedule(TIMING.ACT6_DELAY, () => this.runAct6());
  }

  closeAct8() {
    if (!this.active) return;
    this.cb.setAct8ModalOpen(false);
    this.cb.setPhase('completed');
  }

  private schedule(delay: number, fn: () => void) {
    if (!this.active) return;
    const t = setTimeout(() => {
      if (this.active) fn();
    }, delay);
    this.timers.push(t);
  }

  // ====== ACT 1 — morning widget ======
  private runAct1() {
    this.cb.setPhase('act1');
    this.cb.setAct1Visible(true);
    this.schedule(TIMING.ACT1_VISIBLE, () => {
      this.cb.setAct1Visible(false);
      this.runAct2();
    });
  }

  // ====== ACT 2 — bitácora modal ======
  private runAct2() {
    this.cb.setPhase('act2');
    this.cb.setAct2ModalOpen(true);
    this.schedule(TIMING.ACT2_AUTO_CLOSE, () => {
      if (this.active) this.closeAct2AndContinue();
    });
  }

  // ====== ACT 3 — chat beats financieros ======
  private runAct3() {
    this.cb.setPhase('act3');
    const beats = act3ByPersona[this.cb.personaId];
    let cursor = 0;
    beats.forEach((beat) => {
      this.cb.scheduleBeat(beat, cursor, TIMING.ACT3_BEAT_TYPING);
      cursor += TIMING.ACT3_BEAT_TYPING + TIMING.ACT3_BEAT_GAP;
    });
    this.schedule(cursor + TIMING.ACT4_DELAY, () => this.runAct4());
  }

  // ====== ACT 4 — bienestar + a2a ======
  private runAct4() {
    this.cb.setPhase('act4');
    const beats = act4ByPersona[this.cb.personaId];
    let cursor = 0;
    beats.forEach((beat) => {
      this.cb.scheduleBeat(beat, cursor, TIMING.ACT4_BEAT_TYPING);
      cursor += TIMING.ACT4_BEAT_TYPING + TIMING.ACT4_BEAT_GAP;
    });
    this.schedule(cursor + TIMING.ACT5_DELAY, () => this.runAct5());
  }

  // ====== ACT 5 — collab overlay en home ======
  private runAct5() {
    this.cb.setPhase('act5');
    this.cb.setAct5OverlayOpen(true);
    this.schedule(TIMING.ACT5_VISIBLE, () => {
      if (this.active) this.closeAct5AndContinue();
    });
  }

  // ====== ACT 6 — reporte en chat ======
  private runAct6() {
    this.cb.setPhase('act6');
    const report = act6ByPersona[this.cb.personaId];
    this.cb.scheduleReport(report, 0, TIMING.ACT6_TYPING);
    this.schedule(TIMING.ACT6_TYPING + TIMING.ACT6_VISIBLE, () => this.runAct7());
  }

  // ====== ACT 7 — Dreamtime threads en chat ======
  private runAct7() {
    this.cb.setPhase('act7');
    this.cb.setNightMode(true);
    const threads = act7ByPersona[this.cb.personaId];
    let cursor = 400;
    threads.forEach((t) => {
      if (t.kind === 'action') {
        this.cb.scheduleAgentAction(t.agentId, t.text, cursor, TIMING.ACT7_TYPING, t.integrations);
      } else {
        this.cb.scheduleAgentThought(t.agentId, t.text, cursor, TIMING.ACT7_TYPING, t.integrations);
      }
      cursor += TIMING.ACT7_TYPING + TIMING.ACT7_GAP;
    });
    this.schedule(cursor + TIMING.ACT8_DELAY, () => this.runAct8());
  }

  // ====== ACT 8 — morning greeting + diary modal ======
  private runAct8() {
    this.cb.setPhase('act8');
    this.cb.setNightMode(false);
    this.cb.setAct8ModalOpen(true);
  }

  // Helper público: entries de Act2 para modal consumer
  static getAct2Entries(personaId: PersonaId) {
    return act2ByPersona[personaId];
  }
}
