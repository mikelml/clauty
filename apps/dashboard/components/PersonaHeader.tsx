import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMock } from '@/mock/MockContext';

export function PersonaHeader() {
  const { persona, setPersona } = useMock();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  if (!persona) return null;

  const handleChange = () => {
    setPersona(null);
    router.replace('/record/login');
  };

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={[styles.accent, { backgroundColor: persona.accent }]} />
      <View style={styles.textBox}>
        <Text style={styles.name}>{persona.name}</Text>
        <Text style={styles.meta}>
          {persona.city} · {persona.months} meses · {persona.agentCount} agentes
        </Text>
      </View>
      <Pressable onPress={handleChange} style={styles.changeBtn}>
        <Text style={styles.changeText}>Cambiar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: '#1A0F2E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  accent: {
    width: 4,
    height: 36,
    borderRadius: 2,
    marginRight: 12,
  },
  textBox: {
    flex: 1,
  },
  name: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    fontWeight: '700',
  },
  meta: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    marginTop: 2,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  changeText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
