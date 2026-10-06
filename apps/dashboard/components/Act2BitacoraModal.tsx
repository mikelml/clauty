import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAgentMeta } from '@/mock/agentMeta';
import { IntegrationLogo } from '@/components/IntegrationLogo';
import type { BitacoraEntry } from '@/mock/acts/act2';

type Props = {
  personaFirstName: string;
  entries: BitacoraEntry[];
  onClose: () => void;
};

function kindBadge(kind: BitacoraEntry['kind']): { label: string; color: string } {
  switch (kind) {
    case 'action': return { label: 'acción', color: '#5FD683' };
    case 'note':   return { label: 'nota', color: 'rgba(255,255,255,0.4)' };
    case 'thought':
    default:       return { label: 'pensamiento', color: '#C57BDB' };
  }
}

export function Act2BitacoraModal({ personaFirstName, entries, onClose }: Props) {
  const insets = useSafeAreaInsets();

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
          <View style={styles.header}>
            <Text style={styles.eyebrow}>EJECUCIÓN AUTÓNOMA</Text>
            <Text style={styles.title}>Tu colonia trabajó sin interrumpirte</Text>
            <Text style={styles.sub}>
              Mientras {personaFirstName} se concentraba, esto pasó en background.
            </Text>
          </View>

          {entries.map((e, i) => {
            const meta = getAgentMeta(e.agentId);
            const badge = kindBadge(e.kind);
            return (
              <View key={`${e.ts}-${i}`} style={styles.row}>
                <Text style={[styles.ts, { color: meta.soft }]}>{e.ts}</Text>
                <View style={styles.body}>
                  <View style={styles.attRow}>
                    <View style={[styles.dot, { backgroundColor: meta.color }]}>
                      <Text style={styles.dotLetter}>{meta.label.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.agentLabel, { color: meta.deep }]}>{meta.label}</Text>
                    <View style={[styles.kindPill, { borderColor: badge.color + '55' }]}>
                      <View style={[styles.kindDot, { backgroundColor: badge.color }]} />
                      <Text style={[styles.kindText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>
                  <Text style={styles.text}>{e.text}</Text>
                  {e.integrations && e.integrations.length > 0 && (
                    <View style={styles.chipsRow}>
                      {e.integrations.map((id) => (
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
            style={({ pressed }) => [styles.closeFullBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.closeFullText}>Cerrar</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    zIndex: 40,
  },
  card: {
    backgroundColor: '#0E0820',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
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
    paddingBottom: 28,
    paddingTop: 14,
  },
  header: {
    marginBottom: 18,
    alignItems: 'center',
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  sub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  ts: {
    width: 42,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    paddingTop: 3,
  },
  body: { flex: 1, gap: 5 },
  attRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 10,
    fontWeight: '800',
  },
  agentLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  kindPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: StyleSheet.hairlineWidth,
    marginLeft: 4,
  },
  kindDot: { width: 4, height: 4, borderRadius: 2 },
  kindText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  text: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  chip: {
    padding: 2,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  closeFullBtn: {
    marginTop: 18,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
  },
  closeFullText: {
    color: '#0E0820',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
