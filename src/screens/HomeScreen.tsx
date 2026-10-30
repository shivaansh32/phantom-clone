import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';
import { Colors } from '@/constants/theme';
import { TypographyFonts } from '@/constants/typography';
import { TokenAvatar } from '@/components/TokenAvatar';
import { WelcomePhantomGraphic } from '@/components/WelcomePhantomGraphic';
import {
  USER_HOLDINGS,
  PERP_SENTIMENT_CARDS,
  HOME_PREDICTIONS,
  WATCHLIST_TOKENS,
  STARTER_MARKET_TOKENS,
  StarterMarketToken,
  WatchlistToken,
  TokenItem,
  UserHolding,
} from '@/constants/mockData';

interface HomeScreenProps {
  onPressDeposit: () => void;
  onPressAddCash: () => void;
  onPressSend: () => void;
  onPressAccount: () => void;
  onPressToken?: (token: TokenItem | UserHolding | WatchlistToken) => void;
  balance: number;
  cashBalance?: number;
  solAmount?: number;
  solPrice?: number;
  solHoldingUsd?: number;
  solChangeUsd?: number;
  solChange24h?: number;
  watchlist?: WatchlistToken[];
  isLive?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
}

function SolanaIcon({ size = 36 }: { size?: number }) {
  const w = size * 0.72;
  const h = w * (312 / 398);

  return (
    <View style={[styles.solanaLogoBadge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={w} height={h} viewBox="0 0 398 312" fill="none">
        <Defs>
          <LinearGradient id="solGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#9945FF" />
            <Stop offset="50%" stopColor="#00C2FF" />
            <Stop offset="100%" stopColor="#14F195" />
          </LinearGradient>
        </Defs>

        {/* Top Parallelogram Slant */}
        <Path
          d="M 64.6 3.8 C 67 1.4 70.3 0 73.8 0 H 391.2 C 397 0 399.9 7 395.8 11.1 L 333.1 73.8 C 330.7 76.2 327.4 77.6 323.9 77.6 H 6.5 C 0.7 77.6 -2.2 70.6 1.9 66.5 L 64.6 3.8 Z"
          fill="url(#solGrad)"
        />

        {/* Middle Parallelogram Slant */}
        <Path
          d="M 333.1 120.1 C 330.7 117.7 327.4 116.3 323.9 116.3 H 6.5 C 0.7 116.3 -2.2 123.3 1.9 127.4 L 64.6 190.1 C 67 192.5 70.3 193.9 73.8 193.9 H 391.2 C 397 193.9 399.9 186.9 395.8 182.8 L 333.1 120.1 Z"
          fill="url(#solGrad)"
        />

        {/* Bottom Parallelogram Slant */}
        <Path
          d="M 64.6 237.9 C 67 235.5 70.3 234.1 73.8 234.1 H 391.2 C 397 234.1 399.9 241.1 395.8 245.2 L 333.1 307.9 C 330.7 310.3 327.4 311.7 323.9 311.7 H 6.5 C 0.7 311.7 -2.2 304.7 1.9 300.6 L 64.6 237.9 Z"
          fill="url(#solGrad)"
        />
      </Svg>
    </View>
  );
}

function XrpIcon({ size = 32 }: { size?: number }) {
  return (
    <View style={[styles.xrpBadge, { width: size, height: size, borderRadius: size / 2 }]}>
      <Svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="none">
        <Path
          d="M19.08 4.65c-0.58-0.58-1.51-0.58-2.09 0L12 9.64 7.01 4.65c-0.58-0.58-1.51-0.58-2.09 0L3.5 6.07c-0.28 0.28-0.44 0.66-0.44 1.06s0.16 0.78 0.44 1.06l7.46 7.46c0.28 0.28 0.66 0.44 1.06 0.44s0.78-0.16 1.06-0.44l7.46-7.46c0.28-0.28 0.44-0.66 0.44-1.06s-0.16-0.78-0.44-1.06l-1.4-1.42z"
          fill="#FFFFFF"
        />
        <Path
          d="M4.92 19.35c0.58 0.58 1.51 0.58 2.09 0L12 14.36l4.99 4.99c0.58 0.58 1.51 0.58 2.09 0l1.42-1.42c0.28-0.28 0.44-0.66 0.44-1.06s-0.16-0.78-0.44-1.06l-7.46-7.46c-0.28-0.28-0.66-0.44-1.06-0.44s-0.78 0.16-1.06 0.44l-7.46 7.46c-0.28 0.28-0.44 0.66-0.44 1.06s0.16 0.78 0.44 1.06l1.46 1.42z"
          fill="#FFFFFF"
        />
      </Svg>
    </View>
  );
}

/**
 * 1:1 replica of the clean hollow paper airplane Send icon from original Phantom screenshot
 */
function SendIcon({ size = 18, color = '#EFEFEF' }: { size?: number; color?: string }) {
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

/**
 * 1:1 replica of the clean + sign Deposit icon from user screenshot
 */
function DepositPlusIcon({ size = 15, color = '#EFEFEF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path
        d="M8 2.5V13.5M2.5 8H13.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/**
 * 1:1 replica of the Cash banknote outline icon from user screenshot
 */
function CashBanknoteIcon({ size = 24, color = '#7E7E88' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 0.65} viewBox="0 0 24 16" fill="none">
      <Rect x="1" y="1" width="22" height="14" rx="3.5" stroke={color} strokeWidth="1.7" />
      <Circle cx="12" cy="8" r="3.2" stroke={color} strokeWidth="1.6" />
      <Circle cx="5.5" cy="8" r="1.2" fill={color} />
      <Circle cx="18.5" cy="8" r="1.2" fill={color} />
    </Svg>
  );
}

export function HomeScreen({
  onPressDeposit,
  onPressAddCash,
  onPressSend,
  onPressAccount,
  onPressToken,
  balance,
  cashBalance = 0,
  solAmount = 0,
  solPrice = 100.76,
  solHoldingUsd,
  solChangeUsd = 0,
  solChange24h = 0,
  watchlist = WATCHLIST_TOKENS,
  isLive = false,
  isRefreshing = false,
  onRefresh,
}: HomeScreenProps) {
  const c = Colors.phantom;

  // Total value up top = (how many tokens) * (current value of solana)
  const solTotalValue = Number((solAmount * solPrice).toFixed(2));
  const activeHoldingValue = solHoldingUsd ?? solTotalValue;
  const isHoldingPositive = solChangeUsd >= 0;
  const isPercentPositive = solChange24h >= 0;

  const displayTotal = solTotalValue.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isStarterAccount = solAmount === 0 && cashBalance === 0;
  const [marketFilter, setMarketFilter] = useState<'Trending' | 'Majors' | 'Perps'>('Trending');
  const [isHeartActive, setIsHeartActive] = useState<boolean>(true);

  if (isStarterAccount) {
    let displayedTokens: TokenItem[] | StarterMarketToken[] = STARTER_MARKET_TOKENS;
    if (marketFilter === 'Majors') {
      displayedTokens = [
        { id: 'sol', name: 'Solana', symbol: 'SOL', marketCap: '$86B MC', price: solPrice, change24h: solChange24h, rankBadge: '1', iconBg: '#0A0A0E', iconType: 'sol' },
        { id: 'btc', name: 'Bitcoin', symbol: 'BTC', marketCap: '$1.3T MC', price: 68450.00, change24h: 2.15, rankBadge: '2', iconBg: '#F7931A', iconType: 'btc' },
        { id: 'eth', name: 'Ethereum', symbol: 'ETH', marketCap: '$400B MC', price: 3380.25, change24h: -0.65, rankBadge: '3', iconBg: '#627EEA', iconType: 'eth' },
        { id: 'xrp', name: 'XRP', symbol: 'XRP', marketCap: '$32B MC', price: 0.584, change24h: 1.12, iconBg: '#171B26', iconType: 'xrp' },
      ];
    } else if (marketFilter === 'Perps') {
      displayedTokens = [
        { id: 'sol-perp', name: 'SOL-PERP', symbol: 'SOL-PERP', marketCap: '$420M OI', price: solPrice, change24h: solChange24h, iconBg: '#0A0A0E', iconType: 'sol' },
        { id: 'btc-perp', name: 'BTC-PERP', symbol: 'BTC-PERP', marketCap: '$1.1B OI', price: 68450.00, change24h: 2.15, iconBg: '#F7931A', iconType: 'btc' },
        { id: 'eth-perp', name: 'ETH-PERP', symbol: 'ETH-PERP', marketCap: '$650M OI', price: 3380.25, change24h: -0.65, iconBg: '#627EEA', iconType: 'eth' },
        { id: 'hype-perp', name: 'HYPE-PERP', symbol: 'HYPE-PERP', marketCap: '$88M OI', price: 2.33, change24h: 38.88, iconBg: '#58E5BE', iconType: 'xhype' },
      ];
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.starterContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={['#14F195', '#9945FF']}
            />
          ) : undefined
        }>
        {/* 1. Welcome to Phantom Hero Card (1:1 replica of screenshot) */}
        <View style={styles.starterHeroCard}>
          <View style={styles.starterGraphicWrap}>
            <WelcomePhantomGraphic width={180} height={92} />
          </View>
          <Text style={styles.starterTitle}>Welcome to Phantom</Text>
          <Text style={styles.starterSubtitle}>Fund your account to start trading.</Text>
          <TouchableOpacity
            style={styles.starterDepositBtn}
            onPress={onPressDeposit}
            activeOpacity={0.8}>
            <Text style={styles.starterDepositBtnText}>Deposit</Text>
          </TouchableOpacity>
        </View>

        {/* 2. Explore Markets Header */}
        <View style={styles.exploreHeaderRow}>
          <TouchableOpacity style={styles.exploreTitleWrap} activeOpacity={0.7}>
            <Text style={styles.exploreTitle}>Explore Markets</Text>
            <Ionicons name="chevron-forward" size={19} color="#8E8E93" style={styles.exploreChevron} />
          </TouchableOpacity>
        </View>

        {/* 3. Filter Category Pills (Heart, Trending, Majors, Perps) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.filterHeartBtn, isHeartActive && styles.filterHeartBtnActive]}
            onPress={() => setIsHeartActive(!isHeartActive)}
            activeOpacity={0.75}>
            <Ionicons
              name={isHeartActive ? 'heart' : 'heart-outline'}
              size={17}
              color={isHeartActive ? '#FFFFFF' : '#8E8E93'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              marketFilter === 'Trending' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
            onPress={() => setMarketFilter('Trending')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                marketFilter === 'Trending' ? styles.filterPillTextActive : styles.filterPillTextInactive,
              ]}>
              Trending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              marketFilter === 'Majors' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
            onPress={() => setMarketFilter('Majors')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                marketFilter === 'Majors' ? styles.filterPillTextActive : styles.filterPillTextInactive,
              ]}>
              Majors
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              marketFilter === 'Perps' ? styles.filterPillActive : styles.filterPillInactive,
            ]}
            onPress={() => setMarketFilter('Perps')}
            activeOpacity={0.75}>
            <Text
              style={[
                styles.filterPillText,
                marketFilter === 'Perps' ? styles.filterPillTextActive : styles.filterPillTextInactive,
              ]}>
              Perps
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 4. Token List with Star Badges */}
        <View style={styles.starterTokensList}>
          {displayedTokens.map((item) => {
            const isPos = item.change24h >= 0;
            const priceStr =
              item.price < 0.01
                ? item.price.toString()
                : item.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: item.price < 1 ? 4 : 2,
                  });

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.starterTokenRow}
                onPress={() => onPressToken && onPressToken(item as any)}
                activeOpacity={0.7}>
                <View style={styles.starterTokenLeft}>
                  <TokenAvatar
                    symbol={item.symbol}
                    iconType={item.iconType}
                    iconBg={item.iconBg}
                    rankBadge={item.rankBadge}
                    size={34}
                  />
                  <View style={styles.starterTokenMeta}>
                    <Text style={styles.starterTokenSymbol}>{item.symbol}</Text>
                    <Text style={styles.starterTokenMc}>{item.marketCap}</Text>
                  </View>
                </View>

                <View style={styles.starterTokenRight}>
                  <Text style={styles.starterTokenPrice}>${priceStr}</Text>
                  <Text
                    style={[
                      styles.starterTokenChange,
                      { color: isPos ? '#10B981' : '#FF2B4D' },
                    ]}>
                    {isPos ? `+${item.change24h}%` : `${item.change24h}%`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={['#14F195', '#9945FF']}
          />
        ) : undefined
      }>
      {/* 1. Account Selector Dropdown */}
      <TouchableOpacity
        style={styles.accountSelector}
        onPress={onPressAccount}
        activeOpacity={0.7}>
        <Text style={styles.accountSelectorText}>Account 1</Text>
        <Ionicons name="chevron-down" size={13} color="#8E8E93" />
      </TouchableOpacity>

      {/* 2. Main Balance Header (Clean typography, no spinner) */}
      <View style={styles.balanceSection}>
        <View style={styles.balanceRow}>
          <Text style={styles.moneyAmount}>${displayTotal}</Text>
        </View>

        {/* Daily Change & Percentage Capsule */}
        <View style={styles.changeRow}>
          <Text
            style={[
              styles.changeText,
              { color: solAmount > 0 ? (isHoldingPositive ? '#10B981' : '#FF2B4D') : '#8E8E93' },
            ]}>
            {solAmount > 0
              ? isHoldingPositive
                ? `+$${solChangeUsd.toFixed(2)}`
                : `-$${Math.abs(solChangeUsd).toFixed(2)}`
              : '$0.00'}
          </Text>
          <View
            style={[
              styles.changePill,
              solAmount > 0 && isPercentPositive && styles.changePillPositive,
            ]}>
            <Text
              style={[
                styles.changePillText,
                solAmount > 0 && isPercentPositive && styles.changePillTextPositive,
              ]}>
              {solAmount > 0
                ? isPercentPositive
                  ? `+${solChange24h.toFixed(2)}%`
                  : `${solChange24h.toFixed(2)}%`
                : '0.00%'}
            </Text>
          </View>
        </View>
      </View>

      {/* 3. Send & Deposit Action Buttons (1:1 replica of Phantom screenshot) */}
      <View style={styles.actionButtonsRow}>
        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onPressSend}
          activeOpacity={0.75}>
          <SendIcon size={17} color="#EFEFEF" />
          <Text style={styles.actionBtnText}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionPillBtn}
          onPress={onPressDeposit}
          activeOpacity={0.75}>
          <DepositPlusIcon size={14} color="#EFEFEF" />
          <Text style={styles.actionBtnText}>Deposit</Text>
        </TouchableOpacity>
      </View>

      {/* 4. Cash Card (1:1 replica with direct banknote icon) */}
      <TouchableOpacity
        style={styles.cashCard}
        onPress={onPressAddCash}
        activeOpacity={0.8}>
        <View style={styles.cashLeft}>
          <CashBanknoteIcon size={20} color="#7E7E88" />
          <Text style={styles.cashTitle}>Cash</Text>
        </View>

        <Text style={styles.cashAmount}>
          ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </TouchableOpacity>

      {/* 5. Tokens Section (Inline chevron header) */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleInline} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Tokens</Text>
          <Ionicons name="chevron-forward" size={15} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.tokensCard}>
        <TouchableOpacity
          style={styles.tokenRow}
          onPress={() =>
            onPressToken &&
            onPressToken({
              id: 'solana',
              name: 'Solana',
              symbol: 'SOL',
              amount: solAmount,
              usdValue: activeHoldingValue,
              changeUsd: solChangeUsd,
              iconBg: '#0A0A0E',
            })
          }
          activeOpacity={0.7}>
          <View style={styles.tokenLeft}>
            <TokenAvatar symbol="SOL" size={32} iconBg="#0A0A0E" />
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenSymbol}>Solana</Text>
              <Text style={styles.tokenSub}>
                {solAmount.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 5,
                })}{' '}
                SOL
              </Text>
            </View>
          </View>

          <View style={styles.tokenRight}>
            <Text style={styles.tokenPrice}>
              ${activeHoldingValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text
              style={[
                styles.tokenSub,
                { color: solAmount > 0 ? (isHoldingPositive ? '#10B981' : '#FF2B4D') : '#8E8E93', fontWeight: '500' },
              ]}>
              {solAmount > 0
                ? isHoldingPositive
                  ? `+$${solChangeUsd.toFixed(2)}`
                  : `-$${Math.abs(solChangeUsd).toFixed(2)}`
                : '$0.00'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 6. Perps Sentiment Section (Inline chevron & subtitle) */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleInline} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Perps</Text>
          <Ionicons name="chevron-forward" size={15} color="#8E8E93" />
        </TouchableOpacity>
        <View style={styles.perpsSubRow}>
          <Ionicons name="person" size={10} color="#8E8E93" />
          <Text style={styles.perpsSubtitle}>Based on profitable traders' positions</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.perpsScroll}>
        {PERP_SENTIMENT_CARDS.map((perp) => (
          <View key={perp.id} style={styles.perpCard}>
            <View style={styles.perpCardTop}>
              <View style={styles.perpTokenRow}>
                <TokenAvatar symbol={perp.symbol} size={28} iconBg={perp.iconBg || '#171B26'} />
                <View>
                  <Text style={styles.perpSymbol}>{perp.symbol}</Text>
                  <Text style={styles.perpShorts}>{perp.shorts}</Text>
                </View>
              </View>

              <View style={styles.bearishPill}>
                <Text style={styles.bearishText}>{perp.sentiment}</Text>
              </View>
            </View>

            {/* Split Progress Bar */}
            <View style={styles.splitBar}>
              <View style={[styles.splitBarLong, { flex: perp.longPct }]} />
              <View style={[styles.splitBarShort, { flex: perp.shortPct }]} />
            </View>

            <View style={styles.splitLabels}>
              <Text style={styles.longLabel}>{perp.longPct}% Long</Text>
              <Text style={styles.shortLabel}>{perp.shortPct}% Short</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 7. Predictions Section */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleInline} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Predictions</Text>
          <Ionicons name="chevron-forward" size={17} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.predScroll}>
        <TouchableOpacity style={styles.predCard} activeOpacity={0.8}>
          <View style={styles.predIconCircleBtc}>
            <FontAwesome5 name="bitcoin" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.predTitle}>BTC Up or Down • 5m</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.predCard} activeOpacity={0.8}>
          <View style={styles.predIconCircleSoccer}>
            <Text style={{ fontSize: 14 }}>⚽</Text>
          </View>
          <View>
            <Text style={styles.predTitle}>Roma vs Cagliari</Text>
            <Text style={styles.predSub}>in 3h 28m</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 8. Watchlist Section */}
      <View style={styles.sectionHeaderSpacing}>
        <TouchableOpacity style={styles.sectionTitleInline} activeOpacity={0.7}>
          <Text style={styles.sectionTitle}>Watchlist</Text>
          <Ionicons name="chevron-forward" size={17} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.watchlistCard}>
        {watchlist.map((token) => {
          const isPositive = token.change24h >= 0;
          return (
            <TouchableOpacity
              key={token.id}
              style={styles.watchRow}
              onPress={() => onPressToken && onPressToken(token)}
              activeOpacity={0.7}>
              <View style={styles.tokenLeft}>
                <TokenAvatar symbol={token.symbol} iconBg={token.iconBg} size={34} />
                <View style={styles.tokenInfo}>
                  <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                  <Text style={styles.tokenSub}>{token.marketCap}</Text>
                </View>
              </View>

              <View style={styles.tokenRight}>
                <Text style={styles.tokenPrice}>
                  ${token.price.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: token.price < 10 ? 4 : 2,
                  })}
                </Text>
                <Text
                  style={[
                    styles.tokenSub,
                    { color: isPositive ? c.green : c.red, fontWeight: '500' },
                  ]}>
                  {isPositive ? `+${token.change24h}%` : `${token.change24h}%`}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 9. Support Section */}
      <View style={styles.supportSection}>
        <Text style={styles.supportHeader}>Support</Text>

        <TouchableOpacity style={styles.supportRow} activeOpacity={0.7}>
          <Text style={styles.supportText}>View FAQ</Text>
          <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportRow} activeOpacity={0.7}>
          <Text style={styles.supportText}>Chat with us</Text>
          <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.disclosuresRow} activeOpacity={0.7}>
          <Ionicons name="information-circle-outline" size={14} color="#5F5F70" />
          <Text style={styles.disclosuresText}>View Disclosures</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 110 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    paddingTop: 0,
    paddingHorizontal: 16,
    paddingBottom: 150,
  },
  starterContentContainer: {
    paddingTop: 4,
    paddingBottom: 110,
  },
  starterHeroCard: {
    backgroundColor: '#151518',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 8,
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  starterGraphicWrap: {
    marginBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starterTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  starterSubtitle: {
    color: '#8E8E98',
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -0.2,
  },
  starterDepositBtn: {
    backgroundColor: '#ABA0EE',
    borderRadius: 24,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starterDepositBtnText: {
    color: '#070709',
    fontSize: 16,
    fontWeight: '700',
  },
  exploreHeaderRow: {
    marginHorizontal: 16,
    marginTop: 26,
    marginBottom: 14,
  },
  exploreTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exploreTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  exploreChevron: {
    marginLeft: 6,
    marginTop: 2,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 14,
  },
  filterHeartBtn: {
    height: 38,
    width: 44,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterHeartBtnActive: {
    backgroundColor: '#1E1E24',
  },
  filterPill: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillInactive: {
    backgroundColor: '#1E1E24',
  },
  filterPillText: {
    fontSize: 15,
  },
  filterPillTextActive: {
    color: '#000000',
    fontWeight: '700',
  },
  filterPillTextInactive: {
    color: '#8E8E93',
    fontWeight: '600',
  },
  starterTokensList: {
    paddingHorizontal: 16,
  },
  starterTokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
  },
  starterTokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starterTokenMeta: {
    marginLeft: 12,
  },
  starterTokenSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  starterTokenMc: {
    color: '#8E8E93',
    fontSize: 13,
    fontWeight: '400',
    marginTop: 2,
  },
  starterTokenRight: {
    alignItems: 'flex-end',
  },
  starterTokenPrice: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  starterTokenChange: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
  },
  accountSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 28,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  accountSelectorText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    letterSpacing: -0.2,
  },
  balanceSection: {
    marginBottom: 0,
    gap: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moneyAmount: {
    color: '#FFFFFF',
    fontSize: 38,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.6,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 8,
  },
  changeText: {
    color: '#FF2A55',
    fontSize: 14.5,
    fontFamily: TypographyFonts.medium,
    fontWeight: Platform.OS === 'ios' ? '500' : undefined,
    letterSpacing: -0.2,
  },
  changePill: {
    backgroundColor: '#350E18', // Deep burgundy pill background sampled 1:1 from screenshot
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePillPositive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  changePillText: {
    color: '#FF2A55', // Bright crimson red text on dark crimson
    fontSize: 12.5,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.1,
  },
  changePillTextPositive: {
    color: '#10B981',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 28,
    marginBottom: 26,
  },
  actionPillBtn: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#202124', // Sampled 1:1 from original screenshot (RGB 32, 34, 33)
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: '#EFEFEF', // Sampled 1:1 from original screenshot (RGB 239, 239, 239)
    fontSize: 15,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    letterSpacing: -0.2,
  },
  cashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141416',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 44,
    borderWidth: 1,
    borderColor: '#1E1E22',
  },
  cashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cashTitle: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    letterSpacing: -0.2,
  },
  cashAmount: {
    color: '#FFFFFF', // Exact crisp white sampled from user screenshot (media_1793341400153_88ca9e75.jpg)
    fontSize: 15.5,
    fontFamily: TypographyFonts.regular, // Clean regular geometric digits matching real Phantom $0.00
    fontWeight: Platform.OS === 'ios' ? '400' : undefined,
    letterSpacing: -0.1,
  },
  sectionHeaderSpacing: {
    marginBottom: 14,
  },
  sectionTitleInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  perpsSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  perpsSubtitle: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
    letterSpacing: -0.1,
  },
  tokensCard: {
    backgroundColor: '#141416',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#1E1E22',
    marginBottom: 44,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  solanaLogoBadge: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xrpBadge: {
    backgroundColor: '#006097',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenInfo: {
    gap: 2,
  },
  tokenSymbol: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  tokenSub: {
    color: '#8E8E93',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    letterSpacing: -0.1,
  },
  tokenRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tokenPrice: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    letterSpacing: -0.2,
  },
  perpsScroll: {
    gap: 12,
    paddingRight: 16,
    marginTop: 10,
    marginBottom: 28,
  },
  perpCard: {
    width: 240,
    backgroundColor: '#141416',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E1E22',
    gap: 12,
  },
  perpCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  perpTokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  perpSymbol: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  perpShorts: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
  },
  bearishPill: {
    backgroundColor: 'rgba(255, 30, 60, 0.16)',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
  },
  bearishText: {
    color: '#FF2B4D',
    fontSize: 11.5,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  splitBar: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    backgroundColor: '#26262E',
  },
  splitBarLong: {
    backgroundColor: '#3B82F6',
  },
  splitBarShort: {
    backgroundColor: '#FF1545',
  },
  splitLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  longLabel: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
  },
  shortLabel: {
    color: '#FF1545',
    fontSize: 12,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  predScroll: {
    gap: 12,
    paddingRight: 16,
  },
  predCard: {
    backgroundColor: '#18181A',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  predIconCircleBtc: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F7931A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predIconCircleSoccer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#242428',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: '600',
  },
  predSub: {
    color: '#8E8E93',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
  },
  watchlistCard: {
    backgroundColor: '#18181A',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#202024',
  },
  supportSection: {
    marginTop: 20,
    gap: 12,
  },
  supportHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TypographyFonts.bold,
    fontWeight: '700',
    marginBottom: 4,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  supportText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.medium,
    fontWeight: '500',
  },
  disclosuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  disclosuresText: {
    color: '#5F5F70',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
  },
});
