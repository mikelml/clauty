/**
 * ReminderBubble — animated bubble for proactive reminder notifications in chat.
 * Slides in from top with fade-in animation.
 * Shows reminder text, agent name, and a "Hecho ✓" completion button.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

interface ReminderBubbleProps {
  reminderId: string;
  text: string;
  agentName: string;
  onComplete: (id: string) => void;
}

export function ReminderBubble({ reminderId, text, agentName, onComplete }: ReminderBubbleProps) {
  const translateY = useRef(new Animated.Value(-30)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <View style={styles.header}>
        <Text style={styles.bell}>🔔</Text>
        <Text style={styles.agentName}>{agentName} dice:</Text>
      </View>
      <Text style={styles.text}>{text}</Text>
      <TouchableOpacity
        onPress={() => onComplete(reminderId)}
        style={styles.doneButton}
        activeOpacity={0.7}
      >
        <Text style={styles.doneText}>Hecho ✓</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(245,166,35,0.12)',
    borderLeftWidth: 3,
    borderLeftColor: '#F5A623',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  bell: {
    fontSize: 14,
  },
  agentName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F5A623',
    fontStyle: 'italic',
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 10,
  },
  doneButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(245,166,35,0.2)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245,166,35,0.4)',
  },
  doneText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F5A623',
  },
});
