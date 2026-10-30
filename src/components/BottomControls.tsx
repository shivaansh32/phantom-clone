import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface BottomControlsProps {
  onPressSearch: () => void;
  onPressPlus: () => void;
}

export function BottomControls({ onPressSearch, onPressPlus }: BottomControlsProps) {
  const c = Colors.phantom;
  const insets = useSafeAreaInsets();
  const bottomOffset = Math.max(insets.bottom, Platform.OS === 'ios' ? 24 : 16) + (Platform.OS === 'android' ? 10 : 0);

  return (
    <View style={[styles.floatingContainer, { bottom: bottomOffset }]}>
      {/* Search Input Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={onPressSearch}
        activeOpacity={0.85}>
        <Ionicons name="search" size={19} color="#8E8E93" style={styles.searchIcon} />
        <Text style={styles.placeholderText}>Search Phantom</Text>
      </TouchableOpacity>

      {/* Floating Plus Button (Lilac circle with black + icon) */}
      <TouchableOpacity
        style={styles.plusButton}
        onPress={onPressPlus}
        activeOpacity={0.85}
        accessibilityLabel="Actions menu">
        <Ionicons name="add" size={28} color="#000000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    zIndex: 90,
  },
  searchBar: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#18181A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  searchIcon: {
    marginRight: 10,
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 15,
    letterSpacing: -0.2,
    fontWeight: '400',
  },
  plusButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ABA0EE', // Phantom lilac matching Home pill
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
