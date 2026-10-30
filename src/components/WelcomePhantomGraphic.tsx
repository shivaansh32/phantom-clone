import React from 'react';
import { View } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

interface WelcomePhantomGraphicProps {
  width?: number;
  height?: number;
}

/**
 * 1:1 Vector Illustration of the Floating Cloud with Solana, Google Pay,
 * and Phantom Ghost from the Welcome to Phantom starter card.
 */
export function WelcomePhantomGraphic({
  width = 190,
  height = 98,
}: WelcomePhantomGraphicProps) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 200 100" fill="none">
        <Defs>
          <LinearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#433672" />
            <Stop offset="100%" stopColor="#2E2452" />
          </LinearGradient>
          <LinearGradient id="solanaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#9945FF" />
            <Stop offset="50%" stopColor="#00C2FF" />
            <Stop offset="100%" stopColor="#14F195" />
          </LinearGradient>
        </Defs>

        {/* 1. Organic Violet/Indigo Cloud Blob in Background */}
        <Path
          d="M 52 38 
             C 42 32, 28 42, 34 56 
             C 24 62, 30 78, 44 76 
             C 48 84, 66 86, 74 78 
             C 86 84, 110 86, 126 78 
             C 138 82, 156 74, 150 60 
             C 160 48, 150 32, 136 36 
             C 130 24, 112 22, 102 28 
             C 92 20, 68 22, 60 32 
             Z"
          fill="url(#cloudGrad)"
        />

        {/* 2. Sparkles / Stars (✦) */}
        {/* Star 1: Top Left */}
        <Path
          d="M 28 20 Q 28 26 22 26 Q 28 26 28 32 Q 28 26 34 26 Q 28 26 28 20 Z"
          fill="#FFFFFF"
        />
        {/* Star 2: Top Center */}
        <Path
          d="M 106 14 Q 106 18 102 18 Q 106 18 106 22 Q 106 18 110 18 Q 106 18 106 14 Z"
          fill="#FFFFFF"
          opacity={0.9}
        />
        {/* Star 3: Bottom Right */}
        <Path
          d="M 158 68 Q 158 75 151 75 Q 158 75 158 82 Q 158 75 165 75 Q 158 75 158 68 Z"
          fill="#FFFFFF"
        />
        {/* Star 4: Mid Right Tiny */}
        <Circle cx="160" cy="40" r="1.8" fill="#FFFFFF" opacity={0.8} />

        {/* 3. Solana Token Badge (Top Left of Cloud) */}
        <G transform="translate(64, 12)">
          <Circle cx="16" cy="16" r="15" fill="#E8E5F8" />
          <Circle cx="16" cy="16" r="14" fill="#0C0B14" />
          {/* Solana 3-slant logo */}
          <Path
            d="M 10 10.5 H 20.5 L 22 12 H 11.5 Z"
            fill="url(#solanaGrad)"
          />
          <Path
            d="M 11.5 15 H 22 L 20.5 16.5 H 10 Z"
            fill="url(#solanaGrad)"
          />
          <Path
            d="M 10 19.5 H 20.5 L 22 21 H 11.5 Z"
            fill="url(#solanaGrad)"
          />
        </G>

        {/* 4. Google Pay Pill Badge (Top Right of Cloud) */}
        <G transform="translate(120, 22)">
          <Rect
            x="0"
            y="0"
            width="32"
            height="15"
            rx="7.5"
            fill="#FFFFFF"
          />
          {/* Google 'G' & 'Pay' stylized */}
          <Circle cx="6.5" cy="7.5" r="3.2" stroke="#4285F4" strokeWidth="1.2" fill="none" />
          <Rect x="6" y="6.8" width="2.4" height="1.4" fill="#4285F4" />
          {/* Pay letters */}
          <Path
            d="M 12 5.5 H 14.5 C 15.5 5.5 16 6 16 7 C 16 8 15.5 8.5 14.5 8.5 H 13 V 10 H 12 Z M 13 6.5 V 7.5 H 14.3 C 14.8 7.5 15 7.3 15 7 C 15 6.7 14.8 6.5 14.3 6.5 Z"
            fill="#5F6368"
          />
          <Path
            d="M 17 6.8 H 18 V 10 H 17 Z M 18 8 C 18.2 7.2 19 6.8 19.8 7.2 V 8 C 19.2 7.8 18.6 8 18.3 8.5 V 10 H 17.5 Z"
            fill="#5F6368"
          />
        </G>

        {/* 5. Credit Card / Wallet Badge (Bottom Left of Cloud) */}
        <G transform="translate(44, 48)">
          <Circle cx="12" cy="12" r="11" fill="#231B40" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
          <Rect
            x="6.5"
            y="7.5"
            width="11"
            height="9"
            rx="2"
            stroke="#ABA0EE"
            strokeWidth="1.2"
            fill="none"
          />
          <Rect x="8.5" y="10" width="3" height="2" rx="0.5" fill="#ABA0EE" />
          <Path d="M 6.5 12 H 17.5" stroke="#ABA0EE" strokeWidth="0.8" />
        </G>

        {/* 6. Cute White Phantom Ghost Peeking Out in Center */}
        <G transform="translate(84, 38)">
          {/* Ghost body */}
          <Path
            d="M 2 34 
               C 0 20, 6 6, 20 2 
               C 34 0, 44 14, 42 28 
               C 42 34, 38 38, 32 36 
               C 28 34, 24 38, 20 38 
               C 16 38, 12 34, 8 36 
               C 4 38, 2 36, 2 34 Z"
            fill="#FFFFFF"
          />
          {/* Left Eye */}
          <Circle cx="16" cy="18" r="2.4" fill="#1E1638" />
          {/* Right Eye */}
          <Circle cx="26" cy="18" r="2.4" fill="#1E1638" />
        </G>
      </Svg>
    </View>
  );
}

