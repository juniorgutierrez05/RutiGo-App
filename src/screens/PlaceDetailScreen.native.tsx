import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../store';
import { Button } from '../components/Button.native';
import { RatingStars } from '../components/RatingStars.native';
import { calculateDistanceKm, formatDistance } from '../services/locationService';

export function PlaceDetailScreen() {
  const { selectedPlace, userLocation, navigateTo, goBack, isFavorite, toggleFavorite } = useApp();
  const insets = useSafeAreaInsets();

  if (!selectedPlace) {
    return (
      <View style={[styles.empty, { paddingTop: Math.max(insets.top, 20) + 20 }]}>
        <Text style={styles.title}>Lugar no encontrado</Text>
      </View>
    );
  }

  const openInAppMap = () => {
    navigateTo('interactive_map', { placeId: selectedPlace.id });
  };

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
      <Image
        source={selectedPlace.images[0]}
        style={styles.cover}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.category}>{selectedPlace.municipality.toUpperCase()}</Text>
      <Text style={styles.title}>{selectedPlace.name}</Text>
      <View style={styles.rating}>
        <RatingStars rating={selectedPlace.avgRating} showBadge reviewCount={selectedPlace.reviewCount} />
        <Text style={styles.distance}>{formatDistance(calculateDistanceKm(userLocation, selectedPlace.location))}</Text>
      </View>
      <Text style={styles.subtitle}>{selectedPlace.description}</Text>
      
      <View style={styles.info}>
        <Text style={styles.infoTitle}>Información práctica</Text>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.address || 'Dirección disponible en el mapa'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.schedule || 'Consulta el horario antes de visitar'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="hourglass-outline" size={16} color="#FF7A59" />
          <Text style={styles.infoText}>{selectedPlace.estimatedTime || 'Tiempo estimado por confirmar'}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Button fullWidth onPress={openInAppMap}>Ver en el mapa</Button>
        <Button
          fullWidth
          variant="outline"
          onPress={() => toggleFavorite('place', selectedPlace.id)}
        >
          {isFavorite('place', selectedPlace.id) ? 'Quitar de guardados' : 'Guardar lugar'}
        </Button>
        <Button fullWidth variant="ghost" onPress={() => navigateTo('reviews')}>Ver reseñas</Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFCF8' },
  content: { paddingHorizontal: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 12 },
  back: { color: '#FF7A59', fontSize: 16, fontWeight: '800' },
  cover: { width: '100%', height: 210, borderRadius: 22, marginBottom: 16 },
  category: { color: '#FF7A59', fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  title: { color: '#1E1927', fontSize: 26, fontWeight: '900', marginTop: 4 },
  subtitle: { color: '#806F69', fontSize: 14, lineHeight: 21, marginTop: 8 },
  rating: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  distance: { color: '#00AEB7', fontSize: 13, fontWeight: '800' },
  info: { marginTop: 18, padding: 16, borderRadius: 18, backgroundColor: '#FFF0EB' },
  infoTitle: { color: '#1E1927', fontSize: 16, fontWeight: '900', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  infoText: { color: '#58423C', fontSize: 13, flex: 1, lineHeight: 18 },
  actions: { gap: 10, marginTop: 18 },
  empty: { flex: 1, padding: 25, backgroundColor: '#FFFCF8' },
});
