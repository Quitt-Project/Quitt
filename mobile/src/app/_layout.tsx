import { Stack } from 'expo-router';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding';

function RootNavigator() {
  const { accepted, isLoading } = useOnboarding();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={accepted}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="scan" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={!accepted}>
        <Stack.Screen name="onboarding" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <RootNavigator />
    </OnboardingProvider>
  );
}
