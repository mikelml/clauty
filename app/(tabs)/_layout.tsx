import React, { useState } from "react";
import {
  View, Text, Pressable, StyleSheet, Modal, Platform,
} from "react-native";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  IconColony, IconChat, IconHamburger, IconDiary, IconSettings,
} from "@/components/icons/TabIcons";

// ==================== CUSTOM TAB BAR ====================

function ColonyTabBar({ state, navigation }: any) {
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const route = state.routes[state.index]?.name;

  const isColony = route === "index";
  const isChat = route === "chat";
  const isOther = !isColony && !isChat;

  const gold = "#FFD700";
  const dim = "rgba(255,255,255,0.35)";

  return (
    <>
      <View style={[tb.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        {/* Colony */}
        <Pressable style={tb.tab} onPress={() => navigation.navigate("index")}>
          <IconColony size={24} color={isColony ? gold : dim} />
          {isColony && <View style={[tb.dot, { backgroundColor: gold }]} />}
        </Pressable>

        {/* Chat */}
        <Pressable style={tb.tab} onPress={() => navigation.navigate("chat")}>
          <IconChat size={24} color={isChat ? gold : dim} />
          {isChat && <View style={[tb.dot, { backgroundColor: gold }]} />}
        </Pressable>

        {/* Hamburger */}
        <Pressable style={tb.tab} onPress={() => setMenuOpen(true)}>
          <IconHamburger size={22} color={isOther || menuOpen ? gold : dim} />
          {isOther && <View style={[tb.dot, { backgroundColor: gold }]} />}
        </Pressable>
      </View>

      {/* ===== MENU BOTTOM SHEET ===== */}
      <Modal visible={menuOpen} transparent animationType="fade">
        <Pressable style={tb.backdrop} onPress={() => setMenuOpen(false)}>
          <View
            style={[tb.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
            onStartShouldSetResponder={() => true}
          >
            <View style={tb.handle} />

            <Pressable
              style={({ pressed }) => [tb.menuItem, pressed && tb.menuItemPressed]}
              onPress={() => { setMenuOpen(false); navigation.navigate("log"); }}
            >
              <IconDiary size={24} color="rgba(255,255,255,0.85)" />
              <View>
                <Text style={tb.menuTitle}>Diario</Text>
                <Text style={tb.menuSub}>Actividad de la colonia</Text>
              </View>
            </Pressable>

            <Pressable
              style={({ pressed }) => [tb.menuItem, pressed && tb.menuItemPressed]}
              onPress={() => { setMenuOpen(false); navigation.navigate("menu"); }}
            >
              <IconSettings size={24} color="rgba(255,255,255,0.85)" />
              <View>
                <Text style={tb.menuTitle}>Ajustes</Text>
                <Text style={tb.menuSub}>Conexion y preferencias</Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

// ==================== TAB LAYOUT ====================

const headerBase = {
  backgroundColor: "#1A0F2E",
  shadowColor: "transparent",
  elevation: 0,
} as const;

export default function TabLayout() {
  return (
    <Tabs tabBar={(props) => <ColonyTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: "Colony", headerShown: false }} />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerStyle: headerBase,
          headerTintColor: "rgba(255,255,255,0.9)",
          headerTitleStyle: { fontWeight: "600", fontSize: 17 },
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: "Diario",
          href: null,
          headerStyle: headerBase,
          headerTintColor: "rgba(255,255,255,0.9)",
          headerTitleStyle: { fontWeight: "600", fontSize: 17 },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Ajustes",
          href: null,
          headerStyle: headerBase,
          headerTintColor: "rgba(255,255,255,0.9)",
          headerTitleStyle: { fontWeight: "600", fontSize: 17 },
        }}
      />
    </Tabs>
  );
}

// ==================== STYLES ====================

const tb = StyleSheet.create({
  bar: {
    flexDirection: "row",
    backgroundColor: "#1A0F2E",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
    paddingTop: 10,
    alignItems: "center",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255,255,255,0.35)",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1E1240",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignSelf: "center",
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  menuItemPressed: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  menuSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginTop: 1,
  },
});
