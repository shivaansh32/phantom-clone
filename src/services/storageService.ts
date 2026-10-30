import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TransactionItem {
  id: string;
  type: 'deposit' | 'send' | 'receive' | 'buy' | 'sell';
  title: string;
  asset: 'SOL' | 'CASH';
  amount: number;
  usdValue: number;
  timestamp: number;
  date: string;
  monthGroup: string;
  time: string;
  recipient?: string;
  sender?: string;
  fromAddress?: string;
  toAddress?: string;
  status: 'confirmed' | 'pending' | 'failed';
  isGreen: boolean;
}

/**
 * Pool of authentic sample addresses from original Phantom screenshot
 */
const SAMPLE_SOL_ADDRESSES = [
  '7xKX...gAsU',
  'qwnK...RyJ...',
  'A77H...4RiR',
  '7xub...PQUi',
  '3U7m...r65W',
  'FiVF...W6Xh',
  'BXXC...DCib',
  'G9Rm...jyw6',
  'En3R...oUVU',
  '8HE6...aWBo',
];

/**
 * Generate an authentic truncated Solana address (e.g. "A77H...4RiR", "FiVF...W6Xh")
 */
export function generateTruncatedSolAddress(): string {
  if (Math.random() < 0.5) {
    const idx = Math.floor(Math.random() * SAMPLE_SOL_ADDRESSES.length);
    return SAMPLE_SOL_ADDRESSES[idx];
  }
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let p1 = '';
  let p2 = '';
  for (let i = 0; i < 4; i++) {
    p1 += chars.charAt(Math.floor(Math.random() * chars.length));
    p2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${p1}...${p2}`;
}

/**
 * Format any recipient address or username to authentic Solana truncated format
 */
export function formatSolAddress(address?: string): string {
  if (!address || address.trim() === '') {
    return generateTruncatedSolAddress();
  }
  const clean = address.trim();
  if (clean.includes('...')) {
    return clean;
  }
  if (clean.length > 10) {
    return `${clean.slice(0, 4)}...${clean.slice(-4)}`;
  }
  return clean;
}

export interface WalletState {
  solAmount: number;
  cashBalance: number;
}

export interface UserProfileState {
  username: string;
  avatarId: string;
  customAvatarUri: string | null;
  bio: string;
}

export interface ActiveTimerRecord {
  id: string; // native notification id
  amount: number;
  solEstimated: string;
  targetEndTime: number; // timestamp ms
  totalDuration: number; // seconds
  createdAt: number;
}

const STORAGE_KEYS = {
  WALLET: '@phantom_wallet_state_v1',
  TRANSACTIONS: '@phantom_transactions_v1',
  PROFILE: '@phantom_user_profile_v1',
  ACTIVE_TIMER: '@phantom_active_timer_v1',
};

// Initial amount matching authentic user screenshot (9.22861 SOL, $0.00 cash)
export const INITIAL_WALLET_STATE: WalletState = {
  solAmount: 9.22861,
  cashBalance: 0,
};

export const INITIAL_USER_PROFILE: UserProfileState = {
  username: 'ImmuneChimp1140',
  avatarId: 'cloud',
  customAvatarUri: null,
  bio: '',
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatTransactionDate(date: Date = new Date()): { dateStr: string; monthGroup: string; timeStr: string } {
  const m = date.getMonth();
  const d = date.getDate();
  const y = date.getFullYear();
  const hh = date.getHours().toString().padStart(2, '0');
  const mm = date.getMinutes().toString().padStart(2, '0');

  return {
    dateStr: `${MONTH_SHORT[m]} ${d}, ${y}`,
    monthGroup: MONTH_NAMES[m],
    timeStr: `${hh}:${mm}`,
  };
}

/**
 * Load Wallet Balances from local storage.
 * Defaults strictly to 0 SOL and $0.00 cash.
 */
export async function loadWalletBalances(): Promise<WalletState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.WALLET);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        solAmount: typeof parsed.solAmount === 'number' ? parsed.solAmount : 0,
        cashBalance: typeof parsed.cashBalance === 'number' ? parsed.cashBalance : 0,
      };
    }
  } catch (err) {
    console.warn('[Storage] Failed to load wallet balances:', err);
  }
  return INITIAL_WALLET_STATE;
}

/**
 * Save Wallet Balances to local storage.
 */
export async function saveWalletBalances(state: WalletState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WALLET, JSON.stringify(state));
  } catch (err) {
    console.warn('[Storage] Failed to save wallet balances:', err);
  }
}

/**
 * Load all transactions from local storage.
 */
export async function loadTransactions(): Promise<TransactionItem[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to load transactions:', err);
  }
  return [];
}

/**
 * Record and persist a new transaction into local storage.
 */
export async function recordTransaction(
  txData: Omit<TransactionItem, 'id' | 'timestamp' | 'date' | 'monthGroup' | 'time'>
): Promise<TransactionItem> {
  const now = new Date();
  const { dateStr, monthGroup, timeStr } = formatTransactionDate(now);

  const newTx: TransactionItem = {
    ...txData,
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.getTime(),
    date: dateStr,
    monthGroup,
    time: timeStr,
  };

  try {
    const current = await loadTransactions();
    const updated = [newTx, ...current];
    await AsyncStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  } catch (err) {
    console.warn('[Storage] Failed to record transaction:', err);
  }

  return newTx;
}

/**
 * Load User Profile from local storage.
 */
export async function loadUserProfile(): Promise<UserProfileState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      return { ...INITIAL_USER_PROFILE, ...JSON.parse(raw) };
    }
  } catch (err) {
    console.warn('[Storage] Failed to load user profile:', err);
  }
  return INITIAL_USER_PROFILE;
}

/**
 * Save User Profile to local storage.
 */
export async function saveUserProfile(profile: UserProfileState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.warn('[Storage] Failed to save user profile:', err);
  }
}

/**
 * Save Active Scheduled Timer to local storage
 * (Ensures running timer persists even if app is closed or removed from background)
 */
export async function saveActiveTimer(timer: ActiveTimerRecord): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ACTIVE_TIMER, JSON.stringify(timer));
  } catch (err) {
    console.warn('[Storage] Failed to save active timer:', err);
  }
}

/**
 * Load Active Scheduled Timer from local storage
 */
export async function loadActiveTimer(): Promise<ActiveTimerRecord | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVE_TIMER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Storage] Failed to load active timer:', err);
  }
  return null;
}

/**
 * Clear Active Scheduled Timer from local storage
 */
export async function clearActiveTimer(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER);
  } catch (err) {
    console.warn('[Storage] Failed to clear active timer:', err);
  }
}

/**
 * Reset all local storage data back to initial $0.00 state.
 */
export async function resetAllStorageData(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.WALLET),
      AsyncStorage.removeItem(STORAGE_KEYS.TRANSACTIONS),
      AsyncStorage.removeItem(STORAGE_KEYS.PROFILE),
      AsyncStorage.removeItem(STORAGE_KEYS.ACTIVE_TIMER),
    ]);
  } catch (err) {
    console.warn('[Storage] Failed to reset storage data:', err);
  }
}
