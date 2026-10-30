import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { TypographyFonts } from '@/constants/typography';

interface AccountsViewProps {
  visible: boolean;
  onBack: () => void;
  balance: number;
  username?: string;
}

export function AccountsView({ visible, onBack, balance, username = 'ImmuneChimp1140' }: AccountsViewProps) {
  const c = Colors.phantom;

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onBack}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>@{username}</Text>

          <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Cash Balance Card */}
          <View style={styles.cashCard}>
            <View style={styles.cashLeft}>
              <View style={styles.cashIconBadge}>
                <Ionicons name="wallet-outline" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.cashLabel}>Cash</Text>
                <Text style={styles.cashAmount}>
                  ${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.qrBtn} activeOpacity={0.7}>
              <Ionicons name="grid-outline" size={18} color="#8E8E9B" />
            </TouchableOpacity>
          </View>

          {/* Accounts Section */}
          <Text style={styles.sectionHeader}>Accounts</Text>

          <View style={styles.accountCard}>
            <View style={styles.accountLeft}>
              <View style={styles.a1Badge}>
                <Text style={styles.a1Text}>A1</Text>
                <View style={styles.checkBadge}>
                  <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                </View>
              </View>
              <Text style={styles.accountName}>Account 1</Text>
            </View>

            <View style={styles.accountActions}>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Ionicons name="grid-outline" size={18} color="#8E8E9B" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={18} color="#8E8E9B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#18181A',
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#202023',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  cashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181A',
    borderRadius: 18,
    padding: 16,
  },
  cashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  cashIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E2C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cashLabel: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
    fontFamily: TypographyFonts.semiBold,
  },
  cashAmount: {
    color: '#929292',
    fontSize: 14,
    fontFamily: TypographyFonts.regular,
    marginTop: 2,
  },
  qrBtn: {
    padding: 8,
  },
  sectionHeader: {
    color: '#8E8E9B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginTop: 8,
  },
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181A',
    borderRadius: 18,
    padding: 16,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  a1Badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262638',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  a1Text: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#7C5DFB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  accountActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
});
