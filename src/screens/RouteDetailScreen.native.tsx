import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { Card } from '../components/Card.native';
import { openExternalNavigation } from '../services/locationService';

export function RouteDetailScreen() {
  const { selectedRoute, places, navigateTo, goBack, isFavorite, toggleFavorite } = useApp();
  const insets = useSafeAreaInsets();

  const firstPlace = selectedRoute?.placeIds?.[0]
    ? places.find((p) => p.id === String(selectedRoute.placeIds[0]))
    : null;

  if (!selectedRoute) {
    return (
      <View style={[styles.empty, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
        <Text style={styles.title}>Ruta no encontrada</Text>
      </View>
    );
  }

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
        <Ionicons name="chevron-back" size={20} color="#E60124" />
        <Text style={styles.back}>Volver</Text>
      </Pressable>
      <Image
        source={selectedRoute.coverImageUrl}
        style={styles.cover}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.category}>{selectedRoute.category.toUpperCase()}</Text>
      <Text style={styles.title}>{selectedRoute.name}</Text>
      <Text style={styles.subtitle}>{selectedRoute.description}</Text>

      <View style={styles.stats}>
        <Stat label="Distancia" value={`${selectedRoute.distanceKm} km`} />
        <Stat label="Duración" value={selectedRoute.durationEstimate} />
        <Stat label="Nivel" value={selectedRoute.difficulty} />
      </View>

      <Card variant="ambient">
        <Text style={styles.section}>Puntos destacados</Text>
        {(selectedRoute.highlights || []).map((highlight) => (
          <Text key={highlight} style={styles.item}>✓ {highlight}</Text>
        ))}
        <Text style={styles.section}>Consejos de viaje</Text>
        <Text style={styles.tipsText}>
          {selectedRoute.tips || 'Lleva agua, protector solar y tiempo para disfrutar cada parada.'}
        </Text>
      </Card>

      <View style={styles.actions}>
        {firstPlace && (
          <Button
            fullWidth
            onPress={() =>
              openExternalNavigation(
                firstPlace.location.lat,
                firstPlace.location.lng,
                `Inicio de ${selectedRoute.name} (${firstPlace.name})`
              )
            }
          >
            Cómo llegar al inicio (GPS)
          </Button>
        )}
        {firstPlace && (
          <Button
            fullWidth
            variant="outline"
            onPress={() => navigateTo('interactive_map', { placeId: firstPlace.id })}
          >
            Ver ruta en mapa de RutiGo
          </Button>
        )}
        <Button fullWidth variant="outline" onPress={() => navigateTo('explore_category', { category: selectedRoute.category })}>
          Ver lugares de la ruta
        </Button>
        <Button
          fullWidth
          variant="ghost"
          onPress={() => toggleFavorite('route', selectedRoute.id)}
        >
          {isFavorite('route', selectedRoute.id) ? 'Quitar de guardados' : 'Guardar ruta'}
        </Button>
      </View>
    </ScrollView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { paddingHorizontal: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  back: { color: '#E60124', fontSize: 16, fontWeight: '800' },
  cover: { width: '100%', height: 210, borderRadius: 22, marginBottom: 16 },
  category: { color: '#E60124', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#6B7280', fontSize: 14, lineHeight: 21, marginTop: 6 },
  stats: { flexDirection: 'row', gap: 8, marginVertical: 18 },
  stat: { flex: 1, padding: 12, borderRadius: 14, backgroundColor: '#EEF8F1', alignItems: 'center' },
  statValue: { color: '#5DB872', fontSize: 13, fontWeight: '900' },
  statLabel: { color: '#6B7280', fontSize: 10, marginTop: 3 },
  section: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginBottom: 8, marginTop: 4 },
  item: { color: '#58423C', fontSize: 13, marginBottom: 6 },
  tipsText: { color: '#6B7280', fontSize: 13, lineHeight: 18 },
  actions: { gap: 10, marginTop: 16 },
  empty: { flex: 1, padding: 25, backgroundColor: '#FFFFFF' },
});
