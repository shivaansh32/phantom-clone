import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SendEmptyAirplaneGraphicProps {
  width?: number;
  height?: number;
}

export function SendEmptyAirplaneGraphic({
  width = 110,
  height = 55,
}: SendEmptyAirplaneGraphicProps) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 140 70"
      fill="none">
      {/* 1. Emerald Green Confetti / Fluttering Banknotes Trail */}
      {/* Piece 1: Far Left Arching Ribbon */}
      <Path
        d="M 19 42 C 22 33 33 29 40 31 C 35 36 29 42 27 48 C 22 47 20 44 19 42 Z"
        fill="#14F195"
      />

      {/* Piece 2: Center-left Tile */}
      <Path
        d="M 43 47 L 52 43 L 56 49 L 47 54 Z"
        fill="#10B981"
      />

      {/* Piece 3: Large Center Bill */}
      <Path
        d="M 51 23 L 74 22 L 73 34 L 51 33 Z"
        fill="#14F195"
      />
      {/* Piece 3b: Lower Folded Shadow */}
      <Path
        d="M 61 33 L 78 29 L 75 40 L 62 43 Z"
        fill="#00D26A"
        opacity={0.85}
      />

      {/* Piece 4: Near Tail Flake */}
      <Path
        d="M 86 33 C 89 31 95 32 97 36 C 96 42 92 48 87 47 C 86 42 86 36 86 33 Z"
        fill="#14F195"
      />

      {/* 2. 3D Paper Airplane in Phantom Lavender */}
      {/* Dark Keel / Underside Shading */}
      <Path
        d="M 84 8 L 100 22 L 91 26 Z"
        fill="#4A3E8A"
      />
      {/* Right Wing Shadow Fold */}
      <Path
        d="M 91 26 L 110 25 L 100 22 Z"
        fill="#6C5CE7"
      />
      {/* Main Left Wing */}
      <Path
        d="M 130 3 L 84 8 L 100 22 Z"
        fill="#ABA0EE"
      />
      {/* Main Right Top Wing Highlight */}
      <Path
        d="M 130 3 L 100 22 L 110 25 Z"
        fill="#C5BAFF"
      />
    </Svg>
  );
}

export default SendEmptyAirplaneGraphic;

