/**
 * Translates color names (including fantasy, skin, hair, and eye colors) to valid CSS colors.
 * Returns null if the string cannot be translated, leaving the background transparent.
 */

const FANTASY_COLOR_MAP: Record<string, string> = {
  // Eye Colors
  cypress: '#2d5032',
  hazel: '#8e7618',
  amber: '#d97706',
  emerald: '#059669',
  sapphire: '#2563eb',
  violet: '#7c3aed',
  purple: '#9333ea',
  turquoise: '#0d9488',
  teal: '#0f766e',
  crimson: '#dc2626',
  ruby: '#991b1b',
  ice: '#7dd3fc',
  charcoal: '#334155',
  slate: '#64748b',

  // Hair Colors
  blonde: '#eab308',
  blond: '#eab308',
  brunette: '#451a03',
  auburn: '#9a3412',
  chestnut: '#78350f',
  raven: '#18181b',
  black: '#1c1917',
  brown: '#713f12',
  dark: '#262626',
  ginger: '#c2410c',
  copper: '#b45309',
  gold: '#eab308',
  golden: '#ca8a04',
  silver: '#94a3b8',
  white: '#f8fafc',
  gray: '#6b7280',
  grey: '#6b7280',
  platinum: '#cbd5e1',
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  pink: '#ec4899',

  // Skin Colors
  ashen: '#78716c',
  ash: '#78716c',
  pale: '#faeedd',
  fair: '#fef3c7',
  tan: '#d4a373',
  tanned: '#b47b48',
  bronze: '#a16207',
  olive: '#847942',
  ebony: '#262220',
  ivory: '#fef9c3',
  ruddy: '#be7461',
  porcelain: '#fff7ed',
  peach: '#fed7aa',
  almond: '#e2caa8',
  caramel: '#93562a',
  chocolate: '#451a03',
  espresso: '#29180b',
  drow: '#3e3848',
  orc: '#5a7852',
};

// Check if a string can be resolved as a CSS color or fantasy color
export function resolveCssColor(input: string): string | null {
  if (!input || typeof input !== 'string') return null;
  const cleaned = input.trim().toLowerCase();
  if (
    !cleaned ||
    cleaned === '—' ||
    cleaned === '-' ||
    cleaned === 'none' ||
    cleaned === 'n/a' ||
    cleaned === 'unknown'
  ) {
    return null;
  }

  // 1. Direct match in dictionary
  if (FANTASY_COLOR_MAP[cleaned]) {
    return FANTASY_COLOR_MAP[cleaned];
  }

  // 2. Check if any word in the phrase matches a known color (e.g. "Dark Brown", "Pale Tan", "Deep Hazel")
  const words = cleaned.split(/[\s-]+/);
  for (const w of words) {
    if (FANTASY_COLOR_MAP[w]) {
      return FANTASY_COLOR_MAP[w];
    }
  }

  // 3. Check browser native CSS color recognition
  if (typeof window !== 'undefined') {
    const s = new Option().style;
    s.color = cleaned;
    if (s.color !== '') {
      return cleaned;
    }
  }

  return null;
}

// Calculate luminance to decide between white and dark text
export function getContrastTextColor(colorString: string): string {
  if (typeof window === 'undefined') return '#1c1917';

  try {
    const d = document.createElement('div');
    d.style.color = colorString;
    document.body.appendChild(d);
    const rgb = window.getComputedStyle(d).color;
    document.body.removeChild(d);

    const match = rgb.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0], 10);
      const g = parseInt(match[1], 10);
      const b = parseInt(match[2], 10);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance < 140 ? '#ffffff' : '#1c1917';
    }
  } catch (e) {
    // fallback
  }

  return '#1c1917';
}

export interface AppearanceColorStyle {
  hasColor: boolean;
  style: React.CSSProperties;
  className: string;
}

export function getAppearanceColorStyle(value: string): AppearanceColorStyle {
  const color = resolveCssColor(value);

  if (!color) {
    return {
      hasColor: false,
      style: {},
      className:
        'w-full text-center text-xs bg-transparent border-b border-stone-400 focus:border-[#7b1113] focus:outline-none pb-0.5 text-stone-900',
    };
  }

  const textColor = getContrastTextColor(color);

  return {
    hasColor: true,
    style: {
      backgroundColor: color,
      color: textColor,
    },
    className:
      'w-full text-center text-xs font-semibold rounded py-0.5 px-1.5 focus:outline-none shadow-xs border border-black/15 transition-colors',
  };
}
