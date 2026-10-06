/**
 * Colony Map — zone-based walkable surfaces for the isometric scene.
 *
 * Each zone corresponds to a building's top face (diamond).
 * Agents are assigned to zones and walk along routes ON the surface.
 * Dynamic agents auto-place in zones with remaining capacity.
 */

type Pt = { x: number; y: number };

export type Zone = {
  id: string;
  // Diamond geometry (same as iT params)
  cx: number;
  cy: number;
  tw: number;
  td: number;
  // Pre-verified spawn positions inside the diamond
  spawns: Pt[];
  // Walking route waypoints (absolute coords, forms a loop)
  route: Pt[];
  // How many agents fit comfortably
  capacity: number;
};

// --- Hash utility ---
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// --- Zone definitions (all points verified inside their diamond) ---

export const ZONES: Zone[] = [
  {
    id: 'tower',
    cx: 200, cy: 160, tw: 30, td: 19,
    spawns: [{ x: 200, y: 155 }],
    route: [
      { x: 196, y: 152 }, { x: 204, y: 156 }, { x: 200, y: 162 }, { x: 195, y: 158 },
    ],
    capacity: 1,
  },
  {
    id: 'upper-plat',
    cx: 200, cy: 268, tw: 50, td: 28,
    spawns: [
      { x: 188, y: 258 }, { x: 212, y: 262 }, { x: 200, y: 272 },
    ],
    route: [
      { x: 178, y: 260 }, { x: 200, y: 250 }, { x: 222, y: 260 },
      { x: 228, y: 270 }, { x: 212, y: 280 }, { x: 188, y: 278 },
      { x: 168, y: 268 },
    ],
    capacity: 3,
  },
  {
    id: 'left-wing',
    cx: 134, cy: 298, tw: 28, td: 16,
    spawns: [{ x: 134, y: 293 }, { x: 126, y: 298 }],
    route: [
      { x: 128, y: 290 }, { x: 142, y: 295 }, { x: 148, y: 300 },
      { x: 138, y: 306 }, { x: 124, y: 300 }, { x: 120, y: 294 },
    ],
    capacity: 2,
  },
  {
    id: 'right-wing',
    cx: 266, cy: 302, tw: 26, td: 15,
    spawns: [{ x: 266, y: 297 }, { x: 258, y: 302 }],
    route: [
      { x: 260, y: 295 }, { x: 274, y: 298 }, { x: 280, y: 304 },
      { x: 272, y: 310 }, { x: 258, y: 306 }, { x: 254, y: 300 },
    ],
    capacity: 2,
  },
  {
    id: 'stairs',
    cx: 170, cy: 292, tw: 10, td: 7,
    spawns: [{ x: 168, y: 290 }],
    route: [
      { x: 164, y: 282 }, { x: 170, y: 290 }, { x: 175, y: 298 }, { x: 170, y: 292 },
    ],
    capacity: 1,
  },
  {
    id: 'castle',
    cx: 200, cy: 352, tw: 82, td: 46,
    spawns: [
      { x: 180, y: 338 }, { x: 220, y: 338 }, { x: 200, y: 355 },
      { x: 168, y: 352 }, { x: 232, y: 352 }, { x: 200, y: 325 },
      { x: 185, y: 370 }, { x: 215, y: 368 },
    ],
    route: [
      { x: 170, y: 335 }, { x: 195, y: 322 }, { x: 225, y: 332 },
      { x: 248, y: 348 }, { x: 230, y: 368 }, { x: 200, y: 378 },
      { x: 170, y: 368 }, { x: 148, y: 350 },
    ],
    capacity: 8,
  },
  {
    id: 'terrace',
    cx: 200, cy: 410, tw: 65, td: 24,
    spawns: [
      { x: 195, y: 402 }, { x: 210, y: 406 }, { x: 185, y: 412 },
      { x: 220, y: 415 },
    ],
    route: [
      { x: 175, y: 405 }, { x: 200, y: 395 }, { x: 228, y: 405 },
      { x: 240, y: 412 }, { x: 218, y: 424 }, { x: 190, y: 422 },
      { x: 160, y: 412 },
    ],
    capacity: 4,
  },
  {
    id: 'water-edge',
    cx: 200, cy: 455, tw: 40, td: 10,
    spawns: [{ x: 200, y: 452 }],
    route: [
      { x: 190, y: 452 }, { x: 205, y: 450 }, { x: 215, y: 454 }, { x: 195, y: 456 },
    ],
    capacity: 1,
  },
];

// --- Named agent → zone assignments ---

const NAMED: Record<string, { zone: string; spawn: number }> = {
  inventor:    { zone: 'tower', spawn: 0 },
  estratega:   { zone: 'upper-plat', spawn: 0 },
  escritor:    { zone: 'upper-plat', spawn: 1 },
  disruptivo:  { zone: 'left-wing', spawn: 0 },
  trabajo:     { zone: 'right-wing', spawn: 0 },
  carpintero:  { zone: 'stairs', spawn: 0 },
  negocios:    { zone: 'castle', spawn: 0 },
  organizador: { zone: 'castle', spawn: 1 },
  comprador:   { zone: 'terrace', spawn: 0 },
  jardineria:  { zone: 'terrace', spawn: 1 },
  familia:     { zone: 'water-edge', spawn: 0 },
};

// --- Placement engine ---

export type Placement = {
  pos: Pt;
  route: Pt[];
  zone: string;
};

/**
 * Assign every agent a position and walking route.
 * Named agents get their hardcoded spot.
 * Dynamic agents auto-fill zones with most remaining capacity.
 */
export function placeAgents(agents: { id: string }[]): Map<string, Placement> {
  const out = new Map<string, Placement>();
  const usage = new Map<string, number>();
  for (const z of ZONES) usage.set(z.id, 0);

  // 1. Place named agents
  for (const a of agents) {
    const n = NAMED[a.id];
    if (!n) continue;
    const zone = ZONES.find((z) => z.id === n.zone);
    if (!zone) continue;
    out.set(a.id, {
      pos: zone.spawns[n.spawn % zone.spawns.length],
      route: zone.route,
      zone: zone.id,
    });
    usage.set(zone.id, (usage.get(zone.id) ?? 0) + 1);
  }

  // 2. Place dynamic agents — prefer zones with most remaining capacity
  for (const a of agents) {
    if (out.has(a.id)) continue;

    let best: Zone | null = null;
    let bestLeft = -1;
    for (const z of ZONES) {
      const left = z.capacity - (usage.get(z.id) ?? 0);
      if (left > bestLeft) {
        bestLeft = left;
        best = z;
      }
    }

    if (best) {
      const used = usage.get(best.id) ?? 0;
      const spawnIdx = used % best.spawns.length;
      out.set(a.id, {
        pos: best.spawns[spawnIdx],
        route: best.route,
        zone: best.id,
      });
      usage.set(best.id, used + 1);
    }
  }

  return out;
}

/**
 * Get a walk route for an agent, rotated by agent-specific offset
 * so agents in the same zone don't walk in lockstep.
 */
export function agentRoute(agentId: string, route: Pt[]): Pt[] {
  if (route.length < 2) return route;
  const offset = hash(agentId) % route.length;
  return [...route.slice(offset), ...route.slice(0, offset)];
}
