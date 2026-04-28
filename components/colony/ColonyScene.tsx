import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Dimensions, Pressable, Platform,
} from 'react-native';
import Svg, {
  Defs, LinearGradient, Stop, Path, G, Circle, Rect, Ellipse,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedProps,
  withRepeat, withSequence, withTiming, withDelay,
  Easing, FadeIn,
} from 'react-native-reanimated';
import { getAgentColor, stateLabels } from '@/constants/Colors';
import { monument as m } from '@/constants/MonumentPalette';
// Icon imports removed — bubbles now use inline SVG text
import { placeAgents, agentRoute, type Placement } from './ColonyMap';

// --- Animated SVG primitives (UI thread, no JS re-renders) ---
const APath = Animated.createAnimatedComponent(Path);
const ACircle = Animated.createAnimatedComponent(Circle);
const ARect = Animated.createAnimatedComponent(Rect);
const AEllipse = Animated.createAnimatedComponent(Ellipse);
const ASvgText = Animated.createAnimatedComponent(SvgText);

// ==================== TYPES ====================

type Agent = {
  id: string;
  state: string;
  metrics: { tasksCompleted: number; tasksFailed: number; tokensUsed: number };
};
type Props = {
  agents: Agent[];
  connected: boolean;
  topInset: number;
  onAgentPress?: (agent: Agent) => void;
  birthingAgentId?: string;
  birthingColor?: string;
};

// ==================== CONSTANTS ====================

const { width: W, height: H } = Dimensions.get('window');
const VBW = 400;
const ZOOM = 1.5;

// Agent positions are now computed by ColonyMap.placeAgents()

const STARS: [number, number][] = [
  [45,20],[120,40],[80,65],[200,30],[250,55],[320,25],
  [350,60],[150,75],[280,45],[60,50],[180,15],[340,40],
  [30,-10],[100,-30],[170,-5],[240,-35],[310,-20],[370,-8],
];

// ==================== HELPERS ====================

const iT = (cx:number,cy:number,tw:number,td:number) =>
  `M${cx},${cy-td}L${cx+tw},${cy}L${cx},${cy+td}L${cx-tw},${cy}Z`;
const iL = (cx:number,cy:number,tw:number,td:number,h:number) =>
  `M${cx-tw},${cy}L${cx},${cy+td}L${cx},${cy+td+h}L${cx-tw},${cy+h}Z`;
const iR = (cx:number,cy:number,tw:number,td:number,h:number) =>
  `M${cx},${cy+td}L${cx+tw},${cy}L${cx+tw},${cy+h}L${cx},${cy+td+h}Z`;

const stColor = (s:string) => {
  switch(s){
    case 'thinking': return '#007AFF';
    case 'acting':   return '#34C759';
    case 'waiting':  return '#FF9500';
    case 'error':    return '#FF3B30';
    default:         return '#AEAEB2';
  }
};
const agentOp = (s:string) =>
  s==='dormant'||s==='dead' ? 0.35 : s==='thinking'||s==='acting' ? 1 : 0.85;

// State icons removed — bubbles now use SVG text inside WalkingAgent

// ==================== WALKING AGENT ====================

function WalkingAgent({ agent, baseX, baseY, route, color, onPosUpdate }: {
  agent: Agent; baseX: number; baseY: number;
  route: { x: number; y: number }[];
  color: string;
  onPosUpdate?: (x: number, y: number) => void;
}) {
  const walks = agent.state !== 'dormant' && agent.state !== 'dead';
  const dx = useSharedValue(0);
  const dy = useSharedValue(0);

  useEffect(() => {
    if (!walks || route.length < 2) {
      dx.value = withTiming(0, { duration: 600 });
      dy.value = withTiming(0, { duration: 600 });
      return;
    }

    // Each agent gets a unique rotation of the route + speed variation
    const rotated = agentRoute(agent.id, route);
    const seed = agent.id.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
    const speed = 0.85 + (Math.abs(seed) % 30) / 100; // 0.85–1.15x
    const pause = 400 + (Math.abs(seed) % 600);        // 400–1000ms pause

    const seqX: any[] = [];
    const seqY: any[] = [];

    for (const wp of rotated) {
      const ox = wp.x - baseX;
      const oy = wp.y - baseY;
      const dist = Math.max(4, Math.hypot(ox - (seqX.length ? 0 : 0), oy));
      const dur = Math.max(800, dist * 110 * speed);

      seqX.push(withTiming(ox, { duration: dur, easing: Easing.inOut(Easing.sin) }));
      seqX.push(withTiming(ox, { duration: pause })); // pause at waypoint

      seqY.push(withTiming(oy, { duration: dur, easing: Easing.inOut(Easing.sin) }));
      seqY.push(withTiming(oy, { duration: pause }));
    }

    dx.value = withRepeat(withSequence(...seqX), -1, false);
    dy.value = withRepeat(withSequence(...seqY), -1, false);
  }, [walks, route.length]);

  const op = agentOp(agent.state);
  const act = agent.state === 'thinking' || agent.state === 'acting';

  const pTouch  = useAnimatedProps(() => ({ cx: baseX + dx.value, cy: baseY - 6 + dy.value }), [baseX, baseY, dx, dy]);
  const pGlow   = useAnimatedProps(() => ({ cx: baseX + dx.value, cy: baseY - 6 + dy.value }), [baseX, baseY, dx, dy]);
  const pShadow = useAnimatedProps(() => ({ cx: baseX + dx.value, cy: baseY + 1 + dy.value }), [baseX, baseY, dx, dy]);
  const pBody   = useAnimatedProps(() => ({ x: baseX - 3.5 + dx.value, y: baseY - 10 + dy.value }), [baseX, baseY, dx, dy]);
  const pHead   = useAnimatedProps(() => ({ cx: baseX + dx.value, cy: baseY - 13 + dy.value }), [baseX, baseY, dx, dy]);
  const pEyeL   = useAnimatedProps(() => ({ cx: baseX - 1.3 + dx.value, cy: baseY - 13.3 + dy.value }), [baseX, baseY, dx, dy]);
  const pEyeR   = useAnimatedProps(() => ({ cx: baseX + 1.5 + dx.value, cy: baseY - 13.3 + dy.value }), [baseX, baseY, dx, dy]);
  const pLabel  = useAnimatedProps(() => ({ x: baseX + dx.value, y: baseY + 8 + dy.value }), [baseX, baseY, dx, dy]);

  // Report walking position to parent for thought bubble tracking
  const posRef = useRef(onPosUpdate);
  posRef.current = onPosUpdate;
  useEffect(() => {
    const iv = setInterval(() => {
      posRef.current?.(baseX + dx.value, baseY + dy.value);
    }, 500);
    return () => clearInterval(iv);
  }, [baseX, baseY]);

  return (
    <G opacity={op}>
      <ACircle animatedProps={pTouch} r={18} fill="transparent" />
      {act && <ACircle animatedProps={pGlow} r={11} fill={color} opacity={0.22} />}
      <AEllipse animatedProps={pShadow} rx={4} ry={1.5} fill="rgba(0,0,0,0.12)" />
      <ARect animatedProps={pBody} width={7} height={10} rx={2.5} fill={color} />
      <ACircle animatedProps={pHead} r={3.5} fill={color} />
      <ACircle animatedProps={pEyeL} r={0.8} fill="white" />
      <ACircle animatedProps={pEyeR} r={0.8} fill="white" />

      {/* Name label below agent */}
      <ASvgText
        animatedProps={pLabel}
        fontSize={4.5}
        fontWeight="600"
        fill="rgba(255,255,255,0.7)"
        textAnchor="middle"
      >
        {agent.id}
      </ASvgText>
    </G>
  );
}

// ==================== THOUGHT BUBBLE OVERLAY ====================
// View overlay positioned using agent's reported walking position

// ==================== MAIN SCENE ====================

function BirthingPulse({ x, y, color }: { x: number; y: number; color: string }) {
  const ring1 = useSharedValue(0);
  const ring2 = useSharedValue(0);
  const glow = useSharedValue(0);

  useEffect(() => {
    const ease = Easing.out(Easing.quad);
    ring1.value = withRepeat(withTiming(1, { duration: 1600, easing: ease }), -1, false);
    ring2.value = withDelay(800, withRepeat(withTiming(1, { duration: 1600, easing: ease }), -1, false));
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 900, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [ring1, ring2, glow]);

  const r1Props = useAnimatedProps(() => ({
    r: 6 + ring1.value * 22,
    opacity: (1 - ring1.value) * 0.85,
  }), [ring1]);
  const r2Props = useAnimatedProps(() => ({
    r: 6 + ring2.value * 22,
    opacity: (1 - ring2.value) * 0.6,
  }), [ring2]);
  const glowProps = useAnimatedProps(() => ({
    opacity: 0.15 + glow.value * 0.35,
  }), [glow]);

  return (
    <G>
      <ACircle cx={x} cy={y - 6} r={14} fill={color} animatedProps={glowProps} />
      <ACircle cx={x} cy={y - 6} r={6} fill="none" stroke={color} strokeWidth={1.6} animatedProps={r1Props} />
      <ACircle cx={x} cy={y - 6} r={6} fill="none" stroke={color} strokeWidth={1.2} animatedProps={r2Props} />
    </G>
  );
}

export function ColonyScene({ agents, connected, topInset, onAgentPress, birthingAgentId, birthingColor }: Props) {
  const [selected, setSelected] = useState<Agent | null>(null);

  // --- Thought bubble system (View overlay that follows walking agents) ---
  const [bubbleTarget, setBubbleTarget] = useState<Agent | null>(null);
  const agentPositions = useRef<Record<string, { x: number; y: number }>>({});
  const bubbleIdx = useRef(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [bubblePos, setBubblePos] = useState<{ x: number; y: number } | null>(null);

  // Cycle through agents
  useEffect(() => {
    if (agents.length === 0 || selected) {
      setBubbleVisible(false);
      return;
    }
    const show = () => {
      const a = agents[bubbleIdx.current % agents.length];
      setBubbleTarget(a);
      setBubbleVisible(true);
      setTimeout(() => setBubbleVisible(false), 3200);
      bubbleIdx.current++;
    };
    const t0 = setTimeout(show, 1500);
    const ti = setInterval(show, 5500);
    return () => { clearTimeout(t0); clearInterval(ti); };
  }, [agents.length, !!selected]);

  // Track bubble position from agent's walking position
  useEffect(() => {
    if (!bubbleVisible || !bubbleTarget) return;
    const track = () => {
      const p = agentPositions.current[bubbleTarget.id];
      if (p) setBubblePos({ ...p });
    };
    track(); // immediate
    const iv = setInterval(track, 400);
    return () => clearInterval(iv);
  }, [bubbleVisible, bubbleTarget?.id]);

  // Sparkle (UI thread)
  const sparkleOp = useSharedValue(0.9);
  useEffect(() => {
    sparkleOp.value = withRepeat(
      withSequence(
        withTiming(0.25, { duration: 900 }),
        withTiming(0.9, { duration: 900 }),
      ), -1, false,
    );
  }, []);
  const sparkleP = useAnimatedProps(() => ({ opacity: sparkleOp.value }), [sparkleOp]);

  // Stable placements — only adds new agents, never resets existing positions
  const placementsRef = useRef<Map<string, Placement>>(new Map());
  const placements = useMemo(() => {
    const fresh = placeAgents(agents);
    // Merge: keep existing placements, only add new ones
    for (const [id, pl] of fresh) {
      if (!placementsRef.current.has(id)) {
        placementsRef.current.set(id, pl);
      }
    }
    // Remove agents no longer in the list
    for (const id of placementsRef.current.keys()) {
      if (!fresh.has(id)) placementsRef.current.delete(id);
    }
    return placementsRef.current;
  }, [agents.map(a => a.id).join(',')]);

  // ViewBox
  const tabH = Platform.OS === 'ios' ? 90 : 64;
  const cH = H - topInset - tabH;
  const vbW = VBW / ZOOM;
  const vbH = vbW * (cH / W);
  const vbX = (VBW - vbW) / 2;
  const vbY = Math.min(305 - vbH / 2, 105);
  const viewBox = `${Math.round(vbX)} ${Math.round(vbY)} ${Math.round(vbW)} ${Math.round(vbH)}`;

  // Tooltip
  const ttPos = selected ? (() => {
    const pl = placements.get(selected.id);
    if (!pl) return null;
    const sx = ((pl.pos.x - vbX) / vbW) * W - 78;
    const sy = ((pl.pos.y - vbY) / vbH) * cH + topInset - 105;
    return { left: Math.max(10, Math.min(sx, W - 168)), top: Math.max(topInset + 10, sy) };
  })() : null;

  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Buenos dias' : hr < 18 ? 'Buenas tardes' : 'Buenas noches';

  // --- Memoized architecture ---
  const arch = useMemo(() => (
    <G>
      {STARS.map(([sx,sy],i) => (
        <Circle key={`s${i}`} cx={sx} cy={sy} r={0.6+(i%3)*0.4} fill="white" opacity={0.15+(i%4)*0.08} />
      ))}
      <Ellipse cx={75} cy={55} rx={32} ry={7} fill="white" opacity={0.1} />
      <Ellipse cx={330} cy={38} rx={26} ry={6} fill="white" opacity={0.08} />

      {/* TOWER */}
      <Path d={iL(200,168,24,15,90)} fill={m.pinkLeft} />
      <Path d={iR(200,168,24,15,90)} fill={m.pinkRight} />
      <Rect x={179} y={195} width={4} height={6} rx={1} fill="rgba(0,0,0,0.12)" />
      <Rect x={179} y={215} width={4} height={6} rx={1} fill="rgba(0,0,0,0.12)" />
      <Rect x={179} y={235} width={4} height={6} rx={1} fill="rgba(0,0,0,0.12)" />
      <Rect x={217} y={200} width={4} height={6} rx={1} fill="rgba(0,0,0,0.12)" />
      <Rect x={217} y={220} width={4} height={6} rx={1} fill="rgba(0,0,0,0.12)" />
      <Path d={iL(200,160,30,19,5)} fill="#D8B4BC" />
      <Path d={iR(200,160,30,19,5)} fill="#E4C4CC" />
      <Path d={iT(200,160,30,19)} fill={m.pinkCapTop} />
      <Path d={iT(200,168,24,15)} fill={m.pinkTop} />
      <Rect x={199} y={128} width={2} height={15} fill={m.pinkLeft} />
      <Path d="M201,128 L214,133 L201,138 Z" fill={m.coral} />

      {/* UPPER PLATFORM */}
      <Path d={iL(200,268,50,28,10)} fill="#C8B8A5" />
      <Path d={iR(200,268,50,28,10)} fill="#D8C8B5" />
      <Path d={iT(200,268,50,28)} fill={m.stoneTop} />

      {/* LEFT WING */}
      <Path d={iL(134,298,28,16,35)} fill={m.lavLeft} />
      <Path d={iR(134,298,28,16,35)} fill={m.lavRight} />
      <Path d={iT(134,298,28,16)} fill={m.lavTop} />
      <Rect x={108} y={310} width={3.5} height={5} rx={0.8} fill="rgba(0,0,0,0.1)" />

      {/* RIGHT WING */}
      <Path d={iL(266,302,26,15,32)} fill={m.pinkLeft} />
      <Path d={iR(266,302,26,15,32)} fill={m.pinkRight} />
      <Path d={iT(266,302,26,15)} fill={m.pinkTop} />
      <Rect x={289} y={315} width={3.5} height={5} rx={0.8} fill="rgba(0,0,0,0.1)" />

      {/* STAIRS */}
      {[0,1,2,3].map(i => {
        const sx=162+i*5, sy=280+i*8;
        return (<G key={`st${i}`}>
          <Path d={iL(sx,sy,8,5,5)} fill={m.stairLeft} />
          <Path d={iR(sx,sy,8,5,5)} fill={m.stairRight} />
          <Path d={iT(sx,sy,8,5)} fill={m.stairTop} />
        </G>);
      })}

      {/* CORAL SLIDE */}
      <Path d="M228,270 L238,276 L256,345 L246,339 Z" fill={m.coral} />
      <Path d="M238,276 L248,270 L266,339 L256,345 Z" fill={m.coralDark} />

      {/* MAIN CASTLE */}
      <Path d={iL(200,352,82,46,22)} fill={m.stoneLeft} />
      <Path d={iR(200,352,82,46,22)} fill={m.stoneRight} />
      <Path d={iT(200,352,82,46)} fill={m.stoneTop} />
      <Rect x={122} y={370} width={4} height={7} rx={1} fill="rgba(0,0,0,0.08)" />
      <Rect x={122} y={384} width={4} height={7} rx={1} fill="rgba(0,0,0,0.08)" />
      <Rect x={278} y={372} width={4} height={7} rx={1} fill="rgba(0,0,0,0.08)" />

      {/* SUB-TOWERS */}
      <Path d={iL(128,360,16,10,20)} fill={m.lavLeft} />
      <Path d={iR(128,360,16,10,20)} fill={m.lavRight} />
      <Path d={iT(128,360,16,10)} fill={m.lavTop} />
      <Path d={iL(272,363,14,9,18)} fill={m.pinkLeft} />
      <Path d={iR(272,363,14,9,18)} fill={m.pinkRight} />
      <Path d={iT(272,363,14,9)} fill={m.pinkTop} />

      {/* FRONT TERRACE */}
      <Path d={iL(200,410,65,24,10)} fill={m.terraceLeft} />
      <Path d={iR(200,410,65,24,10)} fill={m.terraceRight} />
      <Path d={iT(200,410,65,24)} fill={m.terraceTop} />
      <Circle cx={178} cy={402} r={3} fill={m.plant} opacity={0.65} />
      <Circle cx={224} cy={406} r={2.5} fill="#88C880" opacity={0.55} />
      <Circle cx={198} cy={404} r={2} fill="#90D088" opacity={0.5} />

      {/* WATER */}
      <Path d={iT(200,460,52,14)} fill="url(#water)" opacity={0.75} />
      <Circle cx={188} cy={458} r={1} fill="white" opacity={0.25} />
      <Circle cx={210} cy={462} r={0.8} fill="white" opacity={0.2} />
      <Circle cx={196} cy={465} r={0.7} fill="white" opacity={0.18} />
      <Ellipse cx={200} cy={485} rx={88} ry={10} fill="rgba(60,40,80,0.12)" />
    </G>
  ), []);

  return (
    <View style={[styles.root, { backgroundColor: m.skyDeep }]}>
      <Svg width={W} height={cH} viewBox={viewBox} style={{ marginTop: topInset }}>
        <Defs>
          <LinearGradient id="sky" x1="0" y1={vbY} x2="0" y2={vbY+vbH} gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor={m.skyDeep} />
            <Stop offset="0.12" stopColor={m.skyTop} />
            <Stop offset="0.4" stopColor={m.skyMid} />
            <Stop offset="0.7" stopColor={m.skyLow} />
            <Stop offset="1" stopColor={m.skyHorizon} />
          </LinearGradient>
          <LinearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={m.water} />
            <Stop offset="1" stopColor={m.waterDeep} />
          </LinearGradient>
        </Defs>

        <Rect x={vbX} y={vbY} width={vbW} height={vbH} fill="url(#sky)" />
        {arch}
        <APath
          d="M200,118 L202,125 L209,127 L202,129 L200,136 L198,129 L191,127 L198,125 Z"
          fill={m.gold}
          animatedProps={sparkleP}
        />

        {/* Birthing pulse — ring animado en la posición del newborn */}
        {birthingAgentId && (() => {
          const pl = placements.get(birthingAgentId);
          if (!pl) return null;
          return (
            <BirthingPulse
              x={pl.pos.x}
              y={pl.pos.y}
              color={birthingColor ?? '#FFD700'}
            />
          );
        })()}

        {/* Walking agents */}
        {agents.map((a, i) => {
          const pl = placements.get(a.id);
          if (!pl) return null;
          return (
            <WalkingAgent
              key={a.id}
              agent={a}
              baseX={pl.pos.x}
              baseY={pl.pos.y}
              route={pl.route}
              color={getAgentColor(a.id, i)}
              onPosUpdate={(x, y) => {
                agentPositions.current[a.id] = { x, y };
              }}
            />
          );
        })}
      </Svg>

      {/* Thought bubble overlay — follows agent position */}
      {bubbleVisible && bubbleTarget && bubblePos && (() => {
        const sx = ((bubblePos.x - vbX) / vbW) * W;
        const sy = ((bubblePos.y - vbY) / vbH) * cH + topInset;
        const agentColor = getAgentColor(bubbleTarget.id, 0);
        const label = stateLabels[bubbleTarget.state] ?? bubbleTarget.state;
        return (
          <Animated.View
            entering={FadeIn.duration(350)}
            style={[styles.bubbleAnchor, {
              left: Math.max(10, Math.min(sx - 70, W - 155)),
              top: Math.max(topInset + 10, sy - 80),
              pointerEvents: 'none' as const,
            }]}
          >
            <View style={[styles.bubble, { borderLeftColor: agentColor }]}>
              <Text style={styles.bubbleName}>
                {bubbleTarget.id.charAt(0).toUpperCase() + bubbleTarget.id.slice(1)}
              </Text>
              <Text style={styles.bubbleState}>{label}</Text>
            </View>
            <View style={styles.dotsCol}>
              <View style={[styles.dot, { width: 7, height: 7 }]} />
              <View style={[styles.dot, { width: 4, height: 4, opacity: 0.5 }]} />
            </View>
          </Animated.View>
        );
      })()}

      {/* Agent click hotspots — outside SVG to avoid DOM event warnings */}
      {agents.map((a) => {
        const pl = placements.get(a.id);
        if (!pl) return null;
        const sx = ((pl.pos.x - vbX) / vbW) * W;
        const sy = ((pl.pos.y - vbY) / vbH) * cH + topInset;
        return (
          <Pressable
            key={`hit-${a.id}`}
            onPress={() => {
              if (onAgentPress) onAgentPress(a);
              else setSelected(prev => prev?.id === a.id ? null : a);
            }}
            style={{
              position: 'absolute',
              left: sx - 22,
              top: sy - 28,
              width: 44,
              height: 44,
            }}
          />
        );
      })}

      {/* Greeting */}
      <View style={[styles.greeting, { top: topInset + 8 }]}>
        <Text style={styles.greetingText}>{greet}</Text>
      </View>

      {/* Status */}
      <View style={[styles.status, { top: topInset + 8 }]}>
        <View style={[styles.statusDot, { backgroundColor: connected ? '#34C759' : '#FF3B30' }]} />
        <Text style={styles.statusText}>
          {connected ? `${agents.length} agentes` : 'Reconectando...'}
        </Text>
      </View>

      {/* Tooltip (manual tap) */}
      {selected && ttPos && (
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelected(null)}>
          <Animated.View
            entering={FadeIn.duration(180)}
            style={[styles.tooltip, { left: ttPos.left, top: ttPos.top, borderLeftColor: getAgentColor(selected.id, 0) }]}
          >
            <View style={styles.ttHeader}>
              <View style={[styles.ttDot, { backgroundColor: stColor(selected.state) }]} />
              <Text style={styles.ttName}>
                {selected.id.charAt(0).toUpperCase() + selected.id.slice(1)}
              </Text>
            </View>
            <Text style={styles.ttState}>{stateLabels[selected.state] ?? selected.state}</Text>
            <View style={styles.ttDivider} />
            <Text style={styles.ttStat}>{selected.metrics.tasksCompleted} tareas completadas</Text>
            <Text style={styles.ttStat}>{selected.metrics.tokensUsed.toLocaleString()} tokens usados</Text>
          </Animated.View>
        </Pressable>
      )}

      {agents.length === 0 && connected && (
        <View style={[styles.emptyBanner, { top: topInset + 50 }]}>
          <Text style={styles.emptyText}>Esperando agentes...</Text>
        </View>
      )}
    </View>
  );
}

// ==================== STYLES ====================

const styles = StyleSheet.create({
  root: { flex: 1 },

  greeting: {
    position: 'absolute', left: 16,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  greetingText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '600' },

  status: {
    position: 'absolute', right: 16,
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '500' },

  // --- Tooltip ---
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 14,
    padding: 14, paddingLeft: 16, borderLeftWidth: 3,
    minWidth: 155, maxWidth: 200,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18, shadowRadius: 14, elevation: 10,
  },
  ttHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 2 },
  ttDot: { width: 8, height: 8, borderRadius: 4 },
  ttName: { fontSize: 15, fontWeight: '700', color: '#1D1D1F' },
  ttState: { fontSize: 12, color: '#6E6E73', marginLeft: 15, marginBottom: 6 },
  ttDivider: { height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 7 },
  ttStat: { fontSize: 12, color: '#6E6E73', marginTop: 2 },

  // --- Thought bubble ---
  bubbleAnchor: { position: 'absolute', alignItems: 'flex-start' },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 8, borderLeftWidth: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12, shadowRadius: 8, elevation: 6,
  },
  bubbleName: { fontSize: 13, fontWeight: '700', color: '#1D1D1F' },
  bubbleState: { fontSize: 11, color: '#6E6E73', marginTop: 1 },
  dotsCol: { alignItems: 'center', marginLeft: 12, marginTop: 2 },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 10, marginTop: 2,
  },

  // --- Empty ---
  emptyBanner: {
    position: 'absolute', alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 8,
  },
  emptyText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
});
