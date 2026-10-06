import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { getAgentMeta } from '@/mock/agentMeta';
import type { Act6Report } from '@/mock/acts/act6';

type Props = {
  report: Act6Report;
  typing?: boolean;
};

export function Act6ReportCard({ report, typing }: Props) {
  const router = useRouter();
  const meta = getAgentMeta(report.agentId);

  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => router.push(`/record/agent/${report.agentId}`)}
        hitSlop={6}
      >
        <View style={[styles.avatar, { backgroundColor: meta.color }]}>
          <Text style={styles.avatarLetter}>{meta.label.charAt(0)}</Text>
        </View>
      </Pressable>
      <View style={styles.column}>
        <Text style={[styles.attribution, { color: meta.deep }]}>{meta.label}</Text>

        {typing ? (
          <View style={styles.typing}>
            <Text style={styles.typingText}>Compilando reporte del día…</Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.eyebrow}>📋 {report.title.toUpperCase()}</Text>

            <View style={styles.metricsGrid}>
              {report.metrics.map((m) => (
                <View key={m.label} style={styles.metricCell}>
                  <Text style={[styles.metricValue, { color: meta.deep }]}>{m.value}</Text>
                  <Text style={styles.metricLabel}>{m.label}</Text>
                </View>
              ))}
            </View>

            {report.followUp && <Text style={styles.followUp}>{report.followUp}</Text>}

            <View style={[styles.savingPill, { borderColor: meta.soft + '55' }]}>
              <View style={[styles.savingDot, { backgroundColor: meta.color }]} />
              <Text style={[styles.savingText, { color: meta.deep }]}>
                {report.savingLabel}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingRight: 40,
    marginBottom: 12,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 13,
    fontWeight: '800',
  },
  column: { flex: 1, gap: 4 },
  attribution: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginLeft: 2,
  },
  typing: {
    backgroundColor: '#1E1240',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignSelf: 'flex-start',
  },
  typingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  card: {
    backgroundColor: '#241858',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.12)',
  },
  eyebrow: {
    color: 'rgba(255,215,0,0.8)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  metricLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 2,
    textAlign: 'center',
  },
  followUp: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  savingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  savingDot: { width: 5, height: 5, borderRadius: 3 },
  savingText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
