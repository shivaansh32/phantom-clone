import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';

interface ReferEarnModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
}

export function ReferEarnModal({
  visible,
  onClose,
  username,
}: ReferEarnModalProps) {
  const [copied, setCopied] = useState(false);

  if (!visible) return null;

  const referralCode = `PHANTOM-${username.toUpperCase()}`;
  const referralLink = `https://phantom.app/ref/${username.toLowerCase()}`;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Trade with me on Phantom! Use my referral code ${referralCode} or sign up at ${referralLink}`,
      });
    } catch {}
  };

  const handleCopy = () => {
    setCopied(true);
    Alert.alert('Referral Code Copied', `${referralCode} has been copied to your clipboard.`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Refer & Earn</Text>
          <View style={{ width: 36 }} />
        </View>

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Hero Banner Card */}
          <View style={styles.heroCard}>
            <View style={styles.giftIconCircle}>
              <Ionicons name="gift" size={32} color="#121026" />
            </View>
            <Text style={styles.heroTitle}>Invite Friends, Earn Crypto</Text>
            <Text style={styles.heroSub}>
              Earn up to 20% ongoing commission on trading fees whenever a friend trades through Phantom.
            </Text>
          </View>

          {/* Referral Code Card */}
          <View style={styles.codeCard}>
            <Text style={styles.codeLabel}>YOUR REFERRAL CODE</Text>
            <View style={styles.codeRow}>
              <Text style={styles.codeText}>{referralCode}</Text>
              <TouchableOpacity onPress={handleCopy} style={styles.copyBtn} activeOpacity={0.75}>
                <Ionicons
                  name={copied ? 'checkmark-circle' : 'copy-outline'}
                  size={18}
                  color={copied ? '#10B981' : '#ABA0EE'}
                />
                <Text style={[styles.copyBtnText, copied && { color: '#10B981' }]}>
                  {copied ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Primary Share Button */}
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.85}>
            <Ionicons name="share-outline" size={19} color="#121026" style={{ marginRight: 6 }} />
            <Text style={styles.shareBtnText}>Share Referral Link</Text>
          </TouchableOpacity>

          {/* Referral Stats Grid */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Friends Joined</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Total Rewards Earned</Text>
              <Text style={styles.statValue}>$0.00</Text>
            </View>
          </View>

          {/* How It Works Section */}
          <Text style={styles.sectionHeading}>How It Works</Text>
          <View style={styles.stepsCard}>
            {[
              {
                step: '1',
                title: 'Share your link',
                desc: 'Send your invite code or unique referral link to friends.',
              },
              {
                step: '2',
                title: 'Friends join Phantom',
                desc: 'When they create a wallet or fund their account, they are linked to you.',
              },
              {
                step: '3',
                title: 'Earn rewards automatically',
                desc: 'Get up to 20% fee cashback credited directly to your Solana wallet.',
              },
            ].map((st, idx) => (
              <View key={st.step} style={[styles.stepRow, idx > 0 && styles.rowBorderTop]}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>{st.step}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stepTitle}>{st.title}</Text>
                  <Text style={styles.stepDesc}>{st.desc}</Text>
                </View>
              </View>
            ))}
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
  heroCard: {
    backgroundColor: '#1E1A33',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#372E5C',
    padding: 20,
    alignItems: 'center',
    marginVertical: 14,
    gap: 8,
  },
  giftIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: TypographyFonts.black,
    textAlign: 'center',
  },
  heroSub: {
    color: '#AEAEC0',
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: TypographyFonts.regular,
  },
  codeCard: {
    backgroundColor: '#141418',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    marginBottom: 14,
  },
  codeLabel: {
    color: '#8E8E98',
    fontSize: 11.5,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: TypographyFonts.bold,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  codeText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
    letterSpacing: 0.5,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#1E1B32',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  copyBtnText: {
    color: '#ABA0EE',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ABA0EE',
    marginBottom: 20,
  },
  shareBtnText: {
    color: '#121026',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141418',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#1E1E24',
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statLabel: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: TypographyFonts.medium,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    fontFamily: TypographyFonts.black,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#1E1E24',
  },
  sectionHeading: {
    color: '#8E8E98',
    fontSize: 13.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  stepsCard: {
    backgroundColor: '#141418',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E1E24',
    paddingHorizontal: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 14,
  },
  rowBorderTop: {
    borderTopWidth: 1,
    borderTopColor: '#1A1A22',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#26243A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  stepBadgeText: {
    color: '#ABA0EE',
    fontSize: 13,
    fontWeight: '700',
    fontFamily: TypographyFonts.bold,
  },
  stepTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '600',
    fontFamily: TypographyFonts.semiBold,
    marginBottom: 2,
  },
  stepDesc: {
    color: '#8E8E98',
    fontSize: 12.5,
    lineHeight: 17,
    fontFamily: TypographyFonts.regular,
  },
});

