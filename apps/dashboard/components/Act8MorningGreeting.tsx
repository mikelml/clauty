import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated';

type Props = {
  text: string;        // "Buenos días, Roberto"
  subtitle: string;    // "Tu colonia investigó por ti anoche"
};

export function Act8MorningGreeting({ text, subtitle }: Props) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(-8);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    opacity.value = withTiming(1, { duration: 520, easing: ease });
    ty.value = withTiming(0, { duration: 520, easing: ease });
  }, [opacity, ty]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }), [opacity, ty]);

  return (
    <Animated.View style={[styles.wrap, style]}>
      <Text style={styles.sun}>☀️</Text>
      <View style={styles.text}>
        <Text style={styles.title}>{text}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.28)',
    zIndex: 8,
  },
  sun: {
    fontSize: 18,
  },
  text: {
    flex: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    letterSpacing: 0.3,
    marginTop: 1,
    fontStyle: 'italic',
  },
});
