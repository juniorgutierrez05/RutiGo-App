import { Platform } from 'react-native';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as Updates from 'expo-updates';

export const BACKGROUND_UPDATE_TASK = 'RUTIGO_BACKGROUND_OTA_UPDATE_TASK';
export const UPDATE_NOTIFICATION_CHANNEL_ID = 'rutigo_app_updates';

// Configuración global de visualización de notificaciones en primer plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Envia una notificación del sistema informando que la actualización ya está descargada y lista.
 */
export async function sendUpdateReadyNotification(details?: string) {
  if (Platform.OS === 'web') return;

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(UPDATE_NOTIFICATION_CHANNEL_ID, {
        name: 'Actualizaciones de RutiGo',
        description: 'Notificaciones sobre nuevas versiones y mejoras automáticas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#E60124',
        sound: 'default',
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 ¡Nueva actualización de RutiGo lista!',
        body: details || 'Se ha descargado la última versión con nuevos lugares turísticos y mejoras. Toca para disfrutarla.',
        data: { type: 'ota_update_ready' },
        sound: true,
      },
      trigger: Platform.OS === 'android' ? { channelId: UPDATE_NOTIFICATION_CHANNEL_ID } : null,
    });
    console.log('[RutiGo Notifications] Notificación de actualización enviada con éxito.');
  } catch (err) {
    console.warn('[RutiGo Notifications] Error al programar notificación local:', err);
  }
}

/**
 * Función que comprueba y descarga la actualización en segundo plano.
 * Retorna true si encontró y descargó una actualización.
 */
export async function checkAndDownloadUpdateInBackground(): Promise<boolean> {
  if (__DEV__ || !Updates.isEnabled) {
    return false;
  }

  try {
    console.log('[RutiGo Updates] Buscando nuevas actualizaciones OTA...');
    const check = await Updates.checkForUpdateAsync();

    if (check.isAvailable) {
      console.log('[RutiGo Updates] ¡Actualización disponible! Descargando paquete en segundo plano...');
      const fetchResult = await Updates.fetchUpdateAsync();

      if (fetchResult.isNew) {
        console.log('[RutiGo Updates] Paquete descargado con éxito. Notificando al usuario...');
        await sendUpdateReadyNotification();
        return true;
      }
    } else {
      console.log('[RutiGo Updates] La app ya cuenta con la versión más reciente.');
    }
  } catch (err) {
    console.log('[RutiGo Updates] Error al verificar/descargar actualización OTA:', err);
  }

  return false;
}

// 1. Definir la tarea en segundo plano en el ámbito global (TaskManager)
try {
  TaskManager.defineTask(BACKGROUND_UPDATE_TASK, async () => {
    try {
      console.log('[RutiGo Background] Ejecutando verificación programada en segundo plano...');
      const hasNewUpdate = await checkAndDownloadUpdateInBackground();

      return hasNewUpdate
        ? BackgroundFetch.BackgroundFetchResult.NewData
        : BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
      console.log('[RutiGo Background] Error en tarea periódica:', error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  });
} catch (err) {
  console.warn('[RutiGo Background] TaskManager.defineTask advertencia:', err);
}

/**
 * Registra la tarea periódica de fondo con el sistema operativo (Android/iOS).
 * Se ejecutará periódicamente en reposo o al tener conexión Wi-Fi/móvil.
 */
export async function registerBackgroundUpdateTask(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_UPDATE_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_UPDATE_TASK, {
        minimumInterval: 15 * 60, // 15 minutos (mínimo permitido por el sistema operativo)
        stopOnTerminate: false,   // Sigue activo incluso si el usuario cierra la app
        startOnBoot: true,        // Se activa automáticamente cuando el teléfono enciende
      });
      console.log('[RutiGo Background] Tarea periódica de actualizaciones registrada correctamente.');
    } else {
      console.log('[RutiGo Background] Tarea periódica ya se encontraba registrada.');
    }
  } catch (err) {
    console.warn('[RutiGo Background] Error registrando tarea en segundo plano:', err);
  }
}

/**
 * Escucha cuando el usuario presiona una notificación del sistema
 * para aplicar la actualización inmediatamente con reloadAsync.
 */
export function setupUpdateNotificationResponseListener(onReload?: () => void) {
  if (Platform.OS === 'web') return () => {};

  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;
    if (data && data.type === 'ota_update_ready') {
      console.log('[RutiGo Notifications] El usuario presionó la notificación de actualización.');
      if (onReload) {
        onReload();
      } else {
        Updates.reloadAsync().catch(err => {
          console.warn('[RutiGo Notifications] Error al recargar app tras notificación:', err);
        });
      }
    }
  });

  return () => {
    subscription.remove();
  };
}
