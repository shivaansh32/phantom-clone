import { WATCHLIST_TOKENS, USER_HOLDINGS } from '@/constants/mockData';
import { API_BASE_URL } from '@/constants/api';

export interface CryptoPriceInfo {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  marketCap?: string;
  marketCapNum?: number;
  volume24h?: number;
  lastUpdated: number;
}

export type CryptoPriceMap = Record<string, CryptoPriceInfo>;

// Baseline fallback prices if all network endpoints are unreachable or device is offline
export const FALLBACK_PRICES: CryptoPriceMap = {
  SOL: {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    price: 100.7606, // 9.22861 SOL * 100.7606 = $929.88 holding
    change24h: -0.65, // -0.65% from yesterday gives -$6.11 change from yesterday
    marketCap: '$59B MC',
    marketCapNum: 59000000000,
    lastUpdated: Date.now(),
  },
  BTC: {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 94250.8,
    change24h: 1.85,
    marketCap: '$1.86T MC',
    marketCapNum: 1860000000000,
    lastUpdated: Date.now(),
  },
  ETH: {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    price: 3380.25,
    change24h: -0.65,
    marketCap: '$406B MC',
    marketCapNum: 406000000000,
    lastUpdated: Date.now(),
  },
  XRP: {
    id: 'ripple',
    symbol: 'XRP',
    name: 'XRP',
    price: 1.88,
    change24h: 4.12,
    marketCap: '$107B MC',
    marketCapNum: 107000000000,
    lastUpdated: Date.now(),
  },
};

/**
 * Format a raw market cap number into a human-readable badge (e.g. $86.2B MC)
 */
export function formatMarketCap(val: number | string | undefined): string {
  if (val === undefined || val === null) return '';
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '';
  if (num >= 1e12) return `$${(num / 1e12).toFixed(1)}T MC`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B MC`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M MC`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K MC`;
  return `$${num.toFixed(2)} MC`;
}

/**
 * Format token price with intelligent decimal places
 */
export function formatTokenPrice(price: number): string {
  if (isNaN(price)) return '0.00';
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 1) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 0.001) {
    return price.toFixed(4);
  }
  return price.toFixed(6);
}

/**
 * Fetch live prices from CoinCap API (Primary)
 */
async function fetchFromCoinCap(): Promise<CryptoPriceMap | null> {
  const url =
    'https://api.coincap.io/v2/assets?ids=solana,bitcoin,ethereum,ripple,injective-protocol';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();
    if (!data || !Array.isArray(data.data)) return null;

    const result: CryptoPriceMap = {};
    const now = Date.now();

    for (const item of data.data) {
      const sym = item.symbol.toUpperCase();
      const priceNum = parseFloat(item.priceUsd);
      const changeNum = parseFloat(item.changePercent24Hr);
      const capNum = item.marketCapUsd ? parseFloat(item.marketCapUsd) : undefined;

      result[sym] = {
        id: item.id,
        symbol: sym,
        name: item.name,
        price: isNaN(priceNum) ? 0 : priceNum,
        change24h: isNaN(changeNum) ? 0 : parseFloat(changeNum.toFixed(2)),
        marketCap: formatMarketCap(capNum),
        marketCapNum: capNum,
        volume24h: item.volumeUsd24Hr ? parseFloat(item.volumeUsd24Hr) : undefined,
        lastUpdated: now,
      };
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Fetch live prices from Binance API (Secondary Fallback)
 */
async function fetchFromBinance(): Promise<CryptoPriceMap | null> {
  const symbols = '["SOLUSDT","BTCUSDT","ETHUSDT","XRPUSDT"]';
  const url = `https://api.binance.com/api/v3/ticker/24hr?symbols=${encodeURIComponent(symbols)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const list = await response.json();
    if (!Array.isArray(list)) return null;

    const symbolMap: Record<string, { id: string; name: string; sym: string }> = {
      SOLUSDT: { id: 'solana', name: 'Solana', sym: 'SOL' },
      BTCUSDT: { id: 'bitcoin', name: 'Bitcoin', sym: 'BTC' },
      ETHUSDT: { id: 'ethereum', name: 'Ethereum', sym: 'ETH' },
      XRPUSDT: { id: 'ripple', name: 'XRP', sym: 'XRP' },
    };

    const result: CryptoPriceMap = {};
    const now = Date.now();

    for (const item of list) {
      const meta = symbolMap[item.symbol];
      if (!meta) continue;

      const priceNum = parseFloat(item.lastPrice);
      const changeNum = parseFloat(item.priceChangePercent);

      result[meta.sym] = {
        id: meta.id,
        symbol: meta.sym,
        name: meta.name,
        price: isNaN(priceNum) ? 0 : priceNum,
        change24h: isNaN(changeNum) ? 0 : parseFloat(changeNum.toFixed(2)),
        marketCap: FALLBACK_PRICES[meta.sym]?.marketCap,
        volume24h: item.volume ? parseFloat(item.volume) : undefined,
        lastUpdated: now,
      };
    }

    return Object.keys(result).length > 0 ? result : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Fetch live prices from App Backend (Tertiary Fallback)
 */
async function fetchFromBackend(): Promise<CryptoPriceMap | null> {
  if (!API_BASE_URL) return null;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${API_BASE_URL}/crypto/prices`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) return null;
    const body = await response.json();
    if (body?.success && body?.data) {
      return body.data as CryptoPriceMap;
    }
    return null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}

/**
 * Main real-time price fetcher with multi-tiered resilience:
 * 1. CoinCap public API
 * 2. Binance public API
 * 3. App backend proxy
 * 4. Local fallback defaults
 */
export async function fetchLiveCryptoPrices(): Promise<{
  prices: CryptoPriceMap;
  source: 'coincap' | 'binance' | 'backend' | 'fallback';
}> {
  // 1. Try CoinCap
  const coincapData = await fetchFromCoinCap();
  if (coincapData && coincapData.SOL) {
    return { prices: { ...FALLBACK_PRICES, ...coincapData }, source: 'coincap' };
  }

  // 2. Try Binance
  const binanceData = await fetchFromBinance();
  if (binanceData && binanceData.SOL) {
    return { prices: { ...FALLBACK_PRICES, ...binanceData }, source: 'binance' };
  }

  // 3. Try Backend
  const backendData = await fetchFromBackend();
  if (backendData && backendData.SOL) {
    return { prices: { ...FALLBACK_PRICES, ...backendData }, source: 'backend' };
  }

  // 4. Offline / fallback
  return { prices: FALLBACK_PRICES, source: 'fallback' };
}

