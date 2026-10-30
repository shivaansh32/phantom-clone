import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { TokenAvatar } from '@/components/TokenAvatar';
import {
  HOT_MARKETS,
  LIVE_TRADES,
  TOP_TRADERS,
  HotMarket,
  LiveTrade,
  TopTrader,
} from '@/constants/mockData';
import { CryptoPriceMap } from '@/services/cryptoService';

interface TradeScreenProps {
  prices?: CryptoPriceMap;
  onSelectToken?: (token: any) => void;
}

export function TradeScreen({ prices, onSelectToken }: TradeScreenProps = {}) {
  const c = Colors.phantom;
  const [activeCategory, setActiveCategory] = useState<'trending' | 'perps' | 'new'>('trending');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* 1. Hot Markets Section */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Hot Markets</Text>
          <Text style={styles.sectionSubtitle}>Based on trader activity</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.hotMarketsScroll}>
        {HOT_MARKETS.map((item) => {
          const live = prices ? prices[item.symbol] : undefined;
          const change24h = live ? live.change24h : item.change24h;
          const marketCap = live?.marketCap || item.marketCap;
          const isPositive = change24h >= 0;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.hotMarketCard}
              onPress={() =>
                onSelectToken &&
                onSelectToken({
                  id: item.id,
                  name: item.symbol,
                  symbol: item.symbol,
                  price: live?.price || 100,
                  change24h,
                  marketCap,
                  iconBg: item.iconBg,
                })
              }
              activeOpacity={0.8}>
              <View style={styles.hotMarketTop}>
                <View style={styles.hotMarketTokenRow}>
                  <TokenAvatar symbol={item.symbol} iconBg={item.iconBg} size={30} />
                  <View>
                    <Text style={styles.hotMarketSymbol}>{item.symbol}</Text>
                    <Text style={styles.hotMarketMc}>{marketCap}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.changePill,
                    { backgroundColor: isPositive ? c.greenBg : c.redBg },
                  ]}>
                  <Text
                    style={[
                      styles.changePillText,
                      { color: isPositive ? c.green : c.red },
                    ]}>
                    {isPositive ? `+${change24h}%` : `${change24h}%`}
                  </Text>
                </View>
              </View>

              <View style={styles.hotMarketBottom}>
                <View style={styles.viewersRow}>
                  <View style={styles.pulsingDot} />
                  <Text style={styles.viewersText}>
                    {item.viewers} {item.viewers === 1 ? 'person' : 'people'} viewing
                  </Text>
                </View>

                {/* Overlapping avatar stack */}
                <View style={styles.avatarStack}>
                  {item.avatars.map((color, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.miniAvatar,
                        { backgroundColor: color, marginLeft: idx > 0 ? -6 : 0 },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 2. Explore Markets Category Pills */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Explore Markets</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
        <TouchableOpacity
          style={[styles.pill, activeCategory === 'trending' && styles.pillActive]}
          onPress={() => setActiveCategory('trending')}
          activeOpacity={0.7}>
          <Text style={[styles.pillText, activeCategory === 'trending' && styles.pillTextActive]}>
            Trending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeCategory === 'perps' && styles.pillActive]}
          onPress={() => setActiveCategory('perps')}
          activeOpacity={0.7}>
          <Text style={[styles.pillText, activeCategory === 'perps' && styles.pillTextActive]}>
            Perps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.pill, activeCategory === 'new' && styles.pillActive]}
          onPress={() => setActiveCategory('new')}
          activeOpacity={0.7}>
          <Text style={[styles.pillText, activeCategory === 'new' && styles.pillTextActive]}>
            New Markets
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 3. Live Trades Section */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <View>
            <Text style={styles.sectionTitle}>Live Trades</Text>
            <Text style={styles.sectionSubtitle}>Top Traders' latest moves</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <View style={styles.liveTradesList}>
        {LIVE_TRADES.map((trade) => (
          <TouchableOpacity key={trade.id} style={styles.liveTradeCard} activeOpacity={0.8}>
            <View style={styles.liveTradeLeft}>
              <View style={[styles.tradeTagBadge, { backgroundColor: '#1A1A26' }]}>
                {trade.tag === 'WHALE' && <Text style={{ fontSize: 13 }}>🐋</Text>}
                {trade.tag === 'Profitable Trader' && <Ionicons name="trending-up" size={13} color="#10B981" />}
                {trade.tag === 'Top Trader' && <Ionicons name="flash" size={13} color="#F59E0B" />}
                <Text style={[styles.tradeTagText, { color: trade.tagColor }]}>{trade.tag}</Text>
              </View>
              <Text style={styles.tradeDescription}>{trade.trade}</Text>
            </View>

            <View style={styles.liveTradeRight}>
              <Text style={styles.winRateText}>{trade.winRate}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 4. Top Traders Section */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleRow} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Top Traders</Text>
          <Ionicons name="chevron-forward" size={18} color="#8E8E9B" />
        </TouchableOpacity>
      </View>

      <View style={styles.tradersList}>
        {TOP_TRADERS.map((trader, index) => {
          const isPositive = trader.pnlChange >= 0;
          return (
            <TouchableOpacity key={trader.id} style={styles.traderRow} activeOpacity={0.7}>
              <View style={styles.traderLeft}>
                <View style={[styles.traderAvatar, { backgroundColor: trader.avatarColor }]}>
                  <Text style={styles.traderAvatarText}>
                    {trader.handle.slice(1, 3).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.traderHandle}>{trader.handle}</Text>
                  <Text style={styles.traderFollowers}>{trader.followers}</Text>
                </View>
              </View>

              <View style={styles.traderRight}>
                <Text style={[styles.traderPnl, { color: c.green }]}>
                  {trader.pnl}
                </Text>
                <Text
                  style={[
                    styles.traderChange,
                    { color: isPositive ? c.green : c.red },
                  ]}>
                  {isPositive ? `+${trader.pnlChange}%` : `${trader.pnlChange}%`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.phantom.background,
  },
  contentContainer: {
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderSpacing: {
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    color: '#8E8E9B',
    fontSize: 13,
    marginTop: 2,
  },
  hotMarketsScroll: {
    gap: 12,
    paddingRight: 16,
  },
  hotMarketCard: {
    width: 240,
    backgroundColor: '#13131C',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#20202E',
    justifyContent: 'space-between',
    gap: 14,
  },
  hotMarketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hotMarketTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  hotMarketSymbol: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  hotMarketMc: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  changePill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changePillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  hotMarketBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#1A1A26',
    paddingTop: 10,
  },
  viewersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D26A',
  },
  viewersText: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  miniAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#13131C',
  },
  pillsScroll: {
    gap: 8,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#14141C',
    borderWidth: 1,
    borderColor: '#20202C',
  },
  pillActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  pillText: {
    color: '#8E8E9B',
    fontSize: 13,
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#070709',
  },
  liveTradesList: {
    gap: 10,
  },
  liveTradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#12121A',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1C1C28',
  },
  liveTradeLeft: {
    gap: 4,
  },
  tradeTagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  tradeTagText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  tradeDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  liveTradeRight: {
    alignItems: 'flex-end',
  },
  winRateText: {
    color: '#8E8E9B',
    fontSize: 13,
    fontWeight: '600',
  },
  tradersList: {
    gap: 4,
  },
  traderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#12121A',
  },
  traderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  traderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  traderAvatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  traderHandle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  traderFollowers: {
    color: '#8E8E9B',
    fontSize: 12,
  },
  traderRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  traderPnl: {
    fontSize: 15,
    fontWeight: '700',
  },
  traderChange: {
    fontSize: 12,
    fontWeight: '600',
  },
});
