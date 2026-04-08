import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSSE } from '@/hooks/useSSE';
import { ColonyScene } from '@/components/colony/ColonyScene';

export default function ColonyScreen() {
  const { data, connected } = useSSE();
  const insets = useSafeAreaInsets();

  const agents = data?.colony
    ? Object.entries(data.colony).map(([id, agent]: [string, any]) => ({
        id,
        ...agent,
      }))
    : [];

  return (
    <View style={styles.container}>
      <ColonyScene
        agents={agents}
        connected={connected}
        topInset={insets.top}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2A1850',
  },
});
