import React, { useEffect } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { ColonyTabBar } from '@/components/colony/ColonyTabBar';
import { useMockPersona } from '@/mock/MockContext';

const headerBase = {
  backgroundColor: '#1A0F2E',
  shadowColor: 'transparent',
  elevation: 0,
} as const;

export default function RecordTabsLayout() {
  const persona = useMockPersona();
  const router = useRouter();

  useEffect(() => {
    if (!persona) router.replace('/record/login');
  }, [persona, router]);

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
