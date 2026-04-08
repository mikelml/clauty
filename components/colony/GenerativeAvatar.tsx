import React, { useMemo } from 'react';
import Svg, { Circle, Rect, Path, G, Polygon } from 'react-native-svg';

type Props = {
  id: string;
  color: string;
  size?: number;
};

// Deterministic hash from string → stable number sequence
function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Extract N deterministic values 0..1 from a seed
function seededValues(seed: number, count: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < count; i++) {
    s = ((s * 16807) + 0) % 2147483647;
    out.push(s / 2147483647);
  }
  return out;
}

// Shape primitives — each draws inside a 0..1 normalized space
const SHAPES = [
  // Diamond
  (cx: number, cy: number, r: number, fill: string, opacity: number) => (
    <Path
      d={`M${cx},${cy - r}L${cx + r},${cy}L${cx},${cy + r}L${cx - r},${cy}Z`}
      fill={fill}
      opacity={opacity}
    />
  ),
  // Circle
  (cx: number, cy: number, r: number, fill: string, opacity: number) => (
    <Circle cx={cx} cy={cy} r={r} fill={fill} opacity={opacity} />
  ),
  // Square (rotated 0 or 45)
  (cx: number, cy: number, r: number, fill: string, opacity: number) => (
    <Rect
      x={cx - r * 0.7}
      y={cy - r * 0.7}
      width={r * 1.4}
      height={r * 1.4}
      rx={r * 0.15}
      fill={fill}
      opacity={opacity}
    />
  ),
  // Triangle up
  (cx: number, cy: number, r: number, fill: string, opacity: number) => (
    <Path
      d={`M${cx},${cy - r}L${cx + r},${cy + r * 0.6}L${cx - r},${cy + r * 0.6}Z`}
      fill={fill}
      opacity={opacity}
    />
  ),
  // Hexagon
  (cx: number, cy: number, r: number, fill: string, opacity: number) => {
    const pts = [0, 1, 2, 3, 4, 5]
      .map((i) => {
        const a = (Math.PI / 3) * i - Math.PI / 2;
        return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`;
      })
      .join(' ');
    return <Polygon points={pts} fill={fill} opacity={opacity} />;
  },
  // Cross / plus
  (cx: number, cy: number, r: number, fill: string, opacity: number) => {
    const t = r * 0.3;
    return (
      <Path
        d={`M${cx - t},${cy - r}H${cx + t}V${cy - t}H${cx + r}V${cy + t}H${cx + t}V${cy + r}H${cx - t}V${cy + t}H${cx - r}V${cy - t}H${cx - t}Z`}
        fill={fill}
        opacity={opacity}
      />
    );
  },
];

// Lighten/darken a hex color
function adjustColor(hex: string, amount: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, ((n >> 16) & 0xff) + amount));
  const g = Math.min(255, Math.max(0, ((n >> 8) & 0xff) + amount));
  const b = Math.min(255, Math.max(0, (n & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Generates a unique geometric avatar from an agent ID.
 * Same ID always produces the same avatar. Pure, no randomness.
 */
export function GenerativeAvatar({ id, color, size = 36 }: Props) {
  const avatar = useMemo(() => {
    const h = hashCode(id);
    const v = seededValues(h, 12);

    const vb = 100;
    const half = vb / 2;

    // Pick 2-3 shapes from the palette
    const shapeCount = 2 + Math.floor(v[0] * 2); // 2 or 3
    const lighter = adjustColor(color, 50);
    const darker = adjustColor(color, -40);
    const colors = [color, lighter, darker];

    const elements: React.ReactNode[] = [];

    // Background shape (large, low opacity)
    const bgShape = SHAPES[Math.floor(v[1] * SHAPES.length)];
    elements.push(
      <G key="bg">
        {bgShape(half, half, half * 0.85, colors[0], 0.15)}
      </G>,
    );

    // Main shapes
    for (let i = 0; i < shapeCount; i++) {
      const vi = 2 + i * 3; // offset into values array
      const shapeIdx = Math.floor(v[vi] * SHAPES.length);
      const shape = SHAPES[shapeIdx];

      const cx = 25 + v[vi + 1] * 50; // 25..75
      const cy = 25 + v[vi + 2] * 50;
      const r = 12 + v[vi] * 20; // 12..32
      const c = colors[i % colors.length];
      const opacity = 0.4 + v[vi + 1] * 0.5; // 0.4..0.9

      elements.push(
        <G key={`s${i}`}>
          {shape(cx, cy, r, c, opacity)}
        </G>,
      );
    }

    // Center accent (small bright shape)
    const accentShape = SHAPES[Math.floor(v[10] * 3)]; // diamond, circle, or square
    elements.push(
      <G key="accent">
        {accentShape(half, half, 8 + v[11] * 6, '#fff', 0.7)}
      </G>,
    );

    return elements;
  }, [id, color]);

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {avatar}
    </Svg>
  );
}
