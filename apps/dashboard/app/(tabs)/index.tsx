import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColony } from '@/hooks/useColony';
import { useGenesis } from '@/hooks/useGenesis';
import { ConnectionBanner } from '@/components/ConnectionBanner';
import { ConnectionDot } from '@/components/ConnectionDot';
import { BirthCelebration } from '@/components/BirthCelebration';
import { ColonyScene } from '@/components/colony/ColonyScene';

export default function ColonyScreen() {
  const { agents, connectionState, isConnected } = useColony();
  const { newBornAgent, clearNewBorn } = useGenesis();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleAgentPress = useCallback((agent: any) => {
    router.push(`/record/agent/${agent.id}`);
  }, [router]);

  // Map plugin Agent type to ColonyScene format
  const sceneAgents = agents.map((agent: any) => ({
    id: agent.id,
    state: agent.state || 'idle',
    domain: agent.domain || [],
    maturityLevel: agent.maturityLevel || null,
    metrics: agent.metrics || { tasksCompleted: 0, tasksFailed: 0, tokensUsed: 0 },
  }));

  return (
    <View style={styles.container}>
      <ConnectionBanner connectionState={connectionState} />
      {/* ConnectionDot — LED indicator in top-right corner */}
      <View style={[styles.dotContainer, { top: insets.top + 16 }]}>
        <ConnectionDot connectionState={connectionState} size={14} />
      </View>
      {/* Colony Wrapped button — top-left trophy icon */}
      <Pressable
        style={[styles.wrappedBtn, { top: insets.top + 10 }]}
        onPress={() => router.push('/wrapped')}
        hitSlop={12}
      >
        <Text style={styles.wrappedBtnText}>🏆</Text>
      </Pressable>
      <ColonyScene
        agents={sceneAgents}
        connected={isConnected}
        topInset={insets.top}
        onAgentPress={handleAgentPress}
        birthingAgentId={newBornAgent?.id}
        birthingColor={newBornAgent?.color}
      />
      {/* BirthCelebration overlay — triggered by SSE genesis:born event */}
      {newBornAgent && (
        <BirthCelebration
          agentId={newBornAgent.id}
          role={newBornAgent.role}
          color={newBornAgent.color}
          onEnd={clearNewBorn}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A1850',
  },
  dotContainer: {
    position: 'absolute',
    right: 16,
    zIndex: 100,
  },
  wrappedBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 100,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrappedBtnText: {
    fontSize: 18,
  },
});
