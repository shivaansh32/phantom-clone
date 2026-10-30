import { Platform } from 'react-native';

export const Colors = {
  phantom: {
    background: '#000000',
    card: '#18181A',
    cardBorder: 'transparent',
    cardHighlight: '#222226',
    pillInactive: '#222225',
    pillInactiveText: '#98989F',
    pillActive: '#9FA2FF',
    pillActiveText: '#000000',
    accentPurple: '#9FA2FF',
    accentPurpleLight: '#BDB7FF',
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textMuted: '#636366',
    green: '#00D26A',
    greenBg: 'rgba(0, 210, 106, 0.15)',
    red: '#FF2B4D',
    redBg: '#FF1C4E',
    redBgSubtle: 'rgba(255, 43, 77, 0.16)',
    yellowAvatar: '#9FA2FF',
    blueBar: '#3B82F6',
    yellowBar: '#EAB308',
    grayBar: '#334155',
  },
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#18181A',
    backgroundSelected: '#202023',
    textSecondary: '#8E8E93',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

export { TypographyFonts, Typography, type PhantomTypographyVariant } from './typography';

export const Fonts = {
  black: 'Inter-Black',
  bold: 'Inter-Bold',
  semiBold: 'Inter-SemiBold',
  medium: 'Inter-Medium',
  regular: 'Inter-Regular',
  sans: 'Inter-Regular',
  serif: 'serif',
  rounded: 'normal',
  mono: 'monospace',
};

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
export const MaxContentWidth = 480;
