import { Linking, View, Text, StyleSheet, Pressable } from 'react-native';
import { useState } from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useOnboarding } from '@/context/onboarding';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Point = { title: string; description: string };

const STEUERBERATER_URL = 'https://steuerberaterverzeichnis.berufs-org.de/';

const onboardingPoints: Point[] = [
  {
    title: 'Quitt sammelt und sortiert',
    description: 'Belege fotografieren, Betrag und Kategorie eintragen.',
  },
  {
    title: 'Quitt erinnert',
    description: 'Push-Erinnerungen rechtzeitig vor einer Frist.',
  },
  {
    title: 'Quitt berät nicht',
    description: 'Quitt prüft nicht, ob etwas absetzbar ist, und berechnet keine Erstattung.',
  },
];

export default function Onboarding() {
  const [accepted, setAccepted] = useState(false);
  const { accept } = useOnboarding();
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    await accept();
  };

  return (
    <View
      style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/quitt-icon-vw.svg')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text style={styles.title}>Bevor es losgeht</Text>
      </View>

      <View style={styles.points}>
        {onboardingPoints.map((point, index) => (
          <View key={point.title} style={styles.pointRow}>
            <View style={styles.pointNumber}>
              <Text style={styles.pointNumberText}>{index + 1}</Text>
            </View>
            <View style={styles.pointTexts}>
              <Text style={styles.pointTitle}>{point.title}</Text>
              <Text style={styles.pointDescription}>{point.description}</Text>
            </View>
          </View>
        ))}
      </View>

      <Text style={styles.help}>
        Fragen zur Steuer?{' '}
        <Text
          style={styles.helpLink}
          accessibilityRole="link"
          onPress={() => Linking.openURL(STEUERBERATER_URL)}
        >
          Steuerberatung
        </Text>
      </Text>

      <View style={styles.spacer} />

      <Pressable
        style={styles.checkboxRow}
        onPress={() => setAccepted(!accepted)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
      >
        <Ionicons name={accepted ? 'checkbox' : 'square-outline'} size={26} color="#18181B" />
        <Text style={styles.checkboxLabel}>
          Ich habe verstanden: Quitt ist keine Steuerberatung.
        </Text>
      </Pressable>

      <Pressable
        style={[styles.button, !accepted && styles.buttonDisabled]}
        onPress={handleStart}
        disabled={!accepted}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Los geht’s</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    gap: 28,
  },
  header: {
    gap: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#18181B',
  },
  points: {
    gap: 20,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  pointNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#18181B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
  },
  pointTexts: {
    flex: 1,
    gap: 4,
  },
  pointTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    color: '#18181B',
  },
  pointDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#52525B',
  },
  help: {
    fontSize: 14,
    lineHeight: 20,
    color: '#52525B',
  },
  helpLink: {
    fontWeight: '600',
    color: '#18181B',
  },
  spacer: {
    flexGrow: 1,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    minHeight: 44,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#18181B',
    backgroundColor: '#F4F4F5',
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    color: '#18181B',
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181B',
  },
  buttonDisabled: {
    backgroundColor: '#A1A1AA',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
