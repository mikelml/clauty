import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';
import { getAgentMeta } from '@/mock/agentMeta';
import { IntegrationLogo } from '@/components/IntegrationLogo';
import type { Act1Widget } from '@/mock/acts/act1';

export function Act1MorningWidget({ widget }: { widget: Act1Widget }) {
  const meta = getAgentMeta(widget.agentId);
  const opacity = useSharedValue(0);
  const ty = useSharedValue(-12);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    opacity.value = withTiming(1, { duration: 420, easing: ease });
    ty.value = withTiming(0, { duration: 520, easing: ease });
  }, [opacity, ty]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }), [opacity, ty]);

  return (
    <Animated.View
      style={[
        styles.wrap,
        { borderColor: meta.soft + '55' },
        style,
      ]}
    >
      <View style={styles.head}>
        <View style={[styles.agentDot, { backgroundColor: meta.color }]}>
          <Text style={styles.agentLetter}>{meta.label.charAt(0)}</Text>
        </View>
        <View style={styles.headText}>
          <Text style={styles.eyebrow}>
            {widget.time} · <Text style={{ color: meta.deep }}>{meta.label}</Text>
          </Text>
          <Text style={styles.title}>{widget.title}</Text>
        </View>
      </View>

      <Text style={styles.body}>{widget.body}</Text>

      {widget.integrations.length > 0 && (
        <View style={styles.chipsRow}>
          {widget.integrations.map((id) => (
            <View key={id} style={styles.chip}>
              <IntegrationLogo id={id} size={14} radius={4} />
            </View>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(14,8,32,0.94)',
    borderWidth: 1,
    zIndex: 9,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  agentDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  agentLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 13,
    fontWeight: '800',
  },
  headText: {
    flex: 1,
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  title: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 17,
  },
  body: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  chip: {
    padding: 2,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
