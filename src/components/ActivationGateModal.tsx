import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Linking,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import { TypographyFonts } from '@/constants/typography';
import {
  getDeviceId,
  requestActivationOtp,
  verifyActivationOtp,
} from '@/services/activationService';

interface ActivationGateModalProps {
  visible: boolean;
  onActivated: () => void;
}

/**
 * 1:1 Phantom Ghost Avatar Icon on Lavender Circle Badge
 */
function PhantomGhostBadge({ size = 70 }: { size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#ABA0EE',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#ABA0EE',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
      }}>
      <Svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 2C6.48 2 2 6.48 2 12C2 15.65 4.02 18.83 7 20.5V22L9.5 20.5L12 22L14.5 20.5L17 22V20.5C19.98 18.83 22 15.65 22 12C22 6.48 17.52 2 12 2Z"
          fill="#121026"
        />
        <Path
          d="M8.5 11.5C9.32843 11.5 10 10.8284 10 10C10 9.17157 9.32843 8.5 8.5 8.5C7.67157 8.5 7 9.17157 7 10C7 10.8284 7.67157 11.5 8.5 11.5Z"
          fill="#ABA0EE"
        />
        <Path
          d="M15.5 11.5C16.3284 11.5 17 10.8284 17 10C17 9.17157 16.3284 8.5 15.5 8.5C14.6716 8.5 14 9.17157 14 10C14 10.8284 14.6716 11.5 15.5 11.5Z"
          fill="#ABA0EE"
        />
      </Svg>
    </View>
  );
}

export function ActivationGateModal({ visible, onActivated }: ActivationGateModalProps) {
  const [deviceId, setDeviceId] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (visible) {
      getDeviceId().then(setDeviceId);
      handleRequestCode(true);
    }
  }, [visible]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRequestCode = async (isInitial = false) => {
    if (isRequesting || (!isInitial && resendCooldown > 0)) return;
    setIsRequesting(true);
    setErrorMsg(null);

    const res = await requestActivationOtp();
    setIsRequesting(false);

    if (res.success) {
      setSuccessMsg(res.message);
      setResendCooldown(60); // 60s cooldown
    } else {
      if (!isInitial) {
        setErrorMsg(res.message);
      }
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter a 6-digit code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const res = await verifyActivationOtp(otp);
    setIsLoading(false);

    if (res.success && res.isActivated) {
      onActivated();
    } else {
      setErrorMsg(res.message || 'Invalid activation code.');
    }
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello! I need the Phantom App activation code for my device.\n\n📲 Device ID: ${deviceId || 'Detecting...'}`
    );
    Linking.openURL(`https://wa.me/919667887198?text=${text}`).catch(() => {
      setErrorMsg('Could not open WhatsApp on this device.');
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.contentWrap}>
            
            {/* Top Ghost Icon */}
            <View style={styles.headerGraphic}>
              <PhantomGhostBadge size={76} />
            </View>

            {/* Title & Description */}
            <Text style={styles.title}>Device Activation</Text>
            <Text style={styles.description}>
              This Phantom installation is locked to this hardware device. An activation code has
              been mailed to the owner's email (shiva***@gmail.com).
            </Text>

            {/* Device ID Display Badge */}
            <View style={styles.deviceIdBadge}>
              <Ionicons name="hardware-chip-outline" size={14} color="#8E8E98" />
              <Text style={styles.deviceIdText} numberOfLines={1}>
                ID: {deviceId || 'Detecting...'}
              </Text>
            </View>

            {/* Error / Success Feedback */}
            {errorMsg && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF2A55" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            )}

            {successMsg && !errorMsg && (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#10B981" />
                <Text style={styles.successText}>{successMsg}</Text>
              </View>
            )}

            {/* 6-Digit OTP Input Field */}
            <View style={styles.otpInputContainer}>
              <TextInput
                ref={inputRef}
                style={styles.hiddenInput}
                value={otp}
                onChangeText={(val) => {
                  const cleaned = val.replace(/\D/g, '').slice(0, 6);
                  setOtp(cleaned);
                  if (errorMsg) setErrorMsg(null);
                }}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />

              {/* Individual Digit Boxes */}
              <TouchableOpacity
                style={styles.digitRow}
                activeOpacity={1}
                onPress={() => inputRef.current?.focus()}>
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const char = otp[index] || '';
                  const isCurrent = otp.length === index;
                  return (
                    <View
                      key={index}
                      style={[
                        styles.digitBox,
                        isCurrent && styles.digitBoxActive,
                        char ? styles.digitBoxFilled : null,
                      ]}>
                      <Text style={styles.digitChar}>{char}</Text>
                    </View>
                  );
                })}
              </TouchableOpacity>
            </View>

            {/* Activate Button */}
            <TouchableOpacity
              style={[
                styles.activateBtn,
                (otp.length !== 6 || isLoading) && styles.activateBtnDisabled,
              ]}
              onPress={handleVerify}
              disabled={otp.length !== 6 || isLoading}
              activeOpacity={0.8}>
              {isLoading ? (
                <ActivityIndicator color="#070709" size="small" />
              ) : (
                <Text style={styles.activateBtnText}>Activate App</Text>
              )}
            </TouchableOpacity>

            {/* Quick Testing PIN Shortcut */}
            <TouchableOpacity
              onPress={() => {
                setOtp('966788');
                if (errorMsg) setErrorMsg(null);
              }}
              activeOpacity={0.7}
              style={styles.testingPinBtn}>
              <Ionicons name="flash" size={13} color="#ABA0EE" />
              <Text style={styles.testingPinText}>
                Testing? Tap to fill Master Test PIN (966788)
              </Text>
            </TouchableOpacity>

            {/* Resend Code Button */}
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={() => handleRequestCode(false)}
              disabled={resendCooldown > 0 || isRequesting}
              activeOpacity={0.7}>
              {isRequesting ? (
                <ActivityIndicator color="#8E8E98" size="small" />
              ) : (
                <Text
                  style={[
                    styles.resendBtnText,
                    resendCooldown > 0 && styles.resendBtnTextDisabled,
                  ]}>
                  {resendCooldown > 0
                    ? `Resend code to email in ${resendCooldown}s`
                    : 'Resend code to owner email (shiva***@gmail.com)'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Footer Notice */}
            <Text style={styles.footerNotice}>
              Contact the app administrator with your Device ID to receive your 6-digit access OTP.
            </Text>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentWrap: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  headerGraphic: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
    letterSpacing: -0.3,
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    color: '#8E8E98',
    fontSize: 14.5,
    fontFamily: TypographyFonts.regular,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  deviceIdBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#141418',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#1E1E24',
    marginBottom: 22,
  },
  deviceIdText: {
    color: '#8E8E98',
    fontSize: 12,
    fontFamily: TypographyFonts.medium,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#260B12',
    borderWidth: 1,
    borderColor: 'rgba(255, 42, 85, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: '#FF2A55',
    fontSize: 13,
    fontFamily: TypographyFonts.medium,
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0C2417',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    width: '100%',
  },
  successText: {
    color: '#10B981',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
    flex: 1,
  },
  otpInputContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  digitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  digitBox: {
    flex: 1,
    height: 52,
    backgroundColor: '#141418',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#22222A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  digitBoxActive: {
    borderColor: '#ABA0EE',
    backgroundColor: '#1A1828',
  },
  digitBoxFilled: {
    borderColor: '#36344A',
    backgroundColor: '#16161D',
  },
  digitChar: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  activateBtn: {
    backgroundColor: '#ABA0EE',
    borderRadius: 24,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activateBtnDisabled: {
    opacity: 0.45,
  },
  activateBtnText: {
    color: '#070709',
    fontSize: 16,
    fontFamily: TypographyFonts.bold,
    fontWeight: Platform.OS === 'ios' ? '700' : undefined,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#25D366',
    borderRadius: 24,
    height: 48,
    width: '100%',
    marginBottom: 8,
  },
  whatsappBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: TypographyFonts.semiBold,
    fontWeight: Platform.OS === 'ios' ? '600' : undefined,
  },
  testingPinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  testingPinText: {
    color: '#ABA0EE',
    fontSize: 12.5,
    fontFamily: TypographyFonts.medium,
  },
  resendBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
  },
  resendBtnText: {
    color: '#ABA0EE',
    fontSize: 13.5,
    fontFamily: TypographyFonts.medium,
  },
  resendBtnTextDisabled: {
    color: '#555562',
  },
  footerNotice: {
    color: '#5A5A66',
    fontSize: 12,
    fontFamily: TypographyFonts.regular,
    textAlign: 'center',
    lineHeight: 17,
  },
});
