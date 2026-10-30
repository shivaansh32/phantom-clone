import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Dimensions,
  Animated,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TypographyFonts } from '@/constants/typography';
import { TokenAvatar } from './TokenAvatar';
import { SendEmptyAirplaneGraphic } from './SendEmptyAirplaneGraphic';
import { sendDeviceNotification } from '@/services/notificationService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * 4-corner bracket QR viewfinder scanning icon
 * Sampled 1:1 from Phantom recipient search bar
 */
function QrViewfinderIcon({ size = 18, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path
        d="M 2 6.5 V 4 C 2 2.9 2.9 2 4 2 H 6.5"
        stroke={color}
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <Path
        d="M 13.5 2 H 16 C 17.1 2 18 2.9 18 4 V 6.5"
        stroke={color}
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <Path
        d="M 18 13.5 V 16 C 18 17.1 17.1 18 16 18 H 13.5"
        stroke={color}
        strokeWidth="1.85"
        strokeLinecap="round"
      />
      <Path
        d="M 6.5 18 H 4 C 2.9 18 2 17.1 2 16 V 13.5"
        stroke={color}
        strokeWidth="1.85"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/**
 * 1:1 White Phantom Ghost Silhouette on Lavender Badge for Cash
 */
function CashGhostAvatar({ size = 38 }: { size?: number }) {
  const iconSize = size * 0.62;
  return (
    <View
      style={[
        styles.cashGhostCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}>
      <Svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 1024 1024"
        fill="none">
        <Path
          d="M 594.3 289.8 L 566.0 295.6 L 538.7 304.0 L 512.3 314.7 L 486.9 327.4 L 462.4 341.9 L 438.8 358.0 L 416.2 375.4 L 394.4 393.9 L 373.6 413.3 L 353.8 433.7 L 335.1 454.9 L 317.6 477.1 L 301.4 500.2 L 286.5 524.2 L 273.0 549.1 L 261.1 574.8 L 251.2 601.4 L 244.4 628.8 L 242.0 656.9 L 245.3 685.5 L 255.4 711.4 L 273.4 730.1 L 300.4 737.2 L 333.1 732.3 L 360.8 722.9 L 382.6 710.1 L 404.4 691.3 L 426.2 668.9 L 445.1 651.1 L 453.9 665.8 L 463.5 694.1 L 488.4 707.0 L 516.6 704.8 L 543.1 695.3 L 567.3 680.8 L 588.7 656.5 L 605.7 650.0 L 622.7 669.2 L 645.6 674.6 L 671.4 667.7 L 696.7 652.5 L 718.3 632.3 L 735.5 609.3 L 749.0 584.2 L 759.8 557.9 L 768.6 531.1 L 775.4 504.0 L 780.0 476.0 L 782.0 446.9 L 780.9 417.0 L 775.9 387.8 L 766.0 360.8 L 750.7 337.2 L 730.7 317.6 L 707.0 302.5 L 680.6 292.4 L 652.4 287.4 L 623.3 286.8 L 594.3 289.8 Z M 651.3 436.0 a 33.4 33.4 0 1 0 66.9 0 a 33.4 33.4 0 1 0 -66.9 0 Z M 564.6 436.0 a 33.4 33.4 0 1 0 66.9 0 a 33.4 33.4 0 1 0 -66.9 0 Z"
          fill="#FFFFFF"
          fillRule="evenodd"
        />
      </Svg>
    </View>
  );
}

const NETWORKS = ['All', 'Solana', 'Ethereum', 'Bitcoin', 'Robinhood'];

export interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  solAmount: number;
  solPrice: number;
  cashBalance: number;
  onSendCompleted?: (amount: number, recipient: string, asset: 'SOL' | 'CASH') => void;
}

export function SendModal({
  visible,
  onClose,
  solAmount,
  solPrice,
  cashBalance,
  onSendCompleted,
}: SendModalProps) {
  const insets = useSafeAreaInsets();

  // Navigation steps: 'asset' -> 'recipient' -> 'amount'
  const [step, setStep] = useState<'asset' | 'recipient' | 'amount'>('asset');
  const [selectedAsset, setSelectedAsset] = useState<'SOL' | 'CASH'>('SOL');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('All');
  const [assetSearch, setAssetSearch] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [sendAmountInput, setSendAmountInput] = useState<string>('0');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  const recipientInputRef = useRef<any>(null);
  const keyboardAnim = useRef(new Animated.Value(0)).current;

  // Track keyboard height to dock the input bar smoothly above soft keyboard on both Android & iOS
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      setIsKeyboardOpen(true);
      const height = e.endCoordinates?.height || 0;
      const offset = Platform.OS === 'ios' ? Math.max(0, height - insets.bottom + 6) : height;

      Animated.timing(keyboardAnim, {
        toValue: offset,
        duration: Platform.OS === 'ios' ? (e.duration || 250) : 120,
        useNativeDriver: false,
      }).start();
    };

    const onHide = (e: any) => {
      setIsKeyboardOpen(false);
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? (e?.duration || 200) : 120,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [insets.bottom]);

  // Reset state on open
  useEffect(() => {
    if (visible) {
      setStep('asset');
      setSelectedNetwork('All');
      setAssetSearch('');
      setRecipient('');
      setSendAmountInput('0');
      setIsSending(false);
      keyboardAnim.setValue(0);
      setIsKeyboardOpen(false);
    }
  }, [visible]);

  // Focus input when entering recipient step
  useEffect(() => {
    if (step === 'recipient') {
      const t = setTimeout(() => {
        recipientInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(t);
    } else {
      Keyboard.dismiss();
    }
  }, [step]);

  const solHoldingUsd = solAmount * (solPrice > 0 ? solPrice : 100.7606);

  const handleSelectSol = () => {
    setSelectedAsset('SOL');
    setStep('recipient');
  };

  const handleSelectCash = () => {
    setSelectedAsset('CASH');
    setStep('recipient');
  };

  const handleBack = () => {
    Keyboard.dismiss();
    if (step === 'amount') {
      setStep('recipient');
    } else if (step === 'recipient') {
      setStep('asset');
    } else {
      onClose();
    }
  };

  const handlePaste = async () => {
    // Paste realistic Solana address
    const demoSolAddress = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    setRecipient(demoSolAddress);
  };

  const handleScanQR = () => {
    Alert.alert(
      'Scan QR Code',
      'Point your camera at a Solana QR code or wallet address.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Use Demo QR',
          onPress: () => {
            setRecipient('phantom_vault.sol');
          },
        },
      ]
    );
  };

  const handleProceedToAmount = () => {
    if (!recipient.trim()) {
      Alert.alert('Recipient Required', 'Please enter a wallet address, domain, or @username.');
      return;
    }
    Keyboard.dismiss();
    setStep('amount');
  };

  // Numerical Keypad for Amount
  const handleKeyPress = (val: string) => {
    if (val === 'back') {
      if (sendAmountInput.length <= 1) {
        setSendAmountInput('0');
      } else {
        setSendAmountInput((prev) => prev.slice(0, -1));
      }
      return;
    }

    if (val === '.') {
      if (!sendAmountInput.includes('.')) {
        setSendAmountInput((prev) => prev + '.');
      }
      return;
    }

    if (sendAmountInput === '0') {
      setSendAmountInput(val);
    } else {
      if (sendAmountInput.length < 9) {
        setSendAmountInput((prev) => prev + val);
      }
    }
  };

  const parsedAmount = parseFloat(sendAmountInput) || 0;
  const maxAvailable = selectedAsset === 'SOL' ? solAmount : cashBalance;

  const handleSetMax = () => {
    if (selectedAsset === 'SOL') {
      setSendAmountInput(solAmount.toFixed(4));
    } else {
      setSendAmountInput(cashBalance.toFixed(2));
    }
  };

  const handleExecuteSend = async () => {
    if (parsedAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount to send.');
      return;
    }

    if (parsedAmount > maxAvailable) {
      Alert.alert(
        'Insufficient Balance',
        `You have ${maxAvailable.toFixed(4)} ${selectedAsset} available.`
      );
      return;
    }

    setIsSending(true);

    try {
      // Simulate network broadcast
      await new Promise((r) => setTimeout(r, 700));

      // Trigger actual device push notification
      const shortRecipient =
        recipient.length > 12
          ? `${recipient.slice(0, 4)}...${recipient.slice(-4)}`
          : recipient;

      await sendDeviceNotification({
        title: 'Transaction Sent',
        body: `Sent ${parsedAmount} ${selectedAsset} to ${shortRecipient}`,
      });

      if (onSendCompleted) {
        onSendCompleted(parsedAmount, recipient, selectedAsset);
      }

      setIsSending(false);
      onClose();
    } catch {
      setIsSending(false);
      onClose();
    }
  };

  // Filter assets based on search query and network chip
  const showCash =
    (selectedNetwork === 'All' || selectedNetwork.toLowerCase() === 'cash') &&
    (assetSearch === '' || 'cash'.includes(assetSearch.toLowerCase()));

  const showSol =
    (selectedNetwork === 'All' || selectedNetwork.toLowerCase() === 'solana') &&
    (assetSearch === '' ||
      'sol'.includes(assetSearch.toLowerCase()) ||
      'solana'.includes(assetSearch.toLowerCase()));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, 12),
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}>
        {/* ========================================================================= */}
        {/* STEP 1: ASSET SELECTION (1:1 replica of Video Frame 06.0s)                */}
        {/* ========================================================================= */}
        {step === 'asset' && (
          <View style={styles.contentWrap}>
            {/* Top Navigation Header: (X) Send */}
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityLabel="Close Send">
                <Ionicons name="close" size={19} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Send</Text>
            </View>

            {/* Rounded Pill Search Bar */}
            <View style={styles.searchBarWrapper}>
              <Ionicons name="search" size={17} color="#8E8E98" style={{ marginRight: 9 }} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#6E6E78"
                value={assetSearch}
                onChangeText={setAssetSearch}
                autoCapitalize="none"
              />
              {assetSearch.length > 0 && (
                <TouchableOpacity onPress={() => setAssetSearch('')}>
                  <Ionicons name="close-circle" size={16} color="#6E6E78" />
                </TouchableOpacity>
              )}
            </View>

            {/* Horizontal Network Filter Pills Carousel */}
            <View style={styles.carouselWrapper}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScroll}>
                {NETWORKS.map((network) => {
                  const isActive = selectedNetwork === network;
                  return (
                    <TouchableOpacity
                      key={network}
                      onPress={() => setSelectedNetwork(network)}
                      style={[styles.networkPill, isActive && styles.networkPillActive]}
                      activeOpacity={0.75}>
                      <Text
                        style={[
                          styles.networkPillText,
                          isActive && styles.networkPillTextActive,
                        ]}>
                        {network}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Sendable Asset List */}
            <ScrollView style={styles.assetListScroll} showsVerticalScrollIndicator={false}>
              {/* Row 1: Cash */}
              {showCash && (
                <TouchableOpacity
                  style={styles.assetRow}
                  onPress={handleSelectCash}
                  activeOpacity={0.7}>
                  <CashGhostAvatar size={38} />
                  <View style={styles.assetInfoCol}>
                    <Text style={styles.assetTitle}>Cash</Text>
                    <Text style={styles.assetSub}>${cashBalance.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              )}

              {/* Row 2: SOL Solana */}
              {showSol && (
                <TouchableOpacity
                  style={styles.assetRow}
                  onPress={handleSelectSol}
                  activeOpacity={0.7}>
                  <TokenAvatar symbol="SOL" size={38} iconBg="#000000" />
                  <View style={styles.assetInfoCol}>
                    <View style={styles.assetTitleRow}>
                      <Text style={styles.assetTicker}>SOL</Text>
                      <Text style={styles.assetNameMuted}>Solana</Text>
                    </View>
                    <Text style={styles.assetSub}>
                      ${solHoldingUsd.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: RECIPIENT ADDRESS / USERNAME (1:1 replica of Video Frame 08.0s)   */}
        {/* ========================================================================= */}
        {step === 'recipient' && (
          <View style={styles.contentWrap}>
            {/* Header: (‹) Send (+) */}
            <View style={styles.headerRowSpaceBetween}>
              <View style={styles.headerLeftGroup}>
                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={handleBack}
                  activeOpacity={0.7}
                  accessibilityLabel="Back to assets">
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Send</Text>
              </View>

              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() =>
                  Alert.alert('Contacts', 'Save and manage frequently used wallet contacts.')
                }
                activeOpacity={0.7}
                accessibilityLabel="Add Contact">
                <Ionicons name="add" size={21} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Center Empty State with Paper Airplane & Confetti Illustration */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
              <View
                style={[
                  styles.emptyStateContainer,
                  isKeyboardOpen && styles.emptyStateContainerKeyboard,
                ]}>
                <SendEmptyAirplaneGraphic
                  width={isKeyboardOpen ? 96 : 124}
                  height={isKeyboardOpen ? 48 : 62}
                />
                <Text
                  style={[
                    styles.emptyStateTitle,
                    isKeyboardOpen && styles.emptyStateTitleKeyboard,
                  ]}>
                  No recent sends
                </Text>
                <Text
                  style={[
                    styles.emptyStateBody,
                    isKeyboardOpen && styles.emptyStateBodyKeyboard,
                  ]}
                  numberOfLines={isKeyboardOpen ? 2 : undefined}>
                  You can search a username and wallet or create a contact or bank account.
                </Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Bottom Floating Pill Search Bar (Smoothly docks directly above Soft Keyboard) */}
            <Animated.View style={[styles.bottomDockContainer, { marginBottom: keyboardAnim }]}>
              <View style={styles.dockedInputBar}>
                <Ionicons name="search" size={18} color="#8E8E98" style={{ marginRight: 8 }} />
                <TextInput
                  ref={recipientInputRef}
                  style={styles.recipientInput}
                  placeholder="@username or wallet"
                  placeholderTextColor="#5A5A66"
                  value={recipient}
                  onChangeText={setRecipient}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleProceedToAmount}
                />
                <View style={styles.inputRightActions}>
                  <TouchableOpacity
                    onPress={handleScanQR}
                    style={styles.scanBtn}
                    activeOpacity={0.7}
                    accessibilityLabel="Scan QR">
                    <QrViewfinderIcon size={17} color="#FFFFFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePaste}
                    style={styles.pasteBtn}
                    activeOpacity={0.75}
                    accessibilityLabel="Paste address">
                    <Text style={styles.pasteText}>Paste</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Proceed Action Pill if recipient is entered */}
              {recipient.trim().length > 3 && (
                <TouchableOpacity
                  style={styles.proceedPillBtn}
                  onPress={handleProceedToAmount}
                  activeOpacity={0.8}>
                  <Text style={styles.proceedPillText}>Next</Text>
                  <Ionicons name="arrow-forward" size={17} color="#121026" />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SEND AMOUNT & CONFIRMATION                                        */}
        {/* ========================================================================= */}
        {step === 'amount' && (
          <View style={styles.contentWrap}>
            {/* Header: (‹) Send Asset */}
            <View style={styles.headerRowSpaceBetween}>
              <View style={styles.headerLeftGroup}>
                <TouchableOpacity
                  style={styles.circleBtn}
                  onPress={handleBack}
                  activeOpacity={0.7}>
                  <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                  Send {selectedAsset === 'SOL' ? 'Solana' : 'Cash'}
                </Text>
              </View>

              <TouchableOpacity style={styles.maxChip} onPress={handleSetMax} activeOpacity={0.8}>
                <Text style={styles.maxChipText}>MAX</Text>
              </TouchableOpacity>
            </View>

            {/* Recipient Pill Preview */}
            <View style={styles.recipientBadgeRow}>
              <Text style={styles.toLabel}>To: </Text>
              <Text style={styles.toAddress} numberOfLines={1}>
                {recipient}
              </Text>
            </View>

            {/* Large Amount Display */}
            <View style={styles.amountDisplayContainer}>
              <Text style={styles.amountHeroText}>
                {selectedAsset === 'CASH' ? `$${sendAmountInput}` : `${sendAmountInput} SOL`}
              </Text>
              <Text style={styles.amountConvertedSub}>
                {selectedAsset === 'SOL'
                  ? `≈ $${(parsedAmount * (solPrice > 0 ? solPrice : 100.7606)).toFixed(2)} USD`
                  : `Available: $${cashBalance.toFixed(2)}`}
              </Text>
            </View>

            {/* Action Button: Send Now */}
            <TouchableOpacity
              style={[styles.sendSubmitBtn, isSending && styles.sendSubmitBtnDisabled]}
              onPress={handleExecuteSend}
              disabled={isSending}
              activeOpacity={0.85}>
              <Text style={styles.sendSubmitText}>
                {isSending ? 'Sending Transaction...' : `Send ${sendAmountInput} ${selectedAsset}`}
              </Text>
            </TouchableOpacity>

            {/* Numerical Keypad */}
            <View style={styles.keypadContainer}>
              {[
                ['1', '2', '3'],
                ['4', '5', '6'],
                ['7', '8', '9'],
                ['.', '0', 'back'],
              ].map((row, rIdx) => (
                <View key={rIdx} style={styles.keypadRow}>
                  {row.map((k) => (
                    <TouchableOpacity
                      key={k}
                      style={styles.keypadKey}
                      onPress={() => handleKeyPress(k)}
                      activeOpacity={0.7}>
                      {k === 'back' ? (
                        <Ionicons name="backspace-outline" size={22} color="#FFFFFF" />
                      ) : (
                        <Text style={styles.keypadText}>{k}</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // Top Headers
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  headerRowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  headerLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  // Search Bar
  searchBarWrapper: {
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C22',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginTop: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.regular,
  },
  // Network Filter Carousel
  carouselWrapper: {
    marginBottom: 16,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  networkPill: {
    height: 34,
    borderRadius: 17,
    backgroundColor: '#1E1E24',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  networkPillActive: {
    backgroundColor: '#FFFFFF',
  },
  networkPillText: {
    color: '#A0A0A8',
    fontSize: 13.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  networkPillTextActive: {
    color: '#000000',
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
  },
  // Asset List
  assetListScroll: {
    flex: 1,
  },
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 14,
  },
  cashGhostCircle: {
    backgroundColor: '#ABA0EE', // Soft lavender background
    justifyContent: 'center',
    alignItems: 'center',
  },
  assetInfoCol: {
    flex: 1,
    gap: 3,
  },
  assetTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  assetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  assetTicker: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  assetNameMuted: {
    color: '#8E8E98',
    fontSize: 14.5,
    fontFamily: TypographyFonts.medium,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  assetSub: {
    color: '#929292',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
  },
  // Empty State (Airplane + Confetti)
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 20,
  },
  emptyStateContainerKeyboard: {
    paddingBottom: 6,
  },
  emptyStateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateTitleKeyboard: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  emptyStateBody: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
    lineHeight: 19,
    textAlign: 'center',
    maxWidth: 290,
  },
  emptyStateBodyKeyboard: {
    fontSize: 12.5,
    lineHeight: 16,
  },
  // Bottom Dock Input Bar
  bottomDockContainer: {
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    gap: 10,
  },
  dockedInputBar: {
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#282834',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  recipientInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.regular,
  },
  inputRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 6,
  },
  scanBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasteBtn: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pasteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  proceedPillBtn: {
    backgroundColor: '#ABA0EE',
    height: 46,
    borderRadius: 23,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  proceedPillText: {
    color: '#121026',
    fontSize: 15.5,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
  },
  // Step 3: Amount Screen
  maxChip: {
    backgroundColor: '#1E1E24',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  maxChipText: {
    color: '#ABA0EE',
    fontSize: 12,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
  },
  recipientBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  toLabel: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.medium,
  },
  toAddress: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: TypographyFonts.semiBold,
  },
  amountDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 4,
  },
  amountHeroText: {
    color: '#FFFFFF',
    fontSize: 44,
    fontFamily: TypographyFonts.medium,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    letterSpacing: -1,
  },
  amountConvertedSub: {
    color: '#8E8E98',
    fontSize: 14,
    fontFamily: TypographyFonts.medium,
  },
  sendSubmitBtn: {
    backgroundColor: '#ABA0EE',
    borderRadius: 24,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  sendSubmitBtnDisabled: {
    opacity: 0.6,
  },
  sendSubmitText: {
    color: '#121026',
    fontSize: 16,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
  },
  // Numerical Keypad
  keypadContainer: {
    paddingBottom: 8,
    gap: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  keypadKey: {
    width: 80,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  keypadText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: TypographyFonts.medium,
    fontWeight: '500',
  },
});

export default SendModal;
