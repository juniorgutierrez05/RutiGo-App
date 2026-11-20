import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  Vibration,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function InAppNotificationToast() {
  const insets = useSafeAreaInsets();
  const { activeToast, dismissToast, navigateTo } = useApp();
  const translateY = useRef(new Animated.Value(-120)).current;

  useEffect(() => {
    if (activeToast) {
      // Vibración háptica usando el permiso nativo VIBRATE ya existente en el APK
      try {
        Vibration.vibrate([0, 150, 80, 150]);
      } catch {}

      // Animación de entrada (deslizar hacia abajo)
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 40,
      }).start();

      // Auto-ocultar tras 5.5 segundos
      const timer = setTimeout(() => {
        hideToast();
      }, 5500);

      return () => clearTimeout(timer);
    } else {
      translateY.setValue(-120);
    }
  }, [activeToast]);

  const hideToast = () => {
    Animated.timing(translateY, {
      toValue: -140,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      dismissToast?.();
    });
  };

  const handlePress = () => {
    if (!activeToast) return;
    const { relatedType, relatedId } = activeToast;
    hideToast();

    if (relatedType === 'place' && relatedId) {
      navigateTo('place_detail', { placeId: relatedId });
    } else if (relatedType === 'route' && relatedId) {
      navigateTo('route_detail', { routeId: relatedId });
    } else {
      navigateTo('notifications');
    }
  };

  if (!activeToast) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: Math.max(insets.top, 16) + 8,
          transform: [{ translateY }],
        },
      ]}
    >
      <Pressable onPress={handlePress} style={styles.card} android_ripple={{ color: '#F3F4F6' }}>
        <View style={styles.iconCircle}>
          <Ionicons name="notifications" size={18} color="#FFFFFF" />
        </View>

        <View style={styles.textWrap}>
          <View style={styles.headerRow}>
            <Text style={styles.appTag}>RUTIGO</Text>
            <Text style={styles.timeTag}>Ahora</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {activeToast.title}
          </Text>
          <Text style={styles.body} numberOfLines={2}>
            {activeToast.body}
          </Text>
        </View>

        <Pressable onPress={hideToast} hitSlop={10} style={styles.closeBtn}>
          <Ionicons name="close" size={16} color="#9CA3AF" />
        </Pressable>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 999999,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E60124',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  appTag: {
    color: '#E60124',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  timeTag: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: '600',
  },
  title: {
    color: '#111827',
    fontSize: 13.5,
    fontWeight: '800',
  },
  body: {
    color: '#4B5563',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
    alignSelf: 'flex-start',
  },
});
