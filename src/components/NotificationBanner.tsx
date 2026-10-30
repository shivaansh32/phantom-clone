import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { onNotificationReceived, NotificationPayload } from '@/services/notificationService';

export function NotificationBanner() {
  const [currentNotification, setCurrentNotification] = useState<NotificationPayload | null>(null);
  const translateY = useRef(new Animated.Value(-120)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onNotificationReceived((payload) => {
      setCurrentNotification(payload);

      // Slide down
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();

      // Clear previous timer
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }

      // Auto dismiss after 5.5s
      hideTimeoutRef.current = setTimeout(() => {
        dismissBanner();
      }, 5500);
    });

    return () => {
      unsubscribe();
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const dismissBanner = () => {
    Animated.timing(translateY, {
      toValue: -120,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setCurrentNotification(null);
    });
  };

  if (!currentNotification || Platform.OS === 'android') return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        style={styles.banner}
        activeOpacity={0.9}
        onPress={dismissBanner}>
        <View style={styles.bannerHeader}>
          <View style={styles.headerLeft}>
            <View style={styles.appIconBadge}>
              <Ionicons name="flash" size={12} color="#121026" />
            </View>
            <Text style={styles.appName}>PHANTOM</Text>
          </View>
          <Text style={styles.timestampText}>now</Text>
        </View>

        <Text style={styles.notificationTitle}>{currentNotification.title}</Text>
        <Text style={styles.notificationBody}>{currentNotification.body}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 12,
    right: 12,
    zIndex: 9999,
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#1E1E26',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2A2A38',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 10,
    gap: 4,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#ABA0EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    color: '#ABA0EE',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timestampText: {
    color: '#8E8E98',
    fontSize: 11,
    fontWeight: '500',
  },
  notificationTitle: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  notificationBody: {
    color: '#E0E0E8',
    fontSize: 13.5,
    lineHeight: 18,
  },
});
