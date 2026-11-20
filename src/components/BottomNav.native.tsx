import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { theme } from '../theme/expressiveTheme';

type NavKey = 'home' | 'explore' | 'map' | 'profile';

const NAV_ITEMS: {
  key: NavKey;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  target: 'home' | 'explore_category' | 'interactive_map' | 'profile';
}[] = [
  { key: 'home', activeIcon: 'home', inactiveIcon: 'home-outline', label: 'Inicio', target: 'home' },
  { key: 'explore', activeIcon: 'compass', inactiveIcon: 'compass-outline', label: 'Explorar', target: 'explore_category' },
  { key: 'map', activeIcon: 'map', inactiveIcon: 'map-outline', label: 'Mapa', target: 'interactive_map' },
  { key: 'profile', activeIcon: 'person', inactiveIcon: 'person-outline', label: 'Perfil', target: 'profile' },
];

export function BottomNav() {
  const { currentScreen, navigateTo } = useApp();
  const insets = useSafeAreaInsets();

  const initialWidth = Dimensions.get('window').width - 28;
  const [navWidth, setNavWidth] = useState(initialWidth);
  const tabWidth = Math.max((navWidth - 12) / NAV_ITEMS.length, 50);

  const active: NavKey =
    currentScreen === 'interactive_map' || currentScreen === 'nearby_routes'
      ? 'map'
      : currentScreen === 'profile' || currentScreen === 'settings' || currentScreen === 'favorites'
      ? 'profile'
      : currentScreen === 'explore_category' || currentScreen === 'search' || currentScreen === 'recommendations'
      ? 'explore'
      : 'home';

  const activeIndex = Math.max(0, NAV_ITEMS.findIndex((item) => item.key === active));

  // Desplazamiento horizontal animado con física de resorte (Spring Physics)
  const translateX = useRef(new Animated.Value(activeIndex * tabWidth)).current;
  const isInitial = useRef(true);

  // Microinteracción de rebote táctil en cada pestaña
  const tabScales = useRef(NAV_ITEMS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    if (isInitial.current) {
      translateX.setValue(activeIndex * tabWidth);
      isInitial.current = false;
    } else {
      Animated.spring(translateX, {
        toValue: activeIndex * tabWidth,
        useNativeDriver: true,
        speed: 16,
        bounciness: theme.isAndroid ? 11 : 5, // Rebote elástico característico de M3 Expressive
      }).start();
    }
  }, [activeIndex, tabWidth]);

  const handlePressIn = (index: number) => {
    Animated.spring(tabScales[index], {
      toValue: 0.85,
      useNativeDriver: true,
      speed: 24,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(tabScales[index], {
      toValue: 1,
      useNativeDriver: true,
      speed: 16,
      bounciness: theme.isAndroid ? 14 : 6, // Rebote elástico al soltar
    }).start();
  };

  return (
    <View style={[styles.wrapper, { bottom: Math.max(insets.bottom, 12) + 4 }]} pointerEvents="box-none">
      <View
        style={styles.nav}
        onLayout={(e) => {
          const w = e.nativeEvent.layout.width;
          if (w > 0 && Math.abs(w - navWidth) > 1) {
            setNavWidth(w);
          }
        }}
      >
        {/* Píldora deslizante con física de resorte continuo de Material 3 Expressive */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.slidingPillContainer,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        >
          <View style={styles.slidingPill} />
        </Animated.View>

        {NAV_ITEMS.map(({ key, activeIcon, inactiveIcon, label, target }, index) => {
          const isCurrent = active === key;
          return (
            <Pressable
              key={key}
              style={styles.item}
              hitSlop={6}
              onPress={() => navigateTo(target)}
              onPressIn={() => handlePressIn(index)}
              onPressOut={() => handlePressOut(index)}
            >
              <Animated.View
                style={[
                  styles.pillSlot,
                  { transform: [{ scale: tabScales[index] }] },
                ]}
              >
                <Ionicons
                  name={isCurrent ? activeIcon : inactiveIcon}
                  size={22}
                  color={isCurrent ? '#E60124' : '#8A8A8A'}
                />
              </Animated.View>
              <Text style={[styles.label, isCurrent && styles.activeLabel]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 14,
    right: 14,
    alignItems: 'center',
    zIndex: 100,
  },
  nav: {
    width: '100%',
    height: 68,
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    borderWidth: 1,
    borderColor: '#ECECEC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
    elevation: 8,
  },
  slidingPillContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 16,
  },
  slidingPill: {
    width: 62,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FDE8EA',
  },
  item: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  pillSlot: {
    width: 62,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#8A8A8A',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  activeLabel: {
    color: '#E60124',
    fontWeight: '900',
  },
});
