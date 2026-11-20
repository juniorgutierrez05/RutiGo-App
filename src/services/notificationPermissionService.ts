import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registerBackgroundUpdateTask,
} from './backgroundUpdateService';
import {
  initializeNotificationChannels,
  scheduleWeekendNotification,
  triggerWelcomeNotification,
} from './notificationService';

const NOTIFICATIONS_ASKED_KEY = 'rutigo_notifications_permission_asked';

/**
 * Solicita permisos de notificaciones al usuario en la primera apertura de la app.
 * Configura canales nativos en Android y activa las tareas periódicas.
 */
export async function checkAndRequestNotificationPermission(force = false): Promise<boolean> {
  if (Platform.OS === 'web') return true;

  try {
    // 1. Siempre asegurar que los canales de Android estén creados en el SO
    await initializeNotificationChannels();

    if (!force) {
      const alreadyAsked = await AsyncStorage.getItem(NOTIFICATIONS_ASKED_KEY);
      if (alreadyAsked === 'true') {
        const current = await Notifications.getPermissionsAsync();
        if (current.granted) {
          await registerBackgroundUpdateTask();
          await scheduleWeekendNotification();
          return true;
        }
      }
    }

    await AsyncStorage.setItem(NOTIFICATIONS_ASKED_KEY, 'true');

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
      // 3. Activar tareas periódicas y avisos de bienvenida
      await registerBackgroundUpdateTask();
      await scheduleWeekendNotification();
      await triggerWelcomeNotification();
    } else {
      console.log('[RutiGo Permissions] Permiso de notificaciones no concedido o pospuesto.');
    }

    return isGranted;
  } catch (err) {
    console.warn('[RutiGo Permissions] Error solicitando permisos de notificación:', err);
    return false;
  }
}
