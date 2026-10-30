import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { TokenAvatar } from '@/components/TokenAvatar';
import { INITIAL_TOKENS, TokenItem } from '@/constants/mockData';
import { CryptoPriceMap, formatTokenPrice } from '@/services/cryptoService';

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectToken: (token: TokenItem) => void;
  prices?: CryptoPriceMap;
}

export function SearchModal({
  visible,
  onClose,
  onSelectToken,
  prices,
}: SearchModalProps) {
  const [query, setQuery] = useState('');

  if (!visible) return null;

  const filtered = INITIAL_TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.inputWrapper}>
            <Ionicons name="search" size={18} color="#8E8E9B" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search Phantom"
              placeholderTextColor="#8E8E9B"
              value={query}
              onChangeText={setQuery}
              autoFocus
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
                <Ionicons name="close-circle" size={16} color="#8E8E9B" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        <ScrollView
          contentContainerStyle={styles.resultsContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.resultsHeader}>
            {query.length === 0 ? 'Popular Tokens' : `Results (${filtered.length})`}
          </Text>

          {filtered.map((item) => {
            const live = prices ? prices[item.symbol] : undefined;
            const currentPrice = live ? live.price : item.price;
            const currentChange = live ? live.change24h : item.change24h;
            const isPositive = currentChange >= 0;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.tokenRow}
                onPress={() => {
                  onSelectToken({
                    ...item,
                    price: currentPrice,
                    change24h: currentChange,
                    marketCap: live?.marketCap || item.marketCap,
                  });
                  onClose();
                }}
                activeOpacity={0.7}>
                <View style={styles.tokenLeft}>
                  <TokenAvatar
                    symbol={item.symbol}
                    iconBg={item.iconBg}
                    iconType={item.iconType}
                  />
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenSymbol}>{item.symbol}</Text>
                    <Text style={styles.tokenName}>{item.name}</Text>
                  </View>
                </View>

                <View style={styles.tokenRight}>
                  <Text style={styles.tokenPrice}>${formatTokenPrice(currentPrice)}</Text>
                  <Text
                    style={[
                      styles.tokenChange,
                      { color: isPositive ? Colors.phantom.green : Colors.phantom.red },
                    ]}>
                    {isPositive ? `+${currentChange}%` : `${currentChange}%`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'ios' ? 52 : 24,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#18181A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  clearBtn: {
    padding: 4,
  },
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cancelText: {
    color: '#9FA2FF',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  resultsHeader: {
    color: '#8E8E9B',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#12121A',
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenInfo: {
    gap: 2,
  },
  tokenSymbol: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  tokenName: {
    color: '#8E8E9B',
    fontSize: 13,
  },
  tokenRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  tokenPrice: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  tokenChange: {
    fontSize: 13,
    fontWeight: '600',
  },
});
