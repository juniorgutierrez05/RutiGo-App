import { PermissionsAndroid, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_ASKED_KEY = 'rutigo_notifications_permission_asked';

/**
 * Solicita permisos de notificaciones al usuario en la primera apertura de la app.
 * Utiliza PermissionsAndroid en Android 13+ (API 33+) y fallback seguro sin riesgo de crash.
 */
export async function checkAndRequestNotificationPermission(force = false): Promise<boolean> {
  try {
    if (!force) {
      const alreadyAsked = await AsyncStorage.getItem(NOTIFICATIONS_ASKED_KEY);
      if (alreadyAsked === 'true') {
        return true;
      }
    }

    await AsyncStorage.setItem(NOTIFICATIONS_ASKED_KEY, 'true');

    if (Platform.OS === 'android') {
      // Android 13+ (Tiramisu / API 33+) requiere el permiso en tiempo de ejecución
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notificaciones de RutiGo',
            message: 'Permite que RutiGo te avise cuando haya nuevas versiones, lugares turísticos y rutas disponibles.',
            buttonPositive: 'Permitir',
            buttonNegative: 'Más tarde',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    }

    return true;
  } catch (err) {
    console.warn('[RutiGo] Error solicitando permisos de notificación:', err);
    return false;
  }
}
