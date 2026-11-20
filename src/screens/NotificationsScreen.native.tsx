import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { NotificationItem } from '../types';

function formatRelativeTime(dateString: string): string {
  try {
    const diffMs = Date.now() - new Date(dateString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return 'Justo ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return new Date(dateString).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  } catch {
    return 'Reciente';
  }
}

function getNotificationVisuals(type: string): { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string } {
  switch (type) {
    case 'favorite':
      return { icon: 'heart', color: '#EF4444', bg: '#FEE2E2' };
    case 'review':
      return { icon: 'star', color: '#F59E0B', bg: '#FEF3C7' };
    case 'weekend':
      return { icon: 'sunny', color: '#10B981', bg: '#D1FAE5' };
    case 'new_route':
      return { icon: 'map', color: '#3B82F6', bg: '#DBEAFE' };
    case 'welcome':
      return { icon: 'sparkles', color: '#8B5CF6', bg: '#EDE9FE' };
    case 'system':
    default:
      return { icon: 'notifications', color: '#E60124', bg: '#FDE8EA' };
  }
}

export function NotificationsScreen() {
  const {
    notifications,
    goBack,
    navigateTo,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    unreadNotifsCount,
  } = useApp();
  const insets = useSafeAreaInsets();

  const handlePressNotification = async (notification: NotificationItem) => {
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }
    if (notification.relatedType === 'place' && notification.relatedId) {
      navigateTo('place_detail', { placeId: notification.relatedId });
    } else if (notification.relatedType === 'route' && notification.relatedId) {
      navigateTo('route_detail', { routeId: notification.relatedId });
    }
  };

  const confirmClearAll = () => {
    Alert.alert(
      'Limpiar notificaciones',
      '¿Deseas borrar todo el historial de notificaciones?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar todas', style: 'destructive', onPress: () => clearNotifications() },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 32,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Barra Superior con botón Volver */}
      <View style={styles.topRow}>
        <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color="#E60124" />
          <Text style={styles.back}>Volver</Text>
        </Pressable>

        {notifications.length > 0 && (
          <View style={styles.headerActions}>
            {unreadNotifsCount > 0 && (
              <Pressable onPress={markAllNotificationsRead} hitSlop={6} style={styles.actionBtn}>
                <Ionicons name="checkmark-done" size={16} color="#059669" />
                <Text style={styles.actionBtnText}>Leer todas</Text>
              </Pressable>
            )}
            <Pressable onPress={confirmClearAll} hitSlop={6} style={styles.actionBtn}>
              <Ionicons name="trash-outline" size={16} color="#9CA3AF" />
              <Text style={[styles.actionBtnText, { color: '#9CA3AF' }]}>Limpiar</Text>
            </Pressable>
          </View>
        )}
      </View>

      <View style={styles.titleRow}>
        <Text style={styles.title}>Notificaciones</Text>
        {unreadNotifsCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadNotifsCount} nuevas</Text>
          </View>
        )}
      </View>

      {/* Lista de Notificaciones */}
      {notifications.length > 0 ? (
        <View style={styles.list}>
          {notifications.map((notification) => {
            const visual = getNotificationVisuals(notification.type);
            const isClickable = Boolean(notification.relatedType && notification.relatedId);

            return (
              <Pressable
                key={notification.id}
                onPress={() => handlePressNotification(notification)}
                style={[
                  styles.card,
                  !notification.read && styles.cardUnread,
                ]}
              >
                <View style={[styles.iconWrap, { backgroundColor: visual.bg }]}>
                  <Ionicons name={visual.icon} size={20} color={visual.color} />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.cardHeaderRow}>
                    <Text style={[styles.heading, !notification.read && styles.headingUnread]}>
                      {notification.title}
                    </Text>
                    <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
                  </View>

                  <Text style={styles.body}>{notification.body}</Text>

                  {isClickable && (
                    <View style={styles.ctaRow}>
                      <Text style={styles.ctaText}>
                        {notification.relatedType === 'place' ? 'Ver lugar turístico' : 'Ver ruta'}
                      </Text>
                      <Ionicons name="arrow-forward" size={12} color="#E60124" />
                    </View>
                  )}
                </View>

                {!notification.read && <View style={styles.unreadDot} />}
              </Pressable>
            );
          })}
        </View>
      ) : (
        /* Estado Vacío */
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCircle}>
            <Ionicons name="notifications-outline" size={46} color="#E60124" />
          </View>
          <Text style={styles.emptyTitle}>Bandeja al día</Text>
          <Text style={styles.emptySub}>
            Aquí recibirás avisos sobre tus lugares favoritos, nuevas rutas por el Atlántico y sugerencias de fin de semana.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  back: { color: '#E60124', fontSize: 16, fontWeight: '800' },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  title: { color: '#1E1927', fontSize: 28, fontWeight: '900' },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardUnread: {
    backgroundColor: '#FFFBFB',
    borderColor: '#FECDD3',
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 4,
  },
  heading: {
    flex: 1,
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  headingUnread: {
    color: '#111827',
    fontWeight: '900',
  },
  time: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  body: {
    color: '#6B7280',
    fontSize: 13,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  ctaText: {
    color: '#E60124',
    fontSize: 12,
    fontWeight: '800',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E60124',
    marginTop: 6,
  },
  emptyWrap: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFF1F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#1E1927',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },
  emptySub: {
    color: '#6B7280',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
