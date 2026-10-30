import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface QuickActionModalProps {
  visible: boolean;
  onClose: () => void;
  onActionSelect: (action: string) => void;
}

export function QuickActionModal({
  visible,
  onClose,
  onActionSelect,
}: QuickActionModalProps) {
  if (!visible) return null;

  const actions = [
    { id: 'buy', label: 'Buy', icon: 'card-outline', color: '#10B981' },
    { id: 'swap', label: 'Swap', icon: 'swap-horizontal-outline', color: '#7C5DFB' },
    { id: 'send', label: 'Send', icon: 'arrow-up-outline', color: '#3B82F6' },
    { id: 'receive', label: 'Receive', icon: 'arrow-down-outline', color: '#F59E0B' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <View style={styles.actionsGrid}>
            {actions.map((act) => (
              <TouchableOpacity
                key={act.id}
                style={styles.actionBtn}
                onPress={() => {
                  onClose();
                  onActionSelect(act.id);
                }}
                activeOpacity={0.8}>
                <View style={[styles.actionIconCircle, { backgroundColor: act.color }]}>
                  <Ionicons name={act.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.actionLabel}>{act.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  sheet: {
    backgroundColor: '#18181A',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: '#222226',
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#333344',
    alignSelf: 'center',
    marginBottom: 24,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionBtn: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
