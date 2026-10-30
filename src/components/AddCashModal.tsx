import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { TypographyFonts } from '@/constants/typography';

interface AddCashModalProps {
  visible: boolean;
  onClose: () => void;
  onCashAdded: (amount: number) => Promise<void> | void;
}

export function AddCashModal({
  visible,
  onClose,
  onCashAdded,
}: AddCashModalProps) {
  const [amountStr, setAmountStr] = useState<string>('0');

  if (!visible) return null;

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (amountStr.length <= 1) {
        setAmountStr('0');
      } else {
        setAmountStr(amountStr.slice(0, -1));
      }
      return;
    }

    if (key === '.') {
      if (!amountStr.includes('.')) {
        setAmountStr(amountStr + '.');
      }
      return;
    }

    if (amountStr.includes('.') && amountStr.split('.')[1].length >= 2) {
      return;
    }

    // Number keys
    if (amountStr === '0') {
      setAmountStr(key);
    } else {
      // Limit to 7 digits
      if (amountStr.replace(/[^0-9]/g, '').length < 7) {
        setAmountStr(amountStr + key);
      }
    }
  };

  const handlePreset = (val: number) => {
    setAmountStr(val.toString());
  };

  const formatDisplayAmount = (str: string) => {
    if (str === '0') return '$0';
    const parts = str.split('.');
    const integerPart = parts[0];
    const formattedInt = Number(integerPart).toLocaleString('en-US');
    if (parts.length > 1) {
      return `$${formattedInt}.${parts[1]}`;
    }
    return `$${formattedInt}`;
  };

  const numericVal = parseFloat(amountStr) || 0;
  const isReviewActive = numericVal > 0;

  const submitReview = async () => {
    try {
      await onCashAdded(numericVal);
      onClose();
      setAmountStr('0');
    } catch (error) {
      Alert.alert(
        'Deposit failed',
        error instanceof Error ? error.message : 'Unable to update your balance.'
      );
    }
  };

  const handleReview = () => {
    void submitReview();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Cash</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Center Main Money Display */}
        <View style={styles.moneyContainer}>
          <Text
            style={[
              styles.moneyText,
              amountStr.length > 5 ? styles.moneyTextScaled : null,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {formatDisplayAmount(amountStr)}
          </Text>
        </View>

        {/* Middle Section: Presets / Review Action */}
        <View style={styles.midSection}>
          {isReviewActive ? (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={handleReview}
              activeOpacity={0.85}>
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.presetsRow}>
              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => handlePreset(500)}
                activeOpacity={0.7}>
                <Text style={styles.presetChipText}>$500</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => handlePreset(1000)}
                activeOpacity={0.7}>
                <Text style={styles.presetChipText}>$1,000</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.presetChip}
                onPress={() => handlePreset(5000)}
                activeOpacity={0.7}>
                <Text style={styles.presetChipText}>$5,000</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Numeric Keypad */}
        <View style={styles.keypad}>
          <View style={styles.keypadRow}>
            {['1', '2', '3'].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keyBtn}
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.6}>
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['4', '5', '6'].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keyBtn}
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.6}>
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            {['7', '8', '9'].map((digit) => (
              <TouchableOpacity
                key={digit}
                style={styles.keyBtn}
                onPress={() => handleKeyPress(digit)}
                activeOpacity={0.6}>
                <Text style={styles.keyText}>{digit}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.keypadRow}>
            <TouchableOpacity
              style={styles.keyBtn}
              onPress={() => handleKeyPress('.')}
              activeOpacity={0.6}>
              <Text style={styles.keyText}>•</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keyBtn}
              onPress={() => handleKeyPress('0')}
              activeOpacity={0.6}>
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keyBtn}
              onPress={() => handleKeyPress('backspace')}
              activeOpacity={0.6}>
              <Ionicons name="backspace-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'ios' ? 52 : 24,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#202023',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerSpacer: {
    width: 36,
  },
  moneyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 140,
  },
  moneyText: {
    color: '#FFFFFF',
    fontSize: 58,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    fontFamily: TypographyFonts.medium,
    letterSpacing: -1.5,
    textAlign: 'center',
  },
  moneyTextScaled: {
    fontSize: 48,
  },
  midSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  presetsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
  },
  presetChip: {
    flex: 1,
    backgroundColor: '#14141E',
    borderWidth: 1,
    borderColor: '#222232',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetChipText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  reviewButton: {
    width: '100%',
    backgroundColor: '#9FA2FF',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  keypad: {
    width: '100%',
    gap: 16,
    paddingBottom: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  keyBtn: {
    width: 80,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
});
