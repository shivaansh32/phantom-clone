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
import { PhantomCloudAvatar, AVATAR_OPTIONS, AvatarType } from './PhantomCloudAvatar';
import { TypographyFonts } from '@/constants/typography';

interface ManageProfileModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  avatarId: string;
  customAvatarUri?: string | null;
  bio?: string;
  onUpdateUsername: (newUsername: string) => void;
  onUpdateAvatar: (avatarId: string, customUri?: string | null) => void;
  onUpdateBio?: (newBio: string) => void;
  initialView?: 'profile' | 'manage';
}

export function ManageProfileModal({
  visible,
  onClose,
  username,
  avatarId,
  customAvatarUri,
  bio = '',
  onUpdateUsername,
  onUpdateAvatar,
  onUpdateBio,
  initialView = 'manage',
}: ManageProfileModalProps) {
  const [currentView, setCurrentView] = useState<'profile' | 'manage'>(initialView);
  const [isAvatarSheetOpen, setIsAvatarSheetOpen] = useState(false);
  const [isUsernameSheetOpen, setIsUsernameSheetOpen] = useState(false);
  const [isBioSheetOpen, setIsBioSheetOpen] = useState(false);

  // Form edit states
  const [newUsernameInput, setNewUsernameInput] = useState(username);
  const [newBioInput, setNewBioInput] = useState(bio);
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState(avatarId);
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open');

  // Keep input synchronized when opened
  React.useEffect(() => {
    if (visible) {
      setCurrentView(initialView);
      setNewUsernameInput(username);
      setNewBioInput(bio);
      setSelectedAvatarId(avatarId);
    }
  }, [visible, username, bio, avatarId, initialView]);

  if (!visible) return null;

  const handleSaveUsername = () => {
    const trimmed = newUsernameInput.trim().replace(/^@+/, '');
    if (!trimmed) {
      Alert.alert('Invalid Username', 'Username cannot be empty.');
      return;
    }
    if (trimmed.length < 3) {
      Alert.alert('Too short', 'Username must be at least 3 characters.');
      return;
    }
    onUpdateUsername(trimmed);
    setIsUsernameSheetOpen(false);
  };

  const handleSaveBio = () => {
    if (onUpdateBio) {
      onUpdateBio(newBioInput.trim());
    }
    setIsBioSheetOpen(false);
  };

  const handleSelectAvatarPreset = (id: AvatarType) => {
    setSelectedAvatarId(id);
    onUpdateAvatar(id, null);
    setIsAvatarSheetOpen(false);
  };

  const handleSaveCustomUrl = () => {
    if (!customUrlInput.trim()) {
      Alert.alert('Empty URL', 'Please enter a valid image URL.');
      return;
    }
    onUpdateAvatar('custom', customUrlInput.trim());
    setIsAvatarSheetOpen(false);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* ==================================================================== */}
        {/* VIEW 1: PROFILE SCREEN (1:1 with Frame 11s-12s of video)             */}
        {/* ==================================================================== */}
        {currentView === 'profile' && (
          <View style={styles.contentFlex}>
            {/* Top Navigation */}
            <View style={styles.topNavRow}>
              <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setCurrentView('manage')}
                style={styles.manageTopBtn}
                activeOpacity={0.7}>
                <Text style={styles.manageTopBtnText}>Manage</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.profileScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Centered Avatar */}
              <TouchableOpacity
                onPress={() => setIsAvatarSheetOpen(true)}
                activeOpacity={0.85}
                style={styles.avatarCenteredWrapper}>
                <PhantomCloudAvatar
                  size={84}
                  avatarId={selectedAvatarId}
                  customUri={customAvatarUri}
                  showEditBadge
                  onEditPress={() => setIsAvatarSheetOpen(true)}
                />
              </TouchableOpacity>

              {/* Username Handle */}
              <TouchableOpacity
                onPress={() => setIsUsernameSheetOpen(true)}
                activeOpacity={0.8}
                style={styles.usernameRow}>
                <Text style={styles.profileHandleText}>@{username}</Text>
                <Ionicons name="pencil" size={14} color="#8E8E98" style={{ marginLeft: 6 }} />
              </TouchableOpacity>

              {/* Followers & Volume Row */}
              <View style={styles.statsRow}>
                <Text style={styles.statsText}>0 Followers</Text>
                <Text style={styles.statsBullet}>•</Text>
                <Text style={styles.statsText}>$0.00 Vol</Text>
              </View>

              {/* Bio */}
              <TouchableOpacity
                onPress={() => setIsBioSheetOpen(true)}
                activeOpacity={0.75}
                style={styles.bioWrapper}>
                <Text style={styles.bioText}>{bio ? bio : 'Add a bio'}</Text>
              </TouchableOpacity>

              {/* Joined Date */}
              <View style={styles.joinedRow}>
                <Ionicons name="sparkles" size={12} color="#5C5C66" />
                <Text style={styles.joinedText}>Joined Oct 2026</Text>
              </View>

              {/* Portfolio Balance Stats */}
              <View style={styles.balanceSection}>
                <Text style={styles.balanceNumber}>$0.00</Text>
                <Text style={styles.balanceDelta}>+$0.00 24h</Text>
              </View>

              {/* Position Tabs: Open | Closed */}
              <View style={styles.tabsRow}>
                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'open' && styles.tabItemActive]}
                  onPress={() => setActiveTab('open')}
                  activeOpacity={0.75}>
                  <Text style={[styles.tabText, activeTab === 'open' && styles.tabTextActive]}>
                    Open
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.tabItem, activeTab === 'closed' && styles.tabItemActive]}
                  onPress={() => setActiveTab('closed')}
                  activeOpacity={0.75}>
                  <Text style={[styles.tabText, activeTab === 'closed' && styles.tabTextActive]}>
                    Closed
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Empty state */}
              <View style={styles.emptyStateCard}>
                <Ionicons name="layers-outline" size={32} color="#3A3A44" style={{ marginBottom: 10 }} />
                <Text style={styles.emptyStateText}>No open positions</Text>
              </View>
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: MANAGE PROFILE SCREEN (1:1 with Frame 13s-15s of video)       */}
        {/* ==================================================================== */}
        {currentView === 'manage' && (
          <View style={styles.contentFlex}>
            {/* Top Navigation */}
            <View style={styles.topNavRow}>
              <TouchableOpacity
                onPress={() => {
                  if (initialView === 'manage') {
                    onClose();
                  } else {
                    setCurrentView('profile');
                  }
                }}
                style={styles.backBtn}
                activeOpacity={0.7}>
                <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.manageTitleHeader}>Manage Profile</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.manageScrollContent}
              showsVerticalScrollIndicator={false}>
              {/* Avatar Center with Change Photo */}
              <View style={styles.avatarChangeArea}>
                <TouchableOpacity
                  onPress={() => setIsAvatarSheetOpen(true)}
                  activeOpacity={0.85}
                  style={styles.avatarCenteredWrapper}>
                  <PhantomCloudAvatar
                    size={84}
                    avatarId={selectedAvatarId}
                    customUri={customAvatarUri}
                    showEditBadge
                    onEditPress={() => setIsAvatarSheetOpen(true)}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setIsAvatarSheetOpen(true)}
                  activeOpacity={0.75}
                  style={styles.changePhotoPill}>
                  <Ionicons name="camera-outline" size={15} color="#ABA0EE" />
                  <Text style={styles.changePhotoText}>Change Profile Picture</Text>
                </TouchableOpacity>
              </View>

              {/* Section 1: About */}
              <Text style={styles.sectionHeaderTitle}>About</Text>
              <View style={styles.groupCard}>
                {/* Username Row */}
                <TouchableOpacity
                  style={styles.menuRowItem}
                  onPress={() => {
                    setNewUsernameInput(username);
                    setIsUsernameSheetOpen(true);
                  }}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Username</Text>
                  <View style={styles.menuRowRight}>
                    <Text style={styles.menuRowValue}>@{username}</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                </TouchableOpacity>

                {/* Bio Row */}
                <TouchableOpacity
                  style={[styles.menuRowItem, styles.rowBorderTop]}
                  onPress={() => {
                    setNewBioInput(bio);
                    setIsBioSheetOpen(true);
                  }}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Bio</Text>
                  <View style={styles.menuRowRight}>
                    <Text style={styles.menuRowPlaceholder}>{bio || 'Add a bio'}</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                </TouchableOpacity>

                {/* Connect X Row */}
                <TouchableOpacity
                  style={[styles.menuRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Connect X', 'Redirecting to X (Twitter) authorization...')}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Connect your X account</Text>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* Connect TikTok Row */}
                <TouchableOpacity
                  style={[styles.menuRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Connect TikTok', 'Redirecting to TikTok authorization...')}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Connect your TikTok account</Text>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>
              </View>

              {/* Section 2: Manage */}
              <Text style={styles.sectionHeaderTitle}>Manage</Text>
              <View style={styles.groupCard}>
                {/* Followers */}
                <TouchableOpacity
                  style={styles.menuRowItem}
                  onPress={() => Alert.alert('Followers', '0 Followers')}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Followers</Text>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>

                {/* Privacy */}
                <TouchableOpacity
                  style={[styles.menuRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Privacy', 'Your profile is currently Public.')}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Privacy</Text>
                  <View style={styles.menuRowRight}>
                    <Text style={styles.menuRowValue}>Public</Text>
                    <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                  </View>
                </TouchableOpacity>

                {/* Verify My Profile */}
                <TouchableOpacity
                  style={[styles.menuRowItem, styles.rowBorderTop]}
                  onPress={() => Alert.alert('Verification', 'Profile verification requested.')}
                  activeOpacity={0.75}>
                  <Text style={styles.menuRowLabel}>Verify my profile</Text>
                  <Ionicons name="chevron-forward" size={17} color="#7E7E88" />
                </TouchableOpacity>
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </View>
        )}

        {/* ==================================================================== */}
        {/* BOTTOM SHEET 1: CHANGE AVATAR                                        */}
        {/* ==================================================================== */}
        <Modal
          visible={isAvatarSheetOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAvatarSheetOpen(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsAvatarSheetOpen(false)}
            />

            <View style={styles.avatarSheetCard}>
              <View style={styles.sheetDragBar} />
              <Text style={styles.sheetTitle}>Choose Profile Picture</Text>
              <Text style={styles.sheetSubtitle}>
                Select an authentic Phantom avatar or enter a custom photo URL.
              </Text>

              {/* Presets Grid */}
              <View style={styles.avatarGrid}>
                {AVATAR_OPTIONS.map((opt) => {
                  const isSelected = selectedAvatarId === opt.id && !customAvatarUri;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.avatarOptionItem, isSelected && styles.avatarOptionSelected]}
                      onPress={() => handleSelectAvatarPreset(opt.id)}
                      activeOpacity={0.75}>
                      <PhantomCloudAvatar size={48} avatarId={opt.id} />
                      <Text
                        style={[styles.avatarOptionName, isSelected && styles.avatarOptionNameActive]}
                        numberOfLines={1}>
                        {opt.name}
                      </Text>
                      {isSelected && (
                        <View style={styles.avatarSelectedBadge}>
                          <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Custom Image URL Option */}
              <View style={styles.customUrlWrapper}>
                <TextInput
                  style={styles.customUrlInput}
                  placeholder="Or enter image URL (https://...)"
                  placeholderTextColor="#7E7E88"
                  value={customUrlInput}
                  onChangeText={setCustomUrlInput}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.customUrlSaveBtn}
                  onPress={handleSaveCustomUrl}
                  activeOpacity={0.8}>
                  <Text style={styles.customUrlSaveText}>Set</Text>
                </TouchableOpacity>
              </View>

              {/* Close Sheet */}
              <TouchableOpacity
                style={styles.sheetDismissBtn}
                onPress={() => setIsAvatarSheetOpen(false)}
                activeOpacity={0.75}>
                <Text style={styles.sheetDismissText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ==================================================================== */}
        {/* BOTTOM SHEET 2: CHANGE USERNAME                                      */}
        {/* ==================================================================== */}
        <Modal
          visible={isUsernameSheetOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsUsernameSheetOpen(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsUsernameSheetOpen(false)}
            />

            <View style={styles.inputSheetCard}>
              <View style={styles.sheetDragBar} />
              <Text style={styles.sheetTitle}>Change Username</Text>
              <Text style={styles.sheetSubtitle}>
                Your username is visible across Phantom, chat, and transaction details.
              </Text>

              {/* Input Box with @ Prefix */}
              <View style={styles.usernameInputBox}>
                <Text style={styles.usernameAtSymbol}>@</Text>
                <TextInput
                  style={styles.usernameTextInput}
                  value={newUsernameInput}
                  onChangeText={(txt) => setNewUsernameInput(txt.replace(/[^a-zA-Z0-9_]/g, ''))}
                  placeholder="username"
                  placeholderTextColor="#7E7E88"
                  autoCapitalize="none"
                  autoFocus
                  maxLength={24}
                />
              </View>
              <Text style={styles.inputHelperText}>
                Letters, numbers, and underscores only. Max 24 characters.
              </Text>

              {/* Save Button */}
              <TouchableOpacity
                style={styles.primaryLilacBtn}
                onPress={handleSaveUsername}
                activeOpacity={0.85}>
                <Text style={styles.primaryLilacBtnText}>Save Username</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetDismissBtn}
                onPress={() => setIsUsernameSheetOpen(false)}
                activeOpacity={0.75}>
                <Text style={styles.sheetDismissText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* ==================================================================== */}
        {/* BOTTOM SHEET 3: EDIT BIO                                             */}
        {/* ==================================================================== */}
        <Modal
          visible={isBioSheetOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setIsBioSheetOpen(false)}>
          <View style={styles.sheetOverlay}>
            <TouchableOpacity
              style={styles.sheetBackdrop}
              activeOpacity={1}
              onPress={() => setIsBioSheetOpen(false)}
            />

            <View style={styles.inputSheetCard}>
              <View style={styles.sheetDragBar} />
              <Text style={styles.sheetTitle}>Edit Bio</Text>
              <Text style={styles.sheetSubtitle}>Tell the community about yourself.</Text>

              <View style={styles.bioInputBox}>
                <TextInput
                  style={styles.bioTextInput}
                  value={newBioInput}
                  onChangeText={setNewBioInput}
                  placeholder="Add a bio (e.g. Solana enthusiast & NFT collector)"
                  placeholderTextColor="#7E7E88"
                  multiline
                  numberOfLines={3}
                  maxLength={120}
                  autoFocus
                />
              </View>

              <TouchableOpacity
                style={styles.primaryLilacBtn}
                onPress={handleSaveBio}
                activeOpacity={0.85}>
                <Text style={styles.primaryLilacBtnText}>Save Bio</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sheetDismissBtn}
                onPress={() => setIsBioSheetOpen(false)}
                activeOpacity={0.75}>
                <Text style={styles.sheetDismissText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentFlex: {
    flex: 1,
  },
  topNavRow: {
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
  manageTopBtn: {
    backgroundColor: '#1E1E24',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
  },
  manageTopBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  manageTitleHeader: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  scrollArea: {
    flex: 1,
  },
  profileScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  manageScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  avatarCenteredWrapper: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  profileHandleText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: TypographyFonts.bold,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statsText: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontFamily: TypographyFonts.medium,
  },
  statsBullet: {
    color: '#5C5C66',
    fontSize: 12,
  },
  bioWrapper: {
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  bioText: {
    color: '#ABA0EE',
    fontSize: 13.5,
    textAlign: 'center',
    fontFamily: TypographyFonts.medium,
  },
  joinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 20,
  },
  joinedText: {
    color: '#5C5C66',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
  },
  balanceSection: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 3,
  },
  balanceNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    fontFamily: TypographyFonts.black,
  },
  balanceDelta: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontFamily: TypographyFonts.medium,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  tabItem: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#141418',
  },
  tabItemActive: {
    backgroundColor: '#1E1E24',
  },
  tabText: {
    color: '#7E7E88',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: TypographyFonts.bold,
  },
  emptyStateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#5C5C66',
    fontSize: 14,
    fontFamily: TypographyFonts.medium,
  },

  /* Manage Profile Specific */
  avatarChangeArea: {
    alignItems: 'center',
    marginVertical: 12,
    gap: 10,
  },
  changePhotoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1A1829',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2F2A4A',
  },
  changePhotoText: {
    color: '#ABA0EE',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  sectionHeaderTitle: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  groupCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
  },
  menuRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  menuRowLabel: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '500',
    fontFamily: TypographyFonts.medium,
  },
  menuRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  menuRowValue: {
    color: '#ABA0EE',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  menuRowPlaceholder: {
    color: '#7E7E88',
    fontSize: 14,
    fontFamily: TypographyFonts.regular,
  },

  /* Bottom Sheets */
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  sheetBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarSheetCard: {
    backgroundColor: '#121216',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#1E1E24',
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 42 : 24,
    alignItems: 'center',
  },
  inputSheetCard: {
    backgroundColor: '#121216',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: '#1E1E24',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 42 : 24,
    alignItems: 'center',
  },
  sheetDragBar: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#32323A',
    marginBottom: 14,
  },
  sheetTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    marginBottom: 4,
  },
  sheetSubtitle: {
    color: '#8E8E98',
    fontSize: 13,
    textAlign: 'center',
    fontFamily: TypographyFonts.medium,
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 18,
  },
  avatarOptionItem: {
    width: 76,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#18181F',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#1E1E24',
    position: 'relative',
  },
  avatarOptionSelected: {
    borderColor: '#ABA0EE',
    backgroundColor: '#201D2F',
  },
  avatarOptionName: {
    color: '#8E8E98',
    fontSize: 11,
    fontFamily: TypographyFonts.medium,
    marginTop: 6,
    textAlign: 'center',
  },
  avatarOptionNameActive: {
    color: '#ABA0EE',
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  avatarSelectedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customUrlWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  customUrlInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#18181F',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 13.5,
    fontFamily: TypographyFonts.regular,
  },
  customUrlSaveBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customUrlSaveText: {
    color: '#121026',
    fontSize: 13.5,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  usernameInputBox: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 6,
  },
  usernameAtSymbol: {
    color: '#ABA0EE',
    fontSize: 19,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    marginRight: 6,
  },
  usernameTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  inputHelperText: {
    color: '#7E7E88',
    fontSize: 12,
    fontFamily: TypographyFonts.medium,
    marginBottom: 18,
    textAlign: 'center',
  },
  bioInputBox: {
    width: '100%',
    backgroundColor: '#18181F',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 14,
    height: 90,
    marginBottom: 18,
  },
  bioTextInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14.5,
    fontFamily: TypographyFonts.regular,
    textAlignVertical: 'top',
  },
  primaryLilacBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryLilacBtnText: {
    color: '#121026',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  sheetDismissBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sheetDismissText: {
    color: '#8E8E98',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
});

