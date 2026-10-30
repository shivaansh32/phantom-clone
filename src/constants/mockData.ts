export interface TokenItem {
  id: string;
  name: string;
  symbol: string;
  marketCap: string;
  price: number;
  change24h: number;
  rankBadge?: string;
  iconBg: string;
  iconType: string;
}

export interface PerpItem {
  id: string;
  symbol: string;
  leverage: string;
  volume: string;
  price: number;
  change24h: number;
  iconBg: string;
}

export interface HotMarket {
  id: string;
  symbol: string;
  marketCap: string;
  change24h: number;
  viewers: number;
  iconBg: string;
  avatars: string[];
}

export interface LiveTrade {
  id: string;
  tag: string;
  tagColor: string;
  trade: string;
  winRate: string;
  timeAgo: string;
}

export interface TopTrader {
  id: string;
  handle: string;
  followers: string;
  pnl: string;
  pnlChange: number;
  avatarColor: string;
}

export interface PredictionMatch {
  id: string;
  league: string;
  teamA: string;
  teamB: string;
  teamAPercent: number;
  teamBPercent: number;
  timeRemaining: string;
}

export interface UserHolding {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  usdValue: number;
  changeUsd: number;
  iconBg: string;
}

export interface PerpSentimentCard {
  id: string;
  symbol: string;
  shorts: string;
  sentiment: string;
  longPct: number;
  shortPct: number;
  iconBg: string;
}

export interface WatchlistToken {
  id: string;
  name: string;
  symbol: string;
  marketCap: string;
  price: number;
  change24h: number;
  iconBg: string;
}

export const USER_HOLDINGS: UserHolding[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    amount: 0,
    usdValue: 0,
    changeUsd: 0,
    iconBg: '#0A0A0E',
  },
];

export const PERP_SENTIMENT_CARDS: PerpSentimentCard[] = [
  {
    id: 'xrp_sentiment',
    symbol: 'XRP',
    shorts: '$48.5M Shorts',
    sentiment: 'Bearish ↘',
    longPct: 25,
    shortPct: 75,
    iconBg: '#23487E',
  },
  {
    id: 'amd_sentiment',
    symbol: 'AMD',
    shorts: '$10.4M Shorts',
    sentiment: 'Bearish ↘',
    longPct: 26,
    shortPct: 74,
    iconBg: '#18181A',
  },
];

export const HOME_PREDICTIONS = [
  {
    id: 'btc_up_down',
    title: 'BTC Up or Down • 5m',
    icon: 'bitcoin',
    iconBg: '#F7931A',
  },
  {
    id: 'roma_cagliari',
    title: 'Roma vs Cagliari',
    subtitle: 'in 3h 28m',
    icon: 'soccer',
    iconBg: '#EF4444',
  },
];

export const WATCHLIST_TOKENS: WatchlistToken[] = [
  {
    id: 'eth_watch',
    name: 'Ethereum',
    symbol: 'ETH',
    marketCap: '$286B MC',
    price: 2341.54,
    change24h: 0.89,
    iconBg: '#627EEA',
  },
  {
    id: 'btc_watch',
    name: 'Bitcoin',
    symbol: 'BTC',
    marketCap: '$1.6T MC',
    price: 80376.65,
    change24h: 0.33,
    iconBg: '#F7931A',
  },
  {
    id: 'sol_watch',
    name: 'Solana',
    symbol: 'SOL',
    marketCap: '$59B MC',
    price: 100.76,
    change24h: -0.65,
    iconBg: '#0A0A0E',
  },
];

export const INITIAL_TOKENS: TokenItem[] = [
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    marketCap: '$86B MC',
    price: 182.45,
    change24h: 3.42,
    rankBadge: '1',
    iconBg: '#14F195',
    iconType: 'sol',
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    marketCap: '$400B MC',
    price: 3380.25,
    change24h: -0.65,
    rankBadge: '2',
    iconBg: '#627EEA',
    iconType: 'eth',
  },
  {
    id: 'lmao',
    name: 'LMAO',
    symbol: 'LMAO!',
    marketCap: '$3.2M MC',
    price: 0.0032194,
    change24h: 29.95,
    iconBg: '#F59E0B',
    iconType: 'lmao',
  },
  {
    id: 'chip',
    name: 'CHIP',
    symbol: 'CHIP',
    marketCap: '$112M MC',
    price: 0.0557,
    change24h: 22.55,
    iconBg: '#1E293B',
    iconType: 'chip',
  },
  {
    id: 'inj',
    name: 'Injective',
    symbol: 'INJ',
    marketCap: '$795M MC',
    price: 7.89,
    change24h: -0.47,
    rankBadge: '3',
    iconBg: '#3B82F6',
    iconType: 'inj',
  },
  {
    id: 'pump',
    name: 'PUMP',
    symbol: 'PUMP',
    marketCap: '$1.5B MC',
    price: 0.0042957,
    change24h: -1.73,
    iconBg: '#10B981',
    iconType: 'pump',
  },
  {
    id: 'vvv',
    name: 'VVV',
    symbol: 'VVV',
    marketCap: '$1.2B MC',
    price: 25.44,
    change24h: 0.11,
    iconBg: '#EF4444',
    iconType: 'vvv',
  },
  {
    id: 'launch',
    name: 'LAUNCH',
    symbol: 'LAUNCH',
    marketCap: '$1.9M MC',
    price: 0.00187342,
    change24h: -0.58,
    iconBg: '#F97316',
    iconType: 'launch',
  },
  {
    id: 'tsla',
    name: 'Tesla',
    symbol: 'TSLA',
    marketCap: '$75M MC',
    price: 394.79,
    change24h: 5.75,
    iconBg: '#DC2626',
    iconType: 'tsla',
  },
  {
    id: 'kmno',
    name: 'Kamino',
    symbol: 'KMNO',
    marketCap: '$252M MC',
    price: 0.0432,
    change24h: -0.59,
    iconBg: '#0284C7',
    iconType: 'kmno',
  },
  {
    id: 'btc',
    name: 'Bitcoin Meme',
    symbol: 'BTC',
    marketCap: '$5.8M MC',
    price: 0.00584299,
    change24h: -52.99,
    iconBg: '#D97706',
    iconType: 'btc',
  },
  {
    id: 'anthropic',
    name: 'Anthropic AI',
    symbol: 'ANTHROPIC',
    marketCap: '$7.7M MC',
    price: 1001.28,
    change24h: 1.01,
    iconBg: '#78350F',
    iconType: 'anthropic',
  },
  {
    id: 'microduck',
    name: 'Micro Duck',
    symbol: 'MICRODUCK',
    marketCap: '$2.1M MC',
    price: 0.00483424,
    change24h: 14.2,
    iconBg: '#EAB308',
    iconType: 'duck',
  },
];

export const PERP_TOKENS: PerpItem[] = [
  {
    id: 'skhx',
    symbol: 'SKHX',
    leverage: '10x',
    volume: '$218M Vol',
    price: 990.85,
    change24h: 2.83,
    iconBg: '#6366F1',
  },
  {
    id: 'ewz',
    symbol: 'EWZ',
    leverage: '20x',
    volume: '$121M Vol',
    price: 33.75,
    change24h: -25.24,
    iconBg: '#10B981',
  },
  {
    id: 'ewy',
    symbol: 'EWY',
    leverage: '20x',
    volume: '$37M Vol',
    price: 153.64,
    change24h: 1.12,
    iconBg: '#EC4899',
  },
  {
    id: 'smsn',
    symbol: 'SMSN',
    leverage: '10x',
    volume: '$42M Vol',
    price: 165.77,
    change24h: 0.85,
    iconBg: '#8B5CF6',
  },
];

export const HOT_MARKETS: HotMarket[] = [
  {
    id: 'pump_hot',
    symbol: 'PUMP',
    marketCap: '$2B MC',
    change24h: -1.75,
    viewers: 10,
    iconBg: '#10B981',
    avatars: ['#F59E0B', '#EC4899', '#3B82F6'],
  },
  {
    id: 'bncb_hot',
    symbol: 'BNCB',
    marketCap: '$36.7M MC',
    change24h: -2.54,
    viewers: 1,
    iconBg: '#F97316',
    avatars: ['#EF4444'],
  },
  {
    id: 'sol_hot',
    symbol: 'SOL',
    marketCap: '$110B MC',
    change24h: 3.42,
    viewers: 84,
    iconBg: '#8B5CF6',
    avatars: ['#10B981', '#3B82F6', '#F59E0B'],
  },
];

export const LIVE_TRADES: LiveTrade[] = [
  {
    id: 'trade_1',
    tag: 'WHALE',
    tagColor: '#3B82F6',
    trade: 'CRCL 10x Long • $906K',
    winRate: '55% Win Rate',
    timeAgo: 'Just now',
  },
  {
    id: 'trade_2',
    tag: 'Profitable Trader',
    tagColor: '#10B981',
    trade: 'SNDK 10x Short • $71K',
    winRate: '57% Win Rate',
    timeAgo: '1m ago',
  },
  {
    id: 'trade_3',
    tag: 'Top Trader',
    tagColor: '#F59E0B',
    trade: 'HYPE 10x Short • $809K',
    winRate: '70% Win Rate',
    timeAgo: '3m ago',
  },
];

export const TOP_TRADERS: TopTrader[] = [
  {
    id: 'trader_1',
    handle: '@obi2obi',
    followers: '6K Followers',
    pnl: '+$86,552',
    pnlChange: 3,
    avatarColor: '#10B981',
  },
  {
    id: 'trader_2',
    handle: '@shadowshadow...',
    followers: '5K Followers',
    pnl: '+$42,212',
    pnlChange: 17,
    avatarColor: '#8B5CF6',
  },
  {
    id: 'trader_3',
    handle: '@sendit8888888',
    followers: '11K Followers',
    pnl: '+$34,755',
    pnlChange: -14,
    avatarColor: '#EC4899',
  },
  {
    id: 'trader_4',
    handle: '@Dao1112131',
    followers: '10K Followers',
    pnl: '+$31,262',
    pnlChange: -11,
    avatarColor: '#06B6D4',
  },
  {
    id: 'trader_5',
    handle: '@PHONEWALLETS',
    followers: '14K Followers',
    pnl: '+$29,030',
    pnlChange: 8,
    avatarColor: '#F59E0B',
  },
];

export const FIVE_MIN_MARKETS = [
  { id: 'eth_5m', symbol: 'ETH', duration: '5m', iconColor: '#627EEA' },
  { id: 'hype_5m', symbol: 'HYPE', duration: '5m', iconColor: '#22C55E' },
  { id: 'sol_5m', symbol: 'SOL', duration: '5m', iconColor: '#14F195' },
  { id: 'xrp_5m', symbol: 'XRP', duration: '5m', iconColor: '#FFFFFF' },
];

export const FEATURED_MATCH: PredictionMatch = {
  id: 'psg_lyon',
  league: 'Ligue 1',
  teamA: 'Paris Saint-Germain',
  teamB: 'Lyon',
  teamAPercent: 74,
  teamBPercent: 11,
  timeRemaining: 'In 2h',
};

export interface StarterMarketToken {
  id: string;
  name: string;
  symbol: string;
  marketCap: string;
  price: number;
  change24h: number;
  rankBadge?: string;
  iconBg: string;
  iconType: string;
}

export const STARTER_MARKET_TOKENS: StarterMarketToken[] = [
  {
    id: 'neuralink',
    name: 'NEURALINK',
    symbol: 'NEURALINK',
    marketCap: '$1.2M MC',
    price: 463.60,
    change24h: 12.70,
    rankBadge: '1',
    iconBg: '#FFFFFF',
    iconType: 'neuralink',
  },
  {
    id: 'xmr',
    name: 'XMR',
    symbol: 'XMR',
    marketCap: '$1.9M MC',
    price: 598.20,
    change24h: 0.44,
    rankBadge: '2',
    iconBg: '#F26822',
    iconType: 'xmr',
  },
  {
    id: 'beam',
    name: 'BEAM',
    symbol: 'BEAM',
    marketCap: '$233M MC',
    price: 0.00452381,
    change24h: 35.12,
    rankBadge: '3',
    iconBg: '#181C26',
    iconType: 'beam',
  },
  {
    id: 'chillhouse',
    name: 'CHILLHOUSE',
    symbol: 'CHILLHOUSE',
    marketCap: '$480K MC',
    price: 0.00078836,
    change24h: 18.42,
    iconBg: '#C8B8A6',
    iconType: 'chillhouse',
  },
  {
    id: 'aero',
    name: 'AERO',
    symbol: 'AERO',
    marketCap: '$410M MC',
    price: 0.62,
    change24h: 4.15,
    iconBg: '#0052FF',
    iconType: 'aero',
  },
];
