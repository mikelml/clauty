/**
 * AgentSelector — horizontal scroll of agent chips above the chat input.
 *
 * - Displays each agent as a chip with avatar + name
 * - Selected chip has highlighted border
 * - Automatically hidden when only one agent is present
 * - Passes selectedId to the parent for routing POST /clauty/chat
 */

import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import { GenerativeAvatar } from "@/components/colony/GenerativeAvatar";
import { agentColors } from "@/constants/Colors";
import type { Agent } from "@/lib/types";

type Props = {
  agents: Agent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function AgentSelector({ agents, selectedId, onSelect }: Props) {
  // Hide if only one agent — no selection needed
  if (agents.length <= 1) return null;

  return (
    <View style={s.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {agents.map((agent) => {
          const isSelected = agent.id === selectedId;
          const color = agentColors[agent.id] || "#8B6AAE";

          return (
            <Pressable
              key={agent.id}
              style={({ pressed }) => [
                s.chip,
                isSelected && { borderColor: color, borderWidth: 2 },
                pressed && s.chipPressed,
              ]}
              onPress={() => onSelect(agent.id)}
            >
              <GenerativeAvatar id={agent.id} color={color} size={20} />
              <Text style={[s.chipLabel, isSelected && { color }]}>
                {agent.id.charAt(0).toUpperCase() + agent.id.slice(1)}
              </Text>
              {agent.state === "busy" && <View style={s.busyDot} />}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingVertical: 6,
    backgroundColor: "#1A0F2E",
  },
  scroll: {
    paddingHorizontal: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    gap: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipPressed: {
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
  },
  busyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFD700",
  },
});
