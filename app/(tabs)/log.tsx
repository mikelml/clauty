import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { IconEmpty } from "@/components/icons/TabIcons";
import { useColony } from "@/hooks/useColony";
import { theme, getAgentColor } from "@/constants/Colors";

export default function LogScreen() {
  const { colony, isConnected: connected } = useColony();

  const entries = colony
    ? Object.entries(colony).map(([id, agent], i) => ({
        id,
        color: getAgentColor(id, i),
        time: new Date(agent.registeredAt).toLocaleTimeString(),
        text: `${id.charAt(0).toUpperCase() + id.slice(1)} registro como ${agent.state}`,
        tasks: agent.metrics.tasksCompleted,
      }))
    : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Actividad</Text>
        <View style={[styles.liveDot, { backgroundColor: connected ? "#34C759" : "#FF3B30" }]} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {entries.map((entry) => (
          <View key={entry.id} style={styles.entry}>
            <View style={[styles.colorBar, { backgroundColor: entry.color }]} />
            <View style={styles.entryContent}>
              <Text style={styles.entryText}>{entry.text}</Text>
              <Text style={styles.entryTime}>{entry.time}</Text>
            </View>
          </View>
        ))}

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <IconEmpty size={40} />
            <Text style={styles.emptyText}>Esperando actividad...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#110A24",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#1A0F2E",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  entry: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  colorBar: {
    width: 4,
  },
  entryContent: {
    flex: 1,
    padding: 14,
  },
  entryText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  entryTime: {
    fontSize: 12,
    color: "rgba(255,255,255,0.35)",
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 15,
  },
});
