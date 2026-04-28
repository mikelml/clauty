/**
 * Utility functions for formatting reminder messages in the chat UI.
 */

// Agent ID → display name mapping
const AGENT_DISPLAY_NAMES: Record<string, string> = {
  inventor: "Inventor",
  cocina: "Cocina",
  jardineria: "Jardineria",
  mascotas: "Mascotas",
  nintendo: "Nintendo",
  pokemon: "Pokemon",
  taxi: "Taxi",
  videojuegos: "Videojuegos",
};

/**
 * Format a reminder message for display in the chat.
 *
 * @param agentId - The agent's ID (e.g. "inventor")
 * @param reminderText - The reminder text (e.g. "tomar agua")
 * @param agentName - Optional override for agent display name
 * @returns Formatted message string with bell emoji
 *
 * @example
 * formatReminderMessage("inventor", "tomar agua")
 * // → "Inventor dice: Es hora de tomar agua 🔔"
 */
export function formatReminderMessage(
  agentId: string,
  reminderText: string,
  agentName?: string
): string {
  const name =
    agentName ||
    AGENT_DISPLAY_NAMES[agentId.toLowerCase()] ||
    agentId.charAt(0).toUpperCase() + agentId.slice(1);

  // Capitalize first letter of reminder text
  const capitalizedText =
    reminderText.charAt(0).toUpperCase() + reminderText.slice(1);

  return `${name} dice: Es hora de ${capitalizedText} \uD83D\uDD14`;
}

/**
 * Get display name for an agent ID.
 *
 * @param agentId - Agent ID
 * @returns Display name
 */
export function getAgentDisplayName(agentId: string): string {
  return (
    AGENT_DISPLAY_NAMES[agentId.toLowerCase()] ||
    agentId.charAt(0).toUpperCase() + agentId.slice(1)
  );
}
