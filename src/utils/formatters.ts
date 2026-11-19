/**
 * Casting time formatter for spell tables and previews.
 * Truncates long conditional triggers (e.g., conditional reactions/bonus actions)
 * to a 2-word limit followed by '...' while preserving standard casting times.
 */
export const formatCastingTime = (time: string): string => {
  if (!time) return '';
  const trimmed = time.trim();

  // Check for comma separation between action type and condition (e.g. "Reaction, which you take...")
  const commaIdx = trimmed.indexOf(',');
  if (commaIdx !== -1) {
    const beforeComma = trimmed.substring(0, commaIdx).trim();
    return `${beforeComma}...`;
  }

  // Otherwise check word count limit of 2 words
  const words = trimmed.split(/\s+/);
  if (words.length > 2) {
    return `${words.slice(0, 2).join(' ')}...`;
  }

  return trimmed;
};
