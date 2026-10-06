import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle,
  withRepeat, withSequence, withTiming, Easing,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { getAgentMeta } from '@/mock/agentMeta';
import { IntegrationLogo } from '@/components/IntegrationLogo';
import type { MessageFlavor } from '@/mock/intentRouter';

// ============ User ============

export function UserBubble({ text }: { text: string }) {
  return (
    <View style={styles.userRow}>
      <View style={styles.userBubble}>
        <Text style={styles.userText}>{text}</Text>
      </View>
    </View>
  );
}

// ============ Agent ============

function AgentAvatar({ agentId, size = 22 }: { agentId: string; size?: number }) {
  const meta = getAgentMeta(agentId);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: meta.color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          color: 'rgba(14,8,32,0.85)',
          fontSize: size * 0.5,
          fontWeight: '800',
        }}
      >
        {meta.label.charAt(0)}
      </Text>
    </View>
  );
}

const integrationLabels: Record<string, string> = {
  whatsapp_business: 'WhatsApp',
  contpaqi: 'CONTPAQi',
  bbva_empresas: 'BBVA Empresas',
  bbva_personal: 'BBVA',
  satws: 'SAT',
  gmail: 'Gmail',
  google_calendar: 'Calendar',
  figma: 'Figma',
  notion: 'Notion',
  amazon_mx: 'Amazon',
  apple_health: 'Health',
  instagram_dm: 'Instagram',
  uber_eats_merchant: 'Uber Eats',
  uber_eats: 'Uber Eats',
  canvas_tec: 'Canvas',
  mercado_pago: 'Mercado Pago',
  glassdoor: 'Glassdoor',
};

function IntegrationChips({ ids }: { ids: string[] }) {
  return (
    <View style={styles.chipsRow}>
      {ids.map((id) => (
        <View key={id} style={styles.chip}>
          <IntegrationLogo id={id} size={16} radius={4} />
          <Text style={styles.chipText}>{integrationLabels[id] ?? id}</Text>
        </View>
      ))}
    </View>
  );
}

function FlavorIcon({ flavor, color }: { flavor: MessageFlavor; color: string }) {
  if (flavor === 'thought') {
    return <Text style={styles.flavorIconThought}>💭</Text>;
  }
  if (flavor === 'action') {
    return (
      <View style={[styles.flavorIconAction, { borderColor: color + '88', backgroundColor: color + '22' }]}>
        <Text style={[styles.flavorCheck, { color }]}>✓</Text>
      </View>
    );
  }
  return null;
}

export function AgentBubble({
  agentId,
  text,
  typing,
  flavor = 'reply',
  integrations,
}: {
  agentId: string;
  text: string;
  typing?: boolean;
  flavor?: MessageFlavor;
  integrations?: string[];
}) {
  const router = useRouter();
  const meta = getAgentMeta(agentId);
  const openAgent = () => router.push(`/record/agent/${agentId}`);

  const isThought = flavor === 'thought';
  const isAction = flavor === 'action';

  return (
    <View style={styles.agentRow}>
      <Pressable onPress={openAgent} hitSlop={6}>
        <AgentAvatar agentId={agentId} size={26} />
      </Pressable>
      <View style={styles.agentColumn}>
        <Pressable onPress={openAgent} hitSlop={4}>
          <Text style={[styles.agentLabel, { color: meta.deep }]}>{meta.label}</Text>
        </Pressable>

        <View
          style={[
            styles.agentBubble,
            isThought && styles.agentBubbleThought,
            isAction && { ...styles.agentBubbleAction, borderColor: meta.soft + '55' },
          ]}
        >
          {typing ? (
            <TypingDots color={meta.soft} />
          ) : (
            <View style={styles.agentBubbleContent}>
              {(isThought || isAction) && !typing && (
                <FlavorIcon flavor={flavor} color={meta.deep} />
              )}
              <Text
                style={[
                  styles.agentText,
                  isThought && styles.agentTextThought,
                ]}
              >
                {text}
              </Text>
            </View>
          )}
        </View>

        {!typing && integrations && integrations.length > 0 && (
          <IntegrationChips ids={integrations} />
        )}
      </View>
    </View>
  );
}

// ============ Typing ============

function TypingDots({ color }: { color: string }) {
  return (
    <View style={styles.dotsRow}>
      <Dot delay={0} color={color} />
      <Dot delay={180} color={color} />
      <Dot delay={360} color={color} />
    </View>
  );
}

function Dot({ delay, color }: { delay: number; color: string }) {
  const opacity = useSharedValue(0.3);
  const ty = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.inOut(Easing.sin);
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 420, easing: ease }),
        withTiming(0.3, { duration: 420, easing: ease }),
      ),
      -1,
      false,
    );
    ty.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 420, easing: ease }),
        withTiming(0, { duration: 420, easing: ease }),
      ),
      -1,
      false,
    );
  }, [delay, opacity, ty]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }), [opacity, ty]);

  return (
    <Animated.View
      style={[styles.dot, { backgroundColor: color, marginLeft: delay === 0 ? 0 : 4 }, style]}
    />
  );
}

// ============ Styles ============

const styles = StyleSheet.create({
  // user
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingLeft: 40,
  },
  userBubble: {
    backgroundColor: '#3E2E6B',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingVertical: 9,
    paddingHorizontal: 13,
    maxWidth: '85%',
  },
  userText: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 13,
    lineHeight: 19,
  },

  // agent
  agentRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
    paddingRight: 40,
  },
  agentColumn: {
    flex: 1,
    gap: 4,
  },
  agentLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginLeft: 2,
  },
  agentBubble: {
    backgroundColor: '#1E1240',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignSelf: 'flex-start',
    maxWidth: '100%',
  },
  agentBubbleThought: {
    backgroundColor: 'rgba(30,18,64,0.5)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.07)',
    paddingVertical: 8,
  },
  agentBubbleAction: {
    backgroundColor: '#1F1442',
    borderWidth: 1,
  },
  agentBubbleContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  agentText: {
    flex: 1,
    color: 'rgba(255,255,255,0.82)',
    fontSize: 13,
    lineHeight: 19,
  },
  agentTextThought: {
    color: 'rgba(255,255,255,0.62)',
    fontStyle: 'italic',
  },

  // flavor icons
  flavorIconThought: {
    fontSize: 13,
    marginTop: 1,
  },
  flavorIconAction: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  flavorCheck: {
    fontSize: 9,
    fontWeight: '800',
    lineHeight: 12,
  },

  // integration chips
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 6,
    marginLeft: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.09)',
  },
  chipText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },

  // dots
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
