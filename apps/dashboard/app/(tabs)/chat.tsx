import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChat, ChatMessage } from "@/hooks/useChat";
import { useColony } from "@/hooks/useColony";
import { useReminders } from "@/hooks/useReminders";
import { agentColors } from "@/constants/Colors";
import { GenerativeAvatar } from "@/components/colony/GenerativeAvatar";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { AgentSelector } from "@/components/chat/AgentSelector";
import { ReminderBubble } from "@/components/chat/ReminderBubble";

// ==================== ICONS ====================

function SendIcon({ size = 20, color = "#fff" }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M22 2L11 13" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={color} strokeWidth={2} strokeLinejoin="round" />
    </Svg>
  );
}

function TypingDots() {
  return (
    <View style={s.typingRow}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={[s.typingDot, { opacity: 0.3 + i * 0.25 }]} />
      ))}
    </View>
  );
}

// ==================== MESSAGE BUBBLE ====================

function MessageBubble({
  msg,
  isLast,
  onReminderComplete,
}: {
  msg: ChatMessage;
  isLast: boolean;
  onReminderComplete?: (id: string) => void;
}) {
  const isUser = msg.role === "user";
  const agentColor = msg.agentId ? (agentColors[msg.agentId] || "#8B6AAE") : "#8B6AAE";
  const isReminder = !isUser && msg.isReminder;
  const isError = !isUser && (msg as any).isError;

  // Reminder messages use the dedicated ReminderBubble component
  if (isReminder) {
    return (
      <ReminderBubble
        reminderId={msg.id}
        text={msg.text}
        agentName={msg.agentId ? msg.agentId.charAt(0).toUpperCase() + msg.agentId.slice(1) : "Asistente"}
        onComplete={onReminderComplete ?? (() => {})}
      />
    );
  }

  return (
    <View style={[s.msgRow, isUser ? s.msgRowUser : s.msgRowBot]}>
      {/* Agent avatar (left side for bot messages) */}
      {!isUser && (
        <View style={s.avatarCol}>
          <GenerativeAvatar
            id={msg.agentId || "colony"}
            color={isError ? "#FF6B6B" : agentColor}
            size={28}
          />
        </View>
      )}

      <View style={[
        s.bubble,
        isUser ? s.bubbleUser : s.bubbleBot,
        isError && s.bubbleError,
      ]}>
        {/* Error indicator */}
        {isError && (
          <Text style={s.errorBadge}>
            {"\u26A0\uFE0F"} Error de conexión
          </Text>
        )}

        {/* Agent name badge */}
        {!isUser && msg.agentId && !isError && (
          <Text style={[s.agentLabel, { color: agentColor }]}>
            {msg.agentId.charAt(0).toUpperCase() + msg.agentId.slice(1)} dice:
          </Text>
        )}

        <Text style={[s.msgText, isUser && s.msgTextUser, isError && s.msgTextError]}>
          {msg.text}
        </Text>

        {/* Timestamp */}
        <Text style={[s.time, isUser && s.timeUser]}>
          {new Date(msg.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      {/* Spacer for user messages (no avatar on right) */}
      {isUser && <View style={{ width: 36 }} />}
    </View>
  );
}

// ==================== CHAT INPUT ====================

function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled: boolean;
}) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text);
    setText("");
  };

  return (
    <View style={s.inputBar}>
      <TextInput
        style={s.input}
        value={text}
        onChangeText={setText}
        placeholder="Habla con tu colonia..."
        placeholderTextColor="rgba(255,255,255,0.2)"
        editable={!disabled}
        multiline
        onSubmitEditing={handleSend}
        blurOnSubmit={Platform.OS === "web"}
        returnKeyType="send"
      />
      <Pressable
        style={({ pressed }) => [
          s.sendBtn,
          (!text.trim() || disabled) && s.sendBtnOff,
          pressed && text.trim() && !disabled && s.sendBtnPressed,
        ]}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <SendIcon size={18} color={text.trim() && !disabled ? "#fff" : "rgba(255,255,255,0.3)"} />
      </Pressable>
    </View>
  );
}

// ==================== MAIN SCREEN ====================

export default function ChatScreen() {
  const { connected, messages, sending, error, sendMessage, injectReminder } = useChat();
  const { agents } = useColony({
    onReminder: injectReminder,
  });
  const { cancelReminder } = useReminders();
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const listRef = useRef<FlatList>(null);
  const { bottom: bottomInset } = useSafeAreaInsets();

  const handleReminderComplete = useCallback(async (id: string) => {
    // console.log('[Chat] Reminder completado:', id);
    await cancelReminder(id);
  }, [cancelReminder]);

  // Select first available agent by default
  useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      setSelectedAgentId(agents[0].id);
    }
  }, [agents, selectedAgentId]);

  useEffect(() => {
    if (listRef.current && messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = (text: string) => {
    sendMessage(text, selectedAgentId || undefined);
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Status */}
      <View style={s.statusBar}>
        <View style={[s.statusDot, { backgroundColor: connected ? "#34C759" : "#FF3B30" }]} />
        <Text style={s.statusLabel}>
          {connected ? "Colonia activa" : error || "Reconectando..."}
        </Text>
        {sending && <TypingDots />}
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={({ item, index }) => (
          <MessageBubble
            msg={item}
            isLast={index === messages.length - 1}
            onReminderComplete={handleReminderComplete}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={s.list}
        ListEmptyComponent={
          <View style={s.empty}>
            <GenerativeAvatar id="colony" color="#8B6AAE" size={56} />
            <Text style={s.emptyTitle}>Tu colonia</Text>
            <Text style={s.emptyDesc}>
              {connected
                ? "Envia un mensaje para hablar con tus agentes"
                : "Conectando al gateway..."}
            </Text>
          </View>
        }
        ListFooterComponent={
          sending ? (
            <TypingIndicator
              agentId={selectedAgentId || "colony"}
              color={selectedAgentId ? (agentColors[selectedAgentId] || "#8B6AAE") : "#8B6AAE"}
            />
          ) : null
        }
      />

      {/* Agent Selector (only shown if multiple agents) */}
      <AgentSelector
        agents={agents}
        selectedId={selectedAgentId}
        onSelect={setSelectedAgentId}
      />

      {/* Input */}
      <View style={{ paddingBottom: bottomInset }}>
        <ChatInput onSend={handleSend} disabled={!connected || sending} />
      </View>
    </KeyboardAvoidingView>
  );
}

// ==================== STYLES ====================

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#110A24",
  },

  // Status bar
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    flex: 1,
  },
  typingRow: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
  },
  typingDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FFD700",
  },

  // Message list
  list: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexGrow: 1,
  },

  // Empty state
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    gap: 10,
  },
  emptyTitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
  },
  emptyDesc: {
    color: "rgba(255,255,255,0.25)",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 220,
  },

  // Message row
  msgRow: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "flex-end",
  },
  msgRowUser: {
    justifyContent: "flex-end",
  },
  msgRowBot: {
    justifyContent: "flex-start",
  },

  // Avatar
  avatarCol: {
    width: 32,
    marginRight: 8,
    alignItems: "center",
  },

  // Bubbles
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: "#5B3D7A",
    borderBottomRightRadius: 4,
  },
  bubbleBot: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderBottomLeftRadius: 4,
  },
  bubbleReminder: {
    backgroundColor: "rgba(245,166,35,0.12)",
    borderLeftWidth: 3,
    borderLeftColor: "#F5A623",
  },
  bubbleError: {
    backgroundColor: "rgba(255,107,107,0.10)",
    borderLeftWidth: 3,
    borderLeftColor: "#FF6B6B",
  },

  // Reminder badge
  reminderBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F5A623",
    marginBottom: 4,
  },

  // Error badge
  errorBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 4,
  },

  // Agent label
  agentLabel: {
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 3,
    textTransform: "capitalize",
  },

  // Message text
  msgText: {
    fontSize: 15,
    lineHeight: 21,
    color: "rgba(255,255,255,0.88)",
  },
  msgTextUser: {
    color: "#fff",
  },
  msgTextError: {
    color: "rgba(255,150,150,0.9)",
  },

  // Timestamp
  time: {
    fontSize: 10,
    color: "rgba(255,255,255,0.2)",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  timeUser: {
    color: "rgba(255,255,255,0.4)",
  },

  // Input bar
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.06)",
    backgroundColor: "#1A0F2E",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    color: "#fff",
    fontSize: 15,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#5B3D7A",
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnOff: {
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  sendBtnPressed: {
    backgroundColor: "#7A52A8",
  },
});
