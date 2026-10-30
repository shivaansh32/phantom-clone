import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { API_BASE_URL } from '@/constants/api';

const ACTIVATION_STORAGE_KEYS = {
  DEVICE_ID: '@phantom_device_id_v1',
  ACTIVATION_TOKEN: '@phantom_activation_token_v1',
  IS_ACTIVATED: '@phantom_device_activated_v1',
};

// Resilient in-memory fallback for environments where native AsyncStorage module is missing
const memoryFallback = new Map<string, string>();

const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    // 1. Try web localStorage if available
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {}

    // 2. Try AsyncStorage
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
    } catch (e: any) {
      // Suppress native module null error and fall through to memory fallback
    }

    return memoryFallback.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryFallback.set(key, value);

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}

    try {
      await AsyncStorage.setItem(key, value);
    } catch (e: any) {
      // Suppress native module null error
    }
  },
};

/**
 * Safely parse fetch response preventing "JSON Parse error: Unexpected character: <"
 */
async function safeFetchJson(url: string, options: RequestInit): Promise<{ ok: boolean; status: number; data: any }> {
  try {
    const resp = await fetch(url, options);
    const rawText = await resp.text();

    let data: any = {};
    const trimmed = rawText.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        data = JSON.parse(trimmed);
      } catch {
        data = { message: rawText };
      }
    } else {
      // Returned HTML (e.g., 404 Not Found, 502 Bad Gateway)
      if (resp.status === 404) {
        data = {
          message: `Endpoint 404 Not Found on ${url.split('/')[2]}. Please ensure your Railway backend is updated with the activation routes.`,
        };
      } else {
        data = {
          message: `Server returned HTTP ${resp.status} (${resp.statusText || 'Error'}). Please check backend logs.`,
        };
      }
    }

    return { ok: resp.ok, status: resp.status, data };
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: {
        message: err.message || 'Network connection failed. Please check internet connection.',
      },
    };
  }
}

/**
 * Retrieve or generate a persistent hardware/installation ID for this device
 */
export async function getDeviceId(): Promise<string> {
  try {
    let id = await safeStorage.getItem(ACTIVATION_STORAGE_KEYS.DEVICE_ID);
    if (!id) {
      const randomPart = Math.random().toString(36).substring(2, 9);
      const timePart = Date.now().toString(36);
      id = `dev_${Platform.OS}_${timePart}_${randomPart}`;
      await safeStorage.setItem(ACTIVATION_STORAGE_KEYS.DEVICE_ID, id);
    }
    return id;
  } catch {
    return `dev_fallback_${Date.now()}`;
  }
}

/**
 * Get device model descriptor
 */
export function getDeviceModelDescriptor(): string {
  if (Platform.OS === 'android') {
    return 'Android Mobile';
  } else if (Platform.OS === 'ios') {
    return 'Apple iPhone';
  }
  return 'Web / Desktop Client';
}

/**
 * Check whether this specific device is already activated
 * (Temporarily bypassed - OTP gate disabled for now)
 */
export async function checkDeviceActivationStatus(): Promise<{ isActivated: boolean }> {
  return { isActivated: true };
}

/**
 * Request an activation OTP to be pushed to the owner's phone number
 */
export async function requestActivationOtp(): Promise<{
  success: boolean;
  message: string;
  ownerPhoneMasked?: string;
}> {
  try {
    const deviceId = await getDeviceId();
    const deviceModel = getDeviceModelDescriptor();

    if (!API_BASE_URL) {
      return {
        success: false,
        message: 'Backend server URL not configured. Please set EXPO_PUBLIC_API_URL in .env.',
      };
    }

    const { ok, status, data } = await safeFetchJson(`${API_BASE_URL}/activation/request-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, deviceModel }),
    });

    if (!ok) {
      return {
        success: false,
        message: data?.message || `Activation server returned HTTP error ${status}.`,
      };
    }

    return {
      success: true,
      message: data.message || 'Activation code dispatched to owner.',
      ownerPhoneMasked: data.ownerPhoneMasked || '+91 96678*****',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to activation server.',
    };
  }
}

/**
 * Verify OTP entered by user and activate app on this device
 */
export async function verifyActivationOtp(otp: string): Promise<{
  success: boolean;
  message: string;
  isActivated?: boolean;
}> {
  try {
    const deviceId = await getDeviceId();

    if (!API_BASE_URL) {
      return {
        success: false,
        message: 'Backend server URL not configured.',
      };
    }

    const { ok, data } = await safeFetchJson(`${API_BASE_URL}/activation/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, otp: otp.trim() }),
    });

    if (!ok || !data?.success) {
      return {
        success: false,
        message: data?.message || 'Invalid activation code.',
      };
    }

    // Persist activation locally
    if (data.activationToken) {
      await safeStorage.setItem(ACTIVATION_STORAGE_KEYS.ACTIVATION_TOKEN, data.activationToken);
    }
    await safeStorage.setItem(ACTIVATION_STORAGE_KEYS.IS_ACTIVATED, 'true');

    return {
      success: true,
      isActivated: true,
      message: data.message || 'Device activated successfully!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error verifying activation code.',
    };
  }
}
