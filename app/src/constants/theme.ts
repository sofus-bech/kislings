/**
 * Kislings design tokens. Fixed white-on-black, warm — see design/README.md.
 * The app is dark-only, so both color schemes map to the same palette and the
 * scaffold's themed components / navigation theming stay on-brand regardless of
 * the OS setting.
 */

import '@/global.css';

import { Platform } from 'react-native';

/** The six fixed brand colors. Never pure #000/#fff. */
export const palette = {
  bg: '#0D0C0B', // soft warm black — app background
  surface: '#161412', // raised cards
  text: '#F5F1EA', // warm off-white — primary text
  textDim: '#9B948A', // secondary text, inactive tabs
  gold: '#C8A268', // single accent, "crema" gold
  hairline: '#2A2622', // 1px dividers / card borders
} as const;

const kislings = {
  text: palette.text,
  background: palette.bg,
  backgroundElement: palette.surface,
  backgroundSelected: palette.hairline,
  textSecondary: palette.textDim,
};

export const Colors = { light: kislings, dark: kislings } as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

/** expo-google-fonts family names (loaded in the root layout). */
export const font = {
  serifMedium: 'Fraunces_500Medium',
  serifSemi: 'Fraunces_600SemiBold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
} as const;

export const radius = { card: 14, loyalty: 16 } as const;

// Kept for the scaffold's themed-text/themed-view components.
export const Fonts = Platform.select({
  ios: { sans: 'system-ui', serif: 'ui-serif', rounded: 'ui-rounded', mono: 'ui-monospace' },
  default: { sans: 'normal', serif: 'serif', rounded: 'normal', mono: 'monospace' },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
