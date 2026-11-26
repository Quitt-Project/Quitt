import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';

import { OnboardingProvider, useOnboarding } from '@/context/onboarding';

jest.mock('@react-native-async-storage/async-storage', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

const KEY = 'onboardingAccepted';

beforeEach(async () => {
  await AsyncStorage.clear();
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('is not accepted when storage is empty', async () => {
  const { result } = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });

  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current.accepted).toBe(false);
});

test('is accepted when storage already has "true"', async () => {
  await AsyncStorage.setItem(KEY, 'true');

  const { result } = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.accepted).toBe(true);
});

test('accept() sets accepted and saves "true" to storage', async () => {
  const { result } = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.accept();
  });

  expect(result.current.accepted).toBe(true);
  expect(await AsyncStorage.getItem(KEY)).toBe('true');
});

test('accepted survives an app restart', async () => {
  // first launch
  const first = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });
  await waitFor(() => expect(first.result.current.isLoading).toBe(false));

  await act(async () => {
    await first.result.current.accept();
  });

  // close the app
  await first.unmount();

  // second launch, didn't clear the storage
  const second = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });
  await waitFor(() => expect(second.result.current.isLoading).toBe(false));

  expect(second.result.current.accepted).toBe(true);
});

test('read failure: stays not accepted and logs a warning', async () => {
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('read failed'));
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});

  const { result } = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });
  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.accepted).toBe(false);
  expect(warn).toHaveBeenCalled();
});

test('write failure: still sets accepted and logs a warning', async () => {
  jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('write failed'));
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  const { result } = await renderHook(() => useOnboarding(), {
    wrapper: OnboardingProvider,
  });
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  await act(async () => {
    await result.current.accept();
  });
  expect(result.current.accepted).toBe(true);
  expect(warn).toHaveBeenCalled();
});
