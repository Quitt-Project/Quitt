import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24 }]}>
      <Text style={styles.title}>Profil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name}</Text>

        <Text style={styles.label}>E-Mail</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.spacer} />

      <Pressable style={styles.button} onPress={signOut} accessibilityRole="button">
        <Text style={styles.buttonText}>Abmelden</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    gap: 28,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    color: '#18181B',
  },
  card: {
    gap: 4,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    color: '#52525B',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
  },
  spacer: {
    flexGrow: 1,
  },
  button: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#18181B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#18181B',
  },
});
