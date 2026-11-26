import { Linking } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Onboarding from '@/app/onboarding';
const mockAccept = jest.fn();

jest.mock('@/context/onboarding', () => ({
  useOnboarding: () => ({ accept: mockAccept }),
}));
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));
jest.mock('expo-image', () => ({
  Image: () => null,
}));
const START_BUTTON = 'Los geht’s';
describe('<Onboarding />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows the title and the three points', async () => {
    await render(<Onboarding />);

    expect(screen.getByText('Bevor es losgeht')).toBeOnTheScreen();
    expect(screen.getByText('Quitt sammelt und sortiert')).toBeOnTheScreen();
    expect(screen.getByText('Quitt erinnert')).toBeOnTheScreen();
    expect(screen.getByText('Quitt berät nicht')).toBeOnTheScreen();
  });

  test('start button is disabled until the checkbox is checked', async () => {
    await render(<Onboarding />);

    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(screen.getByRole('button', { name: START_BUTTON })).toBeDisabled();
  });

  test('checking the checkbox enables the start button', async () => {
    await render(<Onboarding />);

    await fireEvent.press(screen.getByRole('checkbox'));

    expect(screen.getByRole('checkbox')).toBeChecked();
    expect(screen.getByRole('button', { name: START_BUTTON })).toBeEnabled();
  });

  test('unchecking the checkbox disables the button again', async () => {
    await render(<Onboarding />);

    await fireEvent.press(screen.getByRole('checkbox'));
    await fireEvent.press(screen.getByRole('checkbox'));

    expect(screen.getByRole('button', { name: START_BUTTON })).toBeDisabled();
  });

  test('does not call accept while the checkbox is unchecked', async () => {
    await render(<Onboarding />);

    await fireEvent.press(screen.getByRole('button', { name: START_BUTTON }));

    expect(mockAccept).not.toHaveBeenCalled();
  });

  test('calls accept when the checkbox is checked and the button is pressed', async () => {
    await render(<Onboarding />);

    await fireEvent.press(screen.getByRole('checkbox'));
    await fireEvent.press(screen.getByRole('button', { name: START_BUTTON }));

    expect(mockAccept).toHaveBeenCalledTimes(1);
  });

  test('Steuerberatung link opens the directory', async () => {
    const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
    await render(<Onboarding />);

    await fireEvent.press(screen.getByRole('link', { name: 'Steuerberatung' }));

    expect(openURL).toHaveBeenCalledWith('https://steuerberaterverzeichnis.berufs-org.de/');
  });
});
