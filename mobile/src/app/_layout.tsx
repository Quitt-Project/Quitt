import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding';

function RootNavigator() {
  const { accepted, isLoading: isOnboardingLoading } = useOnboarding();
  const { user, isLoading: isAuthLoading } = useAuth();

  if (isOnboardingLoading || isAuthLoading) {
    return null;
  }

  const isLoggedIn = user !== null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!accepted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>

      <Stack.Protected guard={accepted && !isLoggedIn}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
      </Stack.Protected>

      <Stack.Protected guard={accepted && isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" options={{ presentation: 'fullScreenModal' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </OnboardingProvider>
  );
}