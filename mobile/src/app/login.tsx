import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { useAuth } from '@/context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Backend messages are in English, the UI is in German
function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) {
      return 'E-Mail oder Passwort ist falsch.';
    }
    if (error.status === 0) {
      return 'Server nicht erreichbar. Bitte Verbindung prüfen.';
    }
  }
  return 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
}

export default function LoginScreen() {
  const { signIn } = useAuth();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    // Client-side validation before calling the API
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (password.length === 0) {
      setError('Bitte gib dein Passwort ein.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(trimmedEmail, password);
      // No navigation here: _layout.tsx switches to the tabs when user is set
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 },
        ]}
      >
        <Text style={styles.title}>Anmelden</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>E-Mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="name@beispiel.de"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Passwort</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
              textContentType="password"
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.spacer} />

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Anmelden</Text>
          )}
        </Pressable>

        <Text style={styles.switchText}>
          Noch kein Konto?{' '}
          <Link href="/register" style={styles.switchLink}>
            Registrieren
          </Link>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 28,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#18181B',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#18181B',
  },
  input: {
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#18181B',
    fontSize: 16,
    color: '#18181B',
  },
  error: {
    fontSize: 14,
    lineHeight: 20,
    color: '#B91C1C',
  },
  spacer: {
    flexGrow: 1,
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
  switchText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#52525B',
  },
  switchLink: {
    fontWeight: '600',
    color: '#18181B',
  },
});
