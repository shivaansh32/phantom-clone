import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { Typography, PhantomTypographyVariant } from '@/constants/typography';

export interface PhantomTextProps extends TextProps {
  variant?: PhantomTypographyVariant;
  children: React.ReactNode;
}

export function PhantomText({ variant, style, children, ...rest }: PhantomTextProps) {
  const variantStyle = variant ? Typography[variant] : undefined;

  return (
    <Text style={[variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
}

export default PhantomText;

