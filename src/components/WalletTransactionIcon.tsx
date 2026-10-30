import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

interface WalletTransactionIconProps {
  size?: number;
  color?: string;
  badgeBg?: string;
}

/**
 * 1:1 Vector replica of Phantom's transaction history wallet icon
 * Extracted directly from user uploaded screenshot (media_1793339180213_bca2e60e.jpg)
 * Features:
 * - Upper credit card peeking out from the top pocket
 * - Main wallet body with rounded corners
 * - Side latch/clasp flap with circular snap dot
 */
export function WalletTransactionIcon({
  size = 18,
  color = '#A0A0AA',
  badgeBg = '#1E1E22',
}: WalletTransactionIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top credit card peeking out */}
      <Path
        d="M6.5 4.5C6.5 3.95 6.95 3.5 7.5 3.5H16.5C17.05 3.5 17.5 3.95 17.5 4.5V6H6.5V4.5Z"
        fill={color}
        fillOpacity={0.72}
      />
      {/* Main wallet body */}
      <Rect
        x="3"
        y="6"
        width="18"
        height="14"
        rx="2.5"
        fill={color}
      />
      {/* Side snap clasp tab */}
      <Path
        d="M16 10H19.5C20.33 10 21 10.67 21 11.5V14.5C21 15.33 20.33 16 19.5 16H16V10Z"
        fill={badgeBg}
      />
      {/* Snap button dot inside clasp */}
      <Circle cx="18.5" cy="13" r="1.1" fill={color} />
    </Svg>
  );
}

