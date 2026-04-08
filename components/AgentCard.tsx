import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { theme, getAgentColor, stateLabels } from "@/constants/Colors";
import { GenerativeAvatar } from "@/components/colony/GenerativeAvatar";

type Props = {
  id: string;
  state: string;
  tasksCompleted: number;
  tokensUsed: number;
  index: number;
  onPress?: () => void;
};

export function AgentCard({ id, state, tasksCompleted, tokensUsed, index, onPress }: Props) {
  const color = getAgentColor(id, index);
  const stateText = stateLabels[state] ?? state;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { transform: [{ scale: pressed ? 0.97 : 1 }] },
      ]}
    >
      {/* Color accent bar */}
      <View style={[styles.accentBar, { backgroundColor: color }]} />

      <View style={styles.content}>
        {/* Generative avatar */}
        <GenerativeAvatar id={id} color={color} size={32} />
        <Text style={styles.name}>{id.charAt(0).toUpperCase() + id.slice(1)}</Text>

        {/* State badge */}
        <View style={[styles.stateBadge, { backgroundColor: color + "18" }]}>
          <View style={[styles.stateDot, { backgroundColor: color }]} />
          <Text style={[styles.stateText, { color }]}>{stateText}</Text>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <Text style={styles.stat}>{tasksCompleted} tareas</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  accentBar: {
    height: 4,
    width: "100%",
  },
  content: {
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  icon: {
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.textPrimary,
  },
  stateBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stateText: {
    fontSize: 12,
    fontWeight: "500",
  },
  stats: {
    marginTop: 4,
  },
  stat: {
    color: theme.textTertiary,
    fontSize: 12,
  },
});
