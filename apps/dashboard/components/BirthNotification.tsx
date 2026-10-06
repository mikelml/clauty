import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import type { Newborn } from '@/mock/personas';
import { useMock } from '@/mock/MockContext';

type Props = {
  newborn: Newborn;
};

export function BirthNotification({ newborn }: Props) {
  const router = useRouter();
  const { adoptNewborn, killNewborn } = useMock();

  const handleConocer = () => {
    adoptNewborn();
    router.push('/record/opening');
  };

  return (
    <View style={[styles.wrap, { borderColor: newborn.color + '66' }]}>
      <View style={styles.head}>
        <View style={[styles.iconBox, { backgroundColor: newborn.color + '22' }]}>
          <Text style={styles.sprout}>🌱</Text>
        </View>
        <View style={styles.text}>
          <Text style={styles.eyebrow}>
            NUEVO AGENTE · <Text style={{ color: newborn.color }}>{newborn.role}</Text>
          </Text>
          <Text style={styles.title} numberOfLines={2}>
            {newborn.evidenceTitle}
          </Text>
        </View>
      </View>

      <View style={styles.ctaRow}>
        <Pressable
          onPress={killNewborn}
          style={({ pressed }) => [styles.btn, styles.btnKill, pressed && styles.btnPressed]}
        >
          <Text style={styles.btnKillText}>Matar</Text>
        </Pressable>

        <Pressable
          onPress={handleConocer}
          style={({ pressed }) => [
            styles.btn,
            styles.btnMeet,
            { backgroundColor: newborn.color },
            pressed && styles.btnPressed,
          ]}
        >
          <Text style={styles.btnMeetText}>Conocer</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(14,8,32,0.94)',
    borderWidth: 1,
    zIndex: 10,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sprout: {
    fontSize: 20,
  },
  text: {
    flex: 1,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 3,
  },
  title: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnKill: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  btnKillText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  btnMeet: {
    // backgroundColor set inline with newborn.color
  },
  btnMeetText: {
    color: '#0E0820',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});
