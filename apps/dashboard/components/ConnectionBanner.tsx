/**
 * ConnectionBanner — shows the gateway connection status.
 * Visible only when not fully connected.
 */

import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, ActivityIndicator } from 'react-native';
import type { ConnectionState } from '@/lib/types';

type Props = {
  connectionState: ConnectionState;
};

type BannerConfig = {
  backgroundColor: string;
  textColor: string;
  label: string;
  showSpinner: boolean;
};

const BANNER_CONFIGS: Record<ConnectionState, BannerConfig> = {
  connected: {
    backgroundColor: '#1A3C1A',
    textColor: '#34C759',
    label: 'Plugin conectado',
    showSpinner: false,
  },
  reconnecting: {
    backgroundColor: '#3C2E00',
    textColor: '#FFD700',
    label: 'Reconectando...',
    showSpinner: true,
  },
  offline: {
    backgroundColor: '#3C0A0A',
    textColor: '#FF3B30',
    label: 'Plugin offline — modo demo',
    showSpinner: false,
  },
  mock: {
    backgroundColor: '#1E1E1E',
    textColor: '#8E8E93',
    label: 'Modo demo (sin plugin)',
    showSpinner: false,
  },
};

export function ConnectionBanner({ connectionState }: Props) {
  const config = BANNER_CONFIGS[connectionState];
  const opacityRef = useRef(new Animated.Value(0));
  const heightRef = useRef(new Animated.Value(0));

  const isVisible = connectionState !== 'connected';

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityRef.current, {
        toValue: isVisible ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(heightRef.current, {
        toValue: isVisible ? 32 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isVisible]);

  return (
    <Animated.View
      style={[
        s.banner,
        {
          backgroundColor: config.backgroundColor,
          height: heightRef.current,
          opacity: opacityRef.current,
        },
      ]}
    >
      {config.showSpinner && (
        <ActivityIndicator
          size="small"
          color={config.textColor}
          style={s.spinner}
        />
      )}
      <Text style={[s.label, { color: config.textColor }]}>{config.label}</Text>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 12,
  },
  spinner: {
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
