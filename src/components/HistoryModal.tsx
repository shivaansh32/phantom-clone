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
import { TypographyFonts } from '@/constants/typography';
import {
  TransactionItem,
  formatSolAddress,
  generateTruncatedSolAddress,
} from '@/services/storageService';
import { WalletTransactionIcon } from './WalletTransactionIcon';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  transactions?: TransactionItem[];
}

type HistoryFilter = 'All' | 'Deposit' | 'Trade' | 'Transfer';

export function HistoryModal({
  visible,
  onClose,
  transactions = [],
}: HistoryModalProps) {
  const [selectedFilter, setSelectedFilter] = useState<HistoryFilter>('All');

  if (!visible) return null;

  const filters: HistoryFilter[] = ['All', 'Deposit', 'Trade', 'Transfer'];

  const filteredTransactions = transactions.filter((tx) => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Deposit') return tx.type === 'deposit' || tx.type === 'buy';
    if (selectedFilter === 'Trade') return tx.type === 'buy' || tx.type === 'sell';
    if (selectedFilter === 'Transfer') return tx.type === 'send' || tx.type === 'receive';
    return true;
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Drag Indicator */}
        <View style={styles.topHandleBar}>
          <View style={styles.dragHandle} />
        </View>

        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ width: 38 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Large Title (1:1 with Video Frame 39s) */}
          <Text style={styles.historyTitleLarge}>History</Text>

          {/* Filter Pills Row */}
          <View style={styles.filterPillsRow}>
            {filters.map((flt) => {
              const isActive = selectedFilter === flt;
              return (
                <TouchableOpacity
                  key={flt}
                  style={[styles.filterPill, isActive && styles.filterPillActive]}
                  onPress={() => setSelectedFilter(flt)}
                  activeOpacity={0.75}>
                  <Text style={[styles.filterPillText, isActive && styles.filterPillTextActive]}>
                    {flt}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Transactions List (1:1 with authentic Phantom screenshot media_1793339180213_bca2e60e.jpg) */}
          {filteredTransactions.length > 0 ? (
            <View style={styles.txListContainer}>
              {filteredTransactions.map((tx, idx) => {
                const displayTitle =
                  tx.title && (tx.title.startsWith('From ') || tx.title.startsWith('To '))
                    ? tx.title
                    : tx.isGreen || tx.type === 'deposit' || tx.type === 'receive'
                      ? `From ${tx.sender ? formatSolAddress(tx.sender) : generateTruncatedSolAddress()}`
                      : `To ${tx.recipient ? formatSolAddress(tx.recipient) : generateTruncatedSolAddress()}`;

                return (
                  <View key={tx.id || idx} style={styles.txRowItem}>
                    <View style={styles.txLeftCol}>
                      <View style={styles.txIconCircle}>
                        <WalletTransactionIcon size={19} color="#A0A0AA" badgeBg="#1E1E22" />
                      </View>
                      <View style={styles.txInfoCol}>
                        <Text style={styles.txTitleText} numberOfLines={1}>
                          {displayTitle}
                        </Text>
                        <Text style={styles.txDateText}>{tx.date}</Text>
                      </View>
                    </View>

                    <View style={styles.txRightCol}>
                      <Text
                        style={[
                          styles.txAmountText,
                          tx.isGreen ? styles.amountGreen : styles.amountWhite,
                        ]}>
                        {tx.isGreen ? `+${tx.amount}` : `-${tx.amount}`}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            /* Clean Empty State */
            <View style={styles.emptyStateBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="time-outline" size={32} color="#7E7E88" />
              </View>
              <Text style={styles.emptyTitle}>No transactions yet</Text>
              <Text style={styles.emptySub}>
                Your deposit, send, and trading transactions will be recorded here.
              </Text>
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
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  historyTitleLarge: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    fontFamily: TypographyFonts.bold,
    marginTop: 6,
    marginBottom: 16,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#202026',
  },
  filterPillActive: {
    backgroundColor: '#ABA0EE',
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
  txListContainer: {
    paddingVertical: 4,
  },
  txRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  txLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  txIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1E22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  txInfoCol: {
    gap: 3,
    flex: 1,
  },
  txTitleText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  txDateText: {
    color: '#929292',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
    letterSpacing: -0.1,
  },
  txRightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  txAmountText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  amountGreen: {
    color: '#66C176', // Sampled 1:1 from screenshot RGB(102, 193, 118)
  },
  amountWhite: {
    color: '#FFFFFF',
  },
  emptyStateBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#141418',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    marginBottom: 6,
  },
  emptySub: {
    color: '#7E7E88',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: TypographyFonts.regular,
  },
});
