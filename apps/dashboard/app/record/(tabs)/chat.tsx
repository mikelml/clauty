import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { PersonaHeader } from '@/components/PersonaHeader';
import { AgentBeatCard } from '@/components/AgentBeatCard';
import { AgentBubble, UserBubble } from '@/components/ChatBubbles';
import { ChatInput } from '@/components/ChatInput';
import { Act6ReportCard } from '@/components/Act6ReportCard';
import { ConnectionDot } from '@/components/ConnectionDot';
import { useMock } from '@/mock/MockContext';
import { useRealOrMockChat, useRealOrMockColony } from '@/hooks/useRealOrMock';
import { useColony } from '@/hooks/useColony';

export default function RecordChatTab() {
  const mock = useMock();
  const { persona, nightMode, timelinePhase } = mock;
  const realColony = useRealOrMockColony();
  const chat = useRealOrMockChat();
  const scrollRef = useRef<ScrollView>(null);

  // Optional agent selector — hidden by default, user taps to force a specific agent
  const [forcedAgentId, setForcedAgentId] = useState<string | undefined>(undefined);
  const [showAgentSelector, setShowAgentSelector] = useState(false);

  const isReal = chat.dataSource === 'real';
  const isMock = chat.dataSource === 'mock';

  // Wire up reminders from SSE into chat (real mode only)
  const colony = useColony({
    onReminder: (reminder) => {
      if (isReal) {
        chat.injectReminder({ agentId: reminder.agentId, text: reminder.text });
      }
    },
  });

  // Scroll to bottom on new messages
  const messageCount = isReal ? chat.messages.length : mock.chatMessages.length;
  useEffect(() => {
    if (messageCount > 0) {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [messageCount]);

  if (!persona) return null;

  // Get available agents for optional selector
  const availableAgents = Object.keys(realColony.colony);

  const handleSend = (text: string) => {
    if (isReal) {
      // Send without agentId by default (plugin routes automatically)
      // If user forced an agent via selector, include it
      chat.sendMessage(text, forcedAgentId);
    } else {
      mock.sendUserMessage(text);
    }
  };

  // Render real chat messages
  const renderRealMessages = () => {
    if (!isReal) return null;
    return chat.messages.map((m) => {
      if (m.role === 'user') {
        return <UserBubble key={m.id} text={m.text} />;
      }
      // Assistant message — show which agent responded
      return (
        <AgentBubble
          key={m.id}
          agentId={m.agentId || 'inventor'}
          text={m.text}
          typing={false}
          flavor={m.isReminder ? 'reminder' : 'reply'}
        />
      );
    });
  };

  // Render mock chat messages (existing logic)
  const renderMockMessages = () => {
    if (!isMock) return null;
    return mock.chatMessages.map((m) => {
      if (m.kind === 'user') return <UserBubble key={m.id} text={m.text} />;
      if (m.kind === 'agent') {
        return (
          <AgentBubble
            key={m.id}
            agentId={m.agentId}
            text={m.text}
            typing={m.typing}
            flavor={m.flavor}
            integrations={m.integrations}
          />
        );
      }
      if (m.kind === 'beat') {
        if (m.typing) {
          return (
            <View key={m.id} style={styles.typingBeatRow}>
              <Text style={styles.typingBeatText}>...</Text>
            </View>
          );
        }
        return <AgentBeatCard key={m.id} beat={m.beat} />;
      }
      if (m.kind === 'report') {
        return <Act6ReportCard key={m.id} report={m.report} typing={m.typing} />;
      }
      return null;
    });
  };

  const isEmpty = isReal ? chat.messages.length === 0 : mock.chatMessages.length === 0;

  return (
    <View style={[styles.root, nightMode && styles.rootNight]}>
      <PersonaHeader />

      {/* Connection status bar (real mode) */}
      {isReal && !realColony.isConnected && (
        <View style={styles.connectionBar}>
          <ConnectionDot connectionState={realColony.connectionState} size={8} />
          <Text style={styles.connectionText}>
            {realColony.connectionState === 'reconnecting' ? 'Reconectando...' : 'Sin conexion'}
          </Text>
        </View>
      )}

      {nightMode && isMock && (
        <View style={styles.nightBanner}>
          <Text style={styles.nightIcon}>M</Text>
          <Text style={styles.nightText}>Dreamtime - La colonia no descansa</Text>
        </View>
      )}

      {/* Optional agent selector — discrete, appears only on tap */}
      {isReal && showAgentSelector && availableAgents.length > 0 && (
        <View style={styles.agentSelector}>
          <Pressable
            onPress={() => { setForcedAgentId(undefined); setShowAgentSelector(false); }}
            style={[styles.agentChip, !forcedAgentId && styles.agentChipActive]}
          >
            <Text style={styles.agentChipText}>Auto</Text>
          </Pressable>
          {availableAgents.map((id) => (
            <Pressable
              key={id}
              onPress={() => { setForcedAgentId(id); setShowAgentSelector(false); }}
              style={[styles.agentChip, forcedAgentId === id && styles.agentChipActive]}
            >
              <Text style={styles.agentChipText}>{id}</Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {isEmpty && (isMock ? timelinePhase === 'idle' : true) && (
          <Text style={styles.emptyHint}>
            {isReal
              ? 'Escribe un mensaje. El plugin lo enviara al agente mas adecuado.'
              : 'Tu colonia empezara a hablarte en un momento. Mientras tanto puedes escribirles tu.'}
          </Text>
        )}

        {isReal ? renderRealMessages() : renderMockMessages()}

        {/* Typing indicator while waiting for real response */}
        {isReal && chat.sending && (
          <View style={styles.typingRow}>
            <Text style={styles.typingDots}>...</Text>
            <Text style={styles.typingLabel}>pensando</Text>
          </View>
        )}
      </ScrollView>

      {/* Tap area to toggle agent selector (real mode) */}
      {isReal && (
        <Pressable
          onPress={() => setShowAgentSelector(!showAgentSelector)}
          style={styles.routingHint}
        >
          <Text style={styles.routingHintText}>
            {forcedAgentId ? `> ${forcedAgentId}` : '> auto'}
          </Text>
        </Pressable>
      )}

      <ChatInput onSend={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0F2E',
  },
  rootNight: {
    backgroundColor: '#080618',
  },
  connectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,59,48,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,59,48,0.22)',
  },
  connectionText: {
    color: '#FF6B6B',
    fontSize: 11,
    fontWeight: '600',
  },
  nightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(100,210,255,0.08)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(100,210,255,0.22)',
  },
  nightIcon: { fontSize: 13 },
  nightText: {
    color: '#7EDCFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  agentSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  agentChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  agentChipActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.12)',
  },
  agentChipText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  emptyHint: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 24,
    maxWidth: 280,
    alignSelf: 'center',
  },
  typingBeatRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  typingBeatText: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 18,
    letterSpacing: 2,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  typingDots: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 20,
    letterSpacing: 3,
  },
  typingLabel: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontStyle: 'italic',
  },
  routingHint: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  routingHintText: {
    color: 'rgba(255,255,255,0.25)',
    fontSize: 10,
    fontWeight: '600',
  },
});
