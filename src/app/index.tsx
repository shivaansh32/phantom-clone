import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Alert,
  AppState,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TopNav, MainTabType } from '@/components/TopNav';
import { BottomControls } from '@/components/BottomControls';
import { HomeScreen } from '@/screens/HomeScreen';
import { TradeScreen } from '@/screens/TradeScreen';
import { PredictScreen } from '@/screens/PredictScreen';
import { ProfileDrawer } from '@/components/ProfileDrawer';
import { AccountsView } from '@/components/AccountsView';
import { DepositModal } from '@/components/DepositModal';
import { AddCashModal } from '@/components/AddCashModal';
import { QuickActionModal } from '@/components/QuickActionModal';
import { ReceiveModal } from '@/components/ReceiveModal';
import { TradeModal } from '@/components/TradeModal';
import { SearchModal } from '@/components/SearchModal';
import { TokenDetailModal } from '@/components/TokenDetailModal';
import { SettingsModal } from '@/components/SettingsModal';
import { ManageProfileModal } from '@/components/ManageProfileModal';
import { SendModal } from '@/components/SendModal';
import { ChatsModal } from '@/components/ChatsModal';
import { WatchlistModal } from '@/components/WatchlistModal';
import { HistoryModal } from '@/components/HistoryModal';
import { ReferEarnModal } from '@/components/ReferEarnModal';
import { HelpSupportModal } from '@/components/HelpSupportModal';
import { ActivationGateModal } from '@/components/ActivationGateModal';
import { NotificationBanner } from '@/components/NotificationBanner';
import { sendDeviceNotification, requestNotificationPermissions } from '@/services/notificationService';
import { checkDeviceActivationStatus } from '@/services/activationService';
import { TokenItem, UserHolding, WatchlistToken } from '@/constants/mockData';
import { useCryptoPrices, DEFAULT_SOL_AMOUNT } from '@/hooks/useCryptoPrices';
import {
  loadWalletBalances,
  saveWalletBalances,
  loadTransactions,
  recordTransaction,
  loadUserProfile,
  saveUserProfile,
  resetAllStorageData,
  loadActiveTimer,
  clearActiveTimer,
  generateTruncatedSolAddress,
  formatSolAddress,
  TransactionItem,
} from '@/services/storageService';

export default function App() {
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isAddCashOpen, setIsAddCashOpen] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const [isFavoriteActive, setIsFavoriteActive] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenItem | UserHolding | WatchlistToken | null>(null);

  // User profile state (PFP & Username)
  const [username, setUsername] = useState<string>('ImmuneChimp1140');
  const [avatarId, setAvatarId] = useState<string>('cloud');
  const [customAvatarUri, setCustomAvatarUri] = useState<string | null>(null);
  const [bio, setBio] = useState<string>('');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalInitialView, setProfileModalInitialView] = useState<'profile' | 'manage'>('profile');

  // Sidebar Drawer Tabs state
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReferEarnOpen, setIsReferEarnOpen] = useState(false);
  const [isHelpSupportOpen, setIsHelpSupportOpen] = useState(false);

  // User's Solana amount & cash balance (defaults to authentic 9.22861 SOL from screenshot)
  const [solAmount, setSolAmount] = useState<number>(DEFAULT_SOL_AMOUNT);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isStorageLoaded, setIsStorageLoaded] = useState<boolean>(false);
  const [isActivationGateOpen, setIsActivationGateOpen] = useState<boolean>(false);

  // Load persisted wallet balances, transaction logs, and user profile on mount
  useEffect(() => {
    requestNotificationPermissions();

    // Hardware-locked device activation check (disabled for now)
    // checkDeviceActivationStatus().then(({ isActivated }) => {
    //   if (!isActivated) {
    //     setIsActivationGateOpen(true);
    //   }
    // });

    async function initLocalStorage() {
      try {
        const balances = await loadWalletBalances();
        const txs = await loadTransactions();
        const profile = await loadUserProfile();

        setSolAmount(balances.solAmount);
        setCashBalance(balances.cashBalance);
        setTransactions(txs);
        setUsername(profile.username);
        setAvatarId(profile.avatarId);
        setCustomAvatarUri(profile.customAvatarUri);
        setBio(profile.bio);
      } catch (err) {
        console.warn('Failed to load local storage:', err);
      } finally {
        setIsStorageLoaded(true);
        // Process any timer that completed while app was closed or removed from background
        checkPendingScheduledDeposits();
      }
    }

    initLocalStorage();
  }, []);

  // Checks and credits any scheduled deposits that matured while the app was killed or backgrounded
  const checkPendingScheduledDeposits = async () => {
    try {
      const activeTimer = await loadActiveTimer();
      if (!activeTimer) return;

      const now = Date.now();
      if (now >= activeTimer.targetEndTime) {
        await clearActiveTimer();
        const amt = activeTimer.amount;
        await handleCashAdded(amt, true);
      }
    } catch (err) {
      console.warn('Error checking pending scheduled deposits:', err);
    }
  };

  // AppState & Notification response listener:
  // When user returns to app, opens from killed state, or taps notification banner
  useEffect(() => {
    const appStateSub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkPendingScheduledDeposits();
      }
    });

    const notifSub = Notifications.addNotificationResponseReceivedListener(() => {
      checkPendingScheduledDeposits();
    });

    return () => {
      appStateSub.remove();
      notifSub.remove();
    };
  }, [solAmount]);

  // Save wallet balances automatically whenever changed
  useEffect(() => {
    if (isStorageLoaded) {
      saveWalletBalances({ solAmount, cashBalance });
    }
  }, [solAmount, cashBalance, isStorageLoaded]);

  // Real-time live crypto prices hook (polling, websocket-ready, and resilient fallback)
  const {
    prices,
    solPrice,
    solChange24h,
    solChangeUsd,
    solHoldingUsd,
    totalBalance,
    watchlist,
    isLive,
    isRefreshing,
    refresh,
  } = useCryptoPrices(solAmount, cashBalance);

  // Opening the 1:1 authentic Token Detail Screen when tapping any coin
  const handleSelectToken = (token: TokenItem | UserHolding | WatchlistToken) => {
    setSelectedToken(token);
  };

  const handleActionSelect = (action: string) => {
    if (action === 'send') {
      setIsSendOpen(true);
      return;
    }
    if (action === 'receive') {
      setIsReceiveOpen(true);
      return;
    }
    if (action === 'deposit') {
      setIsDepositOpen(true);
      return;
    }
    if (action === 'trade') {
      setIsTradeModalOpen(true);
      return;
    }
    if (action === 'buy') {
      setIsAddCashOpen(true);
      return;
    }
  };

  const handleSendCompleted = async (amount: number, recipient: string, asset: 'SOL' | 'CASH') => {
    let usdVal = 0;
    if (asset === 'SOL') {
      const newSol = Math.max(0, Number((solAmount - amount).toFixed(6)));
      setSolAmount(newSol);
      usdVal = Number((amount * solPrice).toFixed(2));
    } else {
      const newCash = Math.max(0, Number((cashBalance - amount).toFixed(2)));
      setCashBalance(newCash);
      usdVal = amount;
    }

    const targetAddr = formatSolAddress(recipient);

    // Persist Send transaction to local storage (Formatted 1:1 with Phantom screenshot "To <address>")
    const newTx = await recordTransaction({
      type: 'send',
      title: `To ${targetAddr}`,
      asset,
      amount,
      usdValue: usdVal,
      recipient: targetAddr,
      toAddress: targetAddr,
      status: 'confirmed',
      isGreen: false,
    });
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Depositing cash automatically buys that amount in Solana at live market price
  const handleCashAdded = async (amount: number, skipNotification = false) => {
    const currentPrice = solPrice > 0 ? solPrice : 100.7606;
    const solBought = amount / currentPrice;
    const newSol = Number((solAmount + solBought).toFixed(6));
    setSolAmount(newSol);
    await saveWalletBalances({ solAmount: newSol, cashBalance });

    const randomFrom = generateTruncatedSolAddress();

    // Persist Deposit transaction to local storage (Formatted 1:1 with Phantom screenshot "From <address>")
    const newTx = await recordTransaction({
      type: 'deposit',
      title: `From ${randomFrom}`,
      asset: 'SOL',
      amount: Number(solBought.toFixed(4)),
      usdValue: amount,
      status: 'confirmed',
      isGreen: true,
      sender: randomFrom,
      fromAddress: randomFrom,
    });
    setTransactions((prev) => [newTx, ...prev]);

    // Send device notification if not skipped (e.g. when app resumes from background notification)
    if (!skipNotification) {
      sendDeviceNotification({
        title: 'Deposit Confirmed',
        body: `Amount $${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} credited • ${solBought.toFixed(4)} SOL added to your wallet.`,
      });
    }
  };

  // Selling tokens converts SOL to Cash at live market price
  const handleExecuteSell = async (amountSol: number, usdReceived: number) => {
    const nextSol = Math.max(0, Number((solAmount - amountSol).toFixed(6)));
    const nextCash = Number((cashBalance + usdReceived).toFixed(2));
    setSolAmount(nextSol);
    setCashBalance(nextCash);
    await saveWalletBalances({ solAmount: nextSol, cashBalance: nextCash });

    const newTx = await recordTransaction({
      type: 'send',
      title: 'Sell',
      asset: 'SOL',
      amount: Number(amountSol.toFixed(4)),
      usdValue: usdReceived,
      status: 'confirmed',
      isGreen: false,
    });
    setTransactions((prev) => [newTx, ...prev]);

    sendDeviceNotification({
      title: 'Sell Order Confirmed',
      body: `Sold ${amountSol.toFixed(4)} SOL for $${usdReceived.toFixed(2)} Cash.`,
    });
  };

  // Buying tokens with Cash balance
  const handleExecuteBuy = async (amountSol: number, usdSpent: number) => {
    const nextSol = Number((solAmount + amountSol).toFixed(6));
    const nextCash = Math.max(0, Number((cashBalance - usdSpent).toFixed(2)));
    setSolAmount(nextSol);
    setCashBalance(nextCash);
    await saveWalletBalances({ solAmount: nextSol, cashBalance: nextCash });

    const newTx = await recordTransaction({
      type: 'buy',
      title: 'Buy',
      asset: 'SOL',
      amount: Number(amountSol.toFixed(4)),
      usdValue: usdSpent,
      status: 'confirmed',
      isGreen: true,
    });
    setTransactions((prev) => [newTx, ...prev]);

    sendDeviceNotification({
      title: 'Buy Order Filled',
      body: `Purchased ${amountSol.toFixed(4)} SOL for $${usdSpent.toFixed(2)} Cash.`,
    });
  };

  const handleUpdateUsername = async (newUsername: string) => {
    setUsername(newUsername);
    await saveUserProfile({ username: newUsername, avatarId, customAvatarUri, bio });
    sendDeviceNotification({
      title: 'Username Updated',
      body: `Your profile handle is now @${newUsername}`,
    });
  };

  const handleUpdateAvatar = async (newAvatarId: string, customUri?: string | null) => {
    setAvatarId(newAvatarId);
    const finalUri = customUri || null;
    setCustomAvatarUri(finalUri);
    await saveUserProfile({ username, avatarId: newAvatarId, customAvatarUri: finalUri, bio });
    sendDeviceNotification({
      title: 'Avatar Updated',
      body: 'Your profile avatar has been updated.',
    });
  };

  const handleUpdateBio = async (newBio: string) => {
    setBio(newBio);
    await saveUserProfile({ username, avatarId, customAvatarUri, bio: newBio });
  };

  const handleResetWallet = async () => {
    await resetAllStorageData();
    setSolAmount(0);
    setCashBalance(0);
    setTransactions([]);
    setUsername('ImmuneChimp1140');
    setAvatarId('cloud');
    setCustomAvatarUri(null);
    setBio('');
    Alert.alert('Wallet Reset', 'Wallet balances and transaction history have been reset to initial $0.00 state.');
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.phoneFrame}>
        <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
          {/* Top Segmented Navigation & Avatar */}
          <TopNav
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            isFavoriteActive={isFavoriteActive}
            onToggleFavorite={() => setIsFavoriteActive(!isFavoriteActive)}
            avatarId={avatarId}
            customAvatarUri={customAvatarUri}
            onLongPressAvatar={() => {
              setProfileModalInitialView('manage');
              setIsProfileModalOpen(true);
            }}
          />

          {/* Active Screen Tab Content */}
          <View style={styles.screenContainer}>
            {activeTab === 'home' && (
              <HomeScreen
                onPressDeposit={() => setIsDepositOpen(true)}
                onPressAddCash={() => setIsAddCashOpen(true)}
                onPressSend={() => setIsSendOpen(true)}
                onPressAccount={() => setIsAccountsOpen(true)}
                onPressToken={handleSelectToken}
                balance={totalBalance}
                cashBalance={cashBalance}
                solAmount={solAmount}
                solPrice={solPrice}
                solHoldingUsd={solHoldingUsd}
                solChangeUsd={solChangeUsd}
                solChange24h={solChange24h}
                watchlist={watchlist}
                isLive={isLive}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
              />
            )}
            {activeTab === 'trade' && (
              <TradeScreen prices={prices} onSelectToken={handleSelectToken} />
            )}
            {activeTab === 'predict' && <PredictScreen />}
          </View>

          {/* Floating Bottom Controls (Search & Plus Button) */}
          <BottomControls
            onPressSearch={() => setIsSearchOpen(true)}
            onPressPlus={() => setIsQuickActionOpen(true)}
          />

          {/* Overlays & Modals */}
          <ProfileDrawer
            visible={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onNavigateToAccounts={() => setIsAccountsOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenProfile={() => {
              setIsDrawerOpen(false);
              setProfileModalInitialView('profile');
              setIsProfileModalOpen(true);
            }}
            onOpenChats={() => {
              setIsDrawerOpen(false);
              setIsChatsOpen(true);
            }}
            onOpenWatchlist={() => {
              setIsDrawerOpen(false);
              setIsWatchlistOpen(true);
            }}
            onOpenHistory={() => {
              setIsDrawerOpen(false);
              setIsHistoryOpen(true);
            }}
            onOpenReferEarn={() => {
              setIsDrawerOpen(false);
              setIsReferEarnOpen(true);
            }}
            onOpenHelpSupport={() => {
              setIsDrawerOpen(false);
              setIsHelpSupportOpen(true);
            }}
            username={username}
            avatarId={avatarId}
            customAvatarUri={customAvatarUri}
          />

          <AccountsView
            visible={isAccountsOpen}
            onBack={() => setIsAccountsOpen(false)}
            balance={totalBalance}
            username={username}
          />

          <DepositModal
            visible={isDepositOpen}
            onClose={() => setIsDepositOpen(false)}
            onSelectAddCash={() => setIsAddCashOpen(true)}
            onSelectBuyCrypto={() => setIsAddCashOpen(true)}
            onSelectReceiveCrypto={() => {
              setIsDepositOpen(false);
              setIsReceiveOpen(true);
            }}
          />

          <AddCashModal
            visible={isAddCashOpen}
            onClose={() => setIsAddCashOpen(false)}
            onCashAdded={handleCashAdded}
          />

          <QuickActionModal
            visible={isQuickActionOpen}
            onClose={() => setIsQuickActionOpen(false)}
            onActionSelect={handleActionSelect}
          />

          <ReceiveModal
            visible={isReceiveOpen}
            onClose={() => setIsReceiveOpen(false)}
          />

          <TradeModal
            visible={isTradeModalOpen}
            onClose={() => setIsTradeModalOpen(false)}
            solAmount={solAmount}
            cashBalance={cashBalance}
            solPrice={solPrice}
            onExecuteSwap={(from, to, amt) => {
              if (from === 'SOL') {
                handleExecuteSell(amt, Number((amt * solPrice).toFixed(2)));
              } else {
                handleExecuteBuy(Number((amt / solPrice).toFixed(6)), amt);
              }
            }}
          />

          <SearchModal
            visible={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelectToken={handleSelectToken}
            prices={prices}
          />

          {/* 1:1 Authentic Token Detail Screen matching video */}
          <TokenDetailModal
            visible={selectedToken !== null}
            onClose={() => setSelectedToken(null)}
            token={selectedToken}
            solAmount={solAmount}
            transactions={transactions}
            livePrice={
              selectedToken?.symbol === 'SOL'
                ? solPrice
                : selectedToken && prices[selectedToken.symbol]
                  ? prices[selectedToken.symbol].price
                  : undefined
            }
            liveChange24h={
              selectedToken?.symbol === 'SOL'
                ? solChange24h
                : selectedToken && prices[selectedToken.symbol]
                  ? prices[selectedToken.symbol].change24h
                  : undefined
            }
            cashBalance={cashBalance}
            onExecuteSell={handleExecuteSell}
            onExecuteBuy={handleExecuteBuy}
            onSelectBuy={() => {
              setSelectedToken(null);
              setIsAddCashOpen(true);
            }}
            onSelectSend={() => {
              setSelectedToken(null);
              setIsSendOpen(true);
            }}
            onSelectReceive={() => {
              setSelectedToken(null);
              setIsDepositOpen(true);
            }}
            onSelectSell={() => {
              setSelectedToken(null);
              setIsSendOpen(true);
            }}
          />

          {/* Settings Modal with Developer Settings & Deposit Timer */}
          <SettingsModal
            visible={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            onDepositCompleted={handleCashAdded}
            solPrice={solPrice}
            username={username}
            avatarId={avatarId}
            customAvatarUri={customAvatarUri}
            onOpenProfile={() => {
              setIsSettingsOpen(false);
              setProfileModalInitialView('manage');
              setIsProfileModalOpen(true);
            }}
            onOpenHelpSupport={() => {
              setIsSettingsOpen(false);
              setIsHelpSupportOpen(true);
            }}
            onOpenReferEarn={() => {
              setIsSettingsOpen(false);
              setIsReferEarnOpen(true);
            }}
            onResetWallet={handleResetWallet}
          />

          {/* 1:1 Authentic Manage Profile & Profile View (matching video frames 11s-16s) */}
          <ManageProfileModal
            visible={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            username={username}
            avatarId={avatarId}
            customAvatarUri={customAvatarUri}
            bio={bio}
            onUpdateUsername={handleUpdateUsername}
            onUpdateAvatar={handleUpdateAvatar}
            onUpdateBio={handleUpdateBio}
            initialView={profileModalInitialView}
          />

          {/* 1:1 Authentic Chats Screen matching video Frames 21s-25s */}
          <ChatsModal
            visible={isChatsOpen}
            onClose={() => setIsChatsOpen(false)}
            username={username}
          />

          {/* 1:1 Authentic Watchlist Screen matching video Frames 30s-34s */}
          <WatchlistModal
            visible={isWatchlistOpen}
            onClose={() => setIsWatchlistOpen(false)}
            onSelectToken={handleSelectToken}
            prices={prices}
          />

          {/* 1:1 Authentic Drawer History Screen matching video Frames 39s-41s */}
          <HistoryModal
            visible={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            transactions={transactions}
          />

          {/* 1:1 Authentic Refer & Earn Screen matching video Frame 45s */}
          <ReferEarnModal
            visible={isReferEarnOpen}
            onClose={() => setIsReferEarnOpen(false)}
            username={username}
          />

          {/* 1:1 Authentic Help & Support Screen matching video Frame 56s */}
          <HelpSupportModal
            visible={isHelpSupportOpen}
            onClose={() => setIsHelpSupportOpen(false)}
          />

          {/* 1:1 Phantom Send Workflow Modal (Asset Selection -> Recipient Address -> Transfer) */}
          <SendModal
            visible={isSendOpen}
            onClose={() => setIsSendOpen(false)}
            solAmount={solAmount}
            solPrice={solPrice}
            cashBalance={cashBalance}
            onSendCompleted={handleSendCompleted}
          />

          {/* Hardware-Locked Device Activation Screen (disabled for now) */}
          {/* <ActivationGateModal
            visible={isActivationGateOpen}
            onActivated={() => setIsActivationGateOpen(false)}
          /> */}

          {/* Top Slide-Down System Notification Banner */}
          <NotificationBanner />
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 440 : undefined,
    height: '100%',
    backgroundColor: '#000000',
    ...(Platform.OS === 'web'
      ? {
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: 12 },
          shadowOpacity: 0.5,
          shadowRadius: 36,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#1C1C22',
        }
      : {}),
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screenContainer: {
    flex: 1,
  },
});
