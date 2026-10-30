import React from 'react';
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
import { Colors } from '@/constants/theme';
import { PhantomCloudAvatar } from './PhantomCloudAvatar';
import { TypographyFonts } from '@/constants/typography';

interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToAccounts: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenChats?: () => void;
  onOpenWatchlist?: () => void;
  onOpenHistory?: () => void;
  onOpenReferEarn?: () => void;
  onOpenHelpSupport?: () => void;
  username?: string;
  avatarId?: string;
  customAvatarUri?: string | null;
}

export function ProfileDrawer({
  visible,
  onClose,
  onNavigateToAccounts,
  onOpenSettings,
  onOpenProfile,
  onOpenChats,
  onOpenWatchlist,
  onOpenHistory,
  onOpenReferEarn,
  onOpenHelpSupport,
  username = 'ImmuneChimp1140',
  avatarId = 'cloud',
  customAvatarUri = null,
}: ProfileDrawerProps) {
  if (!visible) return null;

  const handleOpenProfileFlow = () => {
    onClose();
    if (onOpenProfile) onOpenProfile();
  };

  const handleCopyUsername = () => {
    Alert.alert('Copied', `@${username} copied to clipboard.`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop touch to dismiss */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Sidebar Drawer Panel */}
        <View style={styles.drawerPanel}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.drawerContent}>
            {/* Top User Info Section matching Frame 02s */}
            <View style={styles.topBarRow}>
              <TouchableOpacity
                onPress={handleOpenProfileFlow}
                activeOpacity={0.8}
                style={styles.avatarTouch}>
                <PhantomCloudAvatar
                  size={52}
                  avatarId={avatarId}
                  customUri={customAvatarUri}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.copyButtonTop}
                onPress={handleCopyUsername}
                activeOpacity={0.7}>
                <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.usernameRow}
              onPress={handleOpenProfileFlow}
              activeOpacity={0.8}>
              <Text style={styles.userHandle}>@{username}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.xConnectRow}
              onPress={() => Alert.alert('Connect X', 'Redirecting to X (Twitter) authorization...')}
              activeOpacity={0.7}>
              <Text style={styles.xConnectText}>𝕏 Connect your X account</Text>
            </TouchableOpacity>

            {/* Account Selector Card */}
            <TouchableOpacity
              style={styles.accountSelectorCard}
              onPress={() => {
                onClose();
                onNavigateToAccounts();
              }}
              activeOpacity={0.8}>
              <View style={styles.accountSelectorLeft}>
                <View style={styles.a1Badge}>
                  <Text style={styles.a1Text}>A1</Text>
                </View>
                <Text style={styles.accountName}>Account 1</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#8E8E9B" />
            </TouchableOpacity>

            {/* Primary Menu Items matching Frame 02s */}
            <View style={styles.menuGroup}>
              {/* Profile */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleOpenProfileFlow}
                activeOpacity={0.7}>
                <Ionicons name="person-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Profile</Text>
              </TouchableOpacity>

              {/* Chats */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenChats) onOpenChats();
                }}
                activeOpacity={0.7}>
                <Ionicons name="chatbubble-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Chats</Text>
              </TouchableOpacity>

              {/* Watchlist */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenWatchlist) onOpenWatchlist();
                }}
                activeOpacity={0.7}>
                <Ionicons name="heart-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Watchlist</Text>
              </TouchableOpacity>

              {/* History */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenHistory) onOpenHistory();
                }}
                activeOpacity={0.7}>
                <Ionicons name="time-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>History</Text>
              </TouchableOpacity>

              {/* Refer & Earn */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenReferEarn) onOpenReferEarn();
                }}
                activeOpacity={0.7}>
                <Ionicons name="gift-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Refer & Earn</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.verticalSpacer} />

            {/* Secondary Menu Items */}
            <View style={styles.menuGroup}>
              {/* Settings */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenSettings) onOpenSettings();
                }}
                activeOpacity={0.7}>
                <Ionicons name="settings-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Settings</Text>
              </TouchableOpacity>

              {/* Help & Support */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  onClose();
                  if (onOpenHelpSupport) onOpenHelpSupport();
                }}
                activeOpacity={0.7}>
                <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" style={styles.menuIcon} />
                <Text style={styles.menuLabel}>Help & Support</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  drawerPanel: {
    width: '82%',
    maxWidth: 320,
    backgroundColor: '#0E0E12',
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 54 : 40,
    borderRightWidth: 1,
    borderRightColor: '#18181F',
  },
  drawerContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  topBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  avatarTouch: {
    position: 'relative',
  },
  copyButtonTop: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E26',
    justifyContent: 'center',
    alignItems: 'center',
  },
  usernameRow: {
    marginBottom: 6,
  },
  userHandle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    letterSpacing: -0.3,
  },
  xConnectRow: {
    marginBottom: 24,
  },
  xConnectText: {
    color: '#ABA0EE',
    fontSize: 13.5,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  accountSelectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    marginBottom: 16,
  },
  accountSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  a1Badge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#202028',
    justifyContent: 'center',
    alignItems: 'center',
  },
  a1Text: {
    color: '#8E8E9B',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  accountName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  menuGroup: {
    gap: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  menuIcon: {
    marginRight: 16,
    width: 26,
    textAlign: 'center',
  },
  menuLabel: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    letterSpacing: -0.2,
  },
  verticalSpacer: {
    height: 32,
  },
});
