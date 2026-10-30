import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Share,
  Vibration,
  GestureResponderEvent,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Rect,
  Line,
} from 'react-native-svg';
import { TokenAvatar } from './TokenAvatar';
import { TypographyFonts } from '@/constants/typography';
import { TokenItem, UserHolding, WatchlistToken } from '@/constants/mockData';
import {
  TransactionItem,
  formatSolAddress,
  generateTruncatedSolAddress,
} from '@/services/storageService';
import { WalletTransactionIcon } from './WalletTransactionIcon';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TokenDetailModalProps {
  visible: boolean;
  onClose: () => void;
  token: TokenItem | UserHolding | WatchlistToken | null;
  livePrice?: number;
  liveChange24h?: number;
  solAmount?: number;
  cashBalance?: number;
  transactions?: TransactionItem[];
  onSelectBuy?: () => void;
  onSelectSend?: () => void;
  onSelectReceive?: () => void;
  onSelectSell?: () => void;
  onExecuteSell?: (amountToken: number, usdValue: number) => void;
  onExecuteBuy?: (amountToken: number, usdValue: number) => void;
}

type TimeframeOption = 'LIVE' | '1D' | '1W' | '1M' | '1Y' | 'ALL';

interface TokenMarketInfo {
  marketCap: string;
  network: string;
  volume24h: string;
  trades24h: string;
  fundingRate: string;
  openInterest: string;
  allTimeHigh: string;
  circulatingSupply: string;
  tradedToday: string;
  description: string;
  website: string;
  searchX: string;
}

const TOKEN_METRICS_DATA: Record<string, TokenMarketInfo> = {
  SOL: {
    marketCap: '$60.33B',
    network: 'Solana',
    volume24h: '$2.7B',
    trades24h: '27.48M',
    fundingRate: '0.00125%',
    openInterest: '$570.7M',
    allTimeHigh: '$260.06',
    circulatingSupply: '468.2M SOL',
    tradedToday: '$3.8B traded today',
    description: 'Solana is a high-performance decentralized blockchain built for high-throughput smart contracts and financial applications.',
    website: 'solana.com',
    searchX: 'solana',
  },
  GTA6: {
    marketCap: '$18.2M',
    network: 'Solana',
    volume24h: '$4.5M',
    trades24h: '184.2K',
    fundingRate: '0.0084%',
    openInterest: '$12.8M',
    allTimeHigh: '$0.0245',
    circulatingSupply: '1.0B GTA6',
    tradedToday: '$4.5M traded today',
    description: 'GTA6 is a trending Solana community memecoin inspired by Vice City gaming culture, backed by high DEX liquidity.',
    website: 'gta6sol.io',
    searchX: 'gta6 solana',
  },
  XHYPE: {
    marketCap: '$1.2M',
    network: 'Hyperliquid',
    volume24h: '$380K',
    trades24h: '42.1K',
    fundingRate: '0.0045%',
    openInterest: '$4.8M',
    allTimeHigh: '$3.40',
    circulatingSupply: '500K xHYPE',
    tradedToday: '$380K traded today',
    description: 'xHYPE is an ecosystem token closely tied to Hyperliquid perpetual protocols and cross-chain derivatives volume.',
    website: 'hyperliquid.xyz',
    searchX: 'xhype token',
  },
  RSGP: {
    marketCap: '$12.1M',
    network: 'Solana',
    volume24h: '$1.9M',
    trades24h: '92.4K',
    fundingRate: '-0.012%',
    openInterest: '$6.5M',
    allTimeHigh: '$0.0068',
    circulatingSupply: '5.0B RSGP',
    tradedToday: '$1.9M traded today',
    description: 'RuneScape Gold Piece (RSGP) is an iconic community gaming meme asset on Solana celebrating MMORPG culture.',
    website: 'rsgpsol.com',
    searchX: 'rsgp solana',
  },
  VIRTUAL: {
    marketCap: '$610.5M',
    network: 'Base',
    volume24h: '$48.2M',
    trades24h: '410K',
    fundingRate: '0.0015%',
    openInterest: '$88.4M',
    allTimeHigh: '$0.88',
    circulatingSupply: '1.0B VIRTUAL',
    tradedToday: '$48.2M traded today',
    description: 'Virtuals Protocol co-owns and co-creates gaming and AI agents across decentralized virtual entertainment economies.',
    website: 'virtuals.io',
    searchX: 'virtual protocol',
  },
  CARDS: {
    marketCap: '$4.5M',
    network: 'Solana',
    volume24h: '$890K',
    trades24h: '38.2K',
    fundingRate: '0.0022%',
    openInterest: '$1.8M',
    allTimeHigh: '$0.45',
    circulatingSupply: '16.6M CARDS',
    tradedToday: '$890K traded today',
    description: 'Cards of Solana is a decentralized entertainment asset powering game mechanics and card collection rewards on Solana.',
    website: 'cardsofsolana.com',
    searchX: 'cards solana',
  },
  BTC: {
    marketCap: '$1.35T',
    network: 'Bitcoin',
    volume24h: '$28.4B',
    trades24h: '1.4M',
    fundingRate: '0.0009%',
    openInterest: '$2.1B',
    allTimeHigh: '$73,750.00',
    circulatingSupply: '19.7M BTC',
    tradedToday: '$28.4B traded today',
    description: 'Bitcoin is the first decentralized peer-to-peer digital currency, designed to act as a store of value and medium of exchange.',
    website: 'bitcoin.org',
    searchX: 'bitcoin',
  },
  ETH: {
    marketCap: '$405.8B',
    network: 'Ethereum',
    volume24h: '$14.6B',
    trades24h: '890K',
    fundingRate: '0.0011%',
    openInterest: '$1.4B',
    allTimeHigh: '$4,891.70',
    circulatingSupply: '120.2M ETH',
    tradedToday: '$14.6B traded today',
    description: 'Ethereum is a decentralized open-source blockchain with smart contract functionality, powering decentralized finance and Web3 apps.',
    website: 'ethereum.org',
    searchX: 'ethereum',
  },
  XRP: {
    marketCap: '$32.4B',
    network: 'XRP Ledger',
    volume24h: '$1.2B',
    trades24h: '220K',
    fundingRate: '0.0008%',
    openInterest: '$340M',
    allTimeHigh: '$3.84',
    circulatingSupply: '55.4B XRP',
    tradedToday: '$1.2B traded today',
    description: 'XRP is a digital asset built for global payments, facilitating real-time cross-border settlements with low cost.',
    website: 'ripple.com',
    searchX: 'xrp ripple',
  },
};

function getTokenMetrics(symbol: string): TokenMarketInfo {
  const s = (symbol || '').toUpperCase().trim();
  if (TOKEN_METRICS_DATA[s]) return TOKEN_METRICS_DATA[s];
  return {
    marketCap: '$24.5M',
    network: 'Solana',
    volume24h: '$1.8M',
    trades24h: '12.4K',
    fundingRate: '0.002%',
    openInterest: '$4.2M',
    allTimeHigh: '$1.20',
    circulatingSupply: '100M ' + s,
    tradedToday: '$1.8M traded today',
    description: `${s} is a decentralized digital asset engineered for high performance, peer-to-peer security, and ecosystem utility.`,
    website: 'phantom.app',
    searchX: s + ' crypto',
  };
}

const TIMEFRAME_PERCENTAGES: Record<TimeframeOption, number> = {
  LIVE: 0.51,
  '1D': 3.42,
  '1W': 12.85,
  '1M': 28.40,
  '1Y': 185.30,
  ALL: 1250.00,
};

const TIMEFRAME_LABELS: Record<TimeframeOption, string[]> = {
  LIVE: [
    '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM', '11:00 AM', '11:15 AM',
    '11:30 AM', '11:45 AM', '12:00 PM', '12:15 PM', '12:30 PM', '12:45 PM',
    '1:00 PM', '1:15 PM', '1:30 PM', '1:45 PM', '2:00 PM', '2:15 PM', '2:30 PM', 'Now',
  ],
  '1D': [
    'Yesterday 2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM', '2 AM', '4 AM',
    '6 AM', '8 AM', '10 AM', '12 PM', '1 PM', '2 PM', '3 PM', 'Today 4 PM', '5 PM', '6 PM', '7 PM', 'Now',
  ],
  '1W': [
    'Oct 23', 'Oct 24', 'Oct 25', 'Oct 26', 'Oct 27', 'Oct 28', 'Oct 29',
    'Oct 29 6 PM', 'Oct 30 6 AM', 'Oct 30 12 PM', 'Today 2 PM', 'Now',
  ],
  '1M': [
    'Oct 1', 'Oct 4', 'Oct 7', 'Oct 10', 'Oct 13', 'Oct 16', 'Oct 19',
    'Oct 22', 'Oct 25', 'Oct 27', 'Oct 28', 'Oct 29', 'Oct 30', 'Now',
  ],
  '1Y': [
    'Nov 2025', 'Jan 2026', 'Mar 2026', 'May 2026', 'Jul 2026', 'Aug 2026',
    'Sep 2026', 'Oct 2026', 'Mid Oct', 'Late Oct', 'Oct 30', 'Now',
  ],
  ALL: [
    '2020', '2021', '2022', '2023', '2024', '2025', 'Early 2026',
    'Mid 2026', 'Late 2026', 'Oct 2026', 'Oct 30', 'Now',
  ],
};

/**
 * Exact curve sampled from Phantom video for Solana:
 * Starts mid-height, drops to sharp left-dip, recovers with jagged oscillations,
 * climbs to top-right with an upward hook ending in glowing dot.
 */
const TIMEFRAME_DATA: Record<TimeframeOption, number[]> = {
  LIVE: [
    62, 59, 61, 56, 57, 32, 24, 29, 48, 52, 49, 63, 58, 62, 60, 68, 66, 72, 69, 76,
  ],
  '1D': [
    55, 58, 62, 54, 45, 30, 22, 35, 48, 56, 50, 64, 58, 65, 62, 70, 68, 74, 71, 78,
  ],
  '1W': [40, 48, 55, 52, 65, 58, 72, 68, 80, 75, 85, 82],
  '1M': [35, 38, 42, 50, 48, 60, 58, 70, 68, 75, 72, 85, 80, 88],
  '1Y': [20, 28, 35, 45, 40, 55, 60, 58, 72, 80, 85, 90],
  ALL: [15, 22, 30, 40, 50, 45, 60, 70, 65, 80, 85, 92],
};

function CandlestickIcon({ size = 18, color = '#7E7E88' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Path d="M5 2v16M15 2v16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <Rect x="3" y="6" width="4" height="7" rx="1" fill={color} />
      <Rect x="13" y="8" width="4" height="6" rx="1" fill={color} />
    </Svg>
  );
}

function ActionSendIcon({ size = 20, color = '#EFEFEF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21.5 2.5L2.5 9.5L11.5 14.5L14.5 21.5L21.5 2.5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function ActionReceiveIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Top-left QR finder square */}
      <Rect x="2.5" y="2.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Rect x="5" y="5" width="2" height="2" fill={color} />
      {/* Top-right QR finder square */}
      <Rect x="14.5" y="2.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Rect x="17" y="5" width="2" height="2" fill={color} />
      {/* Bottom-left QR finder square */}
      <Rect x="2.5" y="14.5" width="7" height="7" rx="1.5" stroke={color} strokeWidth="1.8" />
      <Rect x="5" y="17" width="2" height="2" fill={color} />
      {/* Bottom-right data dots */}
      <Rect x="14.5" y="14.5" width="2.5" height="2.5" fill={color} rx="0.5" />
      <Rect x="19" y="14.5" width="2.5" height="2.5" fill={color} rx="0.5" />
      <Rect x="14.5" y="19" width="2.5" height="2.5" fill={color} rx="0.5" />
      <Rect x="19" y="19" width="2.5" height="2.5" fill={color} rx="0.5" />
    </Svg>
  );
}

function ActionShareIcon({ size = 20, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 14v-2a4 4 0 0 1 4-4h8m0 0l-3.5-3.5M16 8l-3.5 3.5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * Authentic sample Solana transactions replicated 1:1 from Phantom video frame (media_1793340573104_db07a593.jpg)
 */
const SAMPLE_SOL_TRANSACTIONS: TransactionItem[] = [
  {
    id: 'sample_sol_tx_1',
    type: 'buy',
    title: 'Buy',
    asset: 'SOL',
    amount: 9.22,
    usdValue: 922.0,
    timestamp: Date.now() - 3600000 * 24 * 22,
    date: 'Oct 8, 2026',
    monthGroup: 'October',
    time: '14:22',
    status: 'confirmed',
    isGreen: true,
  },
  {
    id: 'sample_sol_tx_2',
    type: 'sell',
    title: 'Sell',
    asset: 'SOL',
    amount: 8.87,
    usdValue: 887.0,
    timestamp: Date.now() - 3600000 * 24 * 39,
    date: 'Sep 21, 2026',
    monthGroup: 'September',
    time: '11:10',
    status: 'confirmed',
    isGreen: false,
  },
  {
    id: 'sample_sol_tx_3',
    type: 'deposit',
    title: 'From A77H...4RiR',
    asset: 'SOL',
    amount: 3.21,
    usdValue: 321.0,
    timestamp: Date.now() - 3600000 * 24 * 56,
    date: 'Sep 4, 2026',
    monthGroup: 'September',
    time: '09:05',
    status: 'confirmed',
    isGreen: true,
    sender: 'A77H...4RiR',
  },
];

export function TokenDetailModal({
  visible,
  onClose,
  token,
  livePrice,
  liveChange24h,
  solAmount = 0,
  cashBalance = 0,
  transactions = [],
  onSelectBuy,
  onSelectSend,
  onSelectReceive,
  onSelectSell,
  onExecuteSell,
  onExecuteBuy,
}: TokenDetailModalProps) {
  const activeTransactions = transactions && transactions.length > 0 ? transactions : SAMPLE_SOL_TRANSACTIONS;
  const [selectedTimeframe, setSelectedTimeframe] = useState<TimeframeOption>('LIVE');
  const [chartMode, setChartMode] = useState<'line' | 'candle'>('line');
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  const [isTradeSheetVisible, setIsTradeSheetVisible] = useState(false);
  const [isSellSheetVisible, setIsSellSheetVisible] = useState(false);
  const [isBuySheetVisible, setIsBuySheetVisible] = useState(false);
  const [sellAmountText, setSellAmountText] = useState('');
  const [buyAmountText, setBuyAmountText] = useState('50');
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [isPriceInverted, setIsPriceInverted] = useState(false);
  const [marketExpanded, setMarketExpanded] = useState(false);
  const [activeSubView, setActiveSubView] = useState<'holding' | 'explorer' | 'history'>('holding');

  // Live micro-tick simulation mirroring video
  const [priceTickDelta, setPriceTickDelta] = useState<number>(0.0029);
  const [percentTickDelta, setPercentTickDelta] = useState<number>(0.0);

  useEffect(() => {
    if (!visible) {
      setActiveSubView('holding');
      setScrubIndex(null);
      setIsSellSheetVisible(false);
      setIsBuySheetVisible(false);
      return;
    }

    // Simulate authentic exchange tick fluctuations every 3 seconds as seen in video
    const interval = setInterval(() => {
      const randomShift = (Math.random() - 0.48) * 0.05;
      setPriceTickDelta((prev) => {
        const next = parseFloat((prev + randomShift).toFixed(4));
        const pct = parseFloat(((next / (livePrice || 102.26)) * 100).toFixed(2));
        setPercentTickDelta(pct);
        return next;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [visible, livePrice]);

  if (!visible || !token) return null;

  // Determine if this is a user holding (specifically Solana with solAmount > 0 or user holding)
  const isHoldingToken =
    (token.symbol === 'SOL' && solAmount > 0) ||
    ('amount' in token && (token as any).amount > 0);

  const holdingQuantity =
    token.symbol === 'SOL'
      ? solAmount
      : 'amount' in token
        ? (token as any).amount
        : 0;

  const tokenPrice =
    'price' in token
      ? token.price
      : 'usdValue' in token && token.amount > 0
        ? token.usdValue / token.amount
        : 102.26;
  const basePrice = livePrice || tokenPrice;
  const currentPrice = basePrice + priceTickDelta;
  const tokenChange = 'change24h' in token ? token.change24h : 0;
  const baseChange = liveChange24h !== undefined ? liveChange24h : tokenChange;

  const tfBasePct = TIMEFRAME_PERCENTAGES[selectedTimeframe] ?? 3.42;
  const basePct = selectedTimeframe === 'LIVE' ? baseChange : tfBasePct;
  const currentChangePercent = parseFloat((basePct + percentTickDelta).toFixed(2));

  const tokenSymbol = token.symbol || 'SOL';
  const tokenName = token.name || 'Solana';
  const meta = getTokenMetrics(tokenSymbol);

  const chartPoints = TIMEFRAME_DATA[selectedTimeframe] || TIMEFRAME_DATA.LIVE;
  const timeLabels = TIMEFRAME_LABELS[selectedTimeframe] || TIMEFRAME_LABELS.LIVE;

  // Touch scrubbing live calculations
  let displayedPrice = currentPrice;
  let displayedChangePercent = currentChangePercent;
  let scrubTimestamp: string | null = null;

  if (scrubIndex !== null && chartPoints.length > 0) {
    const scrubVal = chartPoints[scrubIndex];
    const firstVal = chartPoints[0];
    const factor = scrubVal / (firstVal || 1);
    displayedPrice = Number((basePrice * factor).toFixed(basePrice < 1 ? 6 : 2));
    displayedChangePercent = Number((((scrubVal - firstVal) / (firstVal || 1)) * 100).toFixed(2));
    scrubTimestamp = timeLabels[scrubIndex] || timeLabels[timeLabels.length - 1];
  }

  const isPositive = displayedChangePercent >= 0;
  const strokeColor = isPositive ? '#14F195' : '#FF2B4D'; // Neon electric green or vivid red

  // Dynamic values matching authentic Phantom holding math sampled from video
  const holdingUsd = Number((holdingQuantity * currentPrice).toFixed(2));
  const investedAmount = Number((holdingQuantity * (currentPrice * 0.91)).toFixed(2)); // Realistic avg entry
  const totalPnlUsd = Number((holdingUsd - investedAmount).toFixed(2));
  const totalPnlPercent = Number(((totalPnlUsd / (investedAmount || 1)) * 100).toFixed(2));
  const isTotalPnlPositive = totalPnlUsd >= 0;

  const todayReturnUsd = Number(((holdingUsd * (currentChangePercent / 100))).toFixed(2));
  const isTodayReturnPositive = todayReturnUsd >= 0;

  // Chart coordinate mapping
  const graphWidth = SCREEN_WIDTH - 32;
  const graphHeight = isHoldingToken ? 150 : 200;
  const minVal = Math.min(...chartPoints);
  const maxVal = Math.max(...chartPoints);
  const range = maxVal - minVal || 1;
  const paddingY = 16;
  const usableHeight = graphHeight - paddingY * 2;

  const coords = chartPoints.map((val, idx) => {
    const x = (idx / (chartPoints.length - 1)) * graphWidth;
    const y = paddingY + usableHeight - ((val - minVal) / range) * usableHeight;
    return { x, y };
  });

  // Construct smooth cubic Bezier curve path
  let pathD = `M ${coords[0].x} ${coords[0].y}`;
  for (let i = 0; i < coords.length - 1; i++) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    const cpX = (p0.x + p1.x) / 2;
    pathD += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  // Shaded area under the curve
  const areaD = `${pathD} L ${coords[coords.length - 1].x} ${graphHeight} L ${coords[0].x} ${graphHeight} Z`;
  const lastPoint = coords[coords.length - 1];

  // Candlestick calculation
  const candleCount = chartPoints.length;
  const candleSpacing = graphWidth / candleCount;
  const candleBarWidth = Math.max(4, candleSpacing * 0.55);

  const candleItems = chartPoints.map((val, idx) => {
    const prev = idx > 0 ? chartPoints[idx - 1] : val * 0.99;
    const isUp = val >= prev;
    const highVal = Math.max(val, prev) + Math.abs(val - prev) * 0.35 + 1.2;
    const lowVal = Math.min(val, prev) - Math.abs(val - prev) * 0.35 - 1.2;

    const candleYHigh = paddingY + usableHeight - ((highVal - minVal) / range) * usableHeight;
    const candleYLow = paddingY + usableHeight - ((lowVal - minVal) / range) * usableHeight;
    const yVal = paddingY + usableHeight - ((val - minVal) / range) * usableHeight;
    const yPrev = paddingY + usableHeight - ((prev - minVal) / range) * usableHeight;

    const bodyTop = Math.min(yVal, yPrev);
    const bodyHeight = Math.max(3, Math.abs(yVal - yPrev));
    const centerX = idx * candleSpacing + candleSpacing / 2;

    const volHeight = Math.min(28, Math.max(6, (Math.abs(val - prev) + 2) * 2.5));
    const volY = graphHeight - volHeight;

    return {
      centerX,
      bodyTop,
      bodyHeight,
      candleYHigh: Math.max(paddingY, candleYHigh),
      candleYLow: Math.min(graphHeight - 6, candleYLow),
      color: isUp ? '#14F195' : '#FF2B4D',
      volHeight,
      volY,
    };
  });

  const handleGraphTouch = (evt: GestureResponderEvent) => {
    const x = evt.nativeEvent.locationX;
    const clampedX = Math.max(0, Math.min(graphWidth, x));
    const index = Math.round((clampedX / graphWidth) * (chartPoints.length - 1));
    if (index !== scrubIndex && index >= 0 && index < chartPoints.length) {
      setScrubIndex(index);
      try {
        Vibration.vibrate(8);
      } catch {}
    }
  };

  const handleGraphTouchEnd = () => {
    setScrubIndex(null);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowStickyHeader(offsetY > 70);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${tokenName} (${tokenSymbol}) at $${currentPrice.toFixed(2)} on Phantom!`,
      });
    } catch {}
  };

  // Full History Sub-View (Sampled 1:1 from 00:43 of video)
  if (activeSubView === 'history') {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={() => setActiveSubView('holding')}>
        <View style={styles.container}>
          {/* Top Navigation */}
          <View style={styles.historyTopBar}>
            <TouchableOpacity
              onPress={() => setActiveSubView('holding')}
              style={styles.historyBackBtn}
              activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.historyTitleText}>History</Text>
            <View style={{ width: 36 }} />
          </View>

          <Text style={styles.historySubtitleText}>Solana Activity</Text>

          <ScrollView style={styles.historyScroll} contentContainerStyle={styles.historyContent}>
            {activeTransactions.length > 0 ? (
              <View style={styles.historyCardGroup}>
                {activeTransactions.map((tx, idx) => {
                  const isTrade = tx.type === 'buy' || tx.type === 'sell';
                  const displayTitle = isTrade
                    ? tx.type === 'buy'
                      ? 'Buy'
                      : 'Sell'
                    : tx.title && (tx.title.startsWith('From ') || tx.title.startsWith('To '))
                      ? tx.title
                      : tx.isGreen || tx.type === 'deposit' || tx.type === 'receive'
                        ? `From ${tx.sender ? formatSolAddress(tx.sender) : generateTruncatedSolAddress()}`
                        : `To ${tx.recipient ? formatSolAddress(tx.recipient) : generateTruncatedSolAddress()}`;

                  return (
                    <View
                      key={tx.id || idx}
                      style={styles.historyItemRow}>
                      <View style={styles.historyItemLeft}>
                        <View style={styles.historyIconCircle}>
                          {isTrade ? (
                            <Ionicons name="swap-horizontal" size={19} color="#A0A0AA" />
                          ) : (
                            <WalletTransactionIcon size={19} color="#A0A0AA" badgeBg="#1E1E22" />
                          )}
                        </View>
                        <View style={{ gap: 3, flex: 1 }}>
                          <Text style={styles.historyActionTitle} numberOfLines={1}>
                            {displayTitle}
                          </Text>
                          <Text style={styles.historyDateSub}>{tx.date}</Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.historyAmountText,
                          tx.isGreen ? styles.historyAmountGreen : styles.historyAmountWhite,
                        ]}>
                        {tx.isGreen ? `+${tx.amount}` : `-${tx.amount}`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyHistoryBox}>
                <Ionicons name="time-outline" size={40} color="#3A3A44" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyHistoryTitle}>No Solana Activity</Text>
                <Text style={styles.emptyHistorySub}>
                  When you buy, send, or receive SOL, your transactions will appear here.
                </Text>
              </View>
            )}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Sticky Collapsing Top Bar on scroll */}
        {showStickyHeader && (
          <View style={styles.stickyHeader}>
            <TouchableOpacity onPress={onClose} style={styles.iconCircleBtn} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.stickyTitleCenter}>
              <Text style={styles.stickyTokenTitle}>
                {tokenName} <Text style={styles.stickyTokenPrice}>${currentPrice.toFixed(2)}</Text>
              </Text>
            </View>

            <View style={styles.headerRightActions}>
              <TouchableOpacity onPress={handleShare} style={styles.iconCircleBtn} activeOpacity={0.7}>
                <Ionicons name="share-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}>
          {/* Drag Handle at top center */}
          <View style={styles.topHandleContainer}>
            <View style={styles.topDragHandle} />
          </View>

          {/* 1:1 Authentic Top Token Card matching Image 1 (media_1793340573104_db07a593.jpg) */}
          <View style={styles.tokenTopCard}>
            {/* Header Row: Token Info (Left) & Price / Return (Right) */}
            <View style={styles.tokenHeaderRow}>
              <View style={styles.tokenHeaderLeftCol}>
                <TouchableOpacity onPress={onClose} style={styles.headerBackChevron} activeOpacity={0.7}>
                  <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TokenAvatar symbol={tokenSymbol} size={36} iconBg="#0A0A0E" />
                <View style={styles.tokenHeaderTitlesCol}>
                  <Text style={styles.tokenHeaderName}>{tokenName}</Text>
                  <TouchableOpacity activeOpacity={0.7} style={styles.tokenHeaderSubtitleRow}>
                    <Text style={styles.tokenHeaderSubtitleText}>New 7d</Text>
                    <Ionicons name="chevron-forward" size={12} color="#9E9EA8" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.tokenHeaderRightCol}>
                <View style={styles.openStatusBadge}>
                  <View style={styles.greenPulseDot} />
                  <Text style={styles.openStatusText}>Open</Text>
                </View>

                <View style={styles.tokenHeaderPriceRow}>
                  <TouchableOpacity
                    onPress={() => setIsPriceInverted(!isPriceInverted)}
                    activeOpacity={0.7}
                    style={styles.currencyToggleBtn}>
                    <Ionicons name="swap-horizontal" size={14} color="#8E8E98" />
                  </TouchableOpacity>
                  <Text style={styles.tokenHeaderPriceText}>
                    ${displayedPrice.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>

                <View style={styles.tokenHeaderDeltaRow}>
                  <Text style={styles.tokenHeaderDeltaRed}>-$94.03</Text>
                  <Text style={styles.tokenHeaderDeltaPercent}>+0.50%</Text>
                </View>

                <Text style={styles.tokenHeader24hRed}>▼ -9.13%</Text>
              </View>
            </View>

            {/* Holding Amount Row */}
            <View style={styles.tokenHoldingRow}>
              <Text style={styles.tokenHoldingUsdTotal}>
                ${(holdingUsd || 943.79).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text style={styles.tokenHoldingQuantityText}>
                {holdingQuantity.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 5,
                })}{' '}
                {tokenSymbol}
              </Text>
            </View>

            {/* Dashed Horizontal Divider */}
            <View style={styles.dashedDividerWrapper}>
              <Svg height="2" width="100%">
                <Line
                  x1="0"
                  y1="1"
                  x2="450"
                  y2="1"
                  stroke="#262630"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </Svg>
            </View>

            {/* 4 Stats Metric Rows */}
            <View style={styles.metricsList}>
              <View style={styles.metricRow}>
                <Text style={styles.metricRowLabel}>Today's Return</Text>
                <Text style={[styles.metricRowValue, { color: '#14F195' }]}>+$13.66</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricRowLabel}>Amount Invested</Text>
                <Text style={styles.metricRowValue}>$1,038.62</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricRowLabel}>Realized</Text>
                <Text style={[styles.metricRowValue, { color: '#14F195' }]}>+$129.15</Text>
              </View>

              <View style={styles.metricRow}>
                <Text style={styles.metricRowLabel}>Avg. Entry</Text>
                <Text style={styles.metricRowValue}>$112.54</Text>
              </View>
            </View>
          </View>

          {/* 3 Action Buttons: Send, Receive, Share (1:1 with Image 1) */}
          <View style={styles.actionsThreeRow}>
            <TouchableOpacity
              style={styles.actionPillCard}
              onPress={() => {
                onClose();
                if (onSelectSend) onSelectSend();
              }}
              activeOpacity={0.75}>
              <ActionSendIcon size={22} color="#FFFFFF" />
              <Text style={styles.actionPillCardText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPillCard}
              onPress={() => {
                onClose();
                if (onSelectReceive) onSelectReceive();
              }}
              activeOpacity={0.75}>
              <ActionReceiveIcon size={22} color="#FFFFFF" />
              <Text style={styles.actionPillCardText}>Receive</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionPillCard}
              onPress={handleShare}
              activeOpacity={0.75}>
              <ActionShareIcon size={22} color="#FFFFFF" />
              <Text style={styles.actionPillCardText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Market Section */}
          <View style={styles.marketCard}>
            <View style={styles.marketHeaderRow}>
              <Text style={styles.marketTitleText}>Market</Text>
              <TouchableOpacity
                onPress={() => setMarketExpanded(!marketExpanded)}
                activeOpacity={0.7}>
                <Text style={styles.marketViewAllLink}>
                  {marketExpanded ? 'View less' : 'View all'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.marketRows}>
              <View style={styles.marketMetricRow}>
                <Text style={styles.marketMetricLabel}>Market Cap</Text>
                <Text style={styles.marketMetricValue}>{meta.marketCap}</Text>
              </View>

              <View style={styles.marketMetricRow}>
                <Text style={styles.marketMetricLabel}>Network</Text>
                <Text style={styles.marketMetricValue}>{meta.network}</Text>
              </View>

              <View style={styles.marketMetricRow}>
                <Text style={styles.marketMetricLabel}>24h Volume</Text>
                <Text style={styles.marketMetricValue}>{meta.volume24h}</Text>
              </View>

              {marketExpanded && (
                <>
                  <View style={styles.marketMetricRow}>
                    <Text style={styles.marketMetricLabel}>24h Trades</Text>
                    <Text style={styles.marketMetricValue}>{meta.trades24h}</Text>
                  </View>
                  <View style={styles.marketMetricRow}>
                    <Text style={styles.marketMetricLabel}>Funding Rate</Text>
                    <Text style={styles.marketMetricValue}>{meta.fundingRate}</Text>
                  </View>
                  <View style={styles.marketMetricRow}>
                    <Text style={styles.marketMetricLabel}>Open Interest</Text>
                    <Text style={styles.marketMetricValue}>{meta.openInterest}</Text>
                  </View>
                  <View style={styles.marketMetricRow}>
                    <Text style={styles.marketMetricLabel}>All-Time High</Text>
                    <Text style={styles.marketMetricValue}>{meta.allTimeHigh}</Text>
                  </View>
                  <View style={styles.marketMetricRow}>
                    <Text style={styles.marketMetricLabel}>Circulating Supply</Text>
                    <Text style={styles.marketMetricValue}>{meta.circulatingSupply}</Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* History > Section (NO BOX - Clean rows on black background 1:1 with Image 1) */}
          <View style={styles.historyPreviewSection}>
            <TouchableOpacity
              style={styles.historyHeaderRow}
              onPress={() => setActiveSubView('history')}
              activeOpacity={0.7}>
              <Text style={styles.historySectionTitle}>History</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.historyListNoBox}>
              {activeTransactions.slice(0, 3).map((tx, idx) => {
                const isTrade = tx.type === 'buy' || tx.type === 'sell';
                const displayTitle = isTrade
                  ? tx.type === 'buy'
                    ? 'Buy'
                    : 'Sell'
                  : tx.title && (tx.title.startsWith('From ') || tx.title.startsWith('To '))
                    ? tx.title
                    : tx.isGreen || tx.type === 'deposit' || tx.type === 'receive'
                      ? `From ${tx.sender ? formatSolAddress(tx.sender) : 'A77H...4RiR'}`
                      : `To ${tx.recipient ? formatSolAddress(tx.recipient) : generateTruncatedSolAddress()}`;

                return (
                  <TouchableOpacity
                    key={tx.id || idx}
                    style={styles.historyItemRowNoBox}
                    onPress={() => setActiveSubView('history')}
                    activeOpacity={0.75}>
                    <View style={styles.historyItemLeft}>
                      <View style={styles.historyIconCircle}>
                        {isTrade ? (
                          <Ionicons name="swap-horizontal" size={19} color="#FFFFFF" />
                        ) : (
                          <WalletTransactionIcon size={19} color="#FFFFFF" badgeBg="#1E1E22" />
                        )}
                      </View>
                      <View style={{ gap: 3, flex: 1 }}>
                        <Text style={styles.historyActionTitle} numberOfLines={1}>
                          {displayTitle}
                        </Text>
                        <Text style={styles.historyDateSub}>{tx.date}</Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.historyAmountText,
                        tx.isGreen ? styles.historyAmountGreen : styles.historyAmountWhite,
                      ]}>
                      {tx.isGreen ? `+${tx.amount}` : `-${tx.amount}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Spacer to prevent content from hiding under floating bottom bar */}
          <View style={{ height: 110 }} />
        </ScrollView>

        {/* ==================================================================== */}
        {/* FIXED FLOATING BOTTOM BUTTONS: [ Sell ] and [ Buy More ] (1:1 with Image 1) */}
        {/* ==================================================================== */}
        <View style={styles.holdingBottomPinnedBar}>
          <TouchableOpacity
            style={styles.holdingSellPillBtn}
            onPress={() => setIsSellSheetVisible(true)}
            activeOpacity={0.85}>
            <Text style={styles.holdingSellBtnText}>Sell</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.holdingBuyMorePillBtn}
            onPress={() => setIsBuySheetVisible(true)}
            activeOpacity={0.85}>
            <Text style={styles.holdingBuyMoreBtnText}>Buy More</Text>
          </TouchableOpacity>
        </View>

        {/* Trade Action Sheet Modal */}
        <Modal
          visible={isTradeSheetVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsTradeSheetVisible(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsTradeSheetVisible(false)}
            />

            <View style={styles.sheetContainer}>
              <View style={styles.tradeButtonsColumn}>
                <TouchableOpacity
                  style={styles.tradeOptionBtn}
                  onPress={() => setIsTradeSheetVisible(false)}
                  activeOpacity={0.85}>
                  <Text style={styles.tradeOptionText}>Long</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tradeOptionBtn}
                  onPress={() => setIsTradeSheetVisible(false)}
                  activeOpacity={0.85}>
                  <Text style={styles.tradeOptionText}>Short</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tradeOptionBtn}
                  onPress={() => {
                    setIsTradeSheetVisible(false);
                    setIsBuySheetVisible(true);
                  }}
                  activeOpacity={0.85}>
                  <Text style={styles.tradeOptionText}>Buy</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.tradeSheetCloseBtn}
                onPress={() => setIsTradeSheetVisible(false)}
                activeOpacity={0.75}>
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Quick Sell Sheet Modal */}
        <Modal
          visible={isSellSheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsSellSheetVisible(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsSellSheetVisible(false)}
            />
            <View style={styles.actionSheetBox}>
              <View style={styles.sheetDragHandle} />

              <View style={styles.actionSheetHeaderRow}>
                <View>
                  <Text style={styles.actionSheetTitle}>Sell {tokenSymbol}</Text>
                  <Text style={styles.actionSheetSub}>
                    Available: {holdingQuantity.toFixed(4)} {tokenSymbol} (~${holdingUsd.toFixed(2)})
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionSheetCloseBtn}
                  onPress={() => setIsSellSheetVisible(false)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetInputContainer}>
                <TextInput
                  style={styles.sheetAmountInput}
                  value={sellAmountText}
                  onChangeText={setSellAmountText}
                  placeholder="0.0"
                  placeholderTextColor="#5C5C66"
                  keyboardType="numeric"
                />
                <View style={styles.sheetTokenPill}>
                  <Text style={styles.sheetTokenPillText}>{tokenSymbol}</Text>
                </View>
              </View>

              <View style={styles.percentRow}>
                {[25, 50, 75, 100].map((pct) => (
                  <TouchableOpacity
                    key={pct}
                    style={styles.percentPill}
                    onPress={() => {
                      const amt = ((holdingQuantity * pct) / 100).toFixed(4);
                      setSellAmountText(amt);
                    }}
                    activeOpacity={0.75}>
                    <Text style={styles.percentPillText}>{pct === 100 ? 'Max' : `${pct}%`}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Estimated Proceeds</Text>
                <Text style={styles.estimateValueGreen}>
                  +${((parseFloat(sellAmountText) || 0) * currentPrice).toFixed(2)} USD
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmSellBtn}
                onPress={() => {
                  const amt = parseFloat(sellAmountText);
                  if (!amt || isNaN(amt) || amt <= 0) {
                    Alert.alert('Invalid Amount', 'Please enter a valid amount to sell.');
                    return;
                  }
                  if (amt > holdingQuantity) {
                    Alert.alert('Insufficient Balance', `You only have ${holdingQuantity.toFixed(4)} ${tokenSymbol}.`);
                    return;
                  }
                  const proceeds = Number((amt * currentPrice).toFixed(2));
                  if (onExecuteSell) {
                    onExecuteSell(amt, proceeds);
                  }
                  setIsSellSheetVisible(false);
                  setSellAmountText('');
                  Alert.alert('Order Executed', `Sold ${amt.toFixed(4)} ${tokenSymbol} for $${proceeds.toFixed(2)} USD!`);
                }}
                activeOpacity={0.85}>
                <Text style={styles.confirmSellBtnText}>Confirm Sell</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Quick Buy Sheet Modal */}
        <Modal
          visible={isBuySheetVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setIsBuySheetVisible(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsBuySheetVisible(false)}
            />
            <View style={styles.actionSheetBox}>
              <View style={styles.sheetDragHandle} />

              <View style={styles.actionSheetHeaderRow}>
                <View>
                  <Text style={styles.actionSheetTitle}>Buy {tokenSymbol}</Text>
                  <Text style={styles.actionSheetSub}>
                    Cash Balance: ${(cashBalance ?? 0).toFixed(2)} USD
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.actionSheetCloseBtn}
                  onPress={() => setIsBuySheetVisible(false)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.sheetInputContainer}>
                <Text style={styles.dollarPrefix}>$</Text>
                <TextInput
                  style={styles.sheetAmountInput}
                  value={buyAmountText}
                  onChangeText={setBuyAmountText}
                  placeholder="0.00"
                  placeholderTextColor="#5C5C66"
                  keyboardType="numeric"
                />
                <View style={styles.sheetTokenPill}>
                  <Text style={styles.sheetTokenPillText}>USD</Text>
                </View>
              </View>

              <View style={styles.percentRow}>
                {['25', '50', '100', '500'].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={styles.percentPill}
                    onPress={() => setBuyAmountText(amt)}
                    activeOpacity={0.75}>
                    <Text style={styles.percentPillText}>${amt}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.estimateRow}>
                <Text style={styles.estimateLabel}>Estimated Received</Text>
                <Text style={styles.estimateValueGreen}>
                  +{((parseFloat(buyAmountText) || 0) / (currentPrice || 1)).toFixed(4)} {tokenSymbol}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.confirmBuyBtn}
                onPress={() => {
                  const spentUsd = parseFloat(buyAmountText);
                  if (!spentUsd || isNaN(spentUsd) || spentUsd <= 0) {
                    Alert.alert('Invalid Amount', 'Please enter a valid amount to spend.');
                    return;
                  }
                  if ((cashBalance ?? 0) < spentUsd && (cashBalance ?? 0) > 0) {
                    Alert.alert(
                      'Insufficient Cash',
                      `You only have $${(cashBalance ?? 0).toFixed(2)} Cash. Add Cash first or buy with available cash.`
                    );
                    return;
                  }
                  const tokensBought = Number((spentUsd / (currentPrice || 1)).toFixed(6));
                  if (onExecuteBuy) {
                    onExecuteBuy(tokensBought, spentUsd);
                  }
                  setIsBuySheetVisible(false);
                  setBuyAmountText('50');
                  Alert.alert(
                    'Order Executed',
                    `Bought ${tokensBought.toFixed(4)} ${tokenSymbol} for $${spentUsd.toFixed(2)} USD!`
                  );
                }}
                activeOpacity={0.85}>
                <Text style={styles.confirmBuyBtnText}>Confirm Purchase</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 16,
    paddingBottom: 40,
  },
  topHandleContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  topDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#32323A',
  },
  holdingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBackChevron: {
    padding: 2,
    marginLeft: -4,
  },
  headerNameCol: {
    gap: 1,
  },
  headerTokenName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  headerViewSolLink: {
    color: '#ABA0EE',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  headerRightCol: {
    alignItems: 'flex-end',
    gap: 1,
  },
  headerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyToggleBtn: {
    padding: 2,
  },
  headerPriceText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  headerChangeText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  graphWrapper: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeframeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  timeframePillsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  timeframePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  timeframePillActive: {
    backgroundColor: '#1E1E24',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  timeframeLabel: {
    color: '#7E7E88',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  timeframeLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  candlestickBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* 1:1 Top Card Styles matching Image 1 */
  tokenTopCard: {
    backgroundColor: '#141418',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 18,
    marginBottom: 14,
  },
  tokenHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tokenHeaderLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  tokenHeaderTitlesCol: {
    gap: 2,
  },
  tokenHeaderName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  tokenHeaderSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  tokenHeaderSubtitleText: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.medium,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },
  tokenHeaderRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tokenHeaderPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tokenHeaderPriceText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  tokenHeaderDeltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tokenHeaderDeltaRed: {
    color: '#FF2A55',
    fontSize: 13,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  tokenHeaderDeltaPercent: {
    color: '#10B981',
    fontSize: 13,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  tokenHeader24hRed: {
    color: '#FF2A55',
    fontSize: 12.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  tokenHoldingRow: {
    marginTop: 8,
    marginBottom: 16,
    gap: 4,
  },
  tokenHoldingUsdTotal: {
    color: '#FFFFFF',
    fontSize: 34,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.6,
  },
  tokenHoldingQuantityText: {
    color: '#8E8E98',
    fontSize: 14.5,
    fontFamily: TypographyFonts.medium,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
  },

  /* Holding Card Styles (1:1 with video) */
  holdingCard: {
    backgroundColor: '#141418',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    marginBottom: 14,
  },
  holdingCardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  holdingSymbolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  holdingSymbolText: {
    color: '#9E9EA8',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  openStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  openStatusText: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  holdingBalanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  holdingBalanceLeft: {
    gap: 3,
  },
  holdingUsdTotalText: {
    color: '#FFFFFF',
    fontSize: 27,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.5,
  },
  holdingQuantityText: {
    color: '#8E8E98',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  holdingReturnRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  holdingPnlUsdText: {
    fontSize: 19,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.3,
  },
  holdingPnlPercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingPnlPercentText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  dashedDividerWrapper: {
    overflow: 'hidden',
    height: 2,
    marginBottom: 14,
  },
  metricsList: {
    gap: 9,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricRowLabel: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  metricRowValue: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },

  /* 3 Action Buttons Row */
  actionsThreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  actionPillCard: {
    flex: 1,
    height: 64,
    backgroundColor: '#16161B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
  },
  actionPillCardText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },

  /* Market Card */
  marketCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    marginBottom: 14,
  },
  marketHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  marketTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  marketViewAllLink: {
    color: '#ABA0EE',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  marketRows: {
    gap: 10,
  },
  marketMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  marketMetricLabel: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  marketMetricValue: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },

  /* History Preview Section (1:1 replica of Phantom screenshot media_1793340573104_db07a593.jpg - NO BOX) */
  historyPreviewSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  historyHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
    marginBottom: 10,
  },
  historySectionTitle: {
    color: '#FFFFFF',
    fontSize: 18.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    letterSpacing: -0.3,
  },
  historyListNoBox: {
    paddingVertical: 2,
    gap: 16,
  },
  historyItemRowNoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  historyIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyActionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  historyDateSub: {
    color: '#8E8E93',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    letterSpacing: -0.1,
    marginTop: 2,
  },
  historyAmountText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  historyAmountGreen: {
    color: '#66C176', // Sampled 1:1 from screenshot RGB(102, 193, 118)
  },
  historyAmountWhite: {
    color: '#FFFFFF',
  },

  /* Full History Sub-View */
  historyTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 8,
  },
  historyBackBtn: {
    padding: 4,
    marginLeft: -4,
  },
  historyTitleText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  historySubtitleText: {
    color: '#8E8E98',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  historyScroll: {
    flex: 1,
  },
  historyContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  monthGroupHeader: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  historyCardGroup: {
    paddingHorizontal: 0,
    marginBottom: 8,
  },
  emptyHistoryBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  emptyHistoryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    marginBottom: 6,
  },
  emptyHistorySub: {
    color: '#8E8E98',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: TypographyFonts.regular,
  },
  historyItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },

  /* Explorer View Elements */
  receivePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E1E24',
    height: 48,
    borderRadius: 24,
    marginBottom: 20,
  },
  receivePillText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeaderBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  inlineTitleChevron: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  onlineText: {
    color: '#10B981',
    fontSize: 12.5,
    fontWeight: '600',
  },
  chatInputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#1E1E24',
    gap: 12,
  },
  chatAvatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#26243A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInputPlaceholder: {
    color: '#7E7E88',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
  },
  holdersCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
  },
  holderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  holderRowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A20',
  },
  holderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  holderAvatarBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  holderHandleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  holderSubText: {
    color: '#7E7E88',
    fontSize: 12.5,
    fontFamily: TypographyFonts.regular,
  },
  holderRight: {
    alignItems: 'flex-end',
  },
  holderValueText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  holderPnlNegative: {
    color: '#FF2A55',
    fontSize: 12.5,
    fontWeight: '600',
  },
  insightCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E1E24',
    marginBottom: 20,
    gap: 8,
  },
  insightText: {
    color: '#E0E0E6',
    fontSize: 13.5,
    lineHeight: 19,
    fontFamily: TypographyFonts.regular,
  },
  insightFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  insightFooterText: {
    color: '#7E7E88',
    fontSize: 11.5,
    fontFamily: TypographyFonts.medium,
  },
  aboutBodyText: {
    color: '#AEAEB8',
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 12,
    fontFamily: TypographyFonts.regular,
  },
  aboutButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  aboutPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E1E24',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  aboutPillText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },

  /* Fixed Pinned Bottom Bar for Held Tokens (Sell & Buy More side-by-side) */
  holdingBottomPinnedBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#18181D',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 18,
  },
  holdingSellPillBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C1C22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdingSellBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  holdingBuyMorePillBtn: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ABA0EE', // Signature Phantom lilac purple
    justifyContent: 'center',
    alignItems: 'center',
  },
  holdingBuyMoreBtnText: {
    color: '#121026',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },

  /* Non-Holding Pinned Bottom Bar: $2.5B traded today + Lilac Trade Button */
  bottomBarPinned: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0F0F12',
    borderTopWidth: 1,
    borderTopColor: '#1A1A20',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 36 : 18,
  },
  bottomTradedCol: {
    flex: 1,
  },
  tradedTodayText: {
    color: '#7E7E88',
    fontSize: 13,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  tradePillBtn: {
    backgroundColor: '#ABA0EE',
    paddingHorizontal: 36,
    paddingVertical: 13,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tradeBtnText: {
    color: '#121026',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },

  /* Sticky Header */
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.92)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181D',
  },
  stickyTitleCenter: {
    alignItems: 'center',
  },
  stickyTokenTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  stickyTokenPrice: {
    color: '#E2E2EA',
    fontWeight: '500',
    fontSize: 14,
    fontFamily: TypographyFonts.medium,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Trade Action Sheet Modal */
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheetContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 42 : 24,
    gap: 14,
    alignItems: 'center',
  },
  tradeButtonsColumn: {
    width: '100%',
    gap: 10,
  },
  tradeOptionBtn: {
    backgroundColor: '#ABA0EE',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  tradeOptionText: {
    color: '#121026',
    fontSize: 16.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  tradeSheetCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  candlestickBtnActive: {
    backgroundColor: '#1E1E24',
    borderRadius: 8,
  },
  headerChangeAndScrubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scrubBadge: {
    backgroundColor: '#1E1E24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  scrubBadgeText: {
    color: '#ABA0EE',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  actionSheetBox: {
    backgroundColor: '#16161C',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    width: '100%',
    borderWidth: 1,
    borderColor: '#22222A',
  },
  sheetDragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#32323A',
    alignSelf: 'center',
    marginBottom: 14,
  },
  actionSheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionSheetTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  actionSheetSub: {
    color: '#8E8E98',
    fontSize: 13,
    marginTop: 2,
    fontFamily: TypographyFonts.medium,
  },
  actionSheetCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22222A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D0D10',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#282832',
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 14,
  },
  dollarPrefix: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginRight: 4,
    fontFamily: TypographyFonts.bold,
  },
  sheetAmountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  sheetTokenPill: {
    backgroundColor: '#1E1E24',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  sheetTokenPillText: {
    color: '#ABA0EE',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  percentRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  percentPill: {
    flex: 1,
    backgroundColor: '#1E1E24',
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentPillText: {
    color: '#E2E2EA',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  estimateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  estimateLabel: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontFamily: TypographyFonts.medium,
  },
  estimateValueGreen: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  confirmSellBtn: {
    backgroundColor: '#FF2A55',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmSellBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  confirmBuyBtn: {
    backgroundColor: '#ABA0EE',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBuyBtnText: {
    color: '#121026',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
});
