import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';

interface QuickActionModalProps {
  visible: boolean;
  onClose: () => void;
  onActionSelect: (action: 'send' | 'receive' | 'deposit' | 'trade') => void;
}

/**
 * 1:1 replica of the Floating Speed-Dial Menu from Phantom video
 * (Frames 00:01, 00:02, 00:10, 00:11, 00:27)
 */
export function QuickActionModal({
  visible,
  onClose,
  onActionSelect,
}: QuickActionModalProps) {
  const insets = useSafeAreaInsets();
  const bottomOffset =
    Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16) +
    (Platform.OS === 'android' ? 10 : 0);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Dim Backdrop */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Floating Speed-Dial Actions Stack positioned right above the FAB */}
        <View style={[styles.floatingStack, { bottom: bottomOffset }]}>
          {/* 1. Send Action */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              onActionSelect('send');
            }}
            activeOpacity={0.8}>
            <Text style={styles.actionLabel}>Send</Text>
            <View style={styles.actionIconCircle}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M21 3L3 10.5L10.5 14.5L14.5 21L21 3Z"
                  stroke="#000000"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </TouchableOpacity>

          {/* 2. Receive Action */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              onActionSelect('receive');
            }}
            activeOpacity={0.8}>
            <Text style={styles.actionLabel}>Receive</Text>
            <View style={styles.actionIconCircle}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                <Rect x="3" y="3" width="7" height="7" rx="1.5" stroke="#000000" strokeWidth="2.2" />
                <Rect x="14" y="3" width="7" height="7" rx="1.5" stroke="#000000" strokeWidth="2.2" />
                <Rect x="3" y="14" width="7" height="7" rx="1.5" stroke="#000000" strokeWidth="2.2" />
                <Rect x="14" y="14" width="7" height="7" rx="1.5" stroke="#000000" strokeWidth="2.2" />
              </Svg>
            </View>
          </TouchableOpacity>

          {/* 3. Deposit Action */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              onActionSelect('deposit');
            }}
            activeOpacity={0.8}>
            <Text style={styles.actionLabel}>Deposit</Text>
            <View style={styles.actionIconCircle}>
              <Text style={styles.dollarIconText}>$</Text>
            </View>
          </TouchableOpacity>

          {/* 4. Trade Action */}
          <TouchableOpacity
            style={styles.actionRow}
            onPress={() => {
              onClose();
              onActionSelect('trade');
            }}
            activeOpacity={0.8}>
            <Text style={styles.actionLabel}>Trade</Text>
            <View style={styles.actionIconCircle}>
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M17 4L21 8L17 12M21 8H3"
                  stroke="#000000"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M7 20L3 16L7 12M3 16H21"
                  stroke="#000000"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>
          </TouchableOpacity>

          {/* 5. Close FAB button (replaces + with ✕ in same spot) */}
          <TouchableOpacity
            style={styles.closeFab}
            onPress={onClose}
            activeOpacity={0.85}>
            <Ionicons name="close" size={26} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  floatingStack: {
    position: 'absolute',
    right: 16,
    alignItems: 'flex-end',
    gap: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.3,
    marginRight: 14,
  },
  actionIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ABA0EE', // Signature Phantom lilac
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 8,
  },
  dollarIconText: {
    color: '#000000',
    fontSize: 22,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    marginTop: -1,
  },
  closeFab: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
});
