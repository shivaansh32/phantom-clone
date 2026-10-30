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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Path } from 'react-native-svg';
import { TypographyFonts } from '@/constants/typography';
import { TokenAvatar } from '@/components/TokenAvatar';
import { sendDeviceNotification } from '@/services/notificationService';

interface ReceiveModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NetworkItem {
  id: string;
  name: string;
  symbol: string;
  address: string;
  fullAddress: string;
  iconBg: string;
  iconType: string;
}

const NETWORKS_LIST: NetworkItem[] = [
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    address: '1hjk...BsHR',
    fullAddress: '1hjk7QzB9qVw2XmL8yFt3KpNr6DsBsHR',
    iconBg: '#0A0A0E',
    iconType: 'sol',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#627EEA',
    iconType: 'eth',
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1q...52cn',
    fullAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjh52cn',
    iconBg: '#F7931A',
    iconType: 'btc',
  },
  {
    id: 'robinhood',
    name: 'Robinhood Chain',
    symbol: 'RH',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#000000',
    iconType: 'robinhood',
  },
  {
    id: 'bnb',
    name: 'BNB Chain',
    symbol: 'BNB',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#F3BA2F',
    iconType: 'bnb',
  },
  {
    id: 'arc',
    name: 'Arc',
    symbol: 'ARC',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#181C26',
    iconType: 'arc',
  },
  {
    id: 'base',
    name: 'Base',
    symbol: 'BASE',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#0052FF',
    iconType: 'base',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'POL',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#8247E5',
    iconType: 'polygon',
  },
  {
    id: 'hyperevm',
    name: 'HyperEVM Lite',
    symbol: 'HYPE',
    address: '0xf5Bb...826c',
    fullAddress: '0xf5Bb964C3d14E7B91238Ac419F2826c',
    iconBg: '#0C0C12',
    iconType: 'hype',
  },
];

/**
 * 1:1 replica of Phantom Receive Sheet from video (Frames 00:28 - 00:29)
 */
export function ReceiveModal({ visible, onClose }: ReceiveModalProps) {
  const insets = useSafeAreaInsets();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [qrItem, setQrItem] = useState<NetworkItem | null>(null);

  if (!visible) return null;

  const handleCopy = (net: NetworkItem) => {
    setCopiedId(net.id);
    sendDeviceNotification({
      title: 'Address Copied',
      body: `${net.name} address copied to clipboard: ${net.address}`,
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.title}>Receive</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={20} color="#8E8E98" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
            {/* 1. Cash Stablecoins Row */}
            <View style={styles.cashCard}>
              <View style={styles.cashLeft}>
                <View style={styles.cashIconWrap}>
                  <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.cashMeta}>
                  <Text style={styles.cashTitle}>Cash</Text>
                  <Text style={styles.cashSub}>Stablecoins and cash transfers</Text>
                </View>
              </View>

              <View style={styles.actionBtnsGroup}>
                <TouchableOpacity
                  style={styles.actionSquareBtn}
                  onPress={() =>
                    setQrItem({
                      id: 'cash',
                      name: 'Cash (USDC)',
                      symbol: 'USDC',
                      address: '1hjk...BsHR',
                      fullAddress: '1hjk7QzB9qVw2XmL8yFt3KpNr6DsBsHR',
                      iconBg: '#2775CA',
                      iconType: 'usdc',
                    })
                  }
                  activeOpacity={0.75}>
                  <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionSquareBtn}
                  onPress={() =>
                    handleCopy({
                      id: 'cash',
                      name: 'Cash (USDC)',
                      symbol: 'USDC',
                      address: '1hjk...BsHR',
                      fullAddress: '1hjk7QzB9qVw2XmL8yFt3KpNr6DsBsHR',
                      iconBg: '#2775CA',
                      iconType: 'usdc',
                    })
                  }
                  activeOpacity={0.75}>
                  <Ionicons
                    name={copiedId === 'cash' ? 'checkmark' : 'copy-outline'}
                    size={17}
                    color={copiedId === 'cash' ? '#10B981' : '#FFFFFF'}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 2. Networks List */}
            {NETWORKS_LIST.map((net) => {
              const isCopied = copiedId === net.id;
              return (
                <View key={net.id} style={styles.networkRow}>
                  <View style={styles.networkLeft}>
                    <TokenAvatar
                      symbol={net.symbol}
                      iconType={net.iconType}
                      iconBg={net.iconBg}
                      size={36}
                    />
                    <View style={styles.networkMeta}>
                      <Text style={styles.networkName}>{net.name}</Text>
                      <Text style={styles.networkAddress}>{net.address}</Text>
                    </View>
                  </View>

                  <View style={styles.actionBtnsGroup}>
                    <TouchableOpacity
                      style={styles.actionSquareBtn}
                      onPress={() => setQrItem(net)}
                      activeOpacity={0.75}>
                      <Ionicons name="qr-code-outline" size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionSquareBtn}
                      onPress={() => handleCopy(net)}
                      activeOpacity={0.75}>
                      <Ionicons
                        name={isCopied ? 'checkmark' : 'copy-outline'}
                        size={17}
                        color={isCopied ? '#10B981' : '#FFFFFF'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* QR Code Detail Modal */}
        {qrItem && (
          <Modal transparent animationType="fade" visible={!!qrItem} onRequestClose={() => setQrItem(null)}>
            <View style={styles.qrModalOverlay}>
              <View style={styles.qrCard}>
                <TouchableOpacity style={styles.qrCloseBtn} onPress={() => setQrItem(null)}>
                  <Ionicons name="close" size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <TokenAvatar
                  symbol={qrItem.symbol}
                  iconType={qrItem.iconType}
                  iconBg={qrItem.iconBg}
                  size={48}
                />
                <Text style={styles.qrTitle}>{qrItem.name} Address</Text>

                {/* SVG Stylized QR Code Pattern */}
                <View style={styles.qrBox}>
                  <Svg width={180} height={180} viewBox="0 0 180 180">
                    <Rect width="180" height="180" fill="#FFFFFF" rx="8" />
                    {/* Corner 1 */}
                    <Rect x="15" y="15" width="40" height="40" fill="#000000" rx="4" />
                    <Rect x="23" y="23" width="24" height="24" fill="#FFFFFF" rx="2" />
                    <Rect x="29" y="29" width="12" height="12" fill="#000000" rx="1" />
                    {/* Corner 2 */}
                    <Rect x="125" y="15" width="40" height="40" fill="#000000" rx="4" />
                    <Rect x="133" y="23" width="24" height="24" fill="#FFFFFF" rx="2" />
                    <Rect x="139" y="29" width="12" height="12" fill="#000000" rx="1" />
                    {/* Corner 3 */}
                    <Rect x="15" y="125" width="40" height="40" fill="#000000" rx="4" />
                    <Rect x="23" y="133" width="24" height="24" fill="#FFFFFF" rx="2" />
                    <Rect x="29" y="139" width="12" height="12" fill="#000000" rx="1" />
                    {/* Data dots */}
                    <Rect x="70" y="20" width="12" height="12" fill="#000000" />
                    <Rect x="95" y="20" width="12" height="12" fill="#000000" />
                    <Rect x="70" y="45" width="12" height="12" fill="#000000" />
                    <Rect x="95" y="70" width="12" height="12" fill="#000000" />
                    <Rect x="125" y="70" width="12" height="12" fill="#000000" />
                    <Rect x="45" y="70" width="12" height="12" fill="#000000" />
                    <Rect x="70" y="95" width="12" height="12" fill="#000000" />
                    <Rect x="95" y="95" width="12" height="12" fill="#000000" />
                    <Rect x="125" y="95" width="12" height="12" fill="#000000" />
                    <Rect x="70" y="125" width="12" height="12" fill="#000000" />
                    <Rect x="95" y="125" width="12" height="12" fill="#000000" />
                    <Rect x="125" y="125" width="12" height="12" fill="#000000" />
                    <Rect x="145" y="145" width="12" height="12" fill="#000000" />
                  </Svg>
                </View>

                <Text style={styles.qrAddress}>{qrItem.fullAddress}</Text>

                <TouchableOpacity
                  style={styles.qrCopyBtn}
                  onPress={() => {
                    handleCopy(qrItem);
                    setQrItem(null);
                  }}
                  activeOpacity={0.8}>
                  <Ionicons name="copy-outline" size={16} color="#000000" style={{ marginRight: 6 }} />
                  <Text style={styles.qrCopyBtnText}>Copy Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  sheet: {
    backgroundColor: '#121216',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 16,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#33333F',
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E26',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.3,
  },
  closeBtn: {
    padding: 6,
  },
  scrollList: {
    marginTop: 10,
  },
  cashCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#18181E',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  cashLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cashIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cashMeta: {
    flex: 1,
  },
  cashTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.2,
  },
  cashSub: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    marginTop: 2,
  },
  networkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A22',
  },
  networkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  networkMeta: {
    marginLeft: 12,
    flex: 1,
  },
  networkName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.2,
  },
  networkAddress: {
    color: '#8E8E98',
    fontSize: 13,
    fontFamily: TypographyFonts.regular,
    marginTop: 2,
  },
  actionBtnsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionSquareBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#202028',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  qrModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  qrCard: {
    backgroundColor: '#18181E',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    borderWidth: 1,
    borderColor: '#262632',
  },
  qrCloseBtn: {
    alignSelf: 'flex-end',
    padding: 6,
    marginTop: -8,
    marginRight: -8,
  },
  qrTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    marginTop: 12,
    marginBottom: 16,
  },
  qrBox: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
  },
  qrAddress: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  qrCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ABA0EE',
    height: 46,
    borderRadius: 23,
    width: '100%',
  },
  qrCopyBtnText: {
    color: '#000000',
    fontSize: 15,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
});
