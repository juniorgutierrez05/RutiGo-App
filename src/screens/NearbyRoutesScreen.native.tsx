import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function NearbyRoutesScreen() {
  const { routes, navigateTo, goBack } = useApp();
  const insets = useSafeAreaInsets();
  const sorted = [...routes].sort((first, second) => first.distanceKm - second.distanceKm);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: Math.max(insets.top, 20) + 10,
          paddingBottom: Math.max(insets.bottom, 16) + 24,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Pressable onPress={goBack} hitSlop={8} style={styles.backButton}>
        <Text style={styles.back}>‹ Volver</Text>
      </Pressable>
      <Text style={styles.title}>Rutas más cercanas</Text>
      <Text style={styles.subtitle}>Ordenadas según tu ubicación actual.</Text>
      {sorted.map((route) => (
        <Pressable
          key={route.id}
          style={styles.card}
          onPress={() => navigateTo('route_detail', { routeId: route.id })}
        >
          <Text style={styles.name}>{route.name}</Text>
          <Text style={styles.meta}>{route.distanceKm} km · {route.durationEstimate}</Text>
          <Text style={styles.description} numberOfLines={2}>{route.description}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900' },
  subtitle: { color: '#806F69', fontSize: 14, marginTop: 4, marginBottom: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0E4DC',
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  name: { color: '#1E1927', fontSize: 16, fontWeight: '900' },
  meta: { color: '#00AEB7', fontSize: 12, fontWeight: '800', marginTop: 4 },
  description: { color: '#806F69', fontSize: 13, lineHeight: 18, marginTop: 6 },
});
