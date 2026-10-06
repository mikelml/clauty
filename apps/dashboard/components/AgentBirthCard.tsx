import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Newborn, Persona } from '@/mock/personas';
import { IntegrationLogo } from '@/components/IntegrationLogo';

type Props = {
  persona: Persona;
  newborn: Newborn;
  onBack: () => void;
  onContinue?: () => void;
};

export function AgentBirthCard({ persona, newborn, onBack, onContinue }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onBack} />

      <View style={[styles.card, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={onBack} style={styles.closeBtn} hitSlop={12}>
          <Text style={styles.closeX}>×</Text>
        </Pressable>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <View
              style={[
                styles.avatarOuter,
                { backgroundColor: newborn.color + '22', borderColor: newborn.color + '44' },
              ]}
            >
              <View style={[styles.avatarInner, { backgroundColor: newborn.color }]}>
                <Text style={styles.avatarLetter}>{newborn.role.charAt(0)}</Text>
              </View>
            </View>

            <Text style={styles.eyebrow}>CONOCIENDO A</Text>
            <Text style={[styles.role, { color: newborn.color }]}>{newborn.role}</Text>

            <View style={[styles.activePill, { borderColor: newborn.color + '55' }]}>
              <View style={[styles.activeDot, { backgroundColor: newborn.color }]} />
              <Text style={styles.activeText}>
                Activo en la colonia de {persona.name.split(' ')[0]}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Lo que detecté</Text>
            <Text style={styles.title}>{newborn.evidenceTitle}</Text>
            <Text style={styles.evidence}>{newborn.evidenceBody}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Integraciones que leo</Text>
            <View style={styles.integrationRow}>
              {newborn.evidenceIntegrations.map((it) => (
                <View key={it.id} style={styles.integrationPill}>
                  <IntegrationLogo id={it.id} size={22} radius={6} />
                  <Text style={styles.integrationText}>{it.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.quote}>
            "Nadie lo pidió. Nació porque hacía falta."
          </Text>

          {onContinue && (
            <Pressable
              onPress={onContinue}
              style={({ pressed }) => [
                styles.continueBtn,
                { backgroundColor: newborn.color },
                pressed && styles.btnPressed,
              ]}
            >
              <Text style={styles.continueText}>Ir a la colonia</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: '#0E0820',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '94%',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0 -20px 60px rgba(0,0,0,0.6)' as any }
      : {
          shadowColor: '#000',
          shadowOpacity: 0.6,
          shadowRadius: 40,
          shadowOffset: { width: 0, height: -20 },
          elevation: 20,
        }),
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: '400',
  },
  scroll: {
    paddingHorizontal: 22,
    paddingBottom: 36,
    paddingTop: 20,
  },
  top: {
    alignItems: 'center',
    marginBottom: 6,
  },
  avatarOuter: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: '#0E0820',
    fontSize: 38,
    fontWeight: '800',
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  role: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 14,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  activeText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 22,
  },
  section: {
    // sin padding: el card ya tiene horizontal
  },
  sectionLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
    marginBottom: 10,
  },
  evidence: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    lineHeight: 20,
  },
  integrationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  integrationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
    paddingRight: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.1)',
    gap: 7,
  },
  integrationText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  quote: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 24,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  continueBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#0E0820',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
