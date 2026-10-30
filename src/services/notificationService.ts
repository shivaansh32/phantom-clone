import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
}

type NotificationListener = (payload: NotificationPayload) => void;
const listeners: NotificationListener[] = [];

// Configure notification behavior when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Register a listener for in-app floating banner notifications
 */
export function onNotificationReceived(listener: NotificationListener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx !== -1) listeners.splice(idx, 1);
  };
}

/**
 * Request notification permissions from device (iOS / Android / Web)
 * and setup Android notification channel with MAX priority and Exact Alarms
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  let isGranted = false;

  // 1. Web browser notifications
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        if (Notification.permission === 'granted') return true;
        if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          return perm === 'granted';
        }
      } catch {}
    }
    return false;
  }

  // 2. Native iOS & Android runtime permissions (Crucial for Android 13+)
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }
    isGranted = finalStatus === 'granted';
  } catch (permError) {
    console.warn('Could not request notification permission:', permError);
  }

  // 3. Android Notification Channels & Exact Alarm permission (Crucial for Android 8+)
  if (Platform.OS === 'android') {
    try {
      // Check and request exact alarm permissions (Android 12/13/14+)
      // Without exact alarm permission, scheduled alarms can be delayed by Android Doze mode
      try {
        const exactStatus = await Notifications.getExactAlarmPermissionsAsync();
        if (!exactStatus.granted && exactStatus.canAskAgain) {
          await Notifications.requestExactAlarmPermissionsAsync();
        }
      } catch (exactErr) {
        console.warn('Exact alarm permissions check note:', exactErr);
      }

      await Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#ABA0EE',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });

      await Notifications.setNotificationChannelAsync('deposit-notifications', {
        name: 'Deposit Confirmations',
        description: 'Instant and scheduled wallet deposit alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 300, 200, 300],
        lightColor: '#ABA0EE',
        sound: 'default',
        enableVibrate: true,
        showBadge: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
        bypassDnd: true,
      });
    } catch (channelError) {
      console.warn('Android notification channel setup note:', channelError);
    }
  }

  return isGranted;
}

/**
 * Schedule a native OS notification at a specific time in the future.
 * Uses Android AlarmManager.setAlarmClock via delivery: 'alarmClock'
 * so that the notification rings and wakes the screen even if the phone is locked
 * or the app is killed / removed from background!
 */
export async function scheduleNativeTimerNotification({
  title,
  body,
  seconds,
  data,
}: {
  title: string;
  body: string;
  seconds: number;
  data?: Record<string, any>;
}): Promise<string | null> {
  await requestNotificationPermissions();

  const safeSeconds = Math.max(1, Math.round(seconds));
  const targetDate = new Date(Date.now() + safeSeconds * 1000);

  // Web Browser scheduling fallback
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setTimeout(() => {
        sendDeviceNotification({ title, body, data });
      }, safeSeconds * 1000);
    }
    return `web_timer_${Date.now()}`;
  }

  // Native iOS / Android OS-level background trigger
  // Strategy 1: SchedulableTriggerInputTypes.DATE with delivery: 'alarmClock'
  // On Android, this maps to AlarmManager.setAlarmClock() which is exempt from Doze mode
  // and wakes up the device from deep sleep at the exact timestamp!
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: data || {},
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.MAX,
        vibrate: [0, 300, 200, 300],
        color: '#ABA0EE',
        badge: 1,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: targetDate,
        channelId: 'deposit-notifications',
        delivery: 'alarmClock',
      },
    });

    return notificationId;
  } catch (err) {
    console.warn('[NotificationService] alarmClock trigger fallback, trying standard DATE trigger:', err);
    try {
      const fallbackId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.MAX,
          vibrate: [0, 300, 200, 300],
          color: '#ABA0EE',
          badge: 1,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: targetDate,
          channelId: 'deposit-notifications',
        },
      });
      return fallbackId;
    } catch (fallbackErr) {
      console.warn('[NotificationService] DATE trigger failed, trying TIME_INTERVAL fallback:', fallbackErr);
      try {
        const intervalId = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: data || {},
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.MAX,
            vibrate: [0, 300, 200, 300],
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: safeSeconds,
            repeats: false,
            channelId: 'deposit-notifications',
          },
        });
        return intervalId;
      } catch (lastErr) {
        console.error('[NotificationService] All native scheduling attempts failed:', lastErr);
        return null;
      }
    }
  }
}

/**
 * Cancel a scheduled native notification (e.g. if user cancels timer)
 */
export async function cancelScheduledNativeNotification(notificationId: string): Promise<void> {
  if (Platform.OS === 'web' || !notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (err) {
    console.warn('Could not cancel scheduled notification:', err);
  }
}

/**
 * Send a REAL device notification to system tray / notification center immediately
 */
export async function sendDeviceNotification({
  title = 'Phantom',
  body,
  data,
}: NotificationPayload): Promise<void> {
  // 1. Send via expo-notifications on mobile devices
  if (Platform.OS !== 'web') {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
          sound: true,
          vibrate: [0, 250, 250, 250],
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: null, // deliver immediately to device
      });
    } catch (err) {
      console.warn('Failed to schedule native notification:', err);
    }
  }

  // 2. Send via native Web Notification API on browser/desktop
  if (Platform.OS === 'web' && typeof window !== 'undefined' && 'Notification' in window) {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            new Notification(title, {
              body,
              icon: '/favicon.ico',
            });
          }
        });
      }
    } catch (err) {
      console.warn('Web notification error:', err);
    }
  }

  // 3. Broadcast to in-app banner for visible feedback
  listeners.forEach((listener) => {
    try {
      listener({ title, body, data });
    } catch (err) {
      console.warn('In-app notification listener error:', err);
    }
  });
}
