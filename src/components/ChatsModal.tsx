import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';

interface ChatsModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
}

interface TrendingChat {
  id: string;
  name: string;
  ticker: string;
  marketCap: string;
  activeCount: number;
  iconBg: string;
  iconText: string;
}

const TRENDING_CHATS: TrendingChat[] = [
  {
    id: 'batcat',
    name: 'BatCat',
    ticker: 'BATCAT',
    marketCap: '$716K MC',
    activeCount: 89,
    iconBg: '#2D1B4E',
    iconText: '🦇',
  },
  {
    id: 'gta6',
    name: 'gRand theFt GTA6',
    ticker: 'GTA6',
    marketCap: '$19M MC',
    activeCount: 74,
    iconBg: '#1B2E4E',
    iconText: '🚗',
  },
  {
    id: 'purr',
    name: 'PURR Cat',
    ticker: 'PURR',
    marketCap: '$4.1M MC',
    activeCount: 7,
    iconBg: '#4A2A1A',
    iconText: '🐱',
  },
  {
    id: 'solana',
    name: 'Solana Community',
    ticker: 'SOL',
    marketCap: '$60B MC',
    activeCount: 142,
    iconBg: '#102B3F',
    iconText: '◎',
  },
];

export function ChatsModal({ visible, onClose, username }: ChatsModalProps) {
  const [activeTab, setActiveTab] = useState<'trending' | 'recent'>('trending');

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header (1:1 with Video Frame 21s) */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Chats</Text>
            <Text style={styles.headerSubtitle}>@{username}</Text>
          </View>

          <TouchableOpacity
            style={styles.newChatBtn}
            onPress={() => Alert.alert('New Chat', 'Start a direct message with a Solana address or username.')}
            activeOpacity={0.7}>
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Segmented Filter Pills */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={[styles.tabPill, activeTab === 'trending' && styles.tabPillActive]}
              onPress={() => setActiveTab('trending')}
              activeOpacity={0.75}>
              <Text style={[styles.tabPillText, activeTab === 'trending' && styles.tabPillTextActive]}>
                Trending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabPill, activeTab === 'recent' && styles.tabPillActive]}
              onPress={() => setActiveTab('recent')}
              activeOpacity={0.75}>
              <Text style={[styles.tabPillText, activeTab === 'recent' && styles.tabPillTextActive]}>
                Recent
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'trending' ? (
            <>
              {/* Section 1: Trending Chats List */}
              <View style={styles.sectionHeaderSpacing}>
                <Text style={styles.sectionHeading}>Trending Token Chats</Text>
              </View>

              <View style={styles.chatsCardGroup}>
                {TRENDING_CHATS.map((chat, idx) => (
                  <TouchableOpacity
                    key={chat.id}
                    style={[styles.chatRowItem, idx > 0 && styles.rowBorderTop]}
                    onPress={() => Alert.alert(chat.name, `Entering ${chat.name} live community chat.`)}
                    activeOpacity={0.75}>
                    <View style={styles.chatRowLeft}>
                      <View style={[styles.chatAvatarBadge, { backgroundColor: chat.iconBg }]}>
                        <Text style={{ fontSize: 18 }}>{chat.iconText}</Text>
                      </View>
                      <View>
                        <Text style={styles.chatNameText}>{chat.name}</Text>
                        <Text style={styles.chatSubText}>{chat.marketCap}</Text>
                      </View>
                    </View>

                    <View style={styles.chatRowRight}>
                      <View style={styles.activeUsersBadge}>
                        <View style={styles.greenPulseDot} />
                        <Text style={styles.activeUsersText}>{chat.activeCount}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={16} color="#7E7E88" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          ) : (
            /* Recent Tab: Empty state matching video */
            <View style={styles.emptyRecentBox}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbubbles-outline" size={32} color="#7E7E88" />
              </View>
              <Text style={styles.emptyTitle}>No chats to show yet</Text>
              <Text style={styles.emptySub}>
                Join trending token chats or search for an address to start messaging.
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#202026',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  headerSubtitle: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: TypographyFonts.medium,
    marginTop: 1,
  },
  newChatBtn: {
    padding: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 14,
  },
  tabPill: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#202026',
  },
  tabPillActive: {
    backgroundColor: '#FFFFFF',
  },
  tabPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  tabPillTextActive: {
    color: '#000000',
    fontFamily: TypographyFonts.bold,
  },
  sectionHeaderSpacing: {
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionHeading: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  chatsCardGroup: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
  },
  chatRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  chatRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatAvatarBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatNameText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  chatSubText: {
    color: '#8E8E98',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
    marginTop: 2,
  },
  chatRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  activeUsersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#191828',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  greenPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  activeUsersText: {
    color: '#ABA0EE',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  emptyRecentBox: {
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
