import PlaceholderScreen from '@/components/PlaceholderScreen';
import { useRouter } from 'expo-router';
import { Pressable, View, StyleSheet, Text } from 'react-native';

export default function ScanScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <PlaceholderScreen title="Beleg erfassen" />
      <Pressable
        style={styles.closeButton}
        onPress={() => router.back()}
        accessibilityRole="button"
      >
        <Text>Schließen</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
  },
});
