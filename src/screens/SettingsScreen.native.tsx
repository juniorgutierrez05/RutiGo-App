import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import {
  checkNotificationPermissions,
  requestNotificationPermissions,
} from '../services/notificationService';

export function SettingsScreen() {
  const { goBack, locationName, setLocationName, sendTestNotification } = useApp();
  const insets = useSafeAreaInsets();
  const [hasNotifPermission, setHasNotifPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkNotificationPermissions().then((granted) => setHasNotifPermission(granted));
  }, []);

  const handleToggleNotifications = async () => {
    const granted = await requestNotificationPermissions();
    setHasNotifPermission(granted);
    if (granted) {
      Alert.alert(
        '¡Notificaciones activadas!',
        'RutiGo te avisará sobre nuevas rutas, lugares turísticos y planes de fin de semana.',
        [
          { text: 'Entendido' },
          { text: 'Enviar prueba ahora', onPress: () => sendTestNotification() },
        ]
      );
    } else {
      Alert.alert(
        'Permiso denegado',
        'Para activar las notificaciones, abre los Ajustes de tu teléfono > Aplicaciones > RutiGo > Notificaciones y activa el interruptor.'
      );
    }
  };

  const handleSendTest = async () => {
    try {
      await sendTestNotification();
      Alert.alert('¡Alerta enviada!', 'Revisa la barra superior de tu teléfono para ver la notificación del sistema.');
    } catch {
      Alert.alert('Error', 'No se pudo enviar la notificación de prueba.');
    }
  };

  const setting = (label: string, value: string, action: () => void, icon?: keyof typeof Ionicons.glyphMap) => (
    <Pressable style={styles.item} onPress={action}>
      <View style={styles.itemInfo}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      <Ionicons name={icon || 'chevron-forward'} size={18} color="#C4B7B0" />
    </Pressable>
  );

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#E60124" />
        <Text style={styles.back}>Volver</Text>
      </Pressable>
      <Text style={styles.title}>Configuración</Text>

      {setting('Municipio base', locationName, () =>
        Alert.alert('Municipio base', 'Usa la ubicación actual para personalizar tus recomendaciones.')
      )}

      {setting(
        'Notificaciones del sistema',
        hasNotifPermission === null
          ? 'Comprobando...'
          : hasNotifPermission
          ? 'Permitidas (Activas)'
          : 'Desactivadas (Toca para activar)',
        handleToggleNotifications
      )}

      {setting(
        'Probar notificación del sistema',
        'Enviar una notificación de prueba a la barra de estado',
        handleSendTest,
        'paper-plane-outline'
      )}

      {setting('Ubicación GPS', 'Permitir GPS', () => setLocationName('Puerto Colombia'))}

      {setting('Privacidad', 'Tus datos están protegidos', () =>
        Alert.alert('Privacidad', 'RutiGo solo utiliza tu ubicación para calcular distancias y mostrar lugares turísticos cercanos.')
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  back: { color: '#E60124', fontSize: 16, fontWeight: '800' },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginBottom: 18 },
  item: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  label: { color: '#1E1927', fontSize: 15, fontWeight: '800' },
  value: { color: '#806F69', fontSize: 12, marginTop: 4 },
});
