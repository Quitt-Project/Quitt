import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { useAuth } from '@/context/AuthContext';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same limits as backend/app/schemas/user.py
const NAME_MIN = 2;
const NAME_MAX = 50;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 409) {
      return 'Diese E-Mail ist bereits registriert.';
    }
    if (error.status === 422) {
      return 'Bitte überprüfe die Eingaben.';
    }
    if (error.status === 0) {
      return 'Server nicht erreichbar. Bitte Verbindung prüfen.';
    }
  }
  return 'Etwas ist schiefgelaufen. Bitte versuche es erneut.';
}

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    // Client-side validation before calling the API
    if (trimmedName.length < NAME_MIN || trimmedName.length > NAME_MAX) {
      setError(`Der Name muss ${NAME_MIN} bis ${NAME_MAX} Zeichen lang sein.`);
      return;
    }
    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein.');
      return;
    }
    if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
      setError(`Das Passwort muss mindestens ${PASSWORD_MIN} Zeichen lang sein.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await signUp(trimmedName, trimmedEmail, password);
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
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Konto erstellen</Text>

        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
            />
          </View>

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
              autoComplete="new-password"
              textContentType="newPassword"
            />
            <Text style={styles.hint}>Mindestens {PASSWORD_MIN} Zeichen</Text>
          </View>

          {error && <Text style={styles.error}>{error}</Text>}
        </View>

        <View style={styles.spacer} />

        <Pressable
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isSubmitting}
          accessibilityRole="button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Registrieren</Text>
          )}
        </Pressable>

        <Text style={styles.switchText}>
          Schon ein Konto?{' '}
          <Link href="/login" style={styles.switchLink}>
            Anmelden
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
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
  hint: {
    fontSize: 13,
    color: '#52525B',
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
