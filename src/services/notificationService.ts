import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NotificationItem } from '../types';

export const CHANNEL_GENERAL = 'rutigo_general';
export const CHANNEL_TOURISM = 'rutigo_tourism';
export const CHANNEL_UPDATES = 'rutigo_app_updates';

const LOCAL_NOTIFS_STORAGE_KEY = 'rutigo_local_notifications_store_v2';
const WEEKEND_SCHEDULED_KEY = 'rutigo_weekend_notif_scheduled_v2';
const WELCOME_SENT_KEY = 'rutigo_welcome_notif_sent_v2';

/**
 * Inicializa los canales de notificación en Android y asegura permisos.
 */
export async function initializeNotificationChannels(): Promise<void> {
  if (Platform.OS !== 'android') return;

  try {
    await Notifications.setNotificationChannelAsync(CHANNEL_GENERAL, {
      name: 'General y Actividad',
      description: 'Avisos sobre tus favoritos, reseñas y actividad en RutiGo',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E60124',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(CHANNEL_TOURISM, {
      name: 'Recomendaciones y Turismo',
      description: 'Planes de fin de semana, lugares cercanos y festividades del Atlántico',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E60124',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });

    await Notifications.setNotificationChannelAsync(CHANNEL_UPDATES, {
      name: 'Actualizaciones de la App',
      description: 'Avisos sobre nuevas versiones de la aplicación',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E60124',
      sound: 'default',
      enableVibrate: true,
      enableLights: true,
    });

    console.log('[RutiGo Notifications] Canales de Android configurados con éxito.');
  } catch (err) {
    console.warn('[RutiGo Notifications] Error creando canales en Android:', err);
  }
}

/**
 * Solicita permisos de notificación al usuario con el diálogo nativo.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return true;

  try {
    await initializeNotificationChannels();

    const response = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });

    return response.granted;
  } catch (err) {
    console.warn('[RutiGo Notifications] Error solicitando permisos:', err);
    return false;
  }
}

/**
 * Verifica si los permisos de notificación están concedidos.
 */
export async function checkNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') return true;
  try {
    const status = await Notifications.getPermissionsAsync();
    return status.granted;
  } catch {
    return false;
  }
}

/**
 * Envía una notificación del sistema a la barra de estado de Android/iOS.
 */
export async function postSystemNotification(params: {
  title: string;
  body: string;
  channelId?: string;
  data?: Record<string, any>;
}): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  try {
    const channel = params.channelId || CHANNEL_GENERAL;
    const trigger = Platform.OS === 'android' ? { channelId: channel } : null;

    const notifId = await Notifications.scheduleNotificationAsync({
      content: {
        title: params.title,
        body: params.body,
        data: params.data || {},
        sound: true,
      },
      trigger,
    });

    console.log('[RutiGo Notifications] Notificación del sistema enviada con ID:', notifId);
    return notifId;
  } catch (err) {
    console.warn('[RutiGo Notifications] Error publicando notificación del sistema:', err);
    return null;
  }
}

// ==========================================
// MÉTODOS DE LAS 4 ÁREAS DE NOTIFICACIÓN
// ==========================================

/**
 * Área 1: Notificación de Bienvenida (se envía una única vez tras instalación/registro)
 */
export async function triggerWelcomeNotification(force = false): Promise<NotificationItem | null> {
  try {
    if (!force) {
      const alreadySent = await AsyncStorage.getItem(WELCOME_SENT_KEY);
      if (alreadySent === 'true') return null;
    }

    await AsyncStorage.setItem(WELCOME_SENT_KEY, 'true');

    const title = '🎉 ¡Bienvenido a RutiGo!';
    const body = 'Descubre más de 20 centros comerciales, playas y rutas culturales únicas en el Atlántico.';

    await postSystemNotification({
      title,
      body,
      channelId: CHANNEL_GENERAL,
      data: { type: 'welcome' },
    });

    const item: NotificationItem = {
      id: `welcome-${Date.now()}`,
      userId: 'guest',
      type: 'welcome',
      title,
      body,
      read: false,
      createdAt: new Date().toISOString(),
    };

    await saveLocalNotification(item);
    return item;
  } catch (err) {
    console.warn('Error en triggerWelcomeNotification:', err);
    return null;
  }
}

/**
 * Área 1: Notificación Programada de Fin de Semana (Viernes/Sábado)
 */
export async function scheduleWeekendNotification(): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const isScheduled = await AsyncStorage.getItem(WEEKEND_SCHEDULED_KEY);
    if (isScheduled === 'true') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌴 ¿Sin planes para este fin de semana?',
        body: 'Visita los centros comerciales de Barranquilla y Soledad o disfruta la gastronomía en Barrio Abajo.',
        data: { type: 'weekend' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: 6, // Sábado
        hour: 10,
        minute: 0,
        channelId: CHANNEL_TOURISM,
      },
    });

    await AsyncStorage.setItem(WEEKEND_SCHEDULED_KEY, 'true');
    console.log('[RutiGo Notifications] Recordatorio de fin de semana programado con éxito.');
  } catch (err) {
    console.warn('Error programando recordatorio de fin de semana:', err);
  }
}

/**
 * Área 2: Notificación al Guardar en Favoritos
 */
export async function notifyFavoriteAdded(
  name: string,
  type: 'place' | 'route',
  id: string
): Promise<NotificationItem> {
  const isPlace = type === 'place';
  const title = isPlace ? '❤️ ¡Lugar guardado en Favoritos!' : '❤️ ¡Ruta guardada en Favoritos!';
  const body = `Has guardado "${name}". Toca aquí para ver su ubicación, fotos y detalles.`;

  await postSystemNotification({
    title,
    body,
    channelId: CHANNEL_GENERAL,
    data: {
      type: 'favorite',
      relatedType: type,
      relatedId: id,
    },
  });

  const item: NotificationItem = {
    id: `fav-${Date.now()}`,
    userId: 'guest',
    type: 'favorite',
    title,
    body,
    read: false,
    relatedType: type,
    relatedId: id,
    createdAt: new Date().toISOString(),
  };

  await saveLocalNotification(item);
  return item;
}

/**
 * Área 2: Notificación al Calificar / Publicar Reseña
 */
export async function notifyReviewAdded(
  placeName: string,
  rating: number,
  placeId: string
): Promise<NotificationItem> {
  const title = '⭐ ¡Gracias por tu reseña!';
  const body = `Tu calificación de ${rating}★ en "${placeName}" ayuda a más viajeros a explorar el Atlántico.`;

  await postSystemNotification({
    title,
    body,
    channelId: CHANNEL_GENERAL,
    data: {
      type: 'review',
      relatedType: 'place',
      relatedId: placeId,
    },
  });

  const item: NotificationItem = {
    id: `review-${Date.now()}`,
    userId: 'guest',
    type: 'review',
    title,
    body,
    read: false,
    relatedType: 'place',
    relatedId: placeId,
    createdAt: new Date().toISOString(),
  };

  await saveLocalNotification(item);
  return item;
}

/**
 * Prueba directa del sistema de notificaciones (útil en Configuración y soporte)
 */
export async function sendTestSystemNotification(): Promise<NotificationItem> {
  const title = '🔔 Prueba de Notificación de RutiGo';
  const body = '¡El sistema de notificaciones del dispositivo está activo y funcionando al 100%! 🚀';

  await postSystemNotification({
    title,
    body,
    channelId: CHANNEL_GENERAL,
    data: { type: 'system' },
  });

  const item: NotificationItem = {
    id: `test-${Date.now()}`,
    userId: 'guest',
    type: 'system',
    title,
    body,
    read: false,
    createdAt: new Date().toISOString(),
  };

  await saveLocalNotification(item);
  return item;
}

// ==========================================
// PERSISTENCIA LOCAL (AsyncStorage)
// ==========================================

export async function getLocalNotifications(): Promise<NotificationItem[]> {
  try {
    const raw = await AsyncStorage.getItem(LOCAL_NOTIFS_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveLocalNotification(item: NotificationItem): Promise<void> {
  try {
    const existing = await getLocalNotifications();
    const filtered = existing.filter((n) => n.id !== item.id);
    const updated = [item, ...filtered].slice(0, 50); // Máximo 50 avisos
    await AsyncStorage.setItem(LOCAL_NOTIFS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error guardando notificación local:', err);
  }
}

export async function markAllLocalNotificationsRead(): Promise<void> {
  try {
    const existing = await getLocalNotifications();
    const updated = existing.map((n) => ({ ...n, read: true }));
    await AsyncStorage.setItem(LOCAL_NOTIFS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Error marcando notificaciones como leídas:', err);
  }
}

export async function clearAllLocalNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LOCAL_NOTIFS_STORAGE_KEY);
  } catch (err) {
    console.warn('Error borrando notificaciones locales:', err);
  }
}
