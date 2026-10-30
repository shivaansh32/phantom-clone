import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return <Text style={[{ color: theme[themeColor ?? 'text'] }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  small: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  smallBold: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
  },
  default: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  title: {
    fontFamily: Fonts.black,
    fontSize: 44,
    fontWeight: '900',
    lineHeight: 48,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  link: {
    fontFamily: Fonts.medium,
    lineHeight: 24,
    fontSize: 14,
  },
  linkPrimary: {
    fontFamily: Fonts.semiBold,
    lineHeight: 24,
    fontSize: 14,
    color: '#ABA0EE',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: '700' }) ?? '500',
    fontSize: 12,
  },
});
