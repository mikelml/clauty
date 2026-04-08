import React from 'react';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';

type P = { size?: number; color?: string };

// --- Tab bar icons ---

export function IconColony({ size = 22, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Isometric castle turret */}
      <Path d="M12 2L20 7V15L12 20L4 15V7L12 2Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <Path d="M12 2V20" stroke={color} strokeWidth={1.2} opacity={0.4} />
      <Path d="M4 7L20 15" stroke={color} strokeWidth={1.2} opacity={0.3} />
      <Path d="M20 7L4 15" stroke={color} strokeWidth={1.2} opacity={0.3} />
      <Circle cx={12} cy={11} r={2} fill={color} opacity={0.6} />
    </Svg>
  );
}

export function IconChat({ size = 22, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Rounded speech bubble with tail */}
      <Path
        d="M21 12C21 16.418 16.97 20 12 20C10.5 20 9.07 19.69 7.8 19.13L3 20L4.3 16.4C3.48 15.08 3 13.58 3 12C3 7.582 7.03 4 12 4C16.97 4 21 7.582 21 12Z"
        stroke={color} strokeWidth={1.8} strokeLinejoin="round"
      />
      {/* Three dots (typing indicator) */}
      <Circle cx={8.5} cy={12} r={1.2} fill={color} opacity={0.5} />
      <Circle cx={12} cy={12} r={1.2} fill={color} opacity={0.5} />
      <Circle cx={15.5} cy={12} r={1.2} fill={color} opacity={0.5} />
    </Svg>
  );
}

export function IconHamburger({ size = 20, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Line x1={4} y1={6} x2={20} y2={6} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={4} y1={12} x2={20} y2={12} stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Line x1={4} y1={18} x2={20} y2={18} stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

// --- Menu sheet icons ---

export function IconDiary({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={5} y={3} width={14} height={18} rx={2} stroke={color} strokeWidth={1.8} />
      <Line x1={9} y1={7} x2={15} y2={7} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
      <Line x1={9} y1={10} x2={15} y2={10} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
      <Line x1={9} y1={13} x2={12} y2={13} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
      <Path d="M5 5H3V19H5" stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.3} />
    </Svg>
  );
}

export function IconSettings({ size = 24, color = '#fff' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={3} stroke={color} strokeWidth={1.8} />
      <Path
        d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
        stroke={color} strokeWidth={1.5} strokeLinecap="round" opacity={0.5}
      />
    </Svg>
  );
}

// --- State indicator icons (for thought bubbles) ---

export function IconSleep({ size = 14, color = '#AEAEB2' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M5 3H11L5 9H11" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10 11H14L10 15" stroke={color} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
    </Svg>
  );
}

export function IconThink({ size = 14, color = '#007AFF' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={6} r={5} stroke={color} strokeWidth={1.5} />
      <Circle cx={6} cy={12} r={1.2} fill={color} opacity={0.5} />
      <Circle cx={4} cy={14.5} r={0.8} fill={color} opacity={0.3} />
      <Path d="M6 5.5C6 4.67 6.67 4 7.5 4" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.6} />
    </Svg>
  );
}

export function IconBolt({ size = 14, color = '#34C759' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M9 1L3 9H8L7 15L13 7H8L9 1Z" fill={color} opacity={0.8} />
    </Svg>
  );
}

export function IconWait({ size = 14, color = '#FF9500' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx={8} cy={8} r={6.5} stroke={color} strokeWidth={1.5} />
      <Path d="M8 4V8L11 10" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function IconAlert({ size = 14, color = '#FF3B30' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 1L15 14H1L8 1Z" stroke={color} strokeWidth={1.5} strokeLinejoin="round" />
      <Line x1={8} y1={6} x2={8} y2={10} stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Circle cx={8} cy={12} r={0.8} fill={color} />
    </Svg>
  );
}

export function IconDormant({ size = 14, color = '#636366' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M13 8A5 5 0 1 1 3.5 4.5" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
      <Path d="M12.5 2.5C10 4 8 6 8 8" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}

// --- Empty state icon ---

export function IconEmpty({ size = 40, color = 'rgba(255,255,255,0.3)' }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x={3} y={3} width={18} height={18} rx={3} stroke={color} strokeWidth={1.5} />
      <Line x1={7} y1={8} x2={17} y2={8} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
      <Line x1={7} y1={12} x2={17} y2={12} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
      <Line x1={7} y1={16} x2={12} y2={16} stroke={color} strokeWidth={1.3} strokeLinecap="round" opacity={0.5} />
    </Svg>
  );
}
