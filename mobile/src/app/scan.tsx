import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FLASH_ICON = { off: 'flash-off', auto: 'flash-outline', on: 'flash' } as const;
const NEXT_FLASH = { off: 'auto', auto: 'on', on: 'off' } as const;

export default function ScanScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const insets = useSafeAreaInsets();
  const [flash, setFlash] = useState<'off' | 'auto' | 'on'>('off');
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isTaking, setIsTaking] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Kein Zugriff', 'Bitte erlaube den Zugriff auf deine Fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraReady || isTaking) {
      return;
    }

    setIsTaking(true);
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.7 });
      if (photo) {
        setImage(photo.uri);
      }
    } catch (error) {
      console.warn('takePictureAsync failed', error);
      Alert.alert('Fehler', 'Das Foto konnte nicht aufgenommen werden. Bitte versuch es nochmal.');
    } finally {
      setIsTaking(false);
    }
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      setImage(file.uri);
      setPdfName(file.mimeType === 'application/pdf' ? file.name : null);
    }
  };

  const retake = () => {
    setImage(null);
    setPdfName(null);
    setCameraReady(false);
  };

  const handlePermission = () => {
    if (permission?.canAskAgain) {
      requestPermission();
    } else {
      Linking.openSettings();
    }
  };

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (image) {
    return (
      <View style={styles.container}>
        {pdfName ? (
          <View style={styles.pdfPreview}>
            <Ionicons name="document-text-outline" size={80} color="#FFFFFF" />
            <Text style={styles.closeText}>{pdfName}</Text>
          </View>
        ) : (
          <Image source={{ uri: image }} style={styles.preview} resizeMode="contain" />
        )}

        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <Pressable style={styles.actionButton} onPress={retake}>
            <Text style={styles.actionText}>Nochmal</Text>
          </Pressable>
          <Pressable
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.back()}
          >
            <Text style={[styles.actionText, styles.primaryText]}>Verwenden</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {permission.granted ? (
        <CameraView
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          facing="back"
          flash={flash}
          onCameraReady={() => setCameraReady(true)}
        />
      ) : (
        <View style={styles.permissionBox}>
          <Ionicons name="camera-outline" size={48} color="#FFFFFF" />
          <Text style={styles.permissionText}>
            Quitt braucht Zugriff auf die Kamera, um Belege zu fotografieren.
          </Text>
          <Pressable style={styles.actionButton} onPress={handlePermission}>
            <Text style={styles.actionText}>
              {permission.canAskAgain ? 'Zugriff erlauben' : 'Einstellungen öffnen'}
            </Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <Pressable
          style={styles.sideButton}
          onPress={pickImage}
          accessibilityLabel="Foto aus Galerie"
        >
          <Ionicons name="images-outline" size={28} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={[styles.shutter, (!cameraReady || isTaking) && styles.shutterLoading]}
          onPress={takePhoto}
          disabled={!cameraReady || isTaking}
          accessibilityLabel="Foto aufnehmen"
        >
          {isTaking && <ActivityIndicator color="#FFFFFF" />}
        </Pressable>

        <Pressable
          style={styles.sideButton}
          onPress={pickDocument}
          accessibilityLabel="Dateien auswählen"
        >
          <Ionicons name="document-outline" size={28} color="#FFFFFF" />
        </Pressable>
      </View>

      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable
          style={styles.sideButton}
          onPress={() => router.back()}
          accessibilityLabel="Schließen"
        >
          <Ionicons name="close" size={30} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={styles.sideButton}
          onPress={() => setFlash(NEXT_FLASH[flash])}
          disabled={!permission.granted}
          accessibilityLabel="Blitz umschalten"
        >
          <Ionicons name={FLASH_ICON[flash]} size={26} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  closeText: {
    color: '#FFFFFF',
  },
  permissionBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sideButton: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterLoading: {
    opacity: 0.4,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  preview: {
    flex: 1,
  },
  pdfPreview: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#000000',
  },
});
