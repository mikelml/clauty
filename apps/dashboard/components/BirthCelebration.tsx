import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withTiming, withDelay, withSequence, Easing,
} from 'react-native-reanimated';
import { getAgentMeta } from '@/mock/agentMeta';

type Props = {
  agentId: string;
  role: string;
  color: string;
  onEnd: () => void;
};

export function BirthCelebration({ agentId, role, color, onEnd }: Props) {
  const meta = getAgentMeta(agentId);
  const backdropOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0.3);
  const ringOpacity = useSharedValue(0);
  const avatarScale = useSharedValue(0);
  const avatarOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    const expo = Easing.bezier(0.16, 1, 0.3, 1);

    backdropOpacity.value = withSequence(
      withTiming(1, { duration: 240, easing: Easing.linear }),
      withDelay(2200, withTiming(0, { duration: 520, easing: Easing.linear })),
    );

    // Ring: expande con pulso
    ringOpacity.value = withSequence(
      withTiming(0.8, { duration: 240 }),
      withDelay(700, withTiming(0, { duration: 900 })),
    );
    ringScale.value = withTiming(2.4, { duration: 1400, easing: expo });

    // Avatar: scale-in pop
    avatarOpacity.value = withDelay(180, withTiming(1, { duration: 240 }));
    avatarScale.value = withDelay(180, withTiming(1, { duration: 520, easing: expo }));

    // Texto: fade tardío
    textOpacity.value = withSequence(
      withDelay(600, withTiming(1, { duration: 320 })),
      withDelay(1600, withTiming(0, { duration: 500 })),
    );

    const t = setTimeout(onEnd, 3000);
    return () => clearTimeout(t);
  }, [
    agentId,
    backdropOpacity,
    ringScale,
    ringOpacity,
    avatarScale,
    avatarOpacity,
    textOpacity,
    onEnd,
  ]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }), [backdropOpacity]);
  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }), [ringOpacity, ringScale]);
  const avatarStyle = useAnimatedStyle(() => ({
    opacity: avatarOpacity.value,
    transform: [{ scale: avatarScale.value }],
  }), [avatarOpacity, avatarScale]);
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }), [textOpacity]);

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.wrap, backdropStyle, { pointerEvents: 'none' }]}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.ring,
            { borderColor: color + 'CC', shadowColor: color },
            ringStyle,
          ]}
        />
        <Animated.View style={[styles.avatarHolder, avatarStyle]}>
          <View style={[styles.avatar, { backgroundColor: color }]}>
            <Text style={styles.avatarLetter}>{meta.label.charAt(0)}</Text>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={[styles.roleText, { color }]}>{role}</Text>
          <Text style={styles.sub}>se ha unido a tu colonia</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(14,8,32,0.82)',
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    width: 240,
    height: 320,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    top: 60,
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  avatarHolder: {
    position: 'absolute',
    top: 60,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 40,
    fontWeight: '800',
  },
  textBlock: {
    position: 'absolute',
    top: 190,
    alignItems: 'center',
  },
  sparkle: {
    fontSize: 18,
    marginBottom: 6,
  },
  roleText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  sub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
