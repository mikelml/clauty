import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { theme } from "@/constants/Colors";
import { useColony } from "@/hooks/useColony";

export default function MenuScreen() {
  const { isConnected: connected } = useColony();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>ClauTY</Text>
      <Text style={styles.version}>v0.1.0 · Plugin activo</Text>

      {/* Connection status */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Gateway</Text>
          <View style={styles.statusPill}>
            <View style={[styles.dot, { backgroundColor: connected ? "#34C759" : "#FF3B30" }]} />
            <Text style={styles.statusText}>{connected ? "Conectado" : "Desconectado"}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Puerto</Text>
          <Text style={styles.value}>18789</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>SSE</Text>
          <Text style={styles.value}>/clauty/events</Text>
        </View>
      </View>

      {/* Integrations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Integraciones</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Google</Text>
          <Text style={styles.notConnected}>No conectado</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Discord</Text>
          <Text style={styles.notConnected}>No conectado</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telegram</Text>
          <Text style={styles.notConnected}>No conectado</Text>
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Acerca de</Text>
        <Text style={styles.about}>
          ClauTY es tu colonia personal de agentes AI.{"\n"}
          Cada agente tiene su personalidad, memoria y especialidad.{"\n"}
          Ellos trabajan por ti mientras haces lo que importa.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#110A24",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFD700",
  },
  version: {
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
    marginTop: 2,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  label: {
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
  },
  value: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    fontFamily: "SpaceMono",
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(52,199,89,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#34C759",
  },
  notConnected: {
    fontSize: 14,
    color: "rgba(255,255,255,0.3)",
  },
  about: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    lineHeight: 22,
  },
});
