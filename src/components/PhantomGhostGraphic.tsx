import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  G,
} from 'react-native-svg';

export function PhantomGhostGraphic({ size = 100 }: { size?: number }) {
  return (
    <View style={[styles.container, { width: size * 1.5, height: size }]}>
      <Svg width={size * 1.5} height={size} viewBox="0 0 150 100">
        <Defs>
          <LinearGradient id="ghostGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" />
            <Stop offset="100%" stopColor="#DDD6FE" />
          </LinearGradient>
          <LinearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#A78BFA" />
            <Stop offset="100%" stopColor="#6D28D9" />
          </LinearGradient>
          <LinearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#312E81" />
            <Stop offset="100%" stopColor="#1E1B4B" />
          </LinearGradient>
        </Defs>

        {/* Floating dark badge / sticker */}
        <G transform="translate(20, 25) rotate(-12)">
          <Rect
            x="0"
            y="0"
            width="32"
            height="22"
            rx="6"
            fill="url(#cardGrad)"
            stroke="#6366F1"
            strokeWidth="1.5"
          />
          <Circle cx="8" cy="11" r="3" fill="#818CF8" />
          <Rect x="14" y="9" width="12" height="4" rx="2" fill="#818CF8" />
        </G>

        {/* Purple Coin / token */}
        <G transform="translate(105, 30) rotate(15)">
          <Circle cx="12" cy="12" r="12" fill="url(#coinGrad)" />
          <Circle
            cx="12"
            cy="12"
            r="8"
            fill="none"
            stroke="#C4B5FD"
            strokeWidth="1.5"
          />
          <Path
            d="M9 12h6M12 9v6"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </G>

        {/* Stars and Sparkles */}
        {/* Star Top Left */}
        <Path
          d="M 35 15 Q 35 22 42 22 Q 35 22 35 29 Q 35 22 28 22 Q 35 22 35 15 Z"
          fill="#DDD6FE"
        />
        {/* Star Top Right */}
        <Path
          d="M 120 18 Q 120 23 125 23 Q 120 23 120 28 Q 120 23 115 23 Q 120 23 120 18 Z"
          fill="#FDE047"
        />
        {/* Tiny sparkle */}
        <Circle cx="48" cy="42" r="2" fill="#DDD6FE" />
        <Circle cx="100" cy="18" r="1.5" fill="#A78BFA" />
        <Circle cx="128" cy="58" r="2" fill="#F472B6" />

        {/* Central Phantom Ghost */}
        <G transform="translate(52, 20)">
          {/* Ghost Body */}
          <Path
            d="M 10 50 
               C 10 20, 20 8, 32 8 
               C 44 8, 54 20, 54 50 
               C 50 46, 44 52, 40 48 
               C 36 44, 30 52, 26 48 
               C 22 44, 16 52, 10 50 Z"
            fill="url(#ghostGrad)"
          />

          {/* Left Eye */}
          <Circle cx="26" cy="24" r="3" fill="#1E1B4B" />
          {/* Right Eye */}
          <Circle cx="38" cy="24" r="3" fill="#1E1B4B" />

          {/* Eye Sparkles */}
          <Circle cx="25" cy="23" r="1" fill="#FFFFFF" />
          <Circle cx="37" cy="23" r="1" fill="#FFFFFF" />

          {/* Blush Cheeks */}
          <Circle cx="20" cy="29" r="2.5" fill="#F472B6" opacity={0.6} />
          <Circle cx="44" cy="29" r="2.5" fill="#F472B6" opacity={0.6} />

          {/* Cute Smile */}
          <Path
            d="M 29 28 Q 32 32 35 28"
            fill="none"
            stroke="#1E1B4B"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
