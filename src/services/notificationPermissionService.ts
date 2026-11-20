import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registerBackgroundUpdateTask,
  UPDATE_NOTIFICATION_CHANNEL_ID,
} from './backgroundUpdateService';

const NOTIFICATIONS_ASKED_KEY = 'rutigo_notifications_permission_asked';

/**
 * Solicita permisos de notificaciones al usuario en la primera apertura de la app.
 * Configura canales nativos en Android y activa la tarea en segundo plano.
 */
export async function checkAndRequestNotificationPermission(force = false): Promise<boolean> {
  if (Platform.OS === 'web') return true;

  try {
    if (!force) {
      const alreadyAsked = await AsyncStorage.getItem(NOTIFICATIONS_ASKED_KEY);
      if (alreadyAsked === 'true') {
        const current = await Notifications.getPermissionsAsync();
        if (current.granted) {
          // Asegurar que la tarea periódica de fondo esté activa
          await registerBackgroundUpdateTask();
          return true;
        }
      }
    }

    await AsyncStorage.setItem(NOTIFICATIONS_ASKED_KEY, 'true');

    // 1. Configurar canal de notificaciones en Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(UPDATE_NOTIFICATION_CHANNEL_ID, {
        name: 'Actualizaciones de RutiGo',
        description: 'Avisos sobre nuevas versiones de la app y contenido nuevo',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E60124',
        sound: 'default',
      });
    }

    // 2. Solicitar permiso al usuario con el diálogo oficial del sistema
    const permissionResponse = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    const isGranted = permissionResponse.granted;

    if (isGranted) {
      console.log('[RutiGo Permissions] Permiso de notificaciones concedido por el usuario.');
      // 3. Registrar la tarea de actualización en segundo plano
      await registerBackgroundUpdateTask();
    } else {
      console.log('[RutiGo Permissions] Permiso de notificaciones no concedido o pospuesto.');
    }

    return isGranted;
  } catch (err) {
    console.warn('[RutiGo Permissions] Error solicitando permisos de notificación:', err);
    return false;
  }
}
