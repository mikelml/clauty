import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { personaList, type Persona } from '@/mock/personas';
import { useMock } from '@/mock/MockContext';

export default function RecordLogin() {
  const router = useRouter();
  const { setPersona } = useMock();

  const handlePick = (id: Persona['id']) => {
    setPersona(id);
    router.replace('/record');
  };

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.logo}>C L A U T Y</Text>
          <Text style={styles.sub}>¿Quién entra a la colonia?</Text>
        </View>

        {personaList.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => handlePick(p.id)}
            style={({ pressed }) => [
              styles.card,
              { borderColor: p.accent + '55' },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 },
            ]}
          >
            <View style={[styles.avatar, { backgroundColor: p.accent }]}>
              <Text style={styles.avatarLetter}>{p.name.charAt(0)}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardName}>{p.name}</Text>
              <Text style={styles.cardRole}>{p.role}</Text>
              <Text style={styles.cardMeta}>
                {p.city} · {p.months} meses · {p.agentCount} agentes
              </Text>
            </View>
          </Pressable>
        ))}

        <Text style={styles.footer}>v0.1 · demo mode</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0F2E',
  },
  scroll: {
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 6,
    marginBottom: 16,
  },
  sub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#1E1240',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    color: '#1A0F2E',
    fontSize: 24,
    fontWeight: '700',
  },
  cardText: {
    flex: 1,
  },
  cardName: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 15,
    fontWeight: '700',
  },
  cardRole: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 2,
  },
  cardMeta: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  footer: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    marginTop: 32,
    letterSpacing: 1,
  },
});
