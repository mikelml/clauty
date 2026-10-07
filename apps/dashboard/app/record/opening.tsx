import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { AgentBirthCard } from '@/components/AgentBirthCard';
import { useMock } from '@/mock/MockContext';

export default function RecordOpening() {
  const router = useRouter();
  const { persona, newbornStatus } = useMock();

  useEffect(() => {
    if (!persona) router.replace('/record/login');
  }, [persona, router]);

  // Si el usuario llegó aquí sin adoptar (ej. deep link), lo mandamos home.
  useEffect(() => {
    if (persona && newbornStatus === 'pending') router.replace('/record');
  }, [persona, newbornStatus, router]);

  if (!persona) return null;

  const goHome = () => router.replace('/record');

  return (
    <AgentBirthCard
      persona={persona}
      newborn={persona.newborn}
      onBack={goHome}
      onContinue={goHome}
    />
  );
}
