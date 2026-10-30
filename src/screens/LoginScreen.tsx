import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface AuthenticatedUser {
  id: string;
  username: string;
  balance: number;
  accessToken: string;
}

interface LoginScreenProps {
  onAuthenticated: (user: AuthenticatedUser) => void;
}

export function LoginScreen({ onAuthenticated }: LoginScreenProps) {
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');

    if (!username.trim() || !password) {
      setErrorMessage('Enter your username and password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onAuthenticated({
        id: 'mock-user-1',
        username: username.trim(),
        balance: 929.88,
        accessToken: 'mock-token',
      });
    }, 300);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.brand}>
          <View style={styles.brandIcon}>
            <Ionicons name="wallet-outline" size={25} color="#FFFFFF" />
          </View>
          <Text style={styles.brandName}>PHANTOM</Text>
          <Text style={styles.brandCaption}>Your wallet, all in one place</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            {isCreatingAccount ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.subtitle}>
            {isCreatingAccount
              ? 'Create an account to get started.'
              : 'Sign in to view your account balance.'}
          </Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            accessibilityLabel="Username"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
            onChangeText={setUsername}
            onSubmitEditing={handleSubmit}
            placeholder="Enter your username"
            placeholderTextColor={Colors.phantom.textMuted}
            returnKeyType="next"
            style={styles.input}
            value={username}
          />

          <Text style={[styles.label, styles.passwordLabel]}>Password</Text>
          <View style={styles.passwordField}>
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
              placeholder="Enter your password"
              placeholderTextColor={Colors.phantom.textMuted}
              returnKeyType="done"
              secureTextEntry={!isPasswordVisible}
              style={styles.passwordInput}
              value={password}
            />
            <TouchableOpacity
              accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
              disabled={isSubmitting}
              onPress={() => setIsPasswordVisible((visible) => !visible)}
              style={styles.visibilityButton}>
              <Ionicons
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                size={19}
                color={Colors.phantom.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {errorMessage ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {errorMessage}
            </Text>
          ) : null}

          <TouchableOpacity
            accessibilityRole="button"
            activeOpacity={0.8}
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[styles.submitButton, isSubmitting && styles.disabledButton]}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitText}>
                {isCreatingAccount ? 'Create account' : 'Log in'}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>
              {isCreatingAccount ? 'Already have an account?' : 'New to Phantom?'}
            </Text>
            <TouchableOpacity
              disabled={isSubmitting}
              onPress={() => {
                setIsCreatingAccount((creating) => !creating);
                setErrorMessage('');
              }}>
              <Text style={styles.switchAction}>
                {isCreatingAccount ? 'Log in' : 'Create account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.phantom.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 36,
  },
  brand: {
    alignItems: 'center',
    marginBottom: 30,
  },
  brandIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.phantom.accentPurple,
    marginBottom: 13,
  },
  brandName: {
    color: Colors.phantom.text,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 3,
  },
  brandCaption: {
    color: Colors.phantom.textSecondary,
    fontSize: 13,
    marginTop: 7,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.phantom.cardBorder,
    backgroundColor: Colors.phantom.card,
  },
  title: {
    color: Colors.phantom.text,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.phantom.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 25,
  },
  label: {
    color: Colors.phantom.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordLabel: {
    marginTop: 18,
  },
  input: {
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.phantom.cardBorder,
    backgroundColor: '#0B0B10',
    color: Colors.phantom.text,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  passwordField: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.phantom.cardBorder,
    backgroundColor: '#0B0B10',
  },
  passwordInput: {
    flex: 1,
    color: Colors.phantom.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  visibilityButton: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    color: Colors.phantom.red,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 14,
  },
  submitButton: {
    minHeight: 50,
    borderRadius: 13,
    backgroundColor: Colors.phantom.accentPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  disabledButton: {
    opacity: 0.65,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 22,
  },
  switchText: {
    color: Colors.phantom.textSecondary,
    fontSize: 13,
  },
  switchAction: {
    color: Colors.phantom.accentPurpleLight,
    fontSize: 13,
    fontWeight: '700',
  },
});
