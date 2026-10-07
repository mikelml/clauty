import React from 'react';
import { Tabs } from 'expo-router';
import { ColonyTabBar } from '@/components/colony/ColonyTabBar';
import { useReminders } from '@/hooks/useReminders';

const headerBase = {
  backgroundColor: '#1A0F2E',
  shadowColor: 'transparent',
  elevation: 0,
} as const;

export default function TabLayout() {
  const { reminders } = useReminders();
  const pendingCount = reminders.filter((r) => r.status === 'pending').length;

  return (
    <Tabs tabBar={(props) => <ColonyTabBar {...props} />}>
      <Tabs.Screen name="index" options={{ title: 'Colony', headerShown: false }} />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          headerStyle: headerBase,
          headerTintColor: 'rgba(255,255,255,0.9)',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
          tabBarBadge: pendingCount > 0 ? pendingCount : undefined,
        }}
      />
      <Tabs.Screen
        name="log"
        options={{
          title: 'Diario',
          href: null,
          headerStyle: headerBase,
          headerTintColor: 'rgba(255,255,255,0.9)',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Ajustes',
          href: null,
          headerStyle: headerBase,
          headerTintColor: 'rgba(255,255,255,0.9)',
          headerTitleStyle: { fontWeight: '600', fontSize: 17 },
        }}
      />
    </Tabs>
  );
}
