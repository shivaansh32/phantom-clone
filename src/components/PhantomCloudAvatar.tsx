import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, Rect, G, Defs, ClipPath, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export type AvatarType = 'cloud' | 'ghost' | 'solana' | 'chimp' | 'alien' | 'crown' | 'whale';

export interface AvatarOption {
  id: AvatarType;
  name: string;
  description: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: 'cloud', name: 'Lavender Cloud', description: 'Classic Phantom shades & blue cloud' },
  { id: 'ghost', name: 'Phantom Ghost', description: 'Official Phantom spectral companion' },
  { id: 'solana', name: 'Solana Neon', description: 'Electric cyan-violet ecosystem badge' },
  { id: 'chimp', name: 'Immune Chimp', description: 'Cyber chimp with dark sunglasses' },
  { id: 'alien', name: 'Cyber Alien', description: 'Deep space visitor with glowing visor' },
  { id: 'crown', name: 'Golden Whale', description: 'Royal gold crown on midnight violet' },
  { id: 'whale', name: 'Deep Sea Whale', description: 'Deep ocean voyager in neon azure' },
];

interface PhantomCloudAvatarProps {
  size?: number;
  avatarId?: AvatarType | string;
  customUri?: string | null;
  showEditBadge?: boolean;
  onEditPress?: () => void;
}

export function PhantomCloudAvatar({
  size = 38,
  avatarId = 'cloud',
  customUri,
  showEditBadge = false,
  onEditPress,
}: PhantomCloudAvatarProps) {
  const badgeSize = Math.max(18, Math.round(size * 0.32));

  // Render custom user uploaded/picked image if available
  if (customUri) {
    return (
      <View style={[styles.wrapper, { width: size, height: size }]}>
        <Image
          source={{ uri: customUri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
          resizeMode="cover"
        />
        {showEditBadge && (
          <TouchableOpacity
            style={[
              styles.editBadge,
              {
                width: badgeSize,
                height: badgeSize,
                borderRadius: badgeSize / 2,
                bottom: 0,
                right: 0,
              },
            ]}
            onPress={onEditPress}
            activeOpacity={0.8}>
            <Ionicons name="camera" size={badgeSize * 0.58} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  const renderVectorGraphic = () => {
    switch (avatarId) {
      case 'ghost':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Circle cx="19" cy="19" r="19" fill="#ABA0EE" />
            {/* White Ghost */}
            <G transform="translate(8, 7)">
              <Path
                d="M 11 2 C 5.5 2 2 6.5 2 12 L 2 21 C 2 22.5 3.5 23.5 5 22 C 6.5 20.5 8.5 20.5 10 22 C 11.5 23.5 13.5 23.5 15 22 C 16.5 20.5 18 21.5 19 22.5 C 19.8 21.5 20 20.5 20 19 L 20 12 C 20 6.5 16.5 2 11 2 Z"
                fill="#FFFFFF"
              />
              <Circle cx="8" cy="10" r="1.8" fill="#121026" />
              <Circle cx="14" cy="10" r="1.8" fill="#121026" />
            </G>
          </Svg>
        );

      case 'solana':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Defs>
              <LinearGradient id="solAvatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#14F195" />
                <Stop offset="100%" stopColor="#9945FF" />
              </LinearGradient>
            </Defs>
            <Circle cx="19" cy="19" r="19" fill="#0C0C12" />
            <G transform="translate(8, 9.5)">
              <Path
                d="M 3.5 3.5 L 18 3.5 L 14.5 7 L 0 7 Z"
                fill="url(#solAvatarGrad)"
              />
              <Path
                d="M 0 9.5 L 14.5 9.5 L 18 13 L 3.5 13 Z"
                fill="url(#solAvatarGrad)"
              />
              <Path
                d="M 3.5 15.5 L 18 15.5 L 14.5 19 L 0 19 Z"
                fill="url(#solAvatarGrad)"
              />
            </G>
          </Svg>
        );

      case 'chimp':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Circle cx="19" cy="19" r="19" fill="#5838B2" />
            {/* Chimp Face & Sunglasses */}
            <G transform="translate(6, 6)">
              {/* Ears */}
              <Circle cx="4" cy="13" r="3.5" fill="#3B227B" />
              <Circle cx="22" cy="13" r="3.5" fill="#3B227B" />
              <Circle cx="23" cy="13" r="1.5" fill="#FFD700" />
              {/* Head */}
              <Circle cx="13" cy="13" r="9" fill="#2E1B5B" />
              {/* Muzzle */}
              <Rect x="7.5" y="13.5" width="11" height="7" rx="3.5" fill="#472E85" />
              {/* Sunglasses */}
              <Rect x="5" y="9.5" width="16" height="4.5" rx="1.5" fill="#111116" />
              <Rect x="6.5" y="10.5" width="4.5" height="2.5" rx="0.5" fill="#000000" />
              <Rect x="14" y="10.5" width="4.5" height="2.5" rx="0.5" fill="#000000" />
              <Rect x="7" y="11" width="1.5" height="1.5" fill="#FFFFFF" opacity={0.4} />
            </G>
          </Svg>
        );

      case 'alien':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Circle cx="19" cy="19" r="19" fill="#1B122C" />
            {/* Cyber Alien Face */}
            <G transform="translate(8, 7)">
              <Path
                d="M 11 2 C 5 2 2 7 3 14 C 4 19 8 23 11 23 C 14 23 18 19 19 14 C 20 7 17 2 11 2 Z"
                fill="#2E1D4A"
              />
              {/* Visor */}
              <Path
                d="M 4 10 Q 11 14 18 10 L 17 14 Q 11 18 5 14 Z"
                fill="#14F195"
              />
              {/* Glow highlight */}
              <Circle cx="11" cy="6" r="1.5" fill="#9945FF" />
            </G>
          </Svg>
        );

      case 'crown':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Circle cx="19" cy="19" r="19" fill="#181432" />
            {/* Golden Crown */}
            <G transform="translate(7.5, 9)">
              <Path
                d="M 2 17 L 3 6 L 8 11 L 11.5 2 L 15 11 L 20 6 L 21 17 Z"
                fill="#FFB800"
              />
              <Rect x="2" y="16.5" width="19" height="3" rx="1" fill="#FFA000" />
              <Circle cx="3" cy="5" r="1.2" fill="#FFFFFF" />
              <Circle cx="11.5" cy="1.5" r="1.5" fill="#FFFFFF" />
              <Circle cx="20" cy="5" r="1.2" fill="#FFFFFF" />
              <Circle cx="7" cy="18" r="1" fill="#9945FF" />
              <Circle cx="11.5" cy="18" r="1" fill="#14F195" />
              <Circle cx="16" cy="18" r="1" fill="#FF2B4D" />
            </G>
          </Svg>
        );

      case 'whale':
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Defs>
              <LinearGradient id="whaleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#0EA5E9" />
                <Stop offset="100%" stopColor="#2563EB" />
              </LinearGradient>
            </Defs>
            <Circle cx="19" cy="19" r="19" fill="#07172C" />
            {/* Whale */}
            <G transform="translate(6, 9)">
              <Path
                d="M 21 12 C 18 12 15 7 10 7 C 4 7 1 11 1 14 C 1 17 4 19 9 19 C 16 19 20 15 25 18 L 24 13 L 26 8 C 24 9.5 22.5 12 21 12 Z"
                fill="url(#whaleGrad)"
              />
              <Circle cx="5" cy="13" r="1" fill="#FFFFFF" />
            </G>
          </Svg>
        );

      case 'cloud':
      default:
        return (
          <Svg width={size} height={size} viewBox="0 0 38 38">
            <Defs>
              <ClipPath id="circleClipDefault">
                <Circle cx="19" cy="19" r="19" />
              </ClipPath>
            </Defs>

            {/* Base Authentic Phantom Yellow Circle */}
            <Circle cx="19" cy="19" r="19" fill="#FFD54F" />

            <G clipPath="url(#circleClipDefault)">
              {/* Cute Puffy White Cloud in top-left */}
              <G transform="translate(3, 4)">
                <Path
                  d="M 5 9.5 
                     C 3.5 9.5 2 8 2 6.5 
                     C 2 5.2 3 4.2 4.2 4 
                     C 4.6 2.3 6.2 1 8.2 1 
                     C 10.5 1 12.3 2.5 12.8 4.6 
                     C 13.2 4.4 13.7 4.3 14.2 4.3 
                     C 16 4.3 17.5 5.8 17.5 7.6 
                     C 17.5 9.4 16 9.5 14.5 9.5 Z"
                  fill="#FFFFFF"
                />
                <Path
                  d="M 5 9 C 7 8 12 8 14 9"
                  stroke="#FFF2B8"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  fill="none"
                />
              </G>

              {/* Blue Companion Creature in lower-right */}
              <G transform="translate(14, 15)">
                {/* Round Blue Body */}
                <Circle cx="11" cy="11" r="11" fill="#4B88E8" />

                {/* Left squint eye */}
                <Path
                  d="M 6.5 9.5 L 9 11.5 L 6.5 13.5"
                  stroke="#1E325A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Right squint eye */}
                <Path
                  d="M 15.5 9.5 L 13 11.5 L 15.5 13.5"
                  stroke="#1E325A"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

                {/* Cute smile */}
                <Path
                  d="M 10 13 Q 11 14.2 12 13"
                  stroke="#1E325A"
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  fill="none"
                />

                {/* Pink Blush Cheeks */}
                <Circle cx="5" cy="12.5" r="1.5" fill="#FF8BA7" opacity={0.8} />
                <Circle cx="17" cy="12.5" r="1.5" fill="#FF8BA7" opacity={0.8} />
              </G>
            </G>
          </Svg>
        );
    }
  };

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {renderVectorGraphic()}

      {showEditBadge && (
        <TouchableOpacity
          style={[
            styles.editBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: 0,
              right: 0,
            },
          ]}
          onPress={onEditPress}
          activeOpacity={0.8}>
          <Ionicons name="camera" size={badgeSize * 0.55} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    backgroundColor: '#6C48DA',
    borderWidth: 2,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
