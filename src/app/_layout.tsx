import React, { useEffect } from 'react';
import { Platform, Text as RNText, TextInput as RNTextInput } from 'react-native';
import { DarkTheme, ThemeProvider, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {});

// Ensure React Native default Text style always uses Inter sans-serif on Android/iOS (never system serif)
if ((RNText as any).defaultProps == null) {
  (RNText as any).defaultProps = {};
}
(RNText as any).defaultProps.style = { fontFamily: 'Inter-Regular' };

if ((RNTextInput as any).defaultProps == null) {
  (RNTextInput as any).defaultProps = {};
}
(RNTextInput as any).defaultProps.style = { fontFamily: 'Inter-Regular' };

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Inter-Black': require('../../assets/fonts/Inter_18pt-Black.ttf'),
    'Inter-Bold': require('../../assets/fonts/Inter_18pt-Bold.ttf'),
    'Inter-SemiBold': require('../../assets/fonts/Inter_18pt-SemiBold.ttf'),
    'Inter-Medium': require('../../assets/fonts/Inter_18pt-Medium.ttf'),
    'Inter-Regular': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
    'Inter': require('../../assets/fonts/Inter_18pt-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const fontId = 'phantom-inter-font';
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap';
        document.head.appendChild(link);
      }
    }
  }, []);

  if (!fontsLoaded && Platform.OS !== 'web') {
    return null;
  }

  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#000000',
      card: '#18181A',
      text: '#FFFFFF',
      border: 'transparent',
    },
  };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={customDarkTheme}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#000000' },
          }}>
          <Stack.Screen name="index" />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
