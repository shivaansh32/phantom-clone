import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface RankStarBadgeProps {
  rank: number | string;
  size?: number;
}

/**
 * 1:1 Scalloped star ranking badge from Phantom Explore Markets
 * (Gold for 1, Silver for 2, Bronze for 3)
 */
export function RankStarBadge({ rank, size = 18 }: RankStarBadgeProps) {
  const rankNum = typeof rank === 'string' ? parseInt(rank, 10) : rank;

  let starColor = '#FBBF24'; // Gold default for 1
  if (rankNum === 2) starColor = '#D1D5DB'; // Silver for 2
  if (rankNum === 3) starColor = '#F97316'; // Bronze for 3

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* 8-point scalloped star badge */}
        <Path
          d="M 12 0 
             L 15 3.5 L 20 3 L 20.5 8 L 24 12 L 20.5 16 L 20 21 L 15 20.5 L 12 24 L 9 20.5 L 4 21 L 3.5 16 L 0 12 L 3.5 8 L 4 3 L 9 3.5 Z"
          fill={starColor}
          stroke="#000000"
          strokeWidth="1.2"
        />
      </Svg>
      <View style={styles.textOverlay}>
        <Text style={styles.rankNumText}>{rank}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankNumText: {
    color: '#000000',
    fontSize: 9.5,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: -0.5,
  },
});
