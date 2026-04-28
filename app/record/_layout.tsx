import React from 'react';
import { Stack } from 'expo-router';
import { MockProvider } from '@/mock/MockContext';

export default function RecordLayout() {
  return (
    <MockProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="login" />
        <Stack.Screen
          name="opening"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            contentStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen name="agent/[id]" options={{ animation: 'slide_from_right' }} />
      </Stack>
    </MockProvider>
  );
}
