import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

type NavKey = 'home' | 'explore' | 'map' | 'saved' | 'profile';

const NAV_ITEMS: {
  key: NavKey;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  label: string;
  target: 'home' | 'explore_category' | 'interactive_map' | 'favorites' | 'profile';
}[] = [
  { key: 'home', activeIcon: 'home', inactiveIcon: 'home-outline', label: 'Inicio', target: 'home' },
  { key: 'explore', activeIcon: 'compass', inactiveIcon: 'compass-outline', label: 'Explorar', target: 'explore_category' },
  { key: 'map', activeIcon: 'map', inactiveIcon: 'map-outline', label: 'Mapa', target: 'interactive_map' },
  { key: 'saved', activeIcon: 'heart', inactiveIcon: 'heart-outline', label: 'Guardados', target: 'favorites' },
  { key: 'profile', activeIcon: 'person', inactiveIcon: 'person-outline', label: 'Perfil', target: 'profile' },
];

export function BottomNav() {
  const { currentScreen, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  const active: NavKey =
    currentScreen === 'interactive_map' || currentScreen === 'nearby_routes'
      ? 'map'
      : currentScreen === 'favorites'
      ? 'saved'
      : currentScreen === 'profile' || currentScreen === 'settings'
      ? 'profile'
      : currentScreen === 'explore_category' || currentScreen === 'search' || currentScreen === 'recommendations'
      ? 'explore'
      : 'home';

  return (
    <View style={[styles.nav, { height: 60 + bottomPadding, paddingBottom: bottomPadding }]}>
      {NAV_ITEMS.map(({ key, activeIcon, inactiveIcon, label, target }) => {
        const isCurrent = active === key;
        return (
          <Pressable
            key={key}
            style={styles.item}
            hitSlop={6}
            onPress={() => navigateTo(target)}
          >
            <Ionicons
              name={isCurrent ? activeIcon : inactiveIcon}
              size={22}
              color={isCurrent ? '#FF7A59' : '#806F69'}
            />
            <Text style={[styles.label, isCurrent && styles.active]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    backgroundColor: '#FFFFFFFA',
    borderTopWidth: 1,
    borderTopColor: '#F0E4DC',
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  icon: {
    color: '#806F69',
    fontSize: 22,
  },
  label: {
    color: '#806F69',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 3,
  },
  active: {
    color: '#FF7A59',
  },
});
