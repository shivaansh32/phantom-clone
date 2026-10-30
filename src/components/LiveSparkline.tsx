import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface LiveSparklineProps {
  points?: number[];
  width?: number;
  height?: number;
  color?: string;
}

export function LiveSparkline({
  points = [80, 72, 65, 55, 48, 42, 38, 30, 28, 35, 32],
  width = 300,
  height = 90,
  color = '#00D26A',
}: LiveSparklineProps) {
  // Normalize points to SVG viewBox
  const minVal = Math.min(...points);
  const maxVal = Math.max(...points);
  const range = maxVal - minVal || 1;

  const paddingY = 12;
  const paddingX = 8;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  const coords = points.map((val, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * usableWidth;
    // higher value = higher on screen (lower y)
    const y = paddingY + usableHeight - ((val - minVal) / range) * usableHeight;
    return { x, y };
  });

  // Construct smooth bezier curve path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Area under curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const lastPoint = coords[coords.length - 1];

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <LinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </LinearGradient>
        </Defs>

        {/* Shaded Area */}
        <Path d={areaD} fill="url(#chartGradient)" />

        {/* Main Line */}
        <Path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glow halo around live dot */}
        <Circle cx={lastPoint.x} cy={lastPoint.y} r="8" fill={color} opacity="0.3" />
        {/* Live head dot */}
        <Circle cx={lastPoint.x} cy={lastPoint.y} r="4" fill="#FFFFFF" />
        <Circle cx={lastPoint.x} cy={lastPoint.y} r="2" fill={color} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});
