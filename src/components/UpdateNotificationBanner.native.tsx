import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkAndRequestNotificationPermission } from '../services/notificationPermissionService';
import { useApp } from '../store';

const LAST_SEEN_UPDATE_ID_KEY = 'rutigo_last_seen_update_id';

export function UpdateNotificationBanner() {
  const insets = useSafeAreaInsets();
  const { addNotification } = useApp();

  // Hook oficial de Expo Updates para monitorear actualizaciones en tiempo real
  const { isUpdatePending, isUpdateAvailable, currentlyRunning } = Updates.useUpdates();

  const [dismissedPending, setDismissedPending] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [justUpdatedMessage, setJustUpdatedMessage] = useState<string | null>(null);

  // 1. Solicitar permisos de notificación la primera vez que abre la app
  useEffect(() => {
    const timer = setTimeout(() => {
      checkAndRequestNotificationPermission();
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // 2. Verificar y descargar actualizaciones en segundo plano al iniciar
  useEffect(() => {
    async function checkForOtaUpdates() {
      if (__DEV__ || !Updates.isEnabled) return;
      try {
        const check = await Updates.checkForUpdateAsync();
        if (check.isAvailable) {
          console.log('[RutiGo Updates] Nueva actualización encontrada, descargando en segundo plano...');
          await Updates.fetchUpdateAsync();
          console.log('[RutiGo Updates] Actualización descargada exitosamente.');
        }
      } catch (err) {
        // Silencioso si no hay red o está offline
        console.log('[RutiGo Updates] Verificación de actualización en segundo plano:', err);
      }
    }
    checkForOtaUpdates();
  }, []);

  // 3. Detectar si la app acaba de abrir una nueva versión instalada
  useEffect(() => {
    async function checkNewlyAppliedUpdate() {
      if (!Updates.isEnabled || !currentlyRunning?.updateId) return;
      try {
        const lastSeen = await AsyncStorage.getItem(LAST_SEEN_UPDATE_ID_KEY);
        const currentId = currentlyRunning.updateId;

        if (lastSeen && lastSeen !== currentId) {
          // La app se actualizó con un nuevo updateId
          setJustUpdatedMessage('¡RutiGo actualizado! Tienes la versión más reciente con nuevos centros comerciales y mapa interactivo.');
          addNotification?.(
            '🎉 ¡RutiGo Actualizado!',
            'Se aplicaron mejoras en el mapa interactivo (búsqueda y filtros) y se agregaron 18 nuevos centros comerciales del Atlántico.'
          );
        }
        await AsyncStorage.setItem(LAST_SEEN_UPDATE_ID_KEY, currentId);
      } catch (e) {
        // ignore
      }
    }
    checkNewlyAppliedUpdate();
  }, [currentlyRunning?.updateId]);

  // Ocultar mensaje de éxito tras 6 segundos
  useEffect(() => {
    if (!justUpdatedMessage) return;
    const t = setTimeout(() => setJustUpdatedMessage(null), 6000);
    return () => clearTimeout(t);
  }, [justUpdatedMessage]);

  const handleReload = async () => {
    try {
      setIsReloading(true);
      await Updates.reloadAsync();
    } catch (err) {
      setIsReloading(false);
      console.warn('[RutiGo Updates] Error al reiniciar:', err);
    }
  };

  const showModal = isUpdatePending && !dismissedPending;

  return (
    <>
      {/* Toast informativo: Versión recién aplicada */}
      {Boolean(justUpdatedMessage) && (
        <View
          style={[
            styles.successToast,
            { top: Math.max(insets.top, 20) + 8 },
          ]}
        >
          <View style={styles.toastIconWrap}>
            <Ionicons name="checkmark-circle" size={22} color="#10B981" />
          </View>
          <Text style={styles.toastText} numberOfLines={2}>
            {justUpdatedMessage}
          </Text>
          <Pressable
            onPress={() => setJustUpdatedMessage(null)}
            hitSlop={8}
            style={styles.toastCloseBtn}
          >
            <Ionicons name="close" size={16} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Modal / Banner Flotante: Nueva Actualización Descargada y Lista */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setDismissedPending(true)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Ionicons name="rocket-outline" size={16} color="#E60124" />
                <Text style={styles.badgeText}>Nueva Actualización Disponible</Text>
              </View>
            </View>

            <Text style={styles.title}>¡RutiGo tiene mejoras listas!</Text>
            <Text style={styles.description}>
              Se ha descargado una nueva actualización en segundo plano. Reinicia la aplicación ahora para disfrutar de las nuevas funciones y lugares turísticos.
            </Text>

            <View style={styles.actions}>
              <Pressable
                style={[styles.btn, styles.laterBtn]}
                onPress={() => setDismissedPending(true)}
                disabled={isReloading}
              >
                <Text style={styles.laterBtnText}>Más tarde</Text>
              </Pressable>

              <Pressable
                style={[styles.btn, styles.reloadBtn]}
                onPress={handleReload}
                disabled={isReloading}
              >
                {isReloading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons name="refresh" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                    <Text style={styles.reloadBtnText}>Reiniciar ahora</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Toast flotante de éxito
  successToast: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 99999,
    backgroundColor: '#064E3B',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#059669',
  },
  toastIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#065F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    flex: 1,
    color: '#ECFDF5',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  toastCloseBtn: {
    padding: 4,
  },

  // Modal de actualización pendiente
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE8EA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
  },
  badgeText: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '800',
  },
  title: {
    color: '#1E1927',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 6,
  },
  description: {
    color: '#4B5563',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  laterBtn: {
    backgroundColor: '#F3F4F6',
  },
  laterBtnText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '800',
  },
  reloadBtn: {
    backgroundColor: '#E60124',
    flex: 1.4,
  },
  reloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});
