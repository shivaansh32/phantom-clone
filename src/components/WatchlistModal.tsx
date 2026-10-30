import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TokenAvatar } from './TokenAvatar';
import { TypographyFonts } from '@/constants/typography';
import { TokenItem, UserHolding, WatchlistToken, WATCHLIST_TOKENS } from '@/constants/mockData';

interface WatchlistModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectToken: (token: TokenItem | UserHolding | WatchlistToken) => void;
  prices?: Record<string, { price: number; change24h: number }>;
}

type WatchlistCategory = 'Tokens' | 'Perps' | 'Predictions' | 'Lists';

export function WatchlistModal({
  visible,
  onClose,
  onSelectToken,
  prices = {},
}: WatchlistModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<WatchlistCategory>('Tokens');

  if (!visible) return null;

  const categories: WatchlistCategory[] = ['Tokens', 'Perps', 'Predictions', 'Lists'];

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topHandleBar}>
          <View style={styles.dragHandle} />
        </View>

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.heartBtn} activeOpacity={0.8}>
            <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Title & Subtitle (1:1 with Video Frame 30s) */}
          <Text style={styles.watchlistTitleLarge}>Watchlist</Text>
          <Text style={styles.watchlistSubtitle}>
            Follow assets and markets across Phantom and track them all in one place
          </Text>

          {/* Filter Pills Row */}
          <View style={styles.filterPillsRow}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedCategory(cat)}
                  activeOpacity={0.75}>
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tokens List matching video */}
          {selectedCategory === 'Tokens' && (
            <View style={styles.tokensCardGroup}>
              {WATCHLIST_TOKENS.map((token, idx) => {
                const liveInfo = prices[token.symbol];
                const price = liveInfo ? liveInfo.price : token.price;
                const change = liveInfo ? liveInfo.change24h : token.change24h;
                const isPositive = change >= 0;

                return (
                  <TouchableOpacity
                    key={token.id}
                    style={[styles.tokenRowItem, idx > 0 && styles.rowBorderTop]}
                    onPress={() => {
                      onClose();
                      onSelectToken(token);
                    }}
                    activeOpacity={0.75}>
                    <View style={styles.tokenLeftCol}>
                      <TokenAvatar symbol={token.symbol} size={38} iconBg={token.iconBg} />
                      <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Text style={styles.tokenSymbolText}>{token.symbol}</Text>
                          <Ionicons name="checkmark-circle" size={13} color="#ABA0EE" />
                        </View>
                        <Text style={styles.tokenMarketCapText}>{token.marketCap} MC</Text>
                      </View>
                    </View>

                    <View style={styles.tokenRightCol}>
                      <Text style={styles.tokenPriceText}>
                        ${price.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: price < 1 ? 4 : 2,
                        })}
                      </Text>
                      <Text
                        style={[
                          styles.tokenChangeText,
                          { color: isPositive ? '#10B981' : '#FF2B4D' },
                        ]}>
                        {isPositive ? `+${change.toFixed(2)}%` : `${change.toFixed(2)}%`}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* Perps Tab */}
          {selectedCategory === 'Perps' && (
            <View style={styles.tokensCardGroup}>
              {[
                { symbol: 'SOL-PERP', leverage: '20x', funding: '0.0012%', change: '+1.45%' },
                { symbol: 'BTC-PERP', leverage: '50x', funding: '0.0008%', change: '+0.88%' },
                { symbol: 'ETH-PERP', leverage: '25x', funding: '0.0015%', change: '+1.20%' },
              ].map((perp, idx) => (
                <View key={perp.symbol} style={[styles.tokenRowItem, idx > 0 && styles.rowBorderTop]}>
                  <View style={styles.tokenLeftCol}>
                    <TokenAvatar symbol={perp.symbol.split('-')[0]} size={38} iconBg="#1E1E24" />
                    <View>
                      <Text style={styles.tokenSymbolText}>{perp.symbol}</Text>
                      <Text style={styles.tokenMarketCapText}>Max {perp.leverage} • Funding {perp.funding}</Text>
                    </View>
                  </View>
                  <Text style={[styles.tokenChangeText, { color: '#10B981' }]}>{perp.change}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Predictions Tab */}
          {selectedCategory === 'Predictions' && (
            <View style={styles.tokensCardGroup}>
              {[
                { title: 'Will SOL reach $150 by end of month?', pool: '$1.4M Pool', yesPct: '74% Yes' },
                { title: 'Bitcoin to break $90,000 in Q4?', pool: '$3.8M Pool', yesPct: '68% Yes' },
              ].map((pred, idx) => (
                <View key={pred.title} style={[styles.predRowItem, idx > 0 && styles.rowBorderTop]}>
                  <Text style={styles.predTitleText}>{pred.title}</Text>
                  <View style={styles.predMetaRow}>
                    <Text style={styles.predMetaPool}>{pred.pool}</Text>
                    <Text style={styles.predMetaPct}>{pred.yesPct}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Lists Tab */}
          {selectedCategory === 'Lists' && (
            <View style={styles.tokensCardGroup}>
              {['Top Gainers 24h', 'DeFi Blue Chips', 'Solana Meme Coins', 'AI & Infrastructure'].map(
                (listName, idx) => (
                  <View key={listName} style={[styles.tokenRowItem, idx > 0 && styles.rowBorderTop]}>
                    <Text style={styles.tokenSymbolText}>{listName}</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                )
              )}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topHandleBar: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 12 : 10,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 36,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#383842',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 12 : 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  watchlistTitleLarge: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    fontFamily: TypographyFonts.bold,
    marginTop: 6,
    marginBottom: 6,
  },
  watchlistSubtitle: {
    color: '#8E8E98',
    fontSize: 13.5,
    lineHeight: 19,
    fontFamily: TypographyFonts.regular,
    marginBottom: 18,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#202026',
  },
  filterPillActive: {
    backgroundColor: '#FFFFFF',
  },
  filterPillText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  filterPillTextActive: {
    color: '#000000',
    fontFamily: TypographyFonts.bold,
  },
  tokensCardGroup: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
  },
  tokenRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  tokenLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenSymbolText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  tokenMarketCapText: {
    color: '#8E8E98',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
    marginTop: 2,
  },
  tokenRightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tokenPriceText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  tokenChangeText: {
    fontSize: 12.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  predRowItem: {
    paddingVertical: 14,
    gap: 6,
  },
  predTitleText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  predMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  predMetaPool: {
    color: '#8E8E98',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
  },
  predMetaPct: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
});
