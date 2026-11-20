import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function ServerStatusBanner() {
  const { isServerWaking } = useApp();
  const insets = useSafeAreaInsets();

  if (!isServerWaking) return null;

  return (
    <View style={[styles.banner, { top: insets.top + 6 }]}>
      <ActivityIndicator size="small" color="#FFFFFF" />
      <Text style={styles.text}>Conectando con la nube de RutiGo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 9999,
    backgroundColor: '#0F172ACC',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
  },
  text: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '700',
  },
});
