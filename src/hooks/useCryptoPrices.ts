import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CryptoPriceMap,
  CryptoPriceInfo,
  FALLBACK_PRICES,
  fetchLiveCryptoPrices,
  formatTokenPrice,
  formatMarketCap,
} from '@/services/cryptoService';
import { WATCHLIST_TOKENS, WatchlistToken } from '@/constants/mockData';

// Default initial Solana amount matching authentic user screenshot
export const DEFAULT_SOL_AMOUNT = 9.22861;

export interface UseCryptoPricesResult {
  prices: CryptoPriceMap;
  solPrice: number;
  solAmount: number;
  solChange24h: number;
  solChangeUsd: number;
  solHoldingUsd: number;
  totalBalance: number;
  watchlist: WatchlistToken[];
  isLive: boolean;
  isLoading: boolean;
  isRefreshing: boolean;
  source: 'coincap' | 'binance' | 'backend' | 'fallback';
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useCryptoPrices(
  solAmount: number = DEFAULT_SOL_AMOUNT,
  cashBalance: number = 0
): UseCryptoPricesResult {
  const [prices, setPrices] = useState<CryptoPriceMap>(FALLBACK_PRICES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [source, setSource] = useState<'coincap' | 'binance' | 'backend' | 'fallback'>('fallback');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const isMountedRef = useRef(true);

  const loadPrices = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const res = await fetchLiveCryptoPrices();
      if (isMountedRef.current) {
        setPrices(res.prices);
        setSource(res.source);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.warn('Failed to load crypto prices:', err);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    loadPrices();

    // Auto refresh every 15 seconds
    const interval = setInterval(() => {
      loadPrices();
    }, 15000);

    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadPrices]);

  const solData: CryptoPriceInfo = prices.SOL || FALLBACK_PRICES.SOL;
  const solPrice = solData.price;
  const solChange24h = solData.change24h;

  // Exact formula: (how many tokens) * (current value of solana)
  const solHoldingUsd = Number((solAmount * solPrice).toFixed(2));

  // Yesterday's Solana holding value based on 24h performance from yesterday:
  const solRate = solChange24h / 100;
  const solHoldingYesterdayUsd = solRate !== -1 ? solHoldingUsd / (1 + solRate) : solHoldingUsd;

  // Gain or loss under the amount indicates the change compared to Solana's value from yesterday:
  const solChangeUsd =
    solAmount > 0 ? Number((solHoldingUsd - solHoldingYesterdayUsd).toFixed(2)) : 0;

  // Amount up top is strictly the total value of Solana tokens: (tokens * current value of solana)
  const totalBalance = solHoldingUsd;

  // Dynamic watchlist with real-time prices & 24h performance
  const watchlist: WatchlistToken[] = WATCHLIST_TOKENS.map((token) => {
    const live = prices[token.symbol];
    if (!live) return token;
    return {
      ...token,
      price: live.price,
      change24h: live.change24h,
      marketCap: live.marketCap || token.marketCap,
    };
  });

  return {
    prices,
    solPrice,
    solAmount,
    solChange24h,
    solChangeUsd,
    solHoldingUsd,
    totalBalance,
    watchlist,
    isLive: source !== 'fallback',
    isLoading,
    isRefreshing,
    source,
    lastUpdated,
    refresh: () => loadPrices(true),
  };
}
