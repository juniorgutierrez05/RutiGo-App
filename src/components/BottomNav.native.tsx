import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

const NAV_ITEMS = [
  { key: 'home', icon: '⌂', label: 'Inicio', target: 'home' as const },
  { key: 'explore', icon: '⌕', label: 'Explorar', target: 'explore_category' as const },
  { key: 'map', icon: '⌖', label: 'Mapa', target: 'interactive_map' as const },
  { key: 'saved', icon: '♡', label: 'Guardados', target: 'favorites' as const },
  { key: 'profile', icon: '◉', label: 'Perfil', target: 'profile' as const },
];

export function BottomNav() {
  const { currentScreen, navigateTo } = useApp();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 8);

  const active =
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
      {NAV_ITEMS.map(({ key, icon, label, target }) => (
        <Pressable
          key={key}
          style={styles.item}
          hitSlop={6}
          onPress={() => navigateTo(target)}
        >
          <Text style={[styles.icon, active === key && styles.active]}>{icon}</Text>
          <Text style={[styles.label, active === key && styles.active]}>{label}</Text>
        </Pressable>
      ))}
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
