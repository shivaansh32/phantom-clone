import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAddCash: () => void;
  onSelectBuyCrypto?: () => void;
  onSelectReceiveCrypto?: () => void;
}

/**
 * 1:1 replica of Phantom Add Cash card icon
 * Clean rounded card with top stripe in dark navy/black
 */
function AddCashCardIcon({ size = 22, color = '#121026' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 0.72} viewBox="0 0 22 16" fill="none">
      <Rect
        x="1.5"
        y="1.5"
        width="19"
        height="13"
        rx="3"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M 1.5 5.5 H 20.5"
        stroke={color}
        strokeWidth="1.8"
      />
      <Path
        d="M 4.5 10.5 H 8.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 1:1 replica of Phantom Buy Crypto overlapping circles icon
 */
function BuyCryptoCirclesIcon({ size = 22, color = '#121026' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle
        cx="9.5"
        cy="9.5"
        r="5.2"
        stroke={color}
        strokeWidth="1.9"
      />
      <Circle
        cx="14.5"
        cy="14.5"
        r="5.2"
        stroke={color}
        strokeWidth="1.9"
      />
    </Svg>
  );
}

/**
 * 1:1 replica of Phantom Receive Crypto proprietary icon:
 * 3 circular finder targets with center dots, and 4 QR data modules at bottom-right
 */
function ReceiveCryptoQrIcon({ size = 22, color = '#121026' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top-left circular target */}
      <Circle cx="6.5" cy="6.5" r="4.2" stroke={color} strokeWidth="1.8" />
      <Circle cx="6.5" cy="6.5" r="1.4" fill={color} />

      {/* Top-right circular target */}
      <Circle cx="17.5" cy="6.5" r="4.2" stroke={color} strokeWidth="1.8" />
      <Circle cx="17.5" cy="6.5" r="1.4" fill={color} />

      {/* Bottom-left circular target */}
      <Circle cx="6.5" cy="17.5" r="4.2" stroke={color} strokeWidth="1.8" />
      <Circle cx="6.5" cy="17.5" r="1.4" fill={color} />

      {/* Bottom-right QR data dots */}
      <Circle cx="15.5" cy="15.5" r="1.5" fill={color} />
      <Circle cx="19" cy="15.5" r="1.5" fill={color} />
      <Circle cx="15.5" cy="19" r="1.5" fill={color} />
      <Circle cx="19" cy="19" r="1.5" fill={color} />
    </Svg>
  );
}

export function DepositModal({
  visible,
  onClose,
  onSelectAddCash,
  onSelectBuyCrypto,
  onSelectReceiveCrypto,
}: DepositModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          {/* Header with left circular close button and centered title */}
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={17} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.sheetTitle}>Deposit</Text>

            {/* Spacer to balance title centering */}
            <View style={styles.headerSpacer} />
          </View>

          {/* 3 Option cards matching user screenshot 1:1 */}
          <View style={styles.optionsList}>
            {/* Option 1: Add Cash */}
            <TouchableOpacity
              style={styles.optionItem}
              activeOpacity={0.75}
              onPress={() => {
                onClose();
                onSelectAddCash();
              }}>
              <View style={styles.optionIconCircle}>
                <AddCashCardIcon size={20} color="#121026" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Add Cash</Text>
                <Text style={styles.optionSubtitle}>With Google Pay, debit, or credit card</Text>
              </View>
            </TouchableOpacity>

            {/* Option 2: Buy Crypto */}
            <TouchableOpacity
              style={styles.optionItem}
              activeOpacity={0.75}
              onPress={() => {
                onClose();
                if (onSelectBuyCrypto) onSelectBuyCrypto();
              }}>
              <View style={styles.optionIconCircle}>
                <BuyCryptoCirclesIcon size={22} color="#121026" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Buy Crypto</Text>
                <Text style={styles.optionSubtitle}>Top trending tokens with Google Pay</Text>
              </View>
            </TouchableOpacity>

            {/* Option 3: Receive Crypto */}
            <TouchableOpacity
              style={styles.optionItem}
              activeOpacity={0.75}
              onPress={() => {
                onClose();
                if (onSelectReceiveCrypto) onSelectReceiveCrypto();
              }}>
              <View style={styles.optionIconCircle}>
                <ReceiveCryptoQrIcon size={20} color="#121026" />
              </View>
              <View style={styles.optionTextCol}>
                <Text style={styles.optionTitle}>Receive Crypto</Text>
                <Text style={styles.optionSubtitle}>Transfer crypto and cash</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sheet: {
    backgroundColor: '#0F0F12',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 42 : 36,
    borderTopWidth: 1,
    borderTopColor: '#1A1A20',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 36,
  },
  optionsList: {
    gap: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141417',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
  },
  optionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ABA0EE', // Exact pastel lavender/periwinkle from screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextCol: {
    flex: 1,
    marginLeft: 14,
    gap: 3,
  },
  optionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    letterSpacing: -0.2,
  },
  optionSubtitle: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});
