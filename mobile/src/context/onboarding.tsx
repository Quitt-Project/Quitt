import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'onboardingAccepted';

type OnboardingContextValue = {
  accepted: boolean;
  isLoading: boolean;
  accept: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => setAccepted(value === 'true'))
      .finally(() => setIsLoading(false));
  }, []);

  const accept = async () => {
    await AsyncStorage.setItem(STORAGE_KEY, 'true');
    setAccepted(true);
  };

  return (
    <OnboardingContext.Provider value={{ accepted, isLoading, accept }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used inside OnboardingProvider');
  }
  return context;
}
