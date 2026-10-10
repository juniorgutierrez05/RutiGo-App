import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';

export function RecommendationsScreen() {
  const { routes, navigateTo, goBack } = useApp();
  const insets = useSafeAreaInsets();

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
        <Ionicons name="chevron-back" size={20} color="#FF7A59" />
        <Text style={styles.back}>Volver</Text>
      </Pressable>
      <Text style={styles.eyebrow}>INSPIRACIÓN LOCAL</Text>
      <Text style={styles.title}>Recomendaciones</Text>
      <Text style={styles.subtitle}>Planes curados para tu próximo fin de semana.</Text>
      {routes.slice(0, 5).map((route) => (
        <Pressable
          key={route.id}
          style={styles.card}
          onPress={() => navigateTo('route_detail', { routeId: route.id })}
        >
          <Image
            source={route.coverImageUrl}
            style={styles.image}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
          <View style={styles.shade} />
          <View style={styles.overlay}>
            <Text style={styles.tag}>PLAN RUTIGO</Text>
            <Text style={styles.name} numberOfLines={1}>{route.name}</Text>
            <Text style={styles.meta}>{route.durationEstimate} · {route.distanceKm} km</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  eyebrow: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1.4 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#806F69', fontSize: 14, marginTop: 4, marginBottom: 18 },
  card: {
    height: 180,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#1E1927',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%', height: '100%' },
  shade: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.36)' },
  overlay: { position: 'absolute', bottom: 14, left: 16, right: 16 },
  tag: { color: '#FFD6A5', fontSize: 10, fontWeight: '900' },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: '900', marginTop: 3 },
  meta: { color: '#FFFFFF', fontSize: 12, marginTop: 3, opacity: 0.9 },
});
