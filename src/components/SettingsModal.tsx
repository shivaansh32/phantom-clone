import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PhantomCloudAvatar } from './PhantomCloudAvatar';
import {
  sendDeviceNotification,
  requestNotificationPermissions,
  scheduleNativeTimerNotification,
  cancelScheduledNativeNotification,
} from '@/services/notificationService';
import {
  saveActiveTimer,
  loadActiveTimer,
  clearActiveTimer,
} from '@/services/storageService';
import { TypographyFonts } from '@/constants/typography';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onDepositCompleted: (amount: number) => void;
  solPrice: number;
  username?: string;
  avatarId?: string;
  customAvatarUri?: string | null;
  onOpenProfile?: () => void;
  onResetWallet?: () => void;
  onOpenHelpSupport?: () => void;
  onOpenReferEarn?: () => void;
}

const AMOUNT_PRESETS = [100, 500, 1000, 5000];
const TIMER_PRESETS = [
  { label: '5s', seconds: 5 },
  { label: '15s', seconds: 15 },
  { label: '30s', seconds: 30 },
  { label: '1m', seconds: 60 },
  { label: '5m', seconds: 300 },
];

export function SettingsModal({
  visible,
  onClose,
  onDepositCompleted,
  solPrice,
  username = 'ImmuneChimp1140',
  avatarId = 'cloud',
  customAvatarUri = null,
  onOpenProfile,
  onResetWallet,
  onOpenHelpSupport,
  onOpenReferEarn,
}: SettingsModalProps) {
  // Navigation inside Settings: 'main' | 'developer'
  const [currentSubView, setCurrentSubView] = useState<'main' | 'developer'>('main');
  const [searchQuery, setSearchQuery] = useState('');

  // Amount & Timer State (Moved to Developer Settings)
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmountText, setCustomAmountText] = useState<string>('');
  const [selectedSeconds, setSelectedSeconds] = useState<number>(5);
  const [customSecondsText, setCustomSecondsText] = useState<string>('');

  // Active Running Timer State
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [totalTimerSeconds, setTotalTimerSeconds] = useState<number>(0);
  const [scheduledAmount, setScheduledAmount] = useState<number>(0);

  // Developer Cluster State
  const [selectedCluster, setSelectedCluster] = useState<'mainnet' | 'devnet' | 'testnet'>('mainnet');

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const targetEndTimeRef = useRef<number>(0);
  const scheduledAmountRef = useRef<number>(0);
  const scheduledNotifIdRef = useRef<string | null>(null);

  // Sync active timer state from storage whenever Settings is opened
  useEffect(() => {
    if (!visible) {
      setCurrentSubView('main');
    } else {
      loadActiveTimer().then((timer) => {
        if (timer) {
          const now = Date.now();
          if (now < timer.targetEndTime) {
            const left = Math.ceil((timer.targetEndTime - now) / 1000);
            targetEndTimeRef.current = timer.targetEndTime;
            scheduledAmountRef.current = timer.amount;
            scheduledNotifIdRef.current = timer.id;
            setTotalTimerSeconds(timer.totalDuration);
            setSecondsRemaining(left);
            setScheduledAmount(timer.amount);
            setIsTimerRunning(true);

            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => {
              const currentLeft = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
              setSecondsRemaining(currentLeft);

              if (currentLeft <= 0) {
                if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
                }
                setIsTimerRunning(false);
                clearActiveTimer();
                const amt = scheduledAmountRef.current;
                onDepositCompleted(amt);
              }
            }, 500);
          } else {
            setIsTimerRunning(false);
            clearActiveTimer();
          }
        }
      });
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const effectiveAmount = customAmountText
    ? parseFloat(customAmountText) || selectedAmount
    : selectedAmount;

  const effectiveSeconds = customSecondsText
    ? parseInt(customSecondsText, 10) || selectedSeconds
    : selectedSeconds;

  const solEstimated = (effectiveAmount / (solPrice > 0 ? solPrice : 100.7606)).toFixed(4);

  const startScheduledTimer = async () => {
    if (effectiveAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid deposit amount greater than $0.');
      return;
    }

    const duration = effectiveSeconds;
    if (duration <= 0) {
      Alert.alert('Invalid duration', 'Please enter a valid timer duration (at least 1 second).');
      return;
    }

    // Request permissions on first start
    await requestNotificationPermissions();

    const targetTime = Date.now() + duration * 1000;
    targetEndTimeRef.current = targetTime;
    scheduledAmountRef.current = effectiveAmount;

    // 1. Schedule Native OS Notification
    // This runs via the phone OS (iOS Springboard / Android AlarmManager.setAlarmClock)
    // so you STILL get the notification even if the app is removed from background or phone is locked!
    const notifId = await scheduleNativeTimerNotification({
      title: 'Deposit Confirmed',
      body: `Successfully deposited $${effectiveAmount.toFixed(2)} (${solEstimated} SOL) into Phantom wallet.`,
      seconds: duration,
      data: {
        type: 'scheduled_deposit',
        amount: effectiveAmount,
        targetEndTime: targetTime,
      },
    });

    if (!notifId && Platform.OS !== 'web') {
      Alert.alert(
        'Notification / Alarm Blocked',
        'Phantom was unable to schedule the background notification. Please ensure Notifications and Exact Alarms permissions are enabled in Settings so you get alerts when the phone is locked or app is closed.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]
      );
    }

    scheduledNotifIdRef.current = notifId;

    // 2. Persist running timer to local storage so wallet credits it whenever app opens
    await saveActiveTimer({
      id: notifId || `local_${Date.now()}`,
      amount: effectiveAmount,
      solEstimated,
      targetEndTime: targetTime,
      totalDuration: duration,
      createdAt: Date.now(),
    });

    setTotalTimerSeconds(duration);
    setSecondsRemaining(duration);
    setScheduledAmount(effectiveAmount);
    setIsTimerRunning(true);

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
      setSecondsRemaining(left);

      if (left <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        setIsTimerRunning(false);
        clearActiveTimer();

        if (scheduledNotifIdRef.current) {
          cancelScheduledNativeNotification(scheduledNotifIdRef.current);
          scheduledNotifIdRef.current = null;
        }

        const amt = scheduledAmountRef.current;
        onDepositCompleted(amt);
      }
    }, 500);
  };

  const cancelTimer = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (scheduledNotifIdRef.current) {
      await cancelScheduledNativeNotification(scheduledNotifIdRef.current);
      scheduledNotifIdRef.current = null;
    }
    await clearActiveTimer();
    setIsTimerRunning(false);
    setSecondsRemaining(0);
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* ==================================================================== */}
        {/* SUBVIEW 1: DEVELOPER SETTINGS (WHERE TIMER FUNCTIONALITY NOW LIVES)   */}
        {/* ==================================================================== */}
        {currentSubView === 'developer' ? (
          <View style={styles.contentFlex}>
            {/* Top Bar */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setCurrentSubView('main')}
                style={styles.backBtn}
                activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Developer Settings</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Feature Header Card */}
              <View style={styles.devNoticeCard}>
                <View style={styles.devIconCircle}>
                  <Ionicons name="timer-outline" size={24} color="#121026" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.devNoticeTitle}>Automated Deposit & Alert Timer</Text>
                  <Text style={styles.devNoticeSub}>
                    Configure simulated blockchain deposits and trigger native device push notifications.
                  </Text>
                </View>
              </View>

              {/* Active Countdown Card when running */}
              {isTimerRunning ? (
                <View style={styles.activeTimerCard}>
                  <View style={styles.activeTimerTop}>
                    <View style={styles.pulseDot} />
                    <Text style={styles.activeTimerStatus}>Deposit Timer in Progress</Text>
                  </View>

                  <Text style={styles.countdownNumber}>{formatCountdown(secondsRemaining)}</Text>
                  <Text style={styles.countdownSub}>
                    Depositing{' '}
                    <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>
                      ${scheduledAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>{' '}
                    into your wallet
                  </Text>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={cancelTimer}
                    activeOpacity={0.8}>
                    <Text style={styles.cancelBtnText}>Cancel Timer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.featureCard}>
                  {/* 1. Deposit Amount Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Deposit Amount</Text>
                    <View style={styles.presetRow}>
                      {AMOUNT_PRESETS.map((amt) => {
                        const isSelected = selectedAmount === amt && !customAmountText;
                        return (
                          <TouchableOpacity
                            key={amt}
                            style={[styles.presetChip, isSelected && styles.presetChipActive]}
                            onPress={() => {
                              setSelectedAmount(amt);
                              setCustomAmountText('');
                            }}
                            activeOpacity={0.75}>
                            <Text
                              style={[
                                styles.presetChipText,
                                isSelected && styles.presetChipTextActive,
                              ]}>
                              ${amt.toLocaleString()}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Custom Amount Input */}
                    <View style={styles.customInputWrapper}>
                      <Text style={styles.currencyPrefix}>$</Text>
                      <TextInput
                        style={styles.customInput}
                        placeholder="Or enter custom amount (e.g. 250)"
                        placeholderTextColor="#7E7E88"
                        keyboardType="numeric"
                        value={customAmountText}
                        onChangeText={(txt) => setCustomAmountText(txt.replace(/[^0-9.]/g, ''))}
                      />
                    </View>
                  </View>

                  {/* 2. Timer Duration Selector */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Countdown Duration</Text>
                    <View style={styles.presetRow}>
                      {TIMER_PRESETS.map((t) => {
                        const isSelected = selectedSeconds === t.seconds && !customSecondsText;
                        return (
                          <TouchableOpacity
                            key={t.seconds}
                            style={[styles.presetChip, isSelected && styles.presetChipActive]}
                            onPress={() => {
                              setSelectedSeconds(t.seconds);
                              setCustomSecondsText('');
                            }}
                            activeOpacity={0.75}>
                            <Text
                              style={[
                                styles.presetChipText,
                                isSelected && styles.presetChipTextActive,
                              ]}>
                              {t.label}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>

                    {/* Custom Timer Input */}
                    <View style={styles.customInputWrapper}>
                      <Ionicons name="timer-outline" size={17} color="#ABA0EE" style={{ marginRight: 8 }} />
                      <TextInput
                        style={styles.customInput}
                        placeholder="Or enter custom seconds (e.g. 10, 45, 120)"
                        placeholderTextColor="#7E7E88"
                        keyboardType="numeric"
                        value={customSecondsText}
                        onChangeText={(txt) => setCustomSecondsText(txt.replace(/[^0-9]/g, ''))}
                      />
                      {customSecondsText.length > 0 && (
                        <Text style={styles.unitSuffix}>sec</Text>
                      )}
                    </View>
                  </View>

                  {/* 3. Notification Preview */}
                  <View style={styles.previewBox}>
                    <View style={styles.previewHeader}>
                      <View style={styles.miniPhantomIcon}>
                        <Ionicons name="flash" size={10} color="#121026" />
                      </View>
                      <Text style={styles.previewAppName}>PHANTOM</Text>
                      <Text style={styles.previewTime}>• Preview</Text>
                    </View>
                    <Text style={styles.previewTitle}>Deposit Confirmed</Text>
                    <Text style={styles.previewBody}>
                      Amount ${effectiveAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} credited • {solEstimated} SOL added to your wallet.
                    </Text>
                  </View>

                  {/* Primary Trigger Button */}
                  <TouchableOpacity
                    style={styles.startBtn}
                    onPress={startScheduledTimer}
                    activeOpacity={0.85}>
                    <Ionicons name="play" size={18} color="#121026" style={{ marginRight: 6 }} />
                    <Text style={styles.startBtnText}>
                      Start {effectiveSeconds}s Deposit Timer
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Developer Environment Section */}
              <Text style={styles.sectionHeading}>Cluster Environment</Text>
              <View style={styles.clusterRow}>
                {(['mainnet', 'devnet', 'testnet'] as const).map((cluster) => {
                  const isSel = selectedCluster === cluster;
                  return (
                    <TouchableOpacity
                      key={cluster}
                      style={[styles.clusterChip, isSel && styles.clusterChipActive]}
                      onPress={() => setSelectedCluster(cluster)}
                      activeOpacity={0.75}>
                      <Text style={[styles.clusterText, isSel && styles.clusterTextActive]}>
                        {cluster.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Test Instant Notification */}
              <TouchableOpacity
                style={styles.testNotificationBtn}
                onPress={() => {
                  sendDeviceNotification({
                    title: 'Developer Test',
                    body: 'Phantom notification system is fully operational.',
                  });
                }}
                activeOpacity={0.8}>
                <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
                <Text style={styles.testNotificationText}>Send Test Push Notification Now</Text>
              </TouchableOpacity>

              {/* Reset to Clean $0.00 State */}
              {onResetWallet && (
                <TouchableOpacity
                  style={[styles.testNotificationBtn, { borderColor: '#4A1D28', marginTop: 10 }]}
                  onPress={() => {
                    Alert.alert(
                      'Reset Storage Data?',
                      'This will reset your local wallet balance back to $0.00 and clear all transaction history.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Reset to $0.00',
                          style: 'destructive',
                          onPress: onResetWallet,
                        },
                      ]
                    );
                  }}
                  activeOpacity={0.8}>
                  <Ionicons name="trash-outline" size={18} color="#FF2B4D" />
                  <Text style={[styles.testNotificationText, { color: '#FF2B4D' }]}>
                    Reset Storage to $0.00 State
                  </Text>
                </TouchableOpacity>
              )}

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        ) : (
          /* ==================================================================== */
          /* SUBVIEW 2: MAIN SETTINGS MENU (1:1 with Video Frames 45s-58s)        */
          /* ==================================================================== */
          <View style={styles.contentFlex}>
            {/* Top Bar */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Settings</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Search Bar matching video frame 45s */}
              <View style={styles.searchBarBox}>
                <Ionicons name="search" size={18} color="#7E7E88" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.searchBarInput}
                  placeholder="Search"
                  placeholderTextColor="#7E7E88"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>

              {/* Top User Profile Card (Tapping opens Manage Profile!) */}
              <TouchableOpacity
                style={styles.userProfileCard}
                onPress={() => {
                  if (onOpenProfile) onOpenProfile();
                }}
                activeOpacity={0.8}>
                <View style={styles.userProfileLeft}>
                  <PhantomCloudAvatar
                    size={38}
                    avatarId={avatarId}
                    customUri={customAvatarUri}
                  />
                  <Text style={styles.userProfileHandle}>@{username}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#8E8E98" />
              </TouchableOpacity>

              {/* Section 1: Main Settings Group matching video */}
              <View style={styles.settingsGroupCard}>
                {/* Manage Accounts */}
                <TouchableOpacity
                  style={styles.settingsRowItem}
                  onPress={() => Alert.alert('Accounts', 'Viewing Account 1')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="wallet-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Manage Accounts</Text>
                  </View>
                  <View style={styles.badgeChevronRight}>
                    <Text style={styles.counterBadgeText}>1</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                </TouchableOpacity>

                {/* Preferences */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Preferences', 'Default currency: USD\nTheme: Dark')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="options-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Preferences</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* Security & Privacy */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Security & Privacy', 'Biometrics & Passcode enabled')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Security & Privacy</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>
              </View>

              {/* Section 2: Network & Connections */}
              <View style={styles.settingsGroupCard}>
                {/* Active Networks */}
                <TouchableOpacity
                  style={styles.settingsRowItem}
                  onPress={() => Alert.alert('Active Networks', 'Solana, Ethereum, Bitcoin, Polygon')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="globe-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Active Networks</Text>
                  </View>
                  <View style={styles.badgeChevronRight}>
                    <Text style={styles.pillBadgeText}>All</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                </TouchableOpacity>

                {/* Contacts */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Contacts', 'No saved contacts yet.')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="people-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Contacts</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* Connected Apps */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Connected Apps', 'No decentralized apps connected.')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="apps-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Connected Apps</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>
              </View>

              {/* Section 3: Developer Settings (Houses the Timer Feature!) */}
              <View style={styles.settingsGroupCard}>
                <TouchableOpacity
                  style={styles.settingsRowItem}
                  onPress={() => setCurrentSubView('developer')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="code-slash-outline" size={20} color="#ABA0EE" style={styles.settingsIcon} />
                    <View>
                      <Text style={[styles.settingsRowTitle, { color: '#ABA0EE' }]}>
                        Developer Settings
                      </Text>
                      <Text style={styles.settingsRowSub}>
                        Automated deposit timers, alerts & clusters
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#ABA0EE" />
                </TouchableOpacity>
              </View>

              {/* Section 4: Support & About */}
              <View style={styles.settingsGroupCard}>
                {/* Help & Support */}
                <TouchableOpacity
                  style={styles.settingsRowItem}
                  onPress={() => {
                    if (onOpenHelpSupport) {
                      onOpenHelpSupport();
                    } else {
                      Alert.alert('Help & Support', 'Visit help.phantom.app');
                    }
                  }}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="help-buoy-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Help & Support</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* Invite Your Friends */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => {
                    if (onOpenReferEarn) {
                      onOpenReferEarn();
                    } else {
                      Alert.alert('Invite Friends', 'Share Phantom with your friends!');
                    }
                  }}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="gift-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>Invite your friends</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* About Phantom */}
                <TouchableOpacity
                  style={[styles.settingsRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('About Phantom', 'Phantom Mobile v26.10\nBuild 2026.10.29')}
                  activeOpacity={0.75}>
                  <View style={styles.settingsRowLeft}>
                    <Ionicons name="information-circle-outline" size={20} color="#FFFFFF" style={styles.settingsIcon} />
                    <Text style={styles.settingsRowTitle}>About Phantom</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
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
  contentFlex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* Search Bar */
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#1E1E24',
    marginBottom: 14,
  },
  searchBarInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: TypographyFonts.regular,
  },

  /* User Profile Banner Card */
  userProfileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 14,
    marginBottom: 14,
  },
  userProfileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userProfileHandle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },

  /* Settings Menu Groups */
  settingsGroupCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  settingsRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsIcon: {
    width: 24,
    textAlign: 'center',
  },
  settingsRowTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  settingsRowSub: {
    color: '#7E7E88',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
    marginTop: 2,
  },
  badgeChevronRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  counterBadgeText: {
    color: '#7E7E88',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  pillBadgeText: {
    color: '#7E7E88',
    fontSize: 13.5,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },

  /* Developer Settings Subview Specific */
  devNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1E1A33',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#372E5C',
    marginBottom: 16,
  },
  devIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  devNoticeTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  devNoticeSub: {
    color: '#ABA0EE',
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
    fontFamily: TypographyFonts.regular,
  },
  featureCard: {
    backgroundColor: '#141418',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
    marginBottom: 16,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#ABA0EE',
  },
  presetChipText: {
    color: '#8E8E98',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  presetChipTextActive: {
    color: '#121026',
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  customInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A20',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#262630',
    paddingHorizontal: 12,
    height: 44,
  },
  currencyPrefix: {
    color: '#ABA0EE',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 6,
  },
  customInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
  },
  unitSuffix: {
    color: '#7E7E88',
    fontSize: 12.5,
    fontWeight: '600',
  },
  previewBox: {
    backgroundColor: '#1A1829',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2E274D',
    gap: 4,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  miniPhantomIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewAppName: {
    color: '#ABA0EE',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewTime: {
    color: '#7E7E88',
    fontSize: 10,
  },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  previewBody: {
    color: '#AEAEC0',
    fontSize: 12.5,
    lineHeight: 17,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ABA0EE',
  },
  startBtnText: {
    color: '#121026',
    fontSize: 15.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  activeTimerCard: {
    backgroundColor: '#1E1A33',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#4D3B82',
    alignItems: 'center',
    marginBottom: 16,
    gap: 6,
  },
  activeTimerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  activeTimerStatus: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  countdownNumber: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    fontFamily: TypographyFonts.black,
    letterSpacing: -1,
    marginVertical: 4,
  },
  countdownSub: {
    color: '#AEAEC0',
    fontSize: 13,
    marginBottom: 12,
  },
  cancelBtn: {
    backgroundColor: '#2E2248',
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 18,
  },
  cancelBtnText: {
    color: '#FF2B4D',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  sectionHeading: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  clusterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  clusterChip: {
    flex: 1,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#141418',
    borderWidth: 1,
    borderColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clusterChipActive: {
    borderColor: '#ABA0EE',
    backgroundColor: '#1E1A33',
  },
  clusterText: {
    color: '#8E8E98',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  clusterTextActive: {
    color: '#ABA0EE',
  },
  testNotificationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A20',
    borderWidth: 1,
    borderColor: '#262630',
  },
  testNotificationText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
});
