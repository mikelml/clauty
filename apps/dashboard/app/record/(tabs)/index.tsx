import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { ColonyScene } from '@/components/colony/ColonyScene';
import { PersonaHeader } from '@/components/PersonaHeader';
import { ConnectionDot } from '@/components/ConnectionDot';
import { BirthNotification } from '@/components/BirthNotification';
import { BirthCelebration } from '@/components/BirthCelebration';
import { Act1MorningWidget } from '@/components/Act1MorningWidget';
import { Act2BitacoraModal } from '@/components/Act2BitacoraModal';
import { Act5CollabOverlay } from '@/components/Act5CollabOverlay';
import { Act8MorningGreeting } from '@/components/Act8MorningGreeting';
import { Act8DiaryModal } from '@/components/Act8DiaryModal';
import { useMock } from '@/mock/MockContext';
import { useRealOrMockColony } from '@/hooks/useRealOrMock';
import { act1ByPersona } from '@/mock/acts/act1';
import { act5ByPersona } from '@/mock/acts/act5';
import { act8ByPersona } from '@/mock/acts/act8';
import { TimelineDirector } from '@/mock/director';

const BANNER_DELAY_MS = 3000;

export default function RecordColonyTab() {
  const mock = useMock();
  const {
    persona, newbornStatus,
    act1Visible, act2ModalOpen, act5OverlayOpen, act8ModalOpen,
    timelinePhase, closeAct2, closeAct5, closeAct8,
  } = mock;

  const real = useRealOrMockColony();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [bannerReady, setBannerReady] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [pulseOn, setPulseOn] = useState(false);
  const birthPlayedRef = useRef<string | null>(null);

  // --- Real genesis birth celebration ---
  const realNewBorn = real.newBornAgent;
  useEffect(() => {
    if (realNewBorn && birthPlayedRef.current !== realNewBorn.id) {
      birthPlayedRef.current = realNewBorn.id;
      setCelebrating(true);
      setPulseOn(true);
    }
  }, [realNewBorn?.id]);

  useEffect(() => {
    setBannerReady(false);
    if (real.isMockActive) birthPlayedRef.current = null;
    const t = setTimeout(() => setBannerReady(true), BANNER_DELAY_MS);
    return () => clearTimeout(t);
  }, [persona?.id]);

  // La ceremonia arranca la primera vez que el home recibe focus tras adoptar (mock mode).
  useFocusEffect(
    useCallback(() => {
      if (
        real.isMockActive &&
        newbornStatus === 'adopted' &&
        persona &&
        birthPlayedRef.current !== persona.id
      ) {
        birthPlayedRef.current = persona.id;
        setCelebrating(true);
        setPulseOn(true);
      }
    }, [real.isMockActive, newbornStatus, persona?.id])
  );

  // El pulso del newborn en el mapa dura 10s tras entrar a colonia
  useEffect(() => {
    if (!pulseOn) return;
    const t = setTimeout(() => setPulseOn(false), 10000);
    return () => clearTimeout(t);
  }, [pulseOn]);

  if (!persona) return null;

  // Use real colony data when connected, mock otherwise
  const colony = real.colony;
  const agents = Object.entries(colony).map(([id, agent]) => ({ id, ...agent }));

  const showBirthBanner = real.isMockActive && bannerReady && newbornStatus === 'pending';

  // Acts are demo-only — show only in mock mode
  const showActs = real.isMockActive;
  const act1Widget = act1ByPersona[persona.id];
  const act2Entries = TimelineDirector.getAct2Entries(persona.id);
  const act5Plan = act5ByPersona[persona.id];
  const act8Dream = act8ByPersona[persona.id];
  const isAct8Completed = timelinePhase === 'completed';

  // Determine birthing agent (real genesis vs mock newborn)
  const birthingAgentId = pulseOn
    ? (realNewBorn?.id ?? (real.isMockActive ? persona.newborn.id : undefined))
    : undefined;
  const birthingColor = realNewBorn?.color ?? persona.newborn.color;

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <View style={styles.headerFlex}>
          <PersonaHeader />
        </View>
        <View style={styles.connectionDotWrap}>
          <ConnectionDot connectionState={real.connectionState} size={10} />
        </View>
      </View>
      <View style={styles.scene}>
        <ColonyScene
          agents={agents}
          connected={real.isConnected || real.isMockActive}
          topInset={insets.top}
          onAgentPress={(a) => router.push(`/record/agent/${a.id}`)}
          birthingAgentId={birthingAgentId}
          birthingColor={birthingColor}
        />

        {showBirthBanner && <BirthNotification newborn={persona.newborn} />}

        {showActs && act1Visible && <Act1MorningWidget widget={act1Widget} />}

        {showActs && (timelinePhase === 'act8' || isAct8Completed) && (
          <Act8MorningGreeting text={act8Dream.greeting} subtitle={act8Dream.headline} />
        )}

        {celebrating && (
          <BirthCelebration
            agentId={realNewBorn?.id ?? persona.newborn.id}
            role={realNewBorn?.role ?? persona.newborn.role}
            color={birthingColor}
            onEnd={() => {
              setCelebrating(false);
              if (realNewBorn) real.clearNewBorn();
            }}
          />
        )}

        {showActs && act5OverlayOpen && <Act5CollabOverlay plan={act5Plan} onClose={closeAct5} />}
      </View>

      {showActs && act2ModalOpen && (
        <Act2BitacoraModal
          personaFirstName={persona.name.split(' ')[0]}
          entries={act2Entries}
          onClose={closeAct2}
        />
      )}

      {showActs && act8ModalOpen && (
        <Act8DiaryModal dream={act8Dream} onClose={closeAct8} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#2A1850',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  headerFlex: {
    flex: 1,
  },
  connectionDotWrap: {
    justifyContent: 'center',
    paddingRight: 16,
    paddingTop: 8,
  },
  scene: {
    flex: 1,
    position: 'relative',
  },
});
