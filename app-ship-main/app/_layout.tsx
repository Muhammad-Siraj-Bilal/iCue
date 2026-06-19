import 'react-native-get-random-values';
import 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useColorScheme } from '@/components/useColorScheme';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const handleBackToApp = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="login"
                options={{
                  presentation: 'modal',
                  title: '',
                  headerTitleStyle: {
                    fontFamily: 'mon-sb',
                  },
                  headerLeft: () => (
                    <TouchableOpacity onPress={() => router.back()}>
                      <Ionicons name="close-outline" size={28} />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen name="Intro" options={{ headerShown: false }} />
              <Stack.Screen name="QuizScreen" options={{ headerShown: false }} />
              <Stack.Screen
                name="Information"
                options={{
                  title: 'Learning Room',
                  headerBackTitle: 'Back',
                  headerLeft: () => (
                    <TouchableOpacity onPress={handleBackToApp} style={styles.headerBackButton}>
                      <Ionicons name="chevron-back" size={24} />
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
