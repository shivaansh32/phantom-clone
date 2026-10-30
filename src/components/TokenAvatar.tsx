import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Rect, G, Text as SvgText } from 'react-native-svg';
import { RankStarBadge } from './RankStarBadge';

interface TokenAvatarProps {
  symbol: string;
  iconBg?: string;
  iconType?: string;
  rankBadge?: string;
  size?: number;
}

/**
 * 1. Official Solana Foundation Logo
 * 3 rounded-corner parallel slants forming the signature 'S' with diagonal brand gradient (#9945FF -> #00C2FF -> #14F195)
 */
function SolanaLogo({ size }: { size: number }) {
  const gradId = `solGrad_${Math.round(size)}`;
  const w = size * 0.62;
  const h = w * (312 / 398);

  return (
    <Svg width={w} height={h} viewBox="0 0 398 312" fill="none">
      <Defs>
        <LinearGradient id={gradId} x1="0%" y1="100%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#9945FF" />
          <Stop offset="50%" stopColor="#00C2FF" />
          <Stop offset="100%" stopColor="#14F195" />
        </LinearGradient>
      </Defs>

      {/* Top Parallelogram Slant */}
      <Path
        d="M 64.6 3.8 C 67 1.4 70.3 0 73.8 0 H 391.2 C 397 0 399.9 7 395.8 11.1 L 333.1 73.8 C 330.7 76.2 327.4 77.6 323.9 77.6 H 6.5 C 0.7 77.6 -2.2 70.6 1.9 66.5 L 64.6 3.8 Z"
        fill={`url(#${gradId})`}
      />

      {/* Middle Parallelogram Slant */}
      <Path
        d="M 333.1 120.1 C 330.7 117.7 327.4 116.3 323.9 116.3 H 6.5 C 0.7 116.3 -2.2 123.3 1.9 127.4 L 64.6 190.1 C 67 192.5 70.3 193.9 73.8 193.9 H 391.2 C 397 193.9 399.9 186.9 395.8 182.8 L 333.1 120.1 Z"
        fill={`url(#${gradId})`}
      />

      {/* Bottom Parallelogram Slant */}
      <Path
        d="M 64.6 237.9 C 67 235.5 70.3 234.1 73.8 234.1 H 391.2 C 397 234.1 399.9 241.1 395.8 245.2 L 333.1 307.9 C 330.7 310.3 327.4 311.7 323.9 311.7 H 6.5 C 0.7 311.7 -2.2 304.7 1.9 300.6 L 64.6 237.9 Z"
        fill={`url(#${gradId})`}
      />
    </Svg>
  );
}

/**
 * 2. Official Bitcoin Logo (Official tilted double-spined ₿)
 */
function BitcoinLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 32 32">
      <Path
        d="M23.18 13.09c.35-2.33-1.43-3.58-3.86-4.42l.79-3.16-1.92-.48-.77 3.08c-.5-.13-1.02-.24-1.54-.36l.78-3.11-1.92-.48-.79 3.16c-.42-.1-1.01-.23-1.01-.23l-2.65-.66-.51 2.05s1.43.33 1.4.35c.78.19.92.71.9.12l-2.16 8.68c-.13.33-.47.82-1.22.63.03.04-1.4-.35-1.4-.35l-.96 2.21 2.5.62c.47.12.92.24 1.37.36l-.8 3.2 1.92.48.79-3.16c.52.14 1.03.27 1.53.39l-.79 3.16 1.92.48.8-3.2c3.27.62 5.73.37 6.77-2.59.84-2.38-.04-3.76-1.76-4.66 1.25-.29 2.19-1.11 2.44-2.82zm-4.37 6.16c-.59 2.38-4.6 1.09-5.9.77l1.05-4.22c1.3.32 5.47.97 4.85 3.45zm.6-6.2c-.54 2.17-3.88 1.07-4.96.8l.95-3.83c1.08.27 4.56.78 4.01 3.03z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/**
 * 3. Official Ethereum Logo (Multi-faceted 4-facet geometric diamond)
 */
function EthereumLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.58} height={size * 0.72} viewBox="0 0 24 38">
      {/* Top Left Facet */}
      <Path d="M12 0L11.7 1V26L12 26.3L23.8 19.3L12 0Z" fill="#FFFFFF" fillOpacity={0.96} />
      {/* Top Right Facet */}
      <Path d="M12 0L0.2 19.3L12 26.3V0Z" fill="#FFFFFF" fillOpacity={0.68} />
      {/* Bottom Left Facet */}
      <Path d="M12 28.6L11.8 28.8V37.7L12 38L23.8 21.6L12 28.6Z" fill="#FFFFFF" fillOpacity={0.96} />
      {/* Bottom Right Facet */}
      <Path d="M12 38V28.6L0.2 21.6L12 38Z" fill="#FFFFFF" fillOpacity={0.68} />
      {/* Inner depth shadows */}
      <Path d="M12 26.3L23.8 19.3L12 14V26.3Z" fill="#FFFFFF" fillOpacity={0.4} />
      <Path d="M0.2 19.3L12 26.3V14L0.2 19.3Z" fill="#FFFFFF" fillOpacity={0.2} />
    </Svg>
  );
}

/**
 * 4. Official XRP Logo (Modern symmetric curved cross)
 */
function XrpLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19.08 4.65c-0.58-0.58-1.51-0.58-2.09 0L12 9.64 7.01 4.65c-0.58-0.58-1.51-0.58-2.09 0L3.5 6.07c-0.28 0.28-0.44 0.66-0.44 1.06s0.16 0.78 0.44 1.06l7.46 7.46c0.28 0.28 0.66 0.44 1.06 0.44s0.78-0.16 1.06-0.44l7.46-7.46c0.28-0.28 0.44-0.66 0.44-1.06s-0.16-0.78-0.44-1.06l-1.4-1.42z"
        fill="#FFFFFF"
      />
      <Path
        d="M4.92 19.35c0.58 0.58 1.51 0.58 2.09 0L12 14.36l4.99 4.99c0.58 0.58 1.51 0.58 2.09 0l1.42-1.42c0.28-0.28 0.44-0.66 0.44-1.06s-0.16-0.78-0.44-1.06l-7.46-7.46c-0.28-0.28-0.66-0.44-1.06-0.44s-0.78 0.16-1.06 0.44l-7.46 7.46c-0.28 0.28-0.44 0.66-0.44 1.06s0.16 0.78 0.44 1.06l1.46 1.42z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/**
 * 5. Official Injective Protocol Logo (Curved Mobius helix)
 */
function InjectiveLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 32 32" fill="none">
      <Path
        d="M20 6C18.3 4.3 15.7 4.3 14 6L6 14C4.3 15.7 4.3 18.3 6 20L12 26C13.7 27.7 16.3 27.7 18 26L26 18C27.7 16.3 27.7 13.7 26 12L20 6Z"
        stroke="#00D2FF"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <Circle cx="16" cy="16" r="3.2" fill="#FFFFFF" />
    </Svg>
  );
}

/**
 * 6. Official Pump.fun Pill Logo
 */
function PumpLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4.5 12.5C2.5 10.5 2.5 7.3 4.5 5.3C6.5 3.3 9.7 3.3 11.7 5.3L18.7 12.3C20.7 14.3 20.7 17.5 18.7 19.5C16.7 21.5 13.5 21.5 11.5 19.5L4.5 12.5Z"
        fill="#FFFFFF"
      />
      <Path
        d="M11.6 5.4L18.7 12.5C20.7 14.5 20.7 17.7 18.7 19.7C16.7 21.7 13.5 21.7 11.5 19.7L8.1 16.3L15.2 9.2L11.6 5.4Z"
        fill="#10B981"
      />
      <Path d="M8.1 16.3L15.2 9.2" stroke="#121218" strokeWidth="1.2" />
    </Svg>
  );
}

/**
 * 7. Official USDC Logo
 */
function UsdcLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="9.5" stroke="#FFFFFF" strokeWidth="1.8" />
      <Path
        d="M12 6V18M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5C13.4 7.5 14.5 8.4 14.5 9.5C14.5 12 9.5 11.5 9.5 14.5C9.5 15.6 10.6 16.5 12 16.5C13.4 16.5 14.5 15.6 14.5 14.5"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 8. Official Tether USDT Logo
 */
function UsdtLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5.5 6.5H18.5M12 6.5V17.5M7 11.5C7 9.8 9.2 8.5 12 8.5C14.8 8.5 17 9.8 17 11.5C17 13.2 14.8 14.5 12 14.5C9.2 14.5 7 13.2 7 11.5Z"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 9. Kamino Logo
 */
function KaminoLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 4V20M6 12L16 4M9 10L17 20"
        stroke="#FFFFFF"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 10. Microchip / CHIP Logo
 */
function ChipLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <Rect x="5" y="5" width="14" height="14" rx="3" stroke="#FFFFFF" strokeWidth="1.8" />
      <Rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="#3B82F6" />
      <Path d="M2 9H5M2 15H5M19 9H22M19 15H22M9 2V5M15 2V5M9 19V22M15 19V22" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * 11. Launch Rocket Logo
 */
function LaunchLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 3.5C14 3.5 19 4 20.5 8.5C22 13 20.5 15.5 20.5 15.5L16.5 15.5L14 18L14 20.5L9.5 18.5L7 16L3.5 16L6 13.5L6 9.5C6 9.5 8.5 8 13 9.5C17.5 11 14 3.5 14 3.5Z"
        fill="#FFFFFF"
      />
      <Circle cx="15.5" cy="8.5" r="1.5" fill="#F97316" />
    </Svg>
  );
}

/**
 * 12. Tesla TSLA Logo
 */
function TslaLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 5.5C8 5.5 4.5 6.5 2 8L3 9.5C5 8.2 8.3 7.5 12 7.5C15.7 7.5 19 8.2 21 9.5L22 8C19.5 6.5 16 5.5 12 5.5Z"
        fill="#FFFFFF"
      />
      <Path
        d="M12 8.5C10.5 8.5 9 8.8 8 9.2L11 20H13L16 9.2C15 8.8 13.5 8.5 12 8.5Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/**
 * 13. Hyperliquid HYPE Logo
 */
function HypeLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2L4 13.5H11.5L10 22L20 9.5H12.5L13 2Z"
        fill="#22C55E"
        stroke="#22C55E"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 14. Binance BNCB Logo
 */
function BncbLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
      <Path d="M12 2L16.5 6.5L12 11L7.5 6.5L12 2Z" fill="#F0B90B" />
      <Path d="M12 13L16.5 17.5L12 22L7.5 17.5L12 13Z" fill="#F0B90B" />
      <Path d="M2.5 12L7 7.5L11.5 12L7 16.5L2.5 12Z" fill="#F0B90B" />
      <Path d="M21.5 12L17 7.5L12.5 12L17 16.5L21.5 12Z" fill="#F0B90B" />
    </Svg>
  );
}

/**
 * 15. AMD Logo
 */
function AmdLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <Path d="M4 4H10V10H4V4Z" fill="#00FFA3" />
      <Path d="M14 4H20V10H14V4Z" fill="#00FFA3" />
      <Path d="M14 14H20V20H14V14Z" fill="#00FFA3" />
      <Path d="M4 14H10L20 4V10L14 16H8V20H4V14Z" fill="#00FFA3" />
    </Svg>
  );
}

/**
 * 16. Anthropic AI Logo
 */
function AnthropicLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4L4 20H8.5L10.2 16H13.8L15.5 20H20L12 4ZM11.1 13.5L12 10.8L12.9 13.5H11.1Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}

/**
 * 17. Triple V Chevron Logo
 */
function VvvLogo({ size }: { size: number }) {
  return (
    <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
      <Path d="M4 6L12 14L20 6" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
      <Path d="M6 12L12 18L18 12" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Default clean high-contrast initials badge
 */
function DefaultInitials({ symbol, size }: { symbol: string; size: number }) {
  const cleanSym = (symbol || '').replace(/[^a-zA-Z0-9]/g, '');
  const text = cleanSym.slice(0, 3).toUpperCase();
  const fontSize = text.length > 2 ? size * 0.34 : size * 0.42;

  return (
    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize, letterSpacing: -0.5 }}>
      {text}
    </Text>
  );
}

/**
 * 20. Official GTA VI Logo (Vice City synthwave neon + stylized text)
 */
function Gta6Logo({ size }: { size: number }) {
  const gradId = `gtaGrad_${Math.round(size)}`;
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Defs>
        <LinearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#C026D3" />
          <Stop offset="50%" stopColor="#EC4899" />
          <Stop offset="100%" stopColor="#F59E0B" />
        </LinearGradient>
      </Defs>
      <Rect width="36" height="36" rx="18" fill="#180A26" />
      {/* Stylized 'VI' in synthwave gradient */}
      <Path
        d="M 7 9 L 13.5 27 H 16.5 L 23 9 H 19 L 15 22.5 L 11 9 H 7 Z"
        fill={`url(#${gradId})`}
        opacity={0.88}
      />
      <Path
        d="M 24 9 H 28 V 27 H 24 Z"
        fill={`url(#${gradId})`}
        opacity={0.88}
      />
      {/* 'grand theft auto' signature lettering */}
      <SvgText
        x="18"
        y="16.5"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="6.2"
        fontWeight="bold">
        grand
      </SvgText>
      <SvgText
        x="18"
        y="23"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="5.8"
        fontWeight="bold">
        theft auto
      </SvgText>
    </Svg>
  );
}

/**
 * 21. Official xHYPE / Hyperliquid Logo
 */
function XhypeLogo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Circle cx="18" cy="18" r="18" fill="#58E5BE" />
      {/* Signature Hyperliquid ribbon & x mark */}
      <Path
        d="M 10 14 C 10 10.5, 14 10.5, 15 13.5 L 21 22.5 C 22 25.5, 26 25.5, 26 22.5 C 26 19.5, 22 19.5, 21 16.5 L 15 7.5 C 14 4.5, 10 4.5, 10 7.5 Z"
        fill="#082A22"
      />
      <Path
        d="M 11.5 21 L 15.5 26 M 15.5 21 L 11.5 26"
        stroke="#082A22"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 22. Official RSGP (RuneScape Gold Piece) Logo
 */
function RsgpLogo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Defs>
        <LinearGradient id="rsgpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FDE047" />
          <Stop offset="50%" stopColor="#EAB308" />
          <Stop offset="100%" stopColor="#B45309" />
        </LinearGradient>
      </Defs>
      <Circle cx="18" cy="18" r="18" fill="#241608" />
      <Circle cx="18" cy="18" r="13.5" fill="url(#rsgpGrad)" stroke="#78350F" strokeWidth="1" />
      <Circle cx="18" cy="18" r="10.5" fill="none" stroke="#78350F" strokeWidth="0.8" strokeDasharray="1.5,1.5" />
      {/* RuneScape stamp symbol */}
      <Path
        d="M 14 14 L 18 11 L 22 14 L 20 22 L 16 22 Z"
        fill="#78350F"
      />
      <Circle cx="18" cy="16.5" r="1.8" fill="#FDE047" />
    </Svg>
  );
}

/**
 * 23. Official VIRTUAL (Virtuals Protocol) Logo
 */
function VirtualLogo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Circle cx="18" cy="18" r="18" fill="#B2EFE7" />
      <Path
        d="M 12 12 C 14 8, 22 8, 24 12 C 26 16, 23 21, 18 25 L 14 21 C 18 17, 21 15, 20 13 C 19 11, 15 11, 14 13 Z"
        fill="#0F3832"
      />
      <Circle cx="15" cy="20" r="2.2" fill="#0F3832" />
    </Svg>
  );
}

/**
 * 24. Official CARDS (Cards of Solana) Logo
 */
function CardsLogo({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 36 36">
      <Circle cx="18" cy="18" r="18" fill="#281A32" />
      <Rect x="10" y="9" width="12" height="17" rx="2" fill="#4B2A5E" transform="rotate(-12 16 17)" stroke="#A855F7" strokeWidth="1" />
      <Rect x="14" y="9" width="12" height="17" rx="2" fill="#FFFFFF" transform="rotate(10 20 17)" stroke="#E5E7EB" strokeWidth="1" />
      <Path
        d="M 20 14 C 20 14, 17 17.5, 17 19 C 17 20, 18 20.8, 19 20.8 C 19.5 20.8, 20 20.5, 20 20 C 20 20.5, 20.5 20.8, 21 20.8 C 22 20.8, 23 20, 23 19 C 23 17.5, 20 14, 20 14 Z M 20 20.5 L 18.5 23 H 21.5 Z"
        fill="#111827"
      />
    </Svg>
  );
}

export function TokenAvatar({
  symbol,
  iconBg,
  iconType,
  rankBadge,
  size = 38,
}: TokenAvatarProps) {
  const key = (iconType || symbol || '').toLowerCase().trim();

  // Pick intelligent default official background color per coin
  const getOfficialBg = () => {
    if (iconBg && iconBg !== '#FFFFFF') return iconBg;
    switch (key) {
      case 'sol':
      case 'solana':
        return '#0A0A0E';
      case 'btc':
      case 'bitcoin':
        return '#F7931A';
      case 'eth':
      case 'ethereum':
        return '#627EEA';
      case 'xrp':
      case 'ripple':
        return '#23487E';
      case 'inj':
      case 'injective':
        return '#00142B';
      case 'pump':
        return '#062817';
      case 'usdc':
        return '#2775CA';
      case 'usdt':
        return '#26A17B';
      case 'kmno':
      case 'kamino':
        return '#0284C7';
      case 'chip':
        return '#1E293B';
      case 'launch':
        return '#F97316';
      case 'tsla':
        return '#DC2626';
      case 'hype':
        return '#0B2317';
      case 'bncb':
        return '#1F1A07';
      case 'amd':
        return '#0E211A';
      case 'anthropic':
        return '#2E221A';
      case 'vvv':
        return '#EF4444';
      case 'microduck':
      case 'duck':
        return '#EAB308';
      case 'lmao':
      case 'lmao!':
        return '#F59E0B';
      case 'gta6':
        return '#180A26';
      case 'xhype':
        return '#58E5BE';
      case 'rsgp':
        return '#241608';
      case 'virtual':
        return '#B2EFE7';
      case 'cards':
        return '#281A32';
      default:
        return '#252538';
    }
  };

  const renderIcon = () => {
    switch (key) {
      case 'sol':
      case 'solana':
        return <SolanaLogo size={size} />;
      case 'btc':
      case 'bitcoin':
        return <BitcoinLogo size={size} />;
      case 'eth':
      case 'ethereum':
        return <EthereumLogo size={size} />;
      case 'xrp':
      case 'ripple':
        return <XrpLogo size={size} />;
      case 'inj':
      case 'injective':
        return <InjectiveLogo size={size} />;
      case 'pump':
        return <PumpLogo size={size} />;
      case 'usdc':
        return <UsdcLogo size={size} />;
      case 'usdt':
        return <UsdtLogo size={size} />;
      case 'kmno':
      case 'kamino':
        return <KaminoLogo size={size} />;
      case 'chip':
        return <ChipLogo size={size} />;
      case 'launch':
        return <LaunchLogo size={size} />;
      case 'tsla':
        return <TslaLogo size={size} />;
      case 'hype':
        return <HypeLogo size={size} />;
      case 'bncb':
        return <BncbLogo size={size} />;
      case 'amd':
        return <AmdLogo size={size} />;
      case 'anthropic':
        return <AnthropicLogo size={size} />;
      case 'vvv':
        return <VvvLogo size={size} />;
      case 'gta6':
        return <Gta6Logo size={size} />;
      case 'xhype':
        return <XhypeLogo size={size} />;
      case 'rsgp':
        return <RsgpLogo size={size} />;
      case 'virtual':
        return <VirtualLogo size={size} />;
      case 'cards':
        return <CardsLogo size={size} />;
      case 'microduck':
      case 'duck':
        return <Text style={{ fontSize: size * 0.52 }}>🦆</Text>;
      case 'lmao':
      case 'lmao!':
        return <Text style={{ fontSize: size * 0.52 }}>😹</Text>;
      default:
        return <DefaultInitials symbol={symbol} size={size} />;
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View
        style={[
          styles.badgeCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: getOfficialBg(),
          },
        ]}>
        {renderIcon()}
      </View>
      {rankBadge && (
        <View style={styles.rankBadgeWrapper}>
          <RankStarBadge rank={rankBadge} size={Math.max(16, Math.round(size * 0.42))} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rankBadgeWrapper: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    zIndex: 5,
  },
});
