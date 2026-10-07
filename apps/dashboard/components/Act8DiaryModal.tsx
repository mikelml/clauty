import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAgentMeta } from '@/mock/agentMeta';
import { IntegrationLogo } from '@/components/IntegrationLogo';
import type { Act8Dream } from '@/mock/acts/act8';

type Props = {
  dream: Act8Dream;
  onClose: () => void;
};

export function Act8DiaryModal({ dream, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const metas = dream.agentIds.map(getAgentMeta);

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

      <View style={[styles.card, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
          <Text style={styles.closeX}>×</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <Text style={styles.dreamIcon}>💭</Text>
            <Text style={styles.greeting}>{dream.greeting}</Text>
            <Text style={styles.headline}>{dream.headline}</Text>

            <View style={styles.stack}>
              {metas.map((m, i) => (
                <View
                  key={m.id}
                  style={[
                    styles.avatar,
                    { backgroundColor: m.color, marginLeft: i === 0 ? 0 : -10, zIndex: metas.length - i },
                  ]}
                >
                  <Text style={styles.avatarLetter}>{m.label.charAt(0)}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>HALLAZGO PRINCIPAL</Text>
            <Text style={styles.summaryText}>{dream.summary}</Text>
          </View>

          <Text style={styles.sectionLabel}>ENTRADAS DEL DIARIO</Text>

          {dream.findings.map((f, i) => {
            const meta = getAgentMeta(f.agentId);
            return (
              <View key={i} style={styles.findingRow}>
                <View style={[styles.findingAvatar, { backgroundColor: meta.color }]}>
                  <Text style={styles.findingLetter}>{meta.label.charAt(0)}</Text>
                </View>
                <View style={styles.findingBody}>
                  <Text style={[styles.findingLabel, { color: meta.deep }]}>{meta.label}</Text>
                  <Text style={styles.findingText}>{f.text}</Text>
                  {f.integrations && f.integrations.length > 0 && (
                    <View style={styles.chipsRow}>
                      {f.integrations.map((id) => (
                        <View key={id} style={styles.chip}>
                          <IntegrationLogo id={id} size={14} radius={4} />
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            );
          })}

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.ctaBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.ctaText}>{dream.cta}</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
    zIndex: 50,
  },
  card: {
    backgroundColor: '#0E0820',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 22,
    lineHeight: 24,
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 30,
    paddingTop: 18,
  },
  top: {
    alignItems: 'center',
    marginBottom: 20,
  },
  dreamIcon: {
    fontSize: 34,
    marginBottom: 10,
  },
  greeting: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  headline: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 14,
  },
  stack: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0E0820',
  },
  avatarLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 15,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#1E1442',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(126,220,255,0.18)',
  },
  summaryLabel: {
    color: 'rgba(126,220,255,0.78)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
  summaryText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 12,
  },
  findingRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  findingAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  findingLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 11,
    fontWeight: '800',
  },
  findingBody: {
    flex: 1,
    gap: 4,
  },
  findingLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  findingText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  chip: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ctaBtn: {
    marginTop: 22,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  ctaText: {
    color: '#0E0820',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
