import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';
import { getAgentMeta } from '@/mock/agentMeta';
import { IntegrationLogo } from '@/components/IntegrationLogo';
import type { Act5Plan } from '@/mock/acts/act5';

type Props = {
  plan: Act5Plan;
  onClose?: () => void;
};

export function Act5CollabOverlay({ plan, onClose }: Props) {
  const backdrop = useSharedValue(0);
  const cardScale = useSharedValue(0.94);
  const cardOpacity = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.bezier(0.16, 1, 0.3, 1);
    backdrop.value = withTiming(1, { duration: 480, easing: ease });
    cardOpacity.value = withDelay(120, withTiming(1, { duration: 480, easing: ease }));
    cardScale.value = withDelay(120, withTiming(1, { duration: 540, easing: ease }));
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1100, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [backdrop, cardOpacity, cardScale, pulse]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }), [backdrop]);
  const cardStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }), [cardOpacity, cardScale]);

  const metas = plan.agentIds.map(getAgentMeta);

  return (
    <Animated.View
      style={[StyleSheet.absoluteFill, styles.wrap, backdropStyle]}
    >
      {onClose && (
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      )}
      <Animated.View style={[styles.card, cardStyle]}>
        {onClose && (
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={12}>
            <Text style={styles.closeX}>×</Text>
          </Pressable>
        )}
        <Text style={styles.eyebrow}>🤝 LA COLONIA CONVERGIÓ</Text>

        <View style={styles.avatarStack}>
          {metas.map((m, i) => (
            <AnimatedAvatar key={m.id} meta={m} index={i} pulse={pulse} />
          ))}
        </View>

        <Text style={styles.agentsLine}>
          {metas.map((m) => m.label).join(' × ')}
        </Text>

        <Text style={styles.title}>{plan.title}</Text>
        <Text style={styles.plan}>{plan.plan}</Text>

        <View style={styles.projectionPill}>
          <Text style={styles.projectionLabel}>PROYECCIÓN</Text>
          <Text style={styles.projectionValue}>{plan.projection}</Text>
        </View>

        {plan.integrations.length > 0 && (
          <View style={styles.chipsRow}>
            {plan.integrations.map((id) => (
              <View key={id} style={styles.chip}>
                <IntegrationLogo id={id} size={16} radius={5} />
              </View>
            ))}
          </View>
        )}

        {onClose && (
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.dismissBtn, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.dismissText}>Entendido</Text>
          </Pressable>
        )}
      </Animated.View>

      <View style={styles.susurro}>
        <Text style={styles.susurroText}>
          "Los agentes no solo trabajan. Se platican."
        </Text>
      </View>
    </Animated.View>
  );
}

function AnimatedAvatar({
  meta,
  index,
  pulse,
}: {
  meta: ReturnType<typeof getAgentMeta>;
  index: number;
  pulse: Animated.SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const offset = index * 0.25;
    const p = Math.max(0, Math.sin((pulse.value + offset) * Math.PI));
    return {
      transform: [{ translateY: -p * 4 }],
    };
  }, [pulse, index]);

  return (
    <Animated.View
      style={[
        styles.avatar,
        { backgroundColor: meta.color, marginLeft: index === 0 ? 0 : -12, zIndex: 10 - index },
        style,
      ]}
    >
      <Text style={styles.avatarLetter}>{meta.label.charAt(0)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(8,4,20,0.82)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 30,
    paddingHorizontal: 22,
  },
  card: {
    backgroundColor: '#1E1442',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.18)',
    width: '100%',
    maxWidth: 340,
  },
  eyebrow: {
    color: 'rgba(255,215,0,0.82)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 14,
  },
  avatarStack: {
    flexDirection: 'row',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1E1442',
  },
  avatarLetter: {
    color: 'rgba(14,8,32,0.9)',
    fontSize: 16,
    fontWeight: '800',
  },
  agentsLine: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  title: {
    color: 'rgba(255,255,255,0.96)',
    fontSize: 17,
    fontWeight: '800',
    lineHeight: 23,
    marginBottom: 8,
  },
  plan: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  projectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.25)',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  projectionLabel: {
    color: 'rgba(255,215,0,0.78)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  projectionValue: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 5,
  },
  chip: {
    padding: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeX: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    lineHeight: 20,
  },
  dismissBtn: {
    marginTop: 16,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(255,215,0,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.35)',
    alignItems: 'center',
  },
  dismissText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  susurro: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  susurroText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 11,
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
});
