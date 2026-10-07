import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Animated, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { stateLabels } from '@/constants/Colors';
import { useAgent } from '@/hooks/useAgent';

const stateColor: Record<string, string> = {
  thinking: '#6AA9F0',
  acting:   '#5FD683',
  waiting:  '#FFB06B',
  idle:     'rgba(255,255,255,0.4)',
  dormant:  'rgba(255,255,255,0.25)',
  dead:     'rgba(255,255,255,0.2)',
  birthing: '#FFD700',
};

/** Hash a string to a pastel color for domain tags */
function hashColor(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }
  const hue = Math.abs(h) % 360;
  return `hsl(${hue}, 55%, 65%)`;
}

function AgentStatusBadge({ state }: { state: string }) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (state === 'thinking') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [state, pulseAnim]);

  const color = stateColor[state] ?? '#888';

  return (
    <View style={[styles.statePill, { borderColor: color + '44' }]}>
      <Animated.View
        style={[
          styles.stateDot,
          { backgroundColor: color, transform: [{ scale: pulseAnim }] },
        ]}
      />
      <Text style={styles.stateText}>
        {stateLabels[state] ?? state}
      </Text>
    </View>
  );
}

export default function AgentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reflectionExpanded, setReflectionExpanded] = useState(false);

  const { agent, loading } = useAgent(id);

  if (!id) return null;

  const displayState = agent?.state ?? 'idle';
  const displayDomain = agent?.domain ?? null;
  const displayMaturity = agent?.maturityLevel ?? null;
  const displaySoulSummary = agent?.soulSummary ?? null;
  const journalEntries = agent?.recentJournal ?? [];
  const pendingReminders = agent?.pendingReminders ?? [];

  // Dreamtime insights: journal entries tagged with "dreamtime" or entry_type "dream"
  const dreamtimeInsights = journalEntries.filter(
    (e) => e.entry_type === 'dream' || (e.tags && e.tags.includes('dreamtime'))
  );

  const agentName = id.charAt(0).toUpperCase() + id.slice(1);
  const agentColor = hashColor(id);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/record');
  };

  const goToChat = () => {
    router.push(`/(tabs)/chat?agentId=${id}`);
  };

  if (loading) {
    return (
      <View style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>Cargando agente...</Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Pressable onPress={goBack} hitSlop={12} style={styles.backBtn}>
          <Text style={styles.backChev}>{'<'}</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Agente</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.hero}>
          <View
            style={[
              styles.avatarOuter,
              { backgroundColor: agentColor + '22', borderColor: agentColor + '55' },
            ]}
          >
            <View style={[styles.avatarInner, { backgroundColor: agentColor }]}>
              <Text style={styles.avatarLetter}>{agentName.charAt(0)}</Text>
            </View>
          </View>

          <Text style={[styles.name, { color: agentColor }]}>{agentName}</Text>

          <AgentStatusBadge state={displayState} />

          {/* Domain tags */}
          {displayDomain && displayDomain.length > 0 && (
            <View style={styles.domainRow}>
              {displayDomain.map((d) => (
                <View key={d} style={[styles.domainTag, { backgroundColor: hashColor(d) + '22', borderColor: hashColor(d) + '55' }]}>
                  <Text style={[styles.domainText, { color: hashColor(d) }]}>{d}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Maturity level */}
          {displayMaturity && (
            <Text style={styles.maturityText}>Madurez: {displayMaturity}</Text>
          )}

          <Text style={styles.tagline}>
            {agent?.registeredAt
              ? `Desde ${new Date(agent.registeredAt).toLocaleDateString('es-MX', { month: 'short', year: 'numeric' })}`
              : '---'}
          </Text>
        </View>

        {/* Soul Summary */}
        {displaySoulSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Personalidad</Text>
            <Text style={styles.soulText}>{displaySoulSummary}</Text>
          </View>
        )}

        {/* Metricas */}
        {agent?.metrics && (
          <View style={styles.metricsRow}>
            <Metric label="Tareas" value={String(agent.metrics.tasksCompleted)} />
            <Metric label="Errores" value={String(agent.metrics.tasksFailed)} />
            <Metric
              label="Tokens"
              value={agent.metrics.tokensUsed > 999 ? `${(agent.metrics.tokensUsed / 1000).toFixed(1)}k` : String(agent.metrics.tokensUsed)}
            />
          </View>
        )}

        {/* Journal */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Journal</Text>
          {journalEntries.length === 0 && (
            <Text style={styles.emptyText}>Sin entradas de journal.</Text>
          )}
          {journalEntries.map((entry) => (
            <View key={entry.id} style={styles.journalRow}>
              <Text style={styles.journalDate}>
                {new Date(entry.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </Text>
              <Text style={styles.journalText} numberOfLines={2}>
                {entry.text}
              </Text>
            </View>
          ))}
        </View>

        {/* Dreamtime Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dreamtime Insights</Text>
          {dreamtimeInsights.length === 0 && (
            <Text style={styles.emptyText}>Sin insights de dreamtime.</Text>
          )}
          {dreamtimeInsights.map((entry) => (
            <View key={entry.id} style={styles.dreamRow}>
              <Text style={styles.dreamDate}>
                {new Date(entry.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
              </Text>
              <Text style={styles.dreamText} numberOfLines={4}>
                {entry.text}
              </Text>
            </View>
          ))}
        </View>

        {/* REFLECTION.md preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reflexion</Text>
          {agent?.reflection ? (
            <Pressable onPress={() => setReflectionExpanded(!reflectionExpanded)}>
              <Text style={styles.reflectionToggle}>
                {reflectionExpanded ? 'Colapsar' : 'Expandir'}
              </Text>
              {reflectionExpanded && (
                <Text style={styles.reflectionText}>{agent.reflection}</Text>
              )}
              {!reflectionExpanded && (
                <Text style={styles.reflectionText} numberOfLines={3}>
                  {agent.reflection}
                </Text>
              )}
            </Pressable>
          ) : (
            <Text style={styles.emptyText}>Este agente aun no ha sonado.</Text>
          )}
        </View>

        {/* Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Reminders activos</Text>
          {pendingReminders.length === 0 && (
            <Text style={styles.emptyText}>Sin reminders activos.</Text>
          )}
          {pendingReminders.map((r) => (
            <View key={r.id} style={styles.reminderRow}>
              <Text style={styles.reminderText}>{r.text}</Text>
              <Text style={styles.reminderTime}>
                {new Date(r.scheduled_at).toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          ))}
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Send message button */}
      <TouchableOpacity
        style={[styles.sendMessageButton, { marginBottom: insets.bottom + 10 }]}
        onPress={goToChat}
        activeOpacity={0.85}
      >
        <Text style={styles.sendMessageText}>Enviar mensaje</Text>
      </TouchableOpacity>
    </View>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCell}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#1A0F2E' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChev: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 30,
    lineHeight: 30,
    fontWeight: '300',
  },
  headerTitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  scroll: {
    paddingVertical: 22,
    paddingHorizontal: 20,
  },

  // hero
  hero: { alignItems: 'center', marginBottom: 22 },
  avatarOuter: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: 'rgba(14,8,32,0.85)',
    fontSize: 32,
    fontWeight: '800',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  statePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
    marginBottom: 10,
  },
  stateDot: { width: 6, height: 6, borderRadius: 3 },
  stateText: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  tagline: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 11,
    letterSpacing: 0.3,
  },

  // domain tags
  domainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
    justifyContent: 'center',
  },
  domainTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  domainText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // maturity
  maturityText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },

  // soul summary
  soulText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },

  // metrics
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
  },
  metricCell: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#1E1240',
    borderRadius: 12,
  },
  metricValue: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  // sections
  section: { marginBottom: 22 },
  sectionLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  sectionHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontStyle: 'italic',
    marginBottom: 12,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    paddingVertical: 8,
  },

  // journal
  journalRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  journalDate: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    minWidth: 48,
  },
  journalText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
  },

  // reminders
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  reminderText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
  },
  reminderTime: {
    color: '#FFB06B',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 8,
  },

  // dreamtime insights
  dreamRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 10,
  },
  dreamDate: {
    color: '#C57BDB',
    fontSize: 10,
    fontWeight: '700',
    minWidth: 48,
  },
  dreamText: {
    flex: 1,
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },

  // reflection
  reflectionToggle: {
    color: '#6AA9F0',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 6,
  },
  reflectionText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace',
  },

  // send message button
  sendMessageButton: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    backgroundColor: '#6AA9F0',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  sendMessageText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
