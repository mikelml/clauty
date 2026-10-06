/**
 * Colony Wrapped screen — /wrapped
 *
 * Full-screen "Spotify Wrapped" style summary of the colony.
 * Accessible via a button in the Colony tab header.
 */

import React from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { ColonyWrappedPreview } from '@/screens/ColonyWrappedPreview';
import { useColonyMetrics } from '@/hooks/useColonyMetrics';

export default function WrappedScreen() {
  const { stats, loading, error } = useColonyMetrics();
  const router = useRouter();

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mi colonia ClauTY tiene ${stats.totalAgents} agentes. Mi tema favorito: ${stats.mostFrequentTopic}. #ClauTY`,
        title: 'Mi Colony Wrapped',
      });
    } catch {
      // Share cancelled or not supported — silent
    }
  };

  const handleClose = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7C3AED" />
        <Text style={styles.loadingText}>Cargando tu colonia...</Text>
      </View>
    );
  }

  return (
    <ColonyWrappedPreview
      stats={stats}
      onShare={handleShare}
      onClose={handleClose}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0a0015',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '500',
  },
});
