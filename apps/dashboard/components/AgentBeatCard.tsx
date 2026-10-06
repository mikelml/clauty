import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getAgentMeta } from '@/mock/agentMeta';

// ============ Shared types ============

export type AgentPing = {
  kind: 'ping';
  id: string;
  agentId: string;
  text: string;
  policyLocked?: boolean;
};

export type AgentPrompt = {
  kind: 'prompt';
  id: string;
  agentId: string;
  title: string;
  body: string;
  ctas: { label: string; intent: 'primary' | 'neutral' }[];
};

export type AgentCollab = {
  kind: 'collab';
  id: string;
  agentIds: string[];
  title: string;
  plan: string;
  projection?: string;
};

export type AgentBeat = AgentPing | AgentPrompt | AgentCollab;

// ============ Pieces ============

function AgentDot({ agentId, size = 18 }: { agentId: string; size?: number }) {
  const meta = getAgentMeta(agentId);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: meta.color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: 'rgba(14,8,32,0.85)',
          fontSize: size * 0.5,
          fontWeight: '800',
        }}
      >
        {meta.label.charAt(0)}
      </Text>
    </View>
  );
}

function Attribution({ agentId, onPress }: { agentId: string; onPress?: () => void }) {
  const meta = getAgentMeta(agentId);
  const content = (
    <View style={styles.attributionRow}>
      <AgentDot agentId={agentId} size={18} />
      <Text style={[styles.attributionText, { color: meta.deep }]}>{meta.label}</Text>
      {onPress && <Text style={styles.chev}>›</Text>}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} hitSlop={8} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
      {content}
    </Pressable>
  );
}

function useOpenAgent(agentId: string) {
  const router = useRouter();
  return () => router.push(`/record/agent/${agentId}`);
}

// ============ PING (log / bitácora style) ============

function PingCard({ beat }: { beat: AgentPing }) {
  const openAgent = useOpenAgent(beat.agentId);
  const meta = getAgentMeta(beat.agentId);

  return (
    <View style={styles.pingWrap}>
      <View style={[styles.pingRail, { backgroundColor: meta.soft + '40' }]} />
      <View style={styles.pingBody}>
        <Attribution agentId={beat.agentId} onPress={openAgent} />
        <Text style={styles.pingText}>{beat.text}</Text>
        {beat.policyLocked && (
          <View style={styles.policyPill}>
            <Text style={styles.policyIcon}>🔒</Text>
            <Text style={styles.policyText}>No enviado · Requiere tu aprobación</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// ============ PROMPT (requires action) ============

function PromptCard({ beat }: { beat: AgentPrompt }) {
  const openAgent = useOpenAgent(beat.agentId);
  const meta = getAgentMeta(beat.agentId);
  const [chosen, setChosen] = useState<string | null>(null);

  return (
    <View style={[styles.card, { backgroundColor: '#1F1442' }]}>
      <Attribution agentId={beat.agentId} onPress={openAgent} />
      <Text style={styles.promptTitle}>{beat.title}</Text>
      <Text style={styles.body}>{beat.body}</Text>

      {chosen === null ? (
        <View style={styles.ctaRow}>
          {beat.ctas.map((cta) => (
            <Pressable
              key={cta.label}
              onPress={() => setChosen(cta.label)}
              style={({ pressed }) => [
                styles.ctaBtn,
                cta.intent === 'primary'
                  ? { backgroundColor: meta.soft }
                  : styles.ctaBtnNeutral,
                pressed && styles.btnPressed,
              ]}
            >
              <Text
                style={
                  cta.intent === 'primary'
                    ? styles.ctaBtnPrimaryText
                    : styles.ctaBtnNeutralText
                }
              >
                {cta.label}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <View
          style={[
            styles.chosenPill,
            { borderColor: meta.soft + '77', backgroundColor: meta.soft + '26' },
          ]}
        >
          <View style={[styles.chosenDot, { backgroundColor: meta.color }]} />
          <Text style={[styles.chosenText, { color: meta.deep }]}>
            {chosen}
          </Text>
        </View>
      )}
    </View>
  );
}

// ============ COLLAB ============

function CollabCard({ beat }: { beat: AgentCollab }) {
  const router = useRouter();
  const metas = beat.agentIds.map(getAgentMeta);

  return (
    <View style={[styles.card, styles.collabCard]}>
      <Pressable
        onPress={() => router.push(`/record/agent/${beat.agentIds[0]}`)}
        style={styles.avatarStack}
        hitSlop={6}
      >
        {metas.map((m, i) => (
          <View
            key={m.id}
            style={[
              styles.stackedAvatar,
              {
                backgroundColor: m.color,
                marginLeft: i === 0 ? 0 : -10,
                zIndex: metas.length - i,
              },
            ]}
          >
            <Text style={styles.stackedLetter}>{m.label.charAt(0)}</Text>
          </View>
        ))}
      </Pressable>
      <Text style={styles.collabEyebrow}>
        {metas.map((m) => m.label).join(' × ')}
      </Text>

      <Text style={styles.collabTitle}>{beat.title}</Text>
      <Text style={styles.body}>{beat.plan}</Text>

      {beat.projection && (
        <View style={styles.projectionPill}>
          <Text style={styles.projectionLabel}>PROYECCIÓN</Text>
          <Text style={styles.projectionValue}>{beat.projection}</Text>
        </View>
      )}
    </View>
  );
}

// ============ Router ============

export function AgentBeatCard({ beat }: { beat: AgentBeat }) {
  if (beat.kind === 'ping') return <PingCard beat={beat} />;
  if (beat.kind === 'prompt') return <PromptCard beat={beat} />;
  if (beat.kind === 'collab') return <CollabCard beat={beat} />;
  return null;
}

// ============ Styles ============

const styles = StyleSheet.create({
  // shared
  card: {
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  attributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 7,
  },
  attributionText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  chev: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 16,
    lineHeight: 16,
    marginLeft: 2,
  },
  body: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 19,
  },
  btnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },

  // ping (bitácora / log style)
  pingWrap: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 2,
  },
  pingRail: {
    width: 2,
    borderRadius: 1,
    marginRight: 12,
    marginVertical: 4,
  },
  pingBody: {
    flex: 1,
    paddingVertical: 2,
  },
  pingText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  policyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    alignSelf: 'flex-start',
  },
  policyIcon: { fontSize: 10 },
  policyText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    letterSpacing: 0.3,
  },

  // prompt
  promptTitle: {
    color: 'rgba(255,255,255,0.94)',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    lineHeight: 19,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  ctaBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaBtnNeutral: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ctaBtnPrimaryText: {
    color: '#1A0F2E',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ctaBtnNeutralText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chosenPill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: 'flex-start',
    gap: 8,
  },
  chosenDot: { width: 6, height: 6, borderRadius: 3 },
  chosenText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.3 },

  // collab
  collabCard: {
    backgroundColor: '#241858',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.14)',
  },
  avatarStack: {
    flexDirection: 'row',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  stackedAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#241858',
  },
  stackedLetter: {
    color: 'rgba(14,8,32,0.85)',
    fontSize: 12,
    fontWeight: '800',
  },
  collabEyebrow: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  collabTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 6,
  },
  projectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: 'rgba(255,215,0,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.2)',
    alignSelf: 'flex-start',
  },
  projectionLabel: {
    color: 'rgba(255,215,0,0.72)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  projectionValue: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
