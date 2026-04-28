import React, { useState } from 'react';
import {
  View, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onSend: (text: string) => void;
  placeholder?: string;
};

export function ChatInput({ onSend, placeholder = 'Escríbele a tu colonia…' }: Props) {
  const [value, setValue] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        <View style={styles.inputBox}>
          <TextInput
            value={value}
            onChangeText={setValue}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.3)"
            style={styles.input}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline={false}
          />
        </View>
        <Pressable
          onPress={handleSend}
          disabled={!value.trim()}
          style={({ pressed }) => [
            styles.sendBtn,
            !value.trim() && styles.sendDisabled,
            pressed && styles.sendPressed,
          ]}
        >
          <View style={styles.sendArrow} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#1A0F2E',
  },
  inputBox: {
    flex: 1,
    backgroundColor: '#261A52',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    minHeight: 40,
    justifyContent: 'center',
  },
  input: {
    color: 'rgba(255,255,255,0.95)',
    fontSize: 14,
    ...(Platform.OS === 'web' ? ({ outlineWidth: 0, outlineStyle: 'none' } as any) : {}),
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    backgroundColor: 'rgba(255,215,0,0.3)',
  },
  sendPressed: {
    transform: [{ scale: 0.94 }],
  },
  sendArrow: {
    width: 0,
    height: 0,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderLeftWidth: 10,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#1A0F2E',
    marginLeft: 2,
  },
});
