import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/theme';
import { TypographyFonts } from '@/constants/typography';
import { PhantomCloudAvatar } from './PhantomCloudAvatar';

export type MainTabType = 'home' | 'trade' | 'predict';

interface TopNavProps {
  activeTab: MainTabType;
  onSelectTab: (tab: MainTabType) => void;
  onOpenDrawer: () => void;
  isFavoriteActive?: boolean;
  onToggleFavorite?: () => void;
  avatarId?: string;
  customAvatarUri?: string | null;
  onLongPressAvatar?: () => void;
}

export function TopNav({
  activeTab,
  onSelectTab,
  onOpenDrawer,
  avatarId = 'cloud',
  customAvatarUri = null,
  onLongPressAvatar,
}: TopNavProps) {
  const c = Colors.phantom;

  const tabs: { key: MainTabType; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'trade', label: 'Trade' },
    { key: 'predict', label: 'Predict' },
  ];

  return (
    <View style={styles.container}>
      {/* 1. Left Authentic Yellow Cloud Avatar Button */}
      <TouchableOpacity
        style={styles.avatarButton}
        onPress={onOpenDrawer}
        onLongPress={onLongPressAvatar}
        activeOpacity={0.8}
        accessibilityLabel="Open Profile Drawer">
        <PhantomCloudAvatar
          size={40}
          avatarId={avatarId}
          customUri={customAvatarUri}
        />
      </TouchableOpacity>

      {/* 2. Standalone Pill Tab Switchers (Left-aligned row matching Phantom design) */}
      <View style={styles.tabRow}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => onSelectTab(tab.key)}
              style={[
                styles.tabPill,
                isActive ? styles.tabPillActive : styles.tabPillInactive,
              ]}
              activeOpacity={0.75}>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 6 : 4,
    paddingBottom: 8,
    backgroundColor: '#000000',
  },
  avatarButton: {
    marginRight: 10,
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabPill: {
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPillActive: {
    backgroundColor: '#ABA0EE', // Signature Phantom lilac
  },
  tabPillInactive: {
    backgroundColor: '#1E1E24', // Dark charcoal inactive background matching Image 1
  },
  tabLabel: {
    fontSize: 15,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    color: '#000000', // Pure black bold text matching Image 1
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  tabLabelInactive: {
    color: '#8E8E98', // Crisp clean muted gray matching Image 1
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
});
