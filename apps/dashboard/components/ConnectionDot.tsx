/**
 * ConnectionDot — small LED-style connection indicator with pulse animation.
 * Green pulsing = connected, Yellow blinking = reconnecting, Red = offline, Grey = mock
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import type { ConnectionState } from '@/lib/types';

type Props = {
  connectionState: ConnectionState;
  size?: number;
};

const DOT_COLORS: Record<ConnectionState, string> = {
  connected: '#34C759',
  reconnecting: '#FFD700',
  offline: '#FF3B30',
  mock: '#8E8E93',
};

export function ConnectionDot({ connectionState, size = 12 }: Props) {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const color = DOT_COLORS[connectionState];

  useEffect(() => {
    if (connectionState === 'connected') {
      // Slow pulse for connected state
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else if (connectionState === 'reconnecting') {
      // Fast blink for reconnecting
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 0.2, duration: 300, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ])
      );
      animation.start();
      return () => animation.stop();
    } else {
      // Static for offline/mock
      pulseAnim.setValue(1);
    }
  }, [connectionState, pulseAnim]);

  return (
    <View style={[s.container, { width: size, height: size }]}>
      {/* Glow ring */}
      {connectionState === 'connected' && (
        <Animated.View
          style={[
            s.ring,
            {
              width: size * 2,
              height: size * 2,
              borderRadius: size,
              borderColor: color,
              opacity: Animated.multiply(pulseAnim, 0.3),
              top: -size / 2,
              left: -size / 2,
            },
          ]}
        />
      )}
      {/* Core dot */}
      <Animated.View
        style={[
          s.dot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
            opacity: pulseAnim,
          },
        ]}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
  },
  dot: {
    shadowRadius: 4,
    shadowOpacity: 0.6,
  },
});
