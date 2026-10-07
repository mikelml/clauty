/**
 * ColonyWrappedPreview — "Spotify Wrapped" style summary of the colony.
 *
 * Shows aggregate stats in a dark-gradient full-screen layout.
 * Triggered from the main Colony screen via a "Colony Wrapped" button.
 */

import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, Share, FlatList, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Domain emoji map ---
const DOMAIN_EMOJI: Record<string, string> = {
  tecnologia: '💻',
  dev: '⌨️',
  design: '🎨',
  finance: '💰',
  cocina: '🍳',
  jardineria: '🌱',
  mascotas: '🐾',
  nintendo: '🎮',
  pokemon: '⚡',
  videojuegos: '🕹️',
  taxi: '🚗',
  ops: '⚙️',
  ninguno: '🌟',
  assistant: '🤖',
};

function domainEmoji(topic: string): string {
  return DOMAIN_EMOJI[topic.toLowerCase()] ?? '✨';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

// --- Types ---
export interface AgentRank {
  name: string;
  domain: string;
  messageCount: number;
}

export interface ColonyStats {
  totalAgents: number;
  totalMessages: number;
  mostActiveAgent: string;
  mostFrequentTopic: string;
  firstAgentBorn: string | null;
  userId?: string;
  totalEvents?: number;
  pendingProposals?: number;
  topAgents?: AgentRank[];
}

interface ColonyWrappedPreviewProps {
  stats: ColonyStats;
  onShare: () => void;
  onClose: () => void;
}

// --- Card component ---
function StatCard({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

// --- Main component ---
export function ColonyWrappedPreview({ stats, onShare, onClose }: ColonyWrappedPreviewProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  if (stats.totalAgents === 0 || stats.totalMessages === 0) {
    return (
      <Animated.View
        style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        {/* Close button */}
        <Pressable style={[styles.closeBtn, { top: insets.top + 16 }]} onPress={onClose} hitSlop={12}>
          <Text style={styles.closeBtnText}>✕</Text>
        </Pressable>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🌱</Text>
          <Text style={styles.emptyTitle}>Tu colonia está comenzando</Text>
          <Text style={styles.emptySubtitle}>
            Comienza a chatear con tu asistente para hacer crecer tu colonia de agentes.
          </Text>
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[styles.root, { paddingBottom: insets.bottom + 16, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/* Close button */}
      <Pressable style={[styles.closeBtn, { top: insets.top + 16 }]} onPress={onClose} hitSlop={12}>
        <Text style={styles.closeBtnText}>✕</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 60 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <Text style={styles.heroLabel}>Tu Colonia</Text>
        <Text style={styles.heroNumber}>{stats.totalAgents}</Text>
        <Text style={styles.heroSubtitle}>
          {stats.totalAgents === 1 ? 'agente en tu colonia' : 'agentes en tu colonia'}
        </Text>

        <View style={styles.divider} />

        {/* Stats cards */}
        <StatCard
          emoji={domainEmoji(stats.mostFrequentTopic)}
          label="Tu tema más frecuente"
          value={stats.mostFrequentTopic !== 'ninguno' ? stats.mostFrequentTopic : 'Explorando...'}
        />

        <StatCard
          emoji="🏆"
          label="Agente más activo"
          value={stats.mostActiveAgent !== 'ninguno'
            ? stats.mostActiveAgent.charAt(0).toUpperCase() + stats.mostActiveAgent.slice(1)
            : 'Inventor'}
        />

        <StatCard
          emoji="🐣"
          label="Primer agente nacido"
          value={formatDate(stats.firstAgentBorn)}
        />

        {stats.totalEvents !== undefined && stats.totalEvents > 0 && (
          <StatCard
            emoji="⚡"
            label="Eventos en la colonia"
            value={stats.totalEvents.toLocaleString()}
          />
        )}

        {stats.totalMessages > 0 && (
          <StatCard
            emoji="💬"
            label="Tareas completadas"
            value={stats.totalMessages.toLocaleString()}
          />
        )}

        {/* Top Agents squad */}
        {stats.topAgents && stats.topAgents.length > 0 && (
          <View style={styles.squadSection}>
            <Text style={styles.squadTitle}>Tu squad de agentes</Text>
            <FlatList
              data={stats.topAgents.slice(0, 3)}
              horizontal
              keyExtractor={(item) => item.name}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item, index }) => {
                const medals = ['🥇', '🥈', '🥉'];
                const bgColors = ['rgba(255,215,0,0.15)', 'rgba(192,192,192,0.12)', 'rgba(205,127,50,0.12)'];
                return (
                  <View style={[styles.squadChip, { backgroundColor: bgColors[index] }]}>
                    <Text style={styles.squadMedal}>{medals[index]}</Text>
                    <Text style={styles.squadName}>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </Text>
                    <Text style={styles.squadCount}>{item.messageCount} tareas</Text>
                  </View>
                );
              }}
            />
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Share button */}
      <Pressable style={styles.shareBtn} onPress={onShare}>
        <Text style={styles.shareBtnText}>Compartir mi Colonia</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0a0015',
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
    alignItems: 'center',
  },

  // Close button
  closeBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '700',
  },

  // Hero
  heroLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  heroNumber: {
    color: '#ffffff',
    fontSize: 80,
    fontWeight: '900',
    lineHeight: 90,
    textAlign: 'center',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 32,
  },
  divider: {
    width: 48,
    height: 2,
    backgroundColor: 'rgba(180,100,255,0.4)',
    borderRadius: 1,
    marginBottom: 28,
  },

  // Cards
  card: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 22,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(180,100,255,0.15)',
  },
  cardEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  cardLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  // Squad section
  squadSection: {
    width: '100%',
    marginBottom: 14,
  },
  squadTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },
  squadChip: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    minWidth: 90,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  squadMedal: { fontSize: 24, marginBottom: 4 },
  squadName: { color: '#ffffff', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  squadCount: { color: 'rgba(255,255,255,0.45)', fontSize: 10, fontWeight: '500', marginTop: 2 },

  // Empty state
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Share button
  shareBtn: {
    position: 'absolute',
    bottom: 32,
    left: 24,
    right: 24,
    backgroundColor: '#7C3AED',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 12,
  },
  shareBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
