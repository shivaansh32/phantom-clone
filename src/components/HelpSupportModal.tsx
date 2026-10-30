import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';

interface HelpSupportModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    id: '1',
    title: 'How do I fund my Phantom wallet?',
    desc: 'You can deposit SOL, USDC, or other tokens by tapping Deposit on the home screen, using Google Pay, bank card, or sending from another wallet or exchange.',
    icon: 'wallet-outline',
  },
  {
    id: '2',
    title: 'How do I protect my Secret Recovery Phrase?',
    desc: 'Never share your Secret Recovery Phrase with anyone. Phantom support will never ask for your recovery phrase or private keys.',
    icon: 'shield-checkmark-outline',
  },
  {
    id: '3',
    title: 'How do trading fees and swaps work?',
    desc: 'Phantom finds the best routing across decentralized liquidity pools with minimal slippage and instant settlement on Solana.',
    icon: 'swap-horizontal-outline',
  },
  {
    id: '4',
    title: 'What should I do if a transaction is pending?',
    desc: 'Solana transactions typically confirm in under 400 milliseconds. If the network experiences congestion, your transaction will either confirm or automatically expire without losing funds.',
    icon: 'timer-outline',
  },
  {
    id: '5',
    title: 'Can I connect a Ledger hardware wallet?',
    desc: 'Yes, Phantom supports Ledger hardware wallets via Bluetooth on mobile devices and USB on desktop.',
    icon: 'hardware-chip-outline',
  },
];

export function HelpSupportModal({ visible, onClose }: HelpSupportModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  if (!visible) return null;

  const filteredFaqs = FAQ_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchBarBox}>
            <Ionicons name="search" size={18} color="#7E7E88" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search help articles & FAQs"
              placeholderTextColor="#7E7E88"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* 24/7 Support Card */}
          <View style={styles.supportBanner}>
            <View style={styles.supportIconCircle}>
              <Ionicons name="headset" size={22} color="#121026" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.supportTitle}>Phantom 24/7 Support</Text>
              <Text style={styles.supportSub}>
                Our global support team is available around the clock to assist with your wallet.
              </Text>
            </View>
          </View>

          {/* Contact Support Button */}
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={() => Alert.alert('Support Chat', 'Connecting you to a Phantom support specialist...')}
            activeOpacity={0.85}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.contactBtnText}>Contact Support</Text>
          </TouchableOpacity>

          {/* Frequently Asked Questions */}
          <Text style={styles.sectionHeading}>Frequently Asked Questions</Text>
          <View style={styles.faqGroupCard}>
            {filteredFaqs.map((faq, idx) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <TouchableOpacity
                  key={faq.id}
                  style={[styles.faqRowItem, idx > 0 && styles.rowBorderTop]}
                  onPress={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  activeOpacity={0.75}>
                  <View style={styles.faqHeaderRow}>
                    <View style={styles.faqLeftCol}>
                      <Ionicons
                        name={faq.icon as any}
                        size={20}
                        color="#ABA0EE"
                        style={{ marginRight: 12 }}
                      />
                      <Text style={styles.faqQuestionText}>{faq.title}</Text>
                    </View>
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={17}
                      color="#7E7E88"
                    />
                  </View>
                  {isExpanded && <Text style={styles.faqAnswerText}>{faq.desc}</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 10,
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    borderWidth: 1,
    borderColor: '#1E1E24',
    marginVertical: 14,
  },
  searchBarInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: TypographyFonts.regular,
  },
  supportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#1E1A33',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#372E5C',
    padding: 16,
    marginBottom: 12,
  },
  supportIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  supportTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  supportSub: {
    color: '#AEAEC0',
    fontSize: 12.5,
    lineHeight: 17,
    marginTop: 2,
    fontFamily: TypographyFonts.regular,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E1E24',
    borderWidth: 1,
    borderColor: '#2E2E38',
    marginBottom: 24,
  },
  contactBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  sectionHeading: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  faqGroupCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
  },
  faqRowItem: {
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  faqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 8,
  },
  faqQuestionText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    flex: 1,
  },
  faqAnswerText: {
    color: '#AEAEC0',
    fontSize: 13,
    lineHeight: 18,
    marginTop: 10,
    paddingLeft: 32,
    fontFamily: TypographyFonts.regular,
  },
});

