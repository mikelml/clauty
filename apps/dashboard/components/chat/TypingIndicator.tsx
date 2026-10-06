/**
 * TypingIndicator — animated three-dot "agent is typing" indicator.
 *
 * Appears left-aligned like agent bubbles, with sequential dot animation.
 * Used in ChatScreen while waiting for LLM response.
 */

import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { GenerativeAvatar } from "@/components/colony/GenerativeAvatar";

type Props = {
  agentId?: string;
  color?: string;
};

function AnimatedDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.2)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(600 - delay), // wait for remaining dots
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, opacity]);

  return <Animated.View style={[s.dot, { opacity }]} />;
}

export function TypingIndicator({ agentId = "colony", color = "#8B6AAE" }: Props) {
  return (
    <View style={s.row}>
      <View style={s.avatarCol}>
        <GenerativeAvatar id={agentId} color={color} size={28} />
      </View>
      <View style={s.bubble}>
        <View style={s.dots}>
          <AnimatedDot delay={0} />
          <AnimatedDot delay={200} />
          <AnimatedDot delay={400} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 4,
    marginHorizontal: 12,
  },
  avatarCol: {
    width: 32,
    marginRight: 8,
    alignItems: "center",
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
});
