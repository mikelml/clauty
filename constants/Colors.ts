// ClauTY "Apple-Inspired Colorful" palette

export const theme = {
  // Light mode (default)
  bg: "#FFFFFF",
  surface: "#F5F5F7",
  card: "#FFFFFF",
  border: "rgba(0,0,0,0.06)",
  shadow: "rgba(0,0,0,0.08)",

  textPrimary: "#1D1D1F",
  textSecondary: "#6E6E73",
  textTertiary: "#AEAEB2",

  accent: "#007AFF", // Apple blue
};

// Each agent gets its own MacBook-style color
export const agentColors: Record<string, string> = {
  inventor: "#FF9500",    // naranja
  estratega: "#AF52DE",   // morado
  disruptivo: "#FF3B30",  // rojo
  negocios: "#00C7BE",    // teal
  carpintero: "#34C759",  // verde
  comprador: "#FF2D55",   // rosa
  organizador: "#007AFF", // azul
  escritor: "#5856D6",    // indigo
  familia: "#FF2D55",     // rosa
  trabajo: "#00C7BE",     // teal
};

// Fallback colors for new agents
export const colorPool = [
  "#FF9500", "#AF52DE", "#FF3B30", "#00C7BE",
  "#34C759", "#FF2D55", "#007AFF", "#5856D6",
  "#FFD60A", "#64D2FF", "#BF5AF2", "#FF6482",
];

export function getAgentColor(id: string, index: number = 0): string {
  return agentColors[id] ?? colorPool[index % colorPool.length];
}

export const stateLabels: Record<string, string> = {
  idle: "En espera",
  thinking: "Pensando",
  acting: "Trabajando",
  waiting: "Esperando",
  error: "Error",
  dormant: "Durmiendo",
  dead: "Inactivo",
};

export default {
  light: {
    text: theme.textPrimary,
    background: theme.bg,
    tint: theme.accent,
    tabIconDefault: theme.textTertiary,
    tabIconSelected: theme.accent,
  },
  dark: {
    text: "#FFFFFF",
    background: "#000000",
    tint: "#0A84FF",
    tabIconDefault: "#636366",
    tabIconSelected: "#0A84FF",
  },
};
