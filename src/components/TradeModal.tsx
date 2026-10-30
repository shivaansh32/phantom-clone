import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';
import { TokenAvatar } from '@/components/TokenAvatar';
import { sendDeviceNotification } from '@/services/notificationService';

interface TradeModalProps {
  visible: boolean;
  onClose: () => void;
  solAmount?: number;
  cashBalance?: number;
  solPrice?: number;
  onExecuteSwap?: (fromAsset: 'SOL' | 'CASH', toAsset: 'SOL' | 'CASH', amount: number) => void;
}

interface SelectableAsset {
  symbol: string;
  name: string;
  balance: string;
  iconBg: string;
  iconType: string;
}

const TRADE_ASSETS: SelectableAsset[] = [
  { symbol: 'SOL', name: 'Solana', balance: '< 0.00001 SOL', iconBg: '#0A0A0E', iconType: 'sol' },
  { symbol: 'Cash', name: 'Cash', balance: '$0.00', iconBg: '#8B5CF6', iconType: 'cash' },
  { symbol: 'PSOL', name: 'Phantom SOL', balance: '$0.00', iconBg: '#331B58', iconType: 'sol' },
  { symbol: 'USDC', name: 'USD Coin', balance: '$0.00', iconBg: '#2775CA', iconType: 'usdc' },
  { symbol: 'BTC', name: 'Bitcoin', balance: '0.00 BTC', iconBg: '#F7931A', iconType: 'btc' },
  { symbol: 'ETH', name: 'Ethereum', balance: '0.00 ETH', iconBg: '#627EEA', iconType: 'eth' },
];

/**
 * 1:1 replica of Phantom Trade / Swap modal from video (Frames 00:12 - 00:25)
 */
export function TradeModal({
  visible,
  onClose,
  solAmount = 0,
  cashBalance = 0,
  solPrice = 100.76,
  onExecuteSwap,
}: TradeModalProps) {
  const insets = useSafeAreaInsets();
  const [payAsset, setPayAsset] = useState<SelectableAsset>(TRADE_ASSETS[0]);
  const [receiveAsset, setReceiveAsset] = useState<SelectableAsset>(TRADE_ASSETS[1]);
  const [payAmountStr, setPayAmountStr] = useState<string>('0');
  const [isPickingPayAsset, setIsPickingPayAsset] = useState<boolean>(false);
  const [isPickingReceiveAsset, setIsPickingReceiveAsset] = useState<boolean>(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('All');
  const [assetSearch, setAssetSearch] = useState<string>('');

  if (!visible) return null;

  const numPayAmount = parseFloat(payAmountStr) || 0;
  const receiveAmountStr =
    numPayAmount > 0
      ? payAsset.symbol === 'SOL'
        ? (numPayAmount * solPrice).toFixed(2)
        : (numPayAmount / solPrice).toFixed(6)
      : '0';

  const handleKeyPress = (key: string) => {
    if (key === 'backspace') {
      if (payAmountStr.length <= 1) {
        setPayAmountStr('0');
      } else {
        setPayAmountStr(payAmountStr.slice(0, -1));
      }
      return;
    }

    if (key === '.') {
      if (!payAmountStr.includes('.')) {
        setPayAmountStr(payAmountStr + '.');
      }
      return;
    }

    if (payAmountStr === '0') {
      setPayAmountStr(key);
    } else {
      if (payAmountStr.length < 12) {
        setPayAmountStr(payAmountStr + key);
      }
    }
  };

  const handleFlipAssets = () => {
    const temp = payAsset;
    setPayAsset(receiveAsset);
    setReceiveAsset(temp);
  };

  const handlePreset = (pct: number) => {
    if (payAsset.symbol === 'SOL') {
      const amt = Number((solAmount * pct).toFixed(6));
      setPayAmountStr(amt > 0 ? amt.toString() : '0');
    } else {
      const amt = Number((cashBalance * pct).toFixed(2));
      setPayAmountStr(amt > 0 ? amt.toString() : '0');
    }
  };

  const handleSwap = () => {
    if (numPayAmount <= 0) return;
    if (onExecuteSwap) {
      onExecuteSwap(
        payAsset.symbol === 'SOL' ? 'SOL' : 'CASH',
        receiveAsset.symbol === 'SOL' ? 'SOL' : 'CASH',
        numPayAmount
      );
    }
    sendDeviceNotification({
      title: 'Swap Executed',
      body: `Swapped ${numPayAmount} ${payAsset.symbol} for ${receiveAmountStr} ${receiveAsset.symbol}`,
    });
    setPayAmountStr('0');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.container,
            {
              paddingTop: Math.max(insets.top, 16),
              paddingBottom: Math.max(insets.bottom, 16),
            },
          ]}>
          {/* Header Row: (X)  Trade  (Tune) */}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.circleBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Trade</Text>

            <TouchableOpacity style={styles.circleBtn} activeOpacity={0.7}>
              <Ionicons name="options-outline" size={19} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Card 1: You Pay */}
          <View style={styles.swapCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardLabel}>You Pay</Text>
            </View>

            <View style={styles.cardMainRow}>
              <Text style={styles.amountDisplay} numberOfLines={1} adjustsFontSizeToFit>
                {payAmountStr}
              </Text>

              <TouchableOpacity
                style={styles.assetSelectorPill}
                onPress={() => setIsPickingPayAsset(true)}
                activeOpacity={0.8}>
                <TokenAvatar
                  symbol={payAsset.symbol}
                  iconType={payAsset.iconType}
                  iconBg={payAsset.iconBg}
                  size={24}
                />
                <Text style={styles.assetSelectorText}>{payAsset.symbol}</Text>
                <Ionicons name="chevron-down" size={14} color="#8E8E98" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardBottomRow}>
              <View style={styles.usdValueWrap}>
                <Text style={styles.usdValueText}>
                  ${((parseFloat(payAmountStr) || 0) * (payAsset.symbol === 'SOL' ? solPrice : 1)).toFixed(2)}
                </Text>
                <Ionicons name="swap-vertical" size={12} color="#8E8E98" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.balanceSub}>{payAsset.balance}</Text>
            </View>
          </View>

          {/* Middle Flip Button */}
          <View style={styles.flipBtnWrapper}>
            <TouchableOpacity style={styles.flipBtn} onPress={handleFlipAssets} activeOpacity={0.85}>
              <Ionicons name="swap-vertical" size={18} color="#000000" />
            </TouchableOpacity>
          </View>

          {/* Card 2: You Receive */}
          <View style={styles.swapCard}>
            <View style={styles.cardTopRow}>
              <Text style={styles.cardLabel}>You Receive</Text>
            </View>

            <View style={styles.cardMainRow}>
              <Text style={styles.amountDisplay} numberOfLines={1} adjustsFontSizeToFit>
                {receiveAmountStr}
              </Text>

              <TouchableOpacity
                style={styles.assetSelectorPill}
                onPress={() => setIsPickingReceiveAsset(true)}
                activeOpacity={0.8}>
                <TokenAvatar
                  symbol={receiveAsset.symbol}
                  iconType={receiveAsset.iconType}
                  iconBg={receiveAsset.iconBg}
                  size={24}
                />
                <Text style={styles.assetSelectorText}>{receiveAsset.symbol}</Text>
                <Ionicons name="chevron-down" size={14} color="#8E8E98" />
              </TouchableOpacity>
            </View>

            <View style={styles.cardBottomRow}>
              <View style={{ flex: 1 }} />
              <Text style={styles.balanceSub}>{receiveAsset.balance}</Text>
            </View>
          </View>

          {/* Percentage Presets Row */}
          <View style={styles.presetsRow}>
            {[
              { label: '25%', value: 0.25 },
              { label: '50%', value: 0.5 },
              { label: '100%', value: 1.0 },
            ].map((p) => (
              <TouchableOpacity
                key={p.label}
                style={styles.presetChip}
                onPress={() => handlePreset(p.value)}
                activeOpacity={0.75}>
                <Text style={styles.presetChipText}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Swap Trigger Button */}
          {numPayAmount > 0 && (
            <View style={styles.swapActionArea}>
              <TouchableOpacity
                style={[styles.swapBtn, numPayAmount > 0 && styles.swapBtnActive]}
                onPress={handleSwap}
                activeOpacity={0.85}>
                <Text style={[styles.swapBtnText, numPayAmount > 0 && styles.swapBtnTextActive]}>
                  Swap
                </Text>
              </TouchableOpacity>

              {/* Quote Unavailable Info Row from video frame 00:25 */}
              <View style={styles.quoteInfoRow}>
                <Text style={styles.quoteInfoText}>Quote unavailable</Text>
                <Ionicons name="information-circle-outline" size={14} color="#FBBF24" style={{ marginLeft: 4 }} />
              </View>
            </View>
          )}

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
                <Ionicons name="backspace-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Asset Selector Sub-Modal (Frames 00:15 / 00:18) */}
        {(isPickingPayAsset || isPickingReceiveAsset) && (
          <Modal transparent animationType="slide" visible={true}>
            <View style={styles.assetPickerOverlay}>
              <View
                style={[
                  styles.assetPickerContainer,
                  {
                    paddingTop: Math.max(insets.top, 16),
                    paddingBottom: Math.max(insets.bottom, 16),
                  },
                ]}>
                <View style={styles.pickerHeaderRow}>
                  <TouchableOpacity
                    style={styles.circleBtn}
                    onPress={() => {
                      setIsPickingPayAsset(false);
                      setIsPickingReceiveAsset(false);
                    }}>
                    <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>
                    {isPickingPayAsset ? 'You Pay' : 'You Receive'}
                  </Text>
                  <View style={{ width: 36 }} />
                </View>

                {/* Search Bar */}
                <View style={styles.pickerSearchWrap}>
                  <Ionicons name="search" size={17} color="#8E8E98" style={{ marginRight: 8 }} />
                  <TextInput
                    style={styles.pickerSearchInput}
                    placeholder="Search"
                    placeholderTextColor="#6E6E78"
                    value={assetSearch}
                    onChangeText={setAssetSearch}
                    autoCapitalize="none"
                  />
                </View>

                {/* Network Chips Carousel */}
                <View style={styles.pickerChipsRow}>
                  {['All', 'Solana', 'Ethereum', 'Bitcoin', 'Robinhood'].map((net) => {
                    const isSel = selectedNetwork === net;
                    return (
                      <TouchableOpacity
                        key={net}
                        style={[styles.pickerChip, isSel && styles.pickerChipActive]}
                        onPress={() => setSelectedNetwork(net)}>
                        <Text style={[styles.pickerChipText, isSel && styles.pickerChipTextActive]}>
                          {net}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Asset List */}
                <ScrollView style={{ flex: 1, marginTop: 12 }}>
                  {TRADE_ASSETS.map((asset) => {
                    const isCurrent =
                      (isPickingPayAsset && payAsset.symbol === asset.symbol) ||
                      (isPickingReceiveAsset && receiveAsset.symbol === asset.symbol);

                    return (
                      <TouchableOpacity
                        key={asset.symbol}
                        style={styles.assetPickerRow}
                        onPress={() => {
                          if (isPickingPayAsset) setPayAsset(asset);
                          if (isPickingReceiveAsset) setReceiveAsset(asset);
                          setIsPickingPayAsset(false);
                          setIsPickingReceiveAsset(false);
                        }}>
                        <TokenAvatar
                          symbol={asset.symbol}
                          iconType={asset.iconType}
                          iconBg={asset.iconBg}
                          size={38}
                        />
                        <View style={styles.assetPickerMeta}>
                          <Text style={styles.assetPickerName}>{asset.name}</Text>
                          <Text style={styles.assetPickerBalance}>{asset.balance}</Text>
                        </View>
                        {isCurrent && <Ionicons name="checkmark" size={20} color="#ABA0EE" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  swapCard: {
    backgroundColor: '#141416',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cardTopRow: {
    marginBottom: 6,
  },
  cardLabel: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.medium,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  amountDisplay: {
    color: '#FFFFFF',
    fontSize: 32,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    flex: 1,
    marginRight: 12,
  },
  assetSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#202028',
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  assetSelectorText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  usdValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usdValueText: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
  },
  balanceSub: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
  },
  flipBtnWrapper: {
    alignItems: 'center',
    marginVertical: -14,
    zIndex: 10,
  },
  flipBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000000',
  },
  presetsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 10,
  },
  presetChip: {
    backgroundColor: '#1A1A22',
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  presetChipText: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.semiBold,
  },
  swapActionArea: {
    marginVertical: 6,
  },
  swapBtn: {
    backgroundColor: '#222228',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swapBtnActive: {
    backgroundColor: '#ABA0EE',
  },
  swapBtnText: {
    color: '#555566',
    fontSize: 16,
    fontFamily: TypographyFonts.bold,
  },
  swapBtnTextActive: {
    color: '#000000',
  },
  quoteInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  quoteInfoText: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: TypographyFonts.medium,
  },
  keypad: {
    marginTop: 6,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 6,
  },
  keyBtn: {
    width: 64,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: TypographyFonts.medium,
  },
  assetPickerOverlay: {
    flex: 1,
    backgroundColor: '#000000',
  },
  assetPickerContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pickerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  pickerSearchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16161B',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 42,
    marginBottom: 12,
  },
  pickerSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.regular,
  },
  pickerChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  pickerChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#1A1A22',
  },
  pickerChipActive: {
    backgroundColor: '#FFFFFF',
  },
  pickerChipText: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.semiBold,
  },
  pickerChipTextActive: {
    color: '#000000',
  },
  assetPickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
  },
  assetPickerMeta: {
    marginLeft: 12,
    flex: 1,
  },
  assetPickerName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.bold,
  },
  assetPickerBalance: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    marginTop: 2,
  },
});

