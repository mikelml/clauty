import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useMockPersona } from '@/mock/MockContext';
import { useColonyLog, type LogEntry, type LogEventType } from '@/hooks/useColonyLog';

const TYPE_ICON: Record<LogEventType, string> = {
  journal: '\u{1F4DD}',
  birth: '\u{1F389}',
  reminder: '\u23F0',
  dream: '\u{1F4AD}',
  event: '\u{1F4E1}',
};

function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'ahora';
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `hace ${days}d`;
}

function LogItem({ item }: { item: LogEntry }) {
  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{TYPE_ICON[item.type]}</Text>
      <View style={styles.rowContent}>
        <View style={styles.rowHeader}>
          <Text style={styles.agent}>{item.agentId}</Text>
          <Text style={styles.time}>{relativeTime(item.timestamp)}</Text>
        </View>
        <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
      </View>
    </View>
  );
}

export default function RecordLogTab() {
  const persona = useMockPersona();
  const { entries, loading } = useColonyLog();

  if (!persona) return null;

  if (loading) {
    return (
      <View style={styles.root}>
        <View style={styles.empty}>
          <ActivityIndicator color="rgba(255,255,255,0.5)" />
        </View>
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.root}>
        <View style={styles.empty}>
          <Text style={styles.emoji}>{'\u{1F4DC}'}</Text>
          <Text style={styles.title}>Diario silencioso</Text>
          <Text style={styles.body}>
            La colonia de {persona.name.split(' ')[0]} a\u00FAn no ha registrado actividad.
          </Text>
          <Text style={styles.hint}>
            Cada decisi\u00F3n, nacimiento o colaboraci\u00F3n quedar\u00E1 aqu\u00ED.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <LogItem item={item} />}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0F2E',
  },
  list: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  icon: {
    fontSize: 18,
    marginTop: 2,
    width: 28,
    textAlign: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  agent: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  time: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 10,
  },
  text: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    lineHeight: 18,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: { fontSize: 40, marginBottom: 16, opacity: 0.5 },
  title: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
  hint: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    maxWidth: 260,
  },
});
